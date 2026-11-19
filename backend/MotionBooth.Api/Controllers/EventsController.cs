using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.Models;
using MotionBooth.Api.DTOs.Events;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MotionBooth.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly MotionBoothDbContext _dbContext;

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    public EventsController(MotionBoothDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventListResponse>>> GetEvents()
    {
        var userId = GetUserId();

        var events = await _dbContext.Events
            .AsNoTracking()
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EventListResponse
            {
                Id = e.Id,
                Name = e.Name,
                EventDate = e.EventDate,
                CreatedAt = e.CreatedAt
            })
            .ToListAsync();

        return Ok(events);
    }

    // GET: api/events/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EventResponse>> GetEvent(Guid id)
    {
        var userId = GetUserId();

        var eventItem = await _dbContext.Events
            .AsNoTracking()
            .Where(e => e.Id == id && e.UserId == userId)
            .Select(e => new EventResponse
            {
                Id = e.Id,
                Name = e.Name,
                Template = e.Template,
                EventDate = e.EventDate,
                CreatedAt = e.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (eventItem is null)
        {
            return NotFound();
        }

        return Ok(eventItem);
    }

    // POST: api/events
    [HttpPost]
    public async Task<ActionResult<EventResponse>> CreateEvent(CreateEventRequest request)
    {
        var newEvent = new Event
        {
            Name = request.Name,
            Template = request.Template!,
            EventDate = request.EventDate!.Value,
            CreatedAt = DateTime.UtcNow,
            UserId = GetUserId()
        };

        _dbContext.Events.Add(newEvent);
        await _dbContext.SaveChangesAsync();

        var response = new EventResponse
        {
            Id = newEvent.Id,
            Name = newEvent.Name,
            Template = newEvent.Template,
            EventDate = newEvent.EventDate,
            CreatedAt = newEvent.CreatedAt
        };

        return CreatedAtAction(
            nameof(GetEvent),
            new { id = newEvent.Id },
            response
        );
    }

    // PUT: api/events/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateEvent(
        Guid id,
        UpdateEventRequest request)
    {
        var userId = GetUserId();

        var eventItem = await _dbContext.Events
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (eventItem is null)
        {
            return NotFound();
        }

        eventItem.Name = request.Name;
        eventItem.Template = request.Template!;
        eventItem.EventDate = request.EventDate!.Value;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/events/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        var userId = GetUserId();

        var eventItem = await _dbContext.Events
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (eventItem == null)
        {
            return NotFound();
        }

        _dbContext.Events.Remove(eventItem);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

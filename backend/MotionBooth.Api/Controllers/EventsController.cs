using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.Models;
using MotionBooth.Api.DTOs.Events;

namespace MotionBooth.Api.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly MotionBoothDbContext _dbContext;

    public EventsController(MotionBoothDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetEvents()
    {
        var events = await _dbContext.Events
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EventResponse
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
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetEvent(Guid id)
    {
        var eventItem = await _dbContext.Events
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => new EventResponse
            {
                Id = e.Id,
                Name = e.Name,
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
            EventDate = request.EventDate,
            CreatedAt = DateTime.UtcNow,
        };

        _dbContext.Events.Add(newEvent);
        await _dbContext.SaveChangesAsync();

        var response = new EventResponse
        {
            Id = newEvent.Id,
            Name = newEvent.Name,
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
        var eventItem = await _dbContext.Events.FindAsync(id);

        if (eventItem is null)
        {
            return NotFound();
        }

        eventItem.Name = request.Name;
        eventItem.EventDate = request.EventDate;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/events/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        var eventItem = await _dbContext.Events.FindAsync(id);

        if (eventItem == null)
        {
            return NotFound();
        }

        _dbContext.Events.Remove(eventItem);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

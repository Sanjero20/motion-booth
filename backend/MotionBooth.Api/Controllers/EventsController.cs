using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.Models;

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
    public async Task<ActionResult<List<Event>>> GetEvents()
    {
        var events = await _dbContext.Events
        .AsNoTracking()
        .OrderByDescending(e => e.CreatedAt)
        .ToListAsync();

        return Ok(events);
    }

    // POST: api/events
    [HttpPost]
    public async Task<ActionResult<Event>> CreateEvent(Event newEvent)
    {
        newEvent.Id = Guid.NewGuid();
        newEvent.CreatedAt = DateTime.UtcNow;

        _dbContext.Events.Add(newEvent);
        await _dbContext.SaveChangesAsync();


        return CreatedAtAction(
          nameof(GetEvents),
          new { id = newEvent.Id },
          newEvent
        );
    }
}


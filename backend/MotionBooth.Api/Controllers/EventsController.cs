using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Services.Events;

namespace MotionBooth.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly IEventsService _eventsService;

    public EventsController(IEventsService eventsService)
    {
        _eventsService = eventsService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventListResponse>>> GetEvents(
        CancellationToken cancellationToken
    )
    {
        var events = await _eventsService.GetAllAsync(
            GetUserId(),
            cancellationToken
        );

        return Ok(events);
    }

    // GET: api/events/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EventResponse>> GetEvent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var eventItem = await _eventsService.GetByIdAsync(
            id,
            GetUserId(),
            cancellationToken
        );

        if (eventItem is null)
            return NotFound();

        return Ok(eventItem);
    }

    // POST: api/events
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<EventResponse>> CreateEvent(
        [FromForm] EventRequest request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var eventItem = await _eventsService.CreateAsync(
                request,
                GetUserId(),
                cancellationToken
            );

            return CreatedAtAction(
                nameof(GetEvent),
                new { id = eventItem.Id },
                eventItem
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/events/{id}
    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateEvent(
        Guid id,
        [FromForm] EventRequest request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var updated = await _eventsService.UpdateAsync(
                id,
                request,
                GetUserId(),
                cancellationToken
            );

            if (!updated)
                return NotFound();

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/events/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var deleted = await _eventsService.DeleteAsync(
            id,
            GetUserId(),
            cancellationToken
        );

        if (!deleted)
            return NotFound();

        return NoContent();
    }

    // GET: api/events/{id}/background
    [HttpGet("{id:guid}/background")]
    public async Task<IActionResult> GetBackground(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var image = await _eventsService.GetBackgroundAsync(
            id,
            GetUserId(),
            cancellationToken
        );

        if (image is null)
            return NotFound();

        return File(image.Content, image.ContentType);
    }
}

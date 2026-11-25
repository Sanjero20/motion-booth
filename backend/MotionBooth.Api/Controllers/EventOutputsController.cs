using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Services.Events;

namespace MotionBooth.Api.Controllers;

[ApiController]
[Route("events/{eventId:guid}/outputs")]
[Authorize]
public class EventOutputsController : ControllerBase
{
    private readonly IEventOutputsService _eventOutputsService;

    public EventOutputsController(IEventOutputsService eventOutputsService)
    {
        _eventOutputsService = eventOutputsService;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create(
        Guid eventId,
        [FromForm] CreateEventOutputRequest request,
        CancellationToken cancellationToken
    )
    {
        var output = await _eventOutputsService.CreateAsync(
            eventId,
            request,
            cancellationToken
        );

        var response = new EventOutputResponse
        {
            Id = output.Id,
            EventId = output.EventId,
            ImageUrl = $"/outputs/{output.Id}/image",
            VideoUrl = $"/outputs/{output.Id}/video",
            CreatedAt = output.CreatedAt,
        };

        return CreatedAtAction(
            nameof(GetOutput),
            new { eventId, outputId = output.Id },
            response
        );
    }

    [HttpGet("{outputId:guid}", Name = "GetEventOutput")]
    [AllowAnonymous]
    public async Task<ActionResult<EventOutputResponse>> GetOutput(
        Guid eventId,
        Guid outputId,
        CancellationToken cancellationToken
    )
    {
        var output = await _eventOutputsService.GetAsync(
            outputId,
            cancellationToken
        );

        if (output is null || output.EventId != eventId)
        {
            return NotFound();
        }

        var response = new EventOutputResponse
        {
            Id = output.Id,
            EventId = output.EventId,
            ImageUrl = $"/outputs/{output.Id}/image",
            VideoUrl = $"/outputs/{output.Id}/video",
            CreatedAt = output.CreatedAt,
        };

        return Ok(response);
    }
}

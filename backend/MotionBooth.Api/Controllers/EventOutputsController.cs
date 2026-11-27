using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Services.Events;

namespace MotionBooth.Api.Controllers;

[ApiController]
[Route("api/events/{eventId:guid}/outputs")]
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
        Console.WriteLine("CREATE EVENT OUTPUT HIT");

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

    [HttpGet("/outputs/{outputId:guid}/image")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOutputImage(
        Guid outputId,
        CancellationToken cancellationToken
    )
    {
        var file = await _eventOutputsService.GetImageAsync(
            outputId,
            cancellationToken
        );

        if (file is null)
            return NotFound();

        return File(file.Content, file.ContentType);
    }

    [HttpGet("/outputs/{outputId:guid}/video")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOutputVideo(
        Guid outputId,
        CancellationToken cancellationToken
    )
    {
        var file = await _eventOutputsService.GetVideoAsync(
            outputId,
            cancellationToken
        );

        if (file is null)
            return NotFound();

        return File(file.Content, file.ContentType);
    }
}

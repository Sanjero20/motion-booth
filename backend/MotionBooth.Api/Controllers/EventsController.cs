using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Helpers;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Storage;

namespace MotionBooth.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly MotionBoothDbContext _dbContext;
    private readonly IFileStorageService _fileStorageService;
    private static readonly JsonSerializerOptions JsonOptions = new(
        JsonSerializerDefaults.Web
    );

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    private static bool TryDeserializeEventTemplate(
        string templateJson,
        out EventTemplate? template
    )
    {
        template = null;

        try
        {
            template = JsonSerializer.Deserialize<EventTemplate>(
                templateJson,
                JsonOptions
            );

            return template is not null && template.Slots.Count > 0;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    public EventsController(
        MotionBoothDbContext dbContext,
        IFileStorageService fileStorageService
    )
    {
        _dbContext = dbContext;
        _fileStorageService = fileStorageService;
    }

    // GET: api/events
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventListResponse>>> GetEvents()
    {
        var userId = GetUserId();

        var events = await _dbContext
            .Events.AsNoTracking()
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EventListResponse
            {
                Id = e.Id,
                Name = e.Name,
                EventDate = e.EventDate,
                CreatedAt = e.CreatedAt,
            })
            .ToListAsync();

        return Ok(events);
    }

    // GET: api/events/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EventResponse>> GetEvent(Guid id)
    {
        var userId = GetUserId();

        var eventItem = await _dbContext
            .Events.AsNoTracking()
            .Where(e => e.Id == id && e.UserId == userId)
            .Select(e => new EventResponse
            {
                Id = e.Id,
                Name = e.Name,
                Template = e.Template,
                EventDate = e.EventDate,
                CreatedAt = e.CreatedAt,
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
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<EventResponse>> CreateEvent(
        [FromForm] EventRequest request,
        CancellationToken cancellationToken
    )
    {
        if (!TryDeserializeEventTemplate(request.Template, out var template))
        {
            return BadRequest(new { message = "Invalid event template data." });
        }

        var file = request.BackgroundImageFile;
        string? fileExtension = null;

        if (
            file is not null
            && !ImageValidationHelper.TryValidate(
                file,
                out fileExtension,
                out var errorMessage
            )
        )
        {
            return BadRequest(new { message = errorMessage });
        }

        var eventItem = new Event
        {
            Name = request.Name,
            Template = template!,
            EventDate = request.EventDate!.Value,
            CreatedAt = DateTime.UtcNow,
            UserId = GetUserId(),
        };

        // Ignore any client-provided blob name.
        eventItem.Template.BackgroundImage = null;

        string? blobName = null;

        try
        {
            if (file is not null)
            {
                await using var stream = file.OpenReadStream();

                blobName = await _fileStorageService.UploadAsync(
                    stream,
                    "background",
                    file.ContentType,
                    "events",
                    cancellationToken
                );

                eventItem.Template.BackgroundImage = blobName;
            }

            _dbContext.Events.Add(eventItem);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            if (blobName is not null)
            {
                try
                {
                    await _fileStorageService.DeleteAsync(
                        blobName,
                        CancellationToken.None
                    );
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            throw;
        }

        var response = new EventResponse
        {
            Id = eventItem.Id,
            Name = eventItem.Name,
            Template = eventItem.Template,
            EventDate = eventItem.EventDate,
            CreatedAt = eventItem.CreatedAt,
        };

        return CreatedAtAction(
            nameof(GetEvent),
            new { id = eventItem.Id },
            response
        );
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
        var userId = GetUserId();

        var eventItem = await _dbContext.Events.FirstOrDefaultAsync(
            e => e.Id == id && e.UserId == userId,
            cancellationToken
        );

        if (eventItem is null)
        {
            return NotFound();
        }

        if (!TryDeserializeEventTemplate(request.Template, out var template))
        {
            return BadRequest(new { message = "Invalid event template data." });
        }

        var file = request.BackgroundImageFile;
        string? fileExtension = null;

        if (
            file is not null
            && !ImageValidationHelper.TryValidate(
                file,
                out fileExtension,
                out var errorMessage
            )
        )
        {
            return BadRequest(new { message = errorMessage });
        }

        if (file is not null && request.RemoveBackgroundImage)
        {
            return BadRequest(
                new
                {
                    message = "Cannot upload and remove the background image in the same request.",
                }
            );
        }

        var oldBlobName = eventItem.Template.BackgroundImage;
        string? newBlobName = null;

        try
        {
            // Upload the replacement image first.
            if (file is not null)
            {
                await using var stream = file.OpenReadStream();

                newBlobName = await _fileStorageService.UploadAsync(
                    stream,
                    $"background{fileExtension}",
                    file.ContentType,
                    "events",
                    cancellationToken
                );
            }

            // Preserve the existing background unless explicitly changed.
            template!.BackgroundImage = oldBlobName;

            if (request.RemoveBackgroundImage)
            {
                template.BackgroundImage = null;
            }
            else if (newBlobName is not null)
            {
                template.BackgroundImage = newBlobName;
            }

            eventItem.Name = request.Name;
            eventItem.Template = template;
            eventItem.EventDate = request.EventDate!.Value;

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            // Clean up the newly uploaded image if saving fails.
            if (newBlobName is not null)
            {
                try
                {
                    await _fileStorageService.DeleteAsync(
                        newBlobName,
                        CancellationToken.None
                    );
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            throw;
        }

        // Delete the previous image only after the database update succeeds.
        if (
            oldBlobName is not null
            && (request.RemoveBackgroundImage || newBlobName is not null)
        )
        {
            await _fileStorageService.DeleteAsync(
                oldBlobName,
                cancellationToken
            );
        }

        return NoContent();
    }

    // DELETE: api/events/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEvent(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var userId = GetUserId();

        var eventItem = await _dbContext.Events.FirstOrDefaultAsync(
            e => e.Id == id && e.UserId == userId,
            cancellationToken
        );

        if (eventItem is null)
        {
            return NotFound();
        }

        var backgroundImage = eventItem.Template.BackgroundImage;

        _dbContext.Events.Remove(eventItem);

        await _dbContext.SaveChangesAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(backgroundImage))
        {
            await _fileStorageService.DeleteAsync(
                backgroundImage,
                cancellationToken
            );
        }

        return NoContent();
    }

    [HttpGet("{id:guid}/background")]
    public async Task<IActionResult> GetBackground(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var userId = GetUserId();

        var eventItem = await _dbContext.Events.FirstOrDefaultAsync(
            e => e.Id == id && e.UserId == userId,
            cancellationToken
        );

        if (
            eventItem is null
            || string.IsNullOrWhiteSpace(eventItem.Template.BackgroundImage)
        )
        {
            return NotFound();
        }

        var image = await _fileStorageService.GetAsync(
            eventItem.Template.BackgroundImage,
            cancellationToken
        );

        if (image is null)
            return NotFound();

        return File(image.Content, image.ContentType);
    }
}

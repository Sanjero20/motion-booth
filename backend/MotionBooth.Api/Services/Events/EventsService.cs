using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Helpers;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Storage;

namespace MotionBooth.Api.Services.Events;

public class EventsService : IEventsService
{
    private readonly MotionBoothDbContext _dbContext;
    private readonly IFileStorageService _fileStorageService;

    private static readonly JsonSerializerOptions JsonOptions = new(
        JsonSerializerDefaults.Web
    );

    public EventsService(
        MotionBoothDbContext dbContext,
        IFileStorageService fileStorageService
    )
    {
        _dbContext = dbContext;
        _fileStorageService = fileStorageService;
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

    public async Task<IEnumerable<EventListResponse>> GetAllAsync(
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbContext
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
            .ToListAsync(cancellationToken);
    }

    public async Task<EventResponse?> GetByIdAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
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
            .FirstOrDefaultAsync(cancellationToken);

        return eventItem;
    }

    public async Task<EventResponse> CreateAsync(
        EventRequest request,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        if (!TryDeserializeEventTemplate(request.Template, out var template))
        {
            throw new ArgumentException("Invalid event template data.");
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
            throw new ArgumentException(errorMessage);
        }

        var eventItem = new Event
        {
            Name = request.Name,
            Template = template!,
            EventDate = request.EventDate!.Value,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
        };

        // Never trust a blob path supplied by the client.
        eventItem.Template.BackgroundImage = null;

        string? blobName = null;

        try
        {
            if (file is not null)
            {
                blobName = $"event-backgrounds/{eventItem.Id}{fileExtension}";

                await using var stream = file.OpenReadStream();

                await _fileStorageService.UploadAsync(
                    stream,
                    blobName,
                    file.ContentType,
                    cancellationToken: cancellationToken
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

        return new EventResponse
        {
            Id = eventItem.Id,
            Name = eventItem.Name,
            Template = eventItem.Template,
            EventDate = eventItem.EventDate,
            CreatedAt = eventItem.CreatedAt,
        };
    }

    public async Task<bool> UpdateAsync(
        Guid id,
        EventRequest request,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var eventItem = await _dbContext.Events.FirstOrDefaultAsync(
            e => e.Id == id && e.UserId == userId,
            cancellationToken
        );

        if (eventItem is null)
            return false;

        if (!TryDeserializeEventTemplate(request.Template, out var template))
        {
            throw new ArgumentException("Invalid event template data.");
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
            throw new ArgumentException(errorMessage);
        }

        if (file is not null && request.RemoveBackgroundImage)
        {
            throw new ArgumentException(
                "Cannot upload and remove the background image in the same request."
            );
        }

        var oldBlobName = eventItem.Template.BackgroundImage;
        string? newBlobName = null;

        try
        {
            if (file is not null)
            {
                newBlobName =
                    $"event-backgrounds/{eventItem.Id}{fileExtension}";

                await using var stream = file.OpenReadStream();

                await _fileStorageService.UploadAsync(
                    stream,
                    newBlobName,
                    file.ContentType,
                    overwrite: true,
                    cancellationToken: cancellationToken
                );
            }

            // Preserve the old background unless explicitly changed.
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
            // Only remove a newly uploaded blob if it has a different path.
            // If the path is the same, it may be the existing background
            // that was overwritten.
            if (newBlobName is not null && newBlobName != oldBlobName)
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

        // Delete the previous blob if the path changed or was removed.
        if (
            oldBlobName is not null
            && oldBlobName != newBlobName
            && (request.RemoveBackgroundImage || newBlobName is not null)
        )
        {
            await _fileStorageService.DeleteAsync(
                oldBlobName,
                cancellationToken
            );
        }

        return true;
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var eventItem = await _dbContext.Events.FirstOrDefaultAsync(
            e => e.Id == id && e.UserId == userId,
            cancellationToken
        );

        if (eventItem is null)
            return false;

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

        return true;
    }

    public async Task<StoredFile?> GetBackgroundAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var eventItem = await _dbContext.Events.FirstOrDefaultAsync(
            e => e.Id == id && e.UserId == userId,
            cancellationToken
        );

        if (
            eventItem is null
            || string.IsNullOrWhiteSpace(eventItem.Template.BackgroundImage)
        )
        {
            return null;
        }

        return await _fileStorageService.GetAsync(
            eventItem.Template.BackgroundImage,
            cancellationToken
        );
    }
}

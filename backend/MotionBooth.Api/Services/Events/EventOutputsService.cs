using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Storage;

namespace MotionBooth.Api.Services.Events;

public class EventOutputsService : IEventOutputsService
{
    private readonly MotionBoothDbContext _dbContext;
    private readonly IFileStorageService _fileStorage;

    public EventOutputsService(
        MotionBoothDbContext dbContext,
        IFileStorageService fileStorage
    )
    {
        _dbContext = dbContext;
        _fileStorage = fileStorage;
    }

    public async Task<EventOutput> CreateAsync(
        Guid eventId,
        CreateEventOutputRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var eventExists = await _dbContext.Events.AnyAsync(
            e => e.Id == eventId,
            cancellationToken
        );

        if (!eventExists)
            throw new KeyNotFoundException("Event not found");

        var outputId = Guid.NewGuid();

        var imagePath = $"outputs/{eventId}/images/{outputId}.png";
        var videoPath = $"outputs/{eventId}/videos/{outputId}.mp4";

        var imageUploaded = false;
        var videoUploaded = false;

        try
        {
            // Upload image
            await using var imageStream = request.Image.OpenReadStream();

            await _fileStorage.UploadAsync(
                imageStream,
                imagePath,
                request.Image.ContentType,
                cancellationToken: cancellationToken
            );

            imageUploaded = true;

            // Upload video
            await using var videoStream = request.Video.OpenReadStream();

            await _fileStorage.UploadAsync(
                videoStream,
                videoPath,
                request.Video.ContentType,
                cancellationToken: cancellationToken
            );

            videoUploaded = true;

            var output = new EventOutput
            {
                Id = outputId,
                EventId = eventId,
                ImagePath = imagePath,
                VideoPath = videoPath,
            };

            _dbContext.EventOutputs.Add(output);

            await _dbContext.SaveChangesAsync(cancellationToken);

            return output;
        }
        catch
        {
            if (imageUploaded)
            {
                try
                {
                    await _fileStorage.DeleteAsync(
                        imagePath,
                        CancellationToken.None
                    );
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            if (videoUploaded)
            {
                try
                {
                    await _fileStorage.DeleteAsync(
                        videoPath,
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
    }

    public async Task<EventOutput?> GetAsync(
        Guid outputId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbContext.EventOutputs.FirstOrDefaultAsync(
            o => o.Id == outputId,
            cancellationToken
        );
    }

    public async Task<StoredFile?> GetImageAsync(
        Guid outputId,
        CancellationToken cancellationToken = default
    )
    {
        var output = await GetAsync(outputId, cancellationToken);

        if (output is null)
            return null;

        return await _fileStorage.GetAsync(output.ImagePath, cancellationToken);
    }

    public async Task<StoredFile?> GetVideoAsync(
        Guid outputId,
        CancellationToken cancellationToken = default
    )
    {
        var output = await GetAsync(outputId, cancellationToken);

        if (output is null)
            return null;

        return await _fileStorage.GetAsync(output.VideoPath, cancellationToken);
    }
}

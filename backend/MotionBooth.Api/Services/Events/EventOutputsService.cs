using Apache.Arrow.C;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Storage;
using YamlDotNet.Core.Tokens;

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
        var eventExist = await _dbContext.Events.AnyAsync(
            e => e.Id == eventId,
            cancellationToken
        );

        if (!eventExist)
            throw new KeyNotFoundException("Event not found");

        var outputId = Guid.NewGuid();
        var folder = $"events/{eventId}/outputs/{outputId}";

        string? imagePath = null;
        string? videoPath = null;

        try
        {
            // Save Image
            await using var imageStream = request.Image.OpenReadStream();

            imagePath = await _fileStorage.UploadAsync(
                imageStream,
                "image" + Path.GetExtension(request.Image.FileName),
                request.Image.ContentType,
                folder,
                cancellationToken
            );

            // Save video
            await using var videoStream = request.Video.OpenReadStream();

            videoPath = await _fileStorage.UploadAsync(
                videoStream,
                "motion" + Path.GetExtension(request.Video.FileName),
                request.Video.ContentType,
                folder,
                cancellationToken
            );

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
            if (imagePath is not null)
                await _fileStorage.DeleteAsync(imagePath);

            if (videoPath is not null)
                await _fileStorage.DeleteAsync(videoPath);

            throw;
        }
    }
}

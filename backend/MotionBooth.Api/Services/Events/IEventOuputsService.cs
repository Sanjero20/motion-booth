using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Models;

namespace MotionBooth.Api.Services.Events;

public interface IEventOutputsService
{
    Task<EventOutput> CreateAsync(
        Guid eventId,
        CreateEventOutputRequest request,
        CancellationToken cancellationToken = default
    );

    Task<EventOutput?> GetAsync(
        Guid outputId,
        CancellationToken cancellationToken = default
    );

    Task<StoredFile?> GetImageAsync(
        Guid outputId,
        CancellationToken cancellationToken = default
    );

    Task<StoredFile?> GetVideoAsync(
        Guid outputId,
        CancellationToken cancellationToken = default
    );
}

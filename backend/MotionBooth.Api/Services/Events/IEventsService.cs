using MotionBooth.Api.DTOs.Events;
using MotionBooth.Api.Models;

namespace MotionBooth.Api.Services.Events;

public interface IEventsService
{
    Task<IEnumerable<EventListResponse>> GetAllAsync(
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<EventResponse?> GetByIdAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<EventResponse> CreateAsync(
        EventRequest request,
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<bool> UpdateAsync(
        Guid id,
        EventRequest request,
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<bool> DeleteAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<StoredFile?> GetBackgroundAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    );
}

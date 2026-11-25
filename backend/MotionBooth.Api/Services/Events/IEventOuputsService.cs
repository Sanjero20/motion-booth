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
}

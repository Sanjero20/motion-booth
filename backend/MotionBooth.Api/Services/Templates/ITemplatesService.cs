using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Models;

namespace MotionBooth.Api.Services.Templates;

public interface ITemplatesService
{
    Task<IEnumerable<TemplateResponse>> GetAllAsync(
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<TemplateResponse?> GetByIdAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<TemplateResponse> CreateAsync(
        SaveTemplateRequest request,
        string userId,
        CancellationToken cancellationToken = default
    );

    Task<bool> UpdateAsync(
        Guid id,
        SaveTemplateRequest request,
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

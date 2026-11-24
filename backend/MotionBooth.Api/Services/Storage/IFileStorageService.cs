using MotionBooth.Api.Models;

namespace MotionBooth.Api.Services.Storage;

public interface IFileStorageService
{
    Task<string> UploadAsync(
        Stream file,
        string fileName,
        string contentType,
        string folder,
        CancellationToken cancellationToken = default
    );

    Task<StoredFile?> GetAsync(
        string fileName,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        string fileName,
        CancellationToken cancellationToken = default
    );
}

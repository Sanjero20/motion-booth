using MotionBooth.Api.Models;

namespace MotionBooth.Api.Services.Storage;

public interface IFileStorageService
{
    Task<string> UploadAsync(
        Stream file,
        string blobName,
        string contentType,
        bool overwrite = false,
        CancellationToken cancellationToken = default
    );

    Task<StoredFile?> GetAsync(
        string blobName,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        string blobName,
        CancellationToken cancellationToken = default
    );
}

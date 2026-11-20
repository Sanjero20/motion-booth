namespace MotionBooth.Api.Services.Storage;

public interface IFileStorageService
{
    Task<string> UploadAsync(
        Stream file,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default
    );

    Task<Stream?> GetAsync(
        string fileName,
        CancellationToken cancellationToken = default
    );

    Task DeleteAsync(
        string fileName,
        CancellationToken cancellationToken = default
    );
}
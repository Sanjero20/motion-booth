using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using MotionBooth.Api.Configuration;
using MotionBooth.Api.Models;

namespace MotionBooth.Api.Services.Storage;

public class BlobStorageService : IFileStorageService
{
    private readonly BlobContainerClient _containerClient;

    public BlobStorageService(
        BlobServiceClient blobServiceClient,
        IOptions<StorageOptions> options
    )
    {
        _containerClient = blobServiceClient.GetBlobContainerClient(
            options.Value.ContainerName
        );
    }

    public async Task<string> UploadAsync(
        Stream file,
        string blobName,
        string contentType,
        bool overwrite = false,
        CancellationToken cancellationToken = default
    )
    {
        await _containerClient.CreateIfNotExistsAsync(
            cancellationToken: cancellationToken
        );

        var blobClient = _containerClient.GetBlobClient(blobName);

        await blobClient.UploadAsync(
            file,
            new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders { ContentType = contentType },
                Conditions = overwrite
                    ? null
                    : new BlobRequestConditions { IfNoneMatch = ETag.All },
            },
            cancellationToken
        );

        return blobClient.Name;
    }

    public async Task<StoredFile?> GetAsync(
        string blobName,
        CancellationToken cancellationToken = default
    )
    {
        var blobClient = _containerClient.GetBlobClient(blobName);

        if (!await blobClient.ExistsAsync(cancellationToken))
            return null;

        var response = await blobClient.DownloadStreamingAsync(
            cancellationToken: cancellationToken
        );

        return new StoredFile(
            response.Value.Content,
            response.Value.Details.ContentType
        );
    }

    public async Task DeleteAsync(
        string blobName,
        CancellationToken cancellationToken = default
    )
    {
        var blobClient = _containerClient.GetBlobClient(blobName);

        await blobClient.DeleteIfExistsAsync(
            cancellationToken: cancellationToken
        );
    }
}

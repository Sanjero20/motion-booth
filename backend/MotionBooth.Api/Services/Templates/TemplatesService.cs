using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Helpers;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Storage;

namespace MotionBooth.Api.Services.Templates;

public class TemplatesService : ITemplatesService
{
    private readonly MotionBoothDbContext _dbContext;
    private readonly IFileStorageService _fileStorageService;

    public TemplatesService(
        MotionBoothDbContext dbContext,
        IFileStorageService fileStorageService
    )
    {
        _dbContext = dbContext;
        _fileStorageService = fileStorageService;
    }

    public async Task<IEnumerable<TemplateResponse>> GetAllAsync(
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbContext
            .Templates.AsNoTracking()
            .Where(t => t.UserId == userId)
            .Select(t => new TemplateResponse
            {
                Id = t.Id,
                Name = t.Name,
                Layout = t.Layout,
                Slots = t.Slots,
                BackgroundImage = t.BackgroundImage,
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<TemplateResponse?> GetByIdAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var template = await _dbContext
            .Templates.AsNoTracking()
            .FirstOrDefaultAsync(
                t => t.Id == id && t.UserId == userId,
                cancellationToken
            );

        if (template is null)
            return null;

        return new TemplateResponse
        {
            Id = template.Id,
            Name = template.Name,
            Layout = template.Layout,
            Slots = template.Slots,
            BackgroundImage = template.BackgroundImage,
        };
    }

    public async Task<TemplateResponse> CreateAsync(
        SaveTemplateRequest request,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        if (
            !TemplateRequestHelper.TryDeserialize(
                request,
                out var layout,
                out var slots
            )
        )
        {
            throw new ArgumentException("Invalid template data.");
        }

        var file = request.BackgroundImageFile;
        string? fileExtension = null;

        if (
            file is not null
            && !ImageValidationHelper.TryValidate(
                file,
                out fileExtension,
                out var errorMessage
            )
        )
        {
            throw new ArgumentException(errorMessage);
        }

        var template = new Template
        {
            Name = request.Name,
            Layout = layout!,
            Slots = slots!,
            UserId = userId,
        };

        string? blobName = null;

        try
        {
            if (file is not null)
            {
                blobName = $"template-backgrounds/{template.Id}{fileExtension}";

                await using var stream = file.OpenReadStream();

                await _fileStorageService.UploadAsync(
                    stream,
                    blobName,
                    file.ContentType,
                    overwrite: true,
                    cancellationToken
                );

                template.BackgroundImage = blobName;
            }

            _dbContext.Templates.Add(template);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            if (blobName is not null)
            {
                try
                {
                    await _fileStorageService.DeleteAsync(
                        blobName,
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

        return new TemplateResponse
        {
            Id = template.Id,
            Name = template.Name,
            Layout = template.Layout,
            Slots = template.Slots,
            BackgroundImage = template.BackgroundImage,
        };
    }

    public async Task<bool> UpdateAsync(
        Guid id,
        SaveTemplateRequest request,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var template = await _dbContext.Templates.FirstOrDefaultAsync(
            t => t.Id == id && t.UserId == userId,
            cancellationToken
        );

        if (template is null)
            return false;

        if (
            !TemplateRequestHelper.TryDeserialize(
                request,
                out var layout,
                out var slots
            )
        )
        {
            throw new ArgumentException("Invalid template data.");
        }

        var file = request.BackgroundImageFile;
        string? fileExtension = null;

        if (
            file is not null
            && !request.RemoveBackgroundImage
            && !ImageValidationHelper.TryValidate(
                file,
                out fileExtension,
                out var errorMessage
            )
        )
        {
            throw new ArgumentException(errorMessage);
        }

        var oldBlobName = template.BackgroundImage;
        string? newBlobName = null;

        try
        {
            // Upload the new background before changing the database.
            if (file is not null && !request.RemoveBackgroundImage)
            {
                newBlobName =
                    $"template-backgrounds/{template.Id}{fileExtension}";

                await using var stream = file.OpenReadStream();

                await _fileStorageService.UploadAsync(
                    stream,
                    newBlobName,
                    file.ContentType,
                    overwrite: true,
                    cancellationToken
                );
            }

            template.Name = request.Name;
            template.Layout = layout!;
            template.Slots = slots!;

            if (request.RemoveBackgroundImage)
            {
                template.BackgroundImage = null;
            }
            else if (newBlobName is not null)
            {
                template.BackgroundImage = newBlobName;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            // Clean up the new background if the database update fails.
            if (newBlobName is not null && newBlobName != oldBlobName)
            {
                try
                {
                    await _fileStorageService.DeleteAsync(
                        newBlobName,
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

        // Delete the previous background only after the database update succeeds.
        if (
            oldBlobName is not null
            && oldBlobName != newBlobName
            && (request.RemoveBackgroundImage || newBlobName is not null)
        )
        {
            await _fileStorageService.DeleteAsync(
                oldBlobName,
                cancellationToken
            );
        }

        return true;
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var template = await _dbContext.Templates.FirstOrDefaultAsync(
            t => t.Id == id && t.UserId == userId,
            cancellationToken
        );

        if (template is null)
            return false;

        var backgroundImage = template.BackgroundImage;

        _dbContext.Templates.Remove(template);

        await _dbContext.SaveChangesAsync(cancellationToken);

        // Delete the blob after the database record has been removed.
        if (!string.IsNullOrWhiteSpace(backgroundImage))
        {
            await _fileStorageService.DeleteAsync(
                backgroundImage,
                cancellationToken
            );
        }

        return true;
    }

    public async Task<StoredFile?> GetBackgroundAsync(
        Guid id,
        string userId,
        CancellationToken cancellationToken = default
    )
    {
        var template = await _dbContext.Templates.FirstOrDefaultAsync(
            t => t.Id == id && t.UserId == userId,
            cancellationToken
        );

        if (
            template is null
            || string.IsNullOrWhiteSpace(template.BackgroundImage)
        )
        {
            return null;
        }

        return await _fileStorageService.GetAsync(
            template.BackgroundImage,
            cancellationToken
        );
    }
}

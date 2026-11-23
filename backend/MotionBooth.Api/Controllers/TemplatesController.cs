using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Helpers;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Storage;

[Authorize]
[ApiController]
[Route("api/templates")]
public class TemplatesController : ControllerBase
{
    private readonly MotionBoothDbContext _dbContext;
    private readonly IFileStorageService _fileStorageService;

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    public TemplatesController(
        MotionBoothDbContext dbContext,
        IFileStorageService fileStorageService
    )
    {
        _dbContext = dbContext;
        _fileStorageService = fileStorageService;
    }

    // GET: api/templates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TemplateResponse>>> GetTemplates()
    {
        var userId = GetUserId();

        var templates = await _dbContext
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
            .ToListAsync();

        return Ok(templates);
    }

    // GET: api/templates/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TemplateResponse>> GetTemplate(Guid id)
    {
        var userId = GetUserId();

        var template = await _dbContext
            .Templates.AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (template == null)
        {
            return NotFound();
        }

        var response = new TemplateResponse
        {
            Id = template.Id,
            Name = template.Name,
            Layout = template.Layout,
            Slots = template.Slots,
            BackgroundImage = template.BackgroundImage,
        };

        return Ok(response);
    }

    // POST: api/templates
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<TemplateResponse>> CreateTemplate(
        [FromForm] SaveTemplateRequest request,
        CancellationToken cancellationToken
    )
    {
        if (!TemplateRequestHelper.TryDeserialize(request, out var layout, out var slots))
        {
            return BadRequest(new { message = "Invalid template data." });
        }

        var file = request.BackgroundImageFile;
        string? fileExtension = null;

        if (
            file is not null
            && !ImageValidationHelper.TryValidate(file, out fileExtension, out var errorMessage)
        )
        {
            return BadRequest(new { message = errorMessage });
        }

        var template = new Template
        {
            Name = request.Name,
            Layout = layout!,
            Slots = slots!,
            UserId = GetUserId(),
        };

        string? blobName = null;

        try
        {
            if (file is not null)
            {
                await using var stream = file.OpenReadStream();

                blobName = await _fileStorageService.UploadAsync(
                    stream,
                    $"background{fileExtension}",
                    file.ContentType,
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
                    await _fileStorageService.DeleteAsync(blobName, cancellationToken);
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            throw;
        }

        var response = new TemplateResponse
        {
            Id = template.Id,
            Name = template.Name,
            Layout = template.Layout,
            Slots = template.Slots,
            BackgroundImage = template.BackgroundImage,
        };

        return CreatedAtAction(nameof(GetTemplate), new { id = template.Id }, response);
    }

    // PUT: api/templates/{id}
    [HttpPut("{id:guid}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateTemplate(
        Guid id,
        [FromForm] SaveTemplateRequest request,
        CancellationToken cancellationToken
    )
    {
        var userId = GetUserId();

        var template = await _dbContext.Templates.FirstOrDefaultAsync(t =>
            t.Id == id && t.UserId == userId
        );

        if (template is null)
        {
            return NotFound();
        }

        if (!TemplateRequestHelper.TryDeserialize(request, out var layout, out var slots))
        {
            return BadRequest(new { message = "Invalid template data." });
        }

        var file = request.BackgroundImageFile;
        string? fileExtension = null;

        if (
            file is not null
            && !ImageValidationHelper.TryValidate(file, out fileExtension, out var errorMessage)
        )
        {
            return BadRequest(new { message = errorMessage });
        }

        var oldBlobName = template.BackgroundImage;
        string? newBlobName = null;

        try
        {
            // Upload the new image first, if provided.
            if (file is not null)
            {
                await using var stream = file.OpenReadStream();

                newBlobName = await _fileStorageService.UploadAsync(
                    stream,
                    $"background{fileExtension}",
                    file.ContentType,
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
            // Clean up the new image if the database update fails.
            if (newBlobName is not null)
            {
                try
                {
                    await _fileStorageService.DeleteAsync(newBlobName, CancellationToken.None);
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            throw;
        }

        // Delete the old image only after the database update succeeds.
        if (oldBlobName is not null && (request.RemoveBackgroundImage || newBlobName is not null))
        {
            await _fileStorageService.DeleteAsync(oldBlobName, cancellationToken);
        }

        return NoContent();
    }
}

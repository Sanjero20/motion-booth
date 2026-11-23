using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Templates;
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
        // Deserialize the JSON strings sent through multipart/form-data.
        Layout? layout;
        List<Slot>? slots;

        try
        {
            var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

            layout = JsonSerializer.Deserialize<Layout>(request.Layout, jsonOptions);
            slots = JsonSerializer.Deserialize<List<Slot>>(request.Slots, jsonOptions);
        }
        catch (JsonException)
        {
            return BadRequest(new { message = "Invalid layout or slots data." });
        }

        if (layout is null || slots is null || slots.Count == 0)
        {
            return BadRequest(new { message = "Invalid template data." });
        }

        // Validate the optional background image
        var file = request.BackgroundImageFile;
        string? fileExtension = null;
        string? blobName = null;

        if (file is not null)
        {
            if (file.Length == 0 || file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(
                    new { message = "The background image must be between 1 byte and 5MB." }
                );
            }

            fileExtension = file.ContentType switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                _ => null,
            };

            if (fileExtension is null)
            {
                return BadRequest(
                    new { message = "Only JPEG, PNG, and WebP images are supported." }
                );
            }
        }

        var template = new Template
        {
            Name = request.Name,
            Layout = layout,
            Slots = slots,
            UserId = GetUserId(),
        };

        try
        {
            // Upload the image, if one was provided
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
            // Clean up the uploaded blob if saving the template fails
            if (blobName is not null)
            {
                try
                {
                    await _fileStorageService.DeleteAsync(blobName, cancellationToken);
                }
                catch
                {
                    // Preserve the original exception
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
    public async Task<IActionResult> UpdateTemplate(Guid id, UpdateTemplateRequest request)
    {
        var userId = GetUserId();

        var template = await _dbContext.Templates.FirstOrDefaultAsync(t =>
            t.Id == id && t.UserId == userId
        );

        if (template == null)
        {
            return NotFound();
        }

        template.Name = request.Name;
        template.Layout = request.Layout;
        template.Slots = request.Slots;
        template.BackgroundImage = request.BackgroundImage;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/templates/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        var userId = GetUserId();

        var template = await _dbContext.Templates.FirstOrDefaultAsync(t =>
            t.Id == id && t.UserId == userId
        );

        if (template == null)
        {
            return NotFound();
        }

        _dbContext.Templates.Remove(template);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}

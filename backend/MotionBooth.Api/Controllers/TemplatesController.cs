using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Services.Templates;

[Authorize]
[ApiController]
[Route("api/templates")]
public class TemplatesController : ControllerBase
{
    private readonly ITemplatesService _templatesService;

    public TemplatesController(ITemplatesService templatesService)
    {
        _templatesService = templatesService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    // GET: api/templates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TemplateResponse>>> GetTemplates(
        CancellationToken cancellationToken
    )
    {
        var templates = await _templatesService.GetAllAsync(
            GetUserId(),
            cancellationToken
        );

        return Ok(templates);
    }

    // GET: api/templates/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TemplateResponse>> GetTemplate(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var template = await _templatesService.GetByIdAsync(
            id,
            GetUserId(),
            cancellationToken
        );

        if (template is null)
            return NotFound();

        return Ok(template);
    }

    // POST: api/templates
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<TemplateResponse>> CreateTemplate(
        [FromForm] SaveTemplateRequest request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var template = await _templatesService.CreateAsync(
                request,
                GetUserId(),
                cancellationToken
            );

            return CreatedAtAction(
                nameof(GetTemplate),
                new { id = template.Id },
                template
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
        try
        {
            var updated = await _templatesService.UpdateAsync(
                id,
                request,
                GetUserId(),
                cancellationToken
            );

            if (!updated)
                return NotFound();

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE: api/templates/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTemplate(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var deleted = await _templatesService.DeleteAsync(
            id,
            GetUserId(),
            cancellationToken
        );

        if (!deleted)
            return NotFound();

        return NoContent();
    }

    // GET: api/templates/{id}/background
    [HttpGet("{id:guid}/background")]
    public async Task<IActionResult> GetBackground(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var image = await _templatesService.GetBackgroundAsync(
            id,
            GetUserId(),
            cancellationToken
        );

        if (image is null)
            return NotFound();

        return File(image.Content, image.ContentType);
    }
}

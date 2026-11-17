using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Models;

[Authorize]
[ApiController]
[Route("api/templates")]
public class TemplatesController : ControllerBase
{
    private readonly MotionBoothDbContext _dbContext;

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    public TemplatesController(MotionBoothDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/templates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TemplateResponse>>> GetTemplates()
    {
        var userId = GetUserId();

        var templates = await _dbContext.Templates
            .AsNoTracking()
            .Where(t => t.UserId == userId)
            .Select(t => new TemplateResponse
            {
                Id = t.Id,
                Name = t.Name,
                Layout = t.Layout,
                Slots = t.Slots,
                BackgroundImage = t.BackgroundImage
            })
            .ToListAsync();

        return Ok(templates);
    }

    // GET: api/templates/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TemplateResponse>> GetTemplate(Guid id)
    {
        var userId = GetUserId();

        var template = await _dbContext.Templates
            .AsNoTracking()
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
            BackgroundImage = template.BackgroundImage
        };

        return Ok(response);
    }

    // POST: api/templates
    [HttpPost]
    public async Task<ActionResult<TemplateResponse>> CreateTemplate(CreateTemplateRequest request)
    {
        var template = new Template
        {
            Name = request.Name,
            Layout = request.Layout,
            Slots = request.Slots,
            BackgroundImage = request.BackgroundImage,
            UserId = GetUserId()
        };

        _dbContext.Templates.Add(template);
        await _dbContext.SaveChangesAsync();

        var response = new TemplateResponse
        {
            Id = template.Id,
            Name = template.Name,
            Layout = template.Layout,
            Slots = template.Slots,
            BackgroundImage = template.BackgroundImage
        };

        return CreatedAtAction(
            nameof(GetTemplate),
            new { id = template.Id },
            response
        );
    }

    // PUT: api/templates/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTemplate(
        Guid id,
        UpdateTemplateRequest request)
    {

        var userId = GetUserId();

        var template = await _dbContext.Templates
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

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

        var template = await _dbContext.Templates
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (template == null)
        {
            return NotFound();
        }

        _dbContext.Templates.Remove(template);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;
using MotionBooth.Api.DTOs.Templates;
using MotionBooth.Api.Models;

[ApiController]
[Route("api/templates")]
public class TemplatesController : ControllerBase
{
    private readonly MotionBoothDbContext _dbContext;

    public TemplatesController(MotionBoothDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/templates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TemplateResponse>>> GetTemplates()
    {
        var templates = await _dbContext.Templates
            .AsNoTracking()
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
        var template = await _dbContext.Templates
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

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

        return Ok(template);
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
            BackgroundImage = request.BackgroundImage
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
        var template = await _dbContext.Templates.FindAsync(id);

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
        var template = await _dbContext.Templates.FindAsync(id);

        if (template == null)
        {
            return NotFound();
        }

        _dbContext.Templates.Remove(template);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
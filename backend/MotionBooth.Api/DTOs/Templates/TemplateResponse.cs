using MotionBooth.Api.Models;

namespace MotionBooth.Api.DTOs.Templates;

public class TemplateResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Layout Layout { get; set; } = new();
    public List<Slot> Slots { get; set; } = [];
    public string? BackgroundImage { get; set; }
}
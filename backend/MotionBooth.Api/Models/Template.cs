namespace MotionBooth.Api.Models;

public class Template
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    public Layout Layout { get; set; } = new();
    public List<Slot> Slots { get; set; } = [];
    public string? BackgroundImage { get; set; }
}
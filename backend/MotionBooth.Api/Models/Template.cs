namespace MotionBooth.Api.Models;

public class Template
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public List<Slot> Slots { get; set; } = [];
    public string? BackgroundImage { get; set; }
}
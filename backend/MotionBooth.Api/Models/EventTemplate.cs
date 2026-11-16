namespace MotionBooth.Api.Models;

public class EventTemplate
{
    public Layout Layout { get; set; } = new();
    public List<Slot> Slots { get; set; } = [];
    public string? BackgroundImage { get; set; }
}
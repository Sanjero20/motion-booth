namespace MotionBooth.Api.Models;

public class EventOutput
{
    public Guid Id { get; set; }

    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;

    public string ImagePath { get; set; } = string.Empty;
    public string VideoPath { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

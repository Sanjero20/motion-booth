namespace MotionBooth.Api.Models;

public class Event
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public DateOnly EventDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}
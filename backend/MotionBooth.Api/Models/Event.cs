namespace MotionBooth.Api.Models;

public class Event
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public EventTemplate Template { get; set; } = new();
    public DateOnly EventDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public ICollection<EventOutput> Outputs { get; set; } = [];
}

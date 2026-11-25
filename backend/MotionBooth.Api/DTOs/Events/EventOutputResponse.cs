namespace MotionBooth.Api.DTOs.Events;

public class EventOutputResponse
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }

    public string ImageUrl { get; set; } = string.Empty!;
    public string VideoUrl { get; set; } = string.Empty!;

    public DateTime CreatedAt { get; set; }
}

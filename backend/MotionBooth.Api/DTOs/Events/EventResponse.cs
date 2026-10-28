namespace MotionBooth.Api.DTOs.Events;

public class EventResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
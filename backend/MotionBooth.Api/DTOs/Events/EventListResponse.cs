namespace MotionBooth.Api.DTOs.Events;

public class EventListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly EventDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
using MotionBooth.Api.Models;

namespace MotionBooth.Api.DTOs.Events;

public class EventResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public EventTemplate Template { get; set; } = new();
    public DateOnly EventDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
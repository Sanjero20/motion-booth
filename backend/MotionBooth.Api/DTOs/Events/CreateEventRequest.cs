using System.ComponentModel.DataAnnotations;

namespace MotionBooth.Api.DTOs.Events;

public class CreateEventRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public DateTime EventDate { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace MotionBooth.Api.DTOs.Events;

public class CreateEventRequest
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime? EventDate { get; set; }
}
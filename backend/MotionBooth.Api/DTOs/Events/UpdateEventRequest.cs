
using System.ComponentModel.DataAnnotations;
using MotionBooth.Api.Validation;

namespace MotionBooth.Api.DTOs.Events;

public class UpdateEventRequest
{
    [Required]
    [NotWhitespace]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateOnly? EventDate { get; set; }
}
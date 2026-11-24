using System.ComponentModel.DataAnnotations;
using MotionBooth.Api.Validation;

namespace MotionBooth.Api.DTOs.Events;

public class EventRequest
{
    [Required]
    [NotWhitespace]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Template { get; set; } = string.Empty;

    public IFormFile? BackgroundImageFile { get; set; }

    public bool RemoveBackgroundImage { get; set; }

    [Required]
    public DateOnly? EventDate { get; set; }
}

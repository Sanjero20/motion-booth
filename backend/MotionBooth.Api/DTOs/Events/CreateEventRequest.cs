using System.ComponentModel.DataAnnotations;
using MotionBooth.Api.Models;
using MotionBooth.Api.Validation;

namespace MotionBooth.Api.DTOs.Events;

public class CreateEventRequest
{
    [Required]
    [NotWhitespace]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public EventTemplate? Template { get; set; }

    [Required]
    public DateOnly? EventDate { get; set; }
}
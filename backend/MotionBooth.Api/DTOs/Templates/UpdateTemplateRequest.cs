using System.ComponentModel.DataAnnotations;
using MotionBooth.Api.Models;
using MotionBooth.Api.Validation;

namespace MotionBooth.Api.DTOs.Templates;

public class UpdateTemplateRequest
{
    [Required]
    [NotWhitespace]
    public string Name { get; set; } = string.Empty;

    [Range(1, 10000)]
    public int Width { get; set; }

    [Range(1, 10000)]
    public int Height { get; set; }

    [Required]
    [MinLength(1)]
    public List<Slot> Slots { get; set; } = [];
    public string? BackgroundImage { get; set; }
}
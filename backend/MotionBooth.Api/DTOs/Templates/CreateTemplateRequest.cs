using System.ComponentModel.DataAnnotations;
using MotionBooth.Api.Models;
using MotionBooth.Api.Validation;

namespace MotionBooth.Api.DTOs.Templates;

[ValidTemplateSlots]
public class CreateTemplateRequest : ITemplateRequest
{
    [Required]
    [NotWhitespace]
    public string Name { get; set; } = string.Empty;

    public Layout Layout { get; set; } = new();

    [Required]
    [MinLength(1)]
    public List<Slot> Slots { get; set; } = [];
    public string? BackgroundImage { get; set; }
}
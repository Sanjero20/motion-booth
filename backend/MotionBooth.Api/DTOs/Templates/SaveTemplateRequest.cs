using System.ComponentModel.DataAnnotations;

namespace MotionBooth.Api.DTOs.Templates;

public class SaveTemplateRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Layout { get; set; } = string.Empty;

    [Required]
    public string Slots { get; set; } = string.Empty;

    public IFormFile? BackgroundImageFile { get; set; }

    public bool RemoveBackgroundImage { get; set; }
}

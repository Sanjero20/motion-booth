namespace MotionBooth.Api.DTOs.Templates;

public class UpdateTemplateDto
{
    public string Name { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public string Slots { get; set; } = "[]";
    public string? BackgroundImage { get; set; }
}
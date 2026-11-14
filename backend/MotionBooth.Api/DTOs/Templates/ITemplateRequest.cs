
using MotionBooth.Api.Models;

namespace MotionBooth.Api.DTOs.Templates;

public interface ITemplateRequest
{
    string Name { get; set; }
    Layout Layout { get; set; }
    List<Slot> Slots { get; set; }
    string? BackgroundImage { get; set; }
}
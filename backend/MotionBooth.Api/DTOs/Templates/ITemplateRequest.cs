
using MotionBooth.Api.Models;

namespace MotionBooth.Api.DTOs.Templates;

public interface ITemplateRequest
{
    int Width { get; set; }
    int Height { get; set; }
    List<Slot> Slots { get; set; }

}
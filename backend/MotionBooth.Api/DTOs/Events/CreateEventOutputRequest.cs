namespace MotionBooth.Api.DTOs.Events;

public class CreateEventOutputRequest
{
    public IFormFile Image { get; set; } = null!;
    public IFormFile Video { get; set; } = null!;
}

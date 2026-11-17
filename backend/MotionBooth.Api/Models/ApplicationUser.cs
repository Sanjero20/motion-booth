using Microsoft.AspNetCore.Identity;

namespace MotionBooth.Api.Models;

public class ApplicationUser : IdentityUser
{
    public ICollection<Event> Events { get; set; } = [];
    public ICollection<Template> Templates { get; set; } = [];
}
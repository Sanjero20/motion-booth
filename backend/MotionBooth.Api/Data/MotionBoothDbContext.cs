using Microsoft.EntityFrameworkCore;

namespace MotionBooth.Api.Data;

public class MotionBoothDbContext : DbContext
{
  public MotionBoothDbContext(DbContextOptions<MotionBoothDbContext> options) : base(options)
  {
  }
}
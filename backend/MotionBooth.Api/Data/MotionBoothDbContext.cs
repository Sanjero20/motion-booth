using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Models;

namespace MotionBooth.Api.Data;

public class MotionBoothDbContext : DbContext
{
  public MotionBoothDbContext(
    DbContextOptions<MotionBoothDbContext> options)
    : base(options)
  {
  }

  public DbSet<Event> Events => Set<Event>();
}
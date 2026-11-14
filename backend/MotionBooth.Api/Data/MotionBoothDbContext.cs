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

    public DbSet<Template> Templates => Set<Template>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Template>(entity =>
        {
            entity.Property(e => e.Layout)
                .HasColumnType("jsonb");

            entity.Property(e => e.Slots)
                .HasColumnType("jsonb");
        });
    }
}
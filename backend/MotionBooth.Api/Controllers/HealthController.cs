using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Data;

namespace MotionBooth.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
  private readonly MotionBoothDbContext _dbContext;

  public HealthController(MotionBoothDbContext dbContext)
  {
    _dbContext = dbContext;
  }


  [HttpGet]
  public async Task<IActionResult> Get()
  {
    try
    {
      await _dbContext.Database.ExecuteSqlRawAsync("SELECT 1");

      return Ok(new
      {
        status = "Healthy",
        database = "Connected"
      });
    }
    catch
    {
      return StatusCode(503, new
      {
        status = "Unhealthy",
        database = "Disconnected"
      });
    }
  }

}
using backend.DTOs.Dashboard;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardRepository
            _dashboardRepository;

        public DashboardController(
            IDashboardRepository dashboardRepository
        )
        {
            _dashboardRepository = dashboardRepository;
        }

        // GET: api/dashboard
        [HttpGet]
        public async Task<ActionResult<DashboardResponse>>
            GetDashboard()
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId is null)
            {
                return Unauthorized(new
                {
                    message =
                        "The authentication token is invalid."
                });
            }

            DashboardResponse? dashboard =
                await _dashboardRepository
                    .GetDashboardAsync(ownerId.Value);

            if (dashboard is null)
            {
                return NotFound(new
                {
                    message = "User account not found."
                });
            }

            return Ok(dashboard);
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            return int.TryParse(
                userIdValue,
                out int userId
            )
                ? userId
                : null;
        }
    }
}
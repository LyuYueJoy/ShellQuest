using backend.DTOs.Tortoises;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/tortoises")]
    public class TortoisesController : ControllerBase
    {
        private readonly ITortoiseRepository _tortoiseRepository;

        public TortoisesController(
            ITortoiseRepository tortoiseRepository
        )
        {
            _tortoiseRepository = tortoiseRepository;
        }

        // GET: api/tortoises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TortoiseResponse>>>
            GetTortoises()
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return Unauthorized(new
                {
                    message = "The user ID is missing from the access token."
                });
            }

            List<Tortoise> tortoises =
                await _tortoiseRepository
                    .GetAllByOwnerIdAsync(ownerId.Value);

            List<TortoiseResponse> response = tortoises
                .Select(ToTortoiseResponse)
                .ToList();

            return Ok(response);
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (!int.TryParse(userIdValue, out int userId))
            {
                return null;
            }

            return userId;
        }

        private static TortoiseResponse ToTortoiseResponse(
            Tortoise tortoise
        )
        {
            return new TortoiseResponse
            {
                TortoiseId = tortoise.TortoiseId,
                Name = tortoise.Name,
                AgeMonths = tortoise.AgeMonths,
                WeightGrams = tortoise.WeightGrams,
                PhotoUrl = tortoise.PhotoUrl,
                Notes = tortoise.Notes,
                CreatedAt = tortoise.CreatedAt
            };
        }
    }
}
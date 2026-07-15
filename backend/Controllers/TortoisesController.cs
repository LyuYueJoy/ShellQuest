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
                return InvalidTokenResponse();
            }

            List<Tortoise> tortoises =
                await _tortoiseRepository
                    .GetAllByOwnerIdAsync(ownerId.Value);

            List<TortoiseResponse> response = tortoises
                .Select(ToTortoiseResponse)
                .ToList();

            return Ok(response);
        }

        // GET: api/tortoises/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TortoiseResponse>>
            GetTortoise(int id)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            return Ok(ToTortoiseResponse(tortoise));
        }

        // POST: api/tortoises
        [HttpPost]
        public async Task<ActionResult<TortoiseResponse>>
            CreateTortoise(CreateTortoiseRequest request)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            string name = request.Name.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new
                {
                    message = "Tortoise name is required."
                });
            }

            Tortoise tortoise = new Tortoise
            {
                OwnerId = ownerId.Value,
                Name = name,
                AgeMonths = request.AgeMonths,
                WeightGrams = request.WeightGrams,
                PhotoUrl = null,
                Notes = NormalizeOptionalText(request.Notes),
                CreatedAt = DateTime.UtcNow
            };

            Tortoise createdTortoise =
                await _tortoiseRepository.CreateAsync(tortoise);

            TortoiseResponse response =
                ToTortoiseResponse(createdTortoise);

            return CreatedAtAction(
                nameof(GetTortoise),
                new { id = createdTortoise.TortoiseId },
                response
            );
        }

        // PUT: api/tortoises/1
        [HttpPut("{id:int}")]
        public async Task<ActionResult<TortoiseResponse>>
            UpdateTortoise(
                int id,
                UpdateTortoiseRequest request
            )
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            string name = request.Name.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new
                {
                    message = "Tortoise name is required."
                });
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            tortoise.Name = name;
            tortoise.AgeMonths = request.AgeMonths;
            tortoise.WeightGrams = request.WeightGrams;
            tortoise.Notes =
                NormalizeOptionalText(request.Notes);

            await _tortoiseRepository.UpdateAsync(tortoise);

            return Ok(ToTortoiseResponse(tortoise));
        }

        // DELETE: api/tortoises/1
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTortoise(int id)
        {
            int? ownerId = GetCurrentUserId();

            if (ownerId == null)
            {
                return InvalidTokenResponse();
            }

            Tortoise? tortoise =
                await _tortoiseRepository.GetByIdAsync(
                    id,
                    ownerId.Value
                );

            if (tortoise == null)
            {
                return NotFound(new
                {
                    message = "Tortoise not found."
                });
            }

            await _tortoiseRepository.DeleteAsync(tortoise);

            return NoContent();
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

        private UnauthorizedObjectResult InvalidTokenResponse()
        {
            return Unauthorized(new
            {
                message =
                    "The user ID is missing from the access token."
            });
        }

        private static string? NormalizeOptionalText(
            string? value
        )
        {
            return string.IsNullOrWhiteSpace(value)
                ? null
                : value.Trim();
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
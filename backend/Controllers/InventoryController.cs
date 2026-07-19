using backend.DTOs.Shop;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/inventory")]
    public class InventoryController : ControllerBase
    {
        private readonly IShopRepository _shopRepository;

        public InventoryController(
            IShopRepository shopRepository
        )
        {
            _shopRepository = shopRepository;
        }

        // GET: api/inventory
        [HttpGet]
        public async Task<ActionResult<InventoryResponse>>
            GetInventory()
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

            InventoryResponse? response =
                await _shopRepository.GetInventoryAsync(
                    ownerId.Value
                );

            if (response is null)
            {
                return NotFound(new
                {
                    message = "User account not found."
                });
            }

            return Ok(response);
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue =
                User.FindFirstValue(
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
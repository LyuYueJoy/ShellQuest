using backend.DTOs.Shop;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/shop")]
    public class ShopController : ControllerBase
    {
        private readonly IShopRepository _shopRepository;

        public ShopController(
            IShopRepository shopRepository
        )
        {
            _shopRepository = shopRepository;
        }

        // GET: api/shop
        [HttpGet]
        public async Task<ActionResult<ShopResponse>>
            GetShop()
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

            ShopResponse? response =
                await _shopRepository.GetShopAsync(
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

        // POST: api/shop/items/1/purchase
        [HttpPost("items/{itemId:int}/purchase")]
        public async Task<ActionResult<PurchaseResponse>>
            PurchaseItem(int itemId)
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

            ShopPurchaseResult result =
                await _shopRepository.PurchaseItemAsync(
                    itemId,
                    ownerId.Value
                );

            switch (result.Status)
            {
                case ShopPurchaseStatus.UserNotFound:
                    return NotFound(new
                    {
                        message =
                            "User account not found."
                    });

                case ShopPurchaseStatus.ItemNotFound:
                    return NotFound(new
                    {
                        message =
                            "Shop item not found or is no longer available."
                    });

                case ShopPurchaseStatus.AlreadyOwned:
                    return Conflict(new
                    {
                        message =
                            "You already own this item."
                    });

                case ShopPurchaseStatus.InsufficientCoins:
                    return Conflict(new
                    {
                        message =
                            "You do not have enough Coins to purchase this item."
                    });

                case ShopPurchaseStatus.Success:
                    if (result.Response is null)
                    {
                        return StatusCode(
                            StatusCodes
                                .Status500InternalServerError,
                            new
                            {
                                message =
                                    "The purchase could not be completed."
                            }
                        );
                    }

                    return Ok(result.Response);

                default:
                    return StatusCode(
                        StatusCodes
                            .Status500InternalServerError,
                        new
                        {
                            message =
                                "An unexpected purchase error occurred."
                        }
                    );
            }
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
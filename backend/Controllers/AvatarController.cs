using System.Security.Claims;
using backend.DTOs.Avatar;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/tortoises/{tortoiseId:int}/avatar")]
[Authorize]
public class AvatarController : ControllerBase
{
    private readonly IAvatarRepository _avatarRepository;

    public AvatarController(IAvatarRepository avatarRepository)
    {
        _avatarRepository = avatarRepository;
    }

    // GET: /api/tortoises/1/avatar
    [HttpGet]
    public async Task<ActionResult<AvatarResponse>> GetAvatar(
        int tortoiseId
    )
    {
        int? ownerId = GetCurrentUserId();

        if (ownerId is null)
        {
            return Unauthorized(new
            {
                message = "The current user ID is missing from the token."
            });
        }

        AvatarResponse? avatar =
            await _avatarRepository.GetOrCreateAvatarAsync(
                tortoiseId,
                ownerId.Value
            );

        if (avatar is null)
        {
            return NotFound(new
            {
                message = "Tortoise was not found."
            });
        }

        return Ok(avatar);
    }

    // POST: /api/tortoises/1/avatar/items
    [HttpPost("items")]
    public async Task<ActionResult<AvatarResponse>> EquipItem(
        int tortoiseId,
        [FromBody] EquipAvatarItemRequest request
    )
    {
        int? ownerId = GetCurrentUserId();

        if (ownerId is null)
        {
            return Unauthorized(new
            {
                message = "The current user ID is missing from the token."
            });
        }

        AvatarOperationResult result =
            await _avatarRepository.EquipItemAsync(
                tortoiseId,
                request.ShopItemId,
                ownerId.Value
            );

        return ToActionResult(result);
    }

    // PUT: /api/tortoises/1/avatar/items/5
    [HttpPut("items/{equippedItemId:int}")]
    public async Task<ActionResult<AvatarResponse>> UpdateItem(
        int tortoiseId,
        int equippedItemId,
        [FromBody] UpdateAvatarItemRequest request
    )
    {
        int? ownerId = GetCurrentUserId();

        if (ownerId is null)
        {
            return Unauthorized(new
            {
                message = "The current user ID is missing from the token."
            });
        }

        AvatarOperationResult result =
            await _avatarRepository.UpdateItemAsync(
                tortoiseId,
                equippedItemId,
                request,
                ownerId.Value
            );

        return ToActionResult(result);
    }

    // DELETE: /api/tortoises/1/avatar/items/5
    [HttpDelete("items/{equippedItemId:int}")]
    public async Task<ActionResult<AvatarResponse>> RemoveItem(
        int tortoiseId,
        int equippedItemId
    )
    {
        int? ownerId = GetCurrentUserId();

        if (ownerId is null)
        {
            return Unauthorized(new
            {
                message = "The current user ID is missing from the token."
            });
        }

        AvatarOperationResult result =
            await _avatarRepository.RemoveItemAsync(
                tortoiseId,
                equippedItemId,
                ownerId.Value
            );

        return ToActionResult(result);
    }

    // PUT: /api/tortoises/1/avatar/canvas
    [HttpPut("canvas")]
    public async Task<ActionResult<AvatarResponse>> UpdateCanvas(
        int tortoiseId,
        [FromBody] UpdateAvatarCanvasRequest request
    )
    {
        int? ownerId = GetCurrentUserId();

        if (ownerId is null)
        {
            return Unauthorized(new
            {
                message = "The current user ID is missing from the token."
            });
        }

        AvatarOperationResult result =
            await _avatarRepository.UpdateCanvasAsync(
                tortoiseId,
                request,
                ownerId.Value
            );

        return ToActionResult(result);
    }

    private ActionResult<AvatarResponse> ToActionResult(
        AvatarOperationResult result
    )
    {
        return result.Status switch
        {
            AvatarOperationStatus.Success
                when result.Response is not null
                => Ok(result.Response),

            AvatarOperationStatus.TortoiseNotFound
                => NotFound(new
                {
                    message = "Tortoise was not found."
                }),

            AvatarOperationStatus.AvatarNotFound
                => NotFound(new
                {
                    message = "Avatar was not found."
                }),

            AvatarOperationStatus.ShopItemNotFound
                => NotFound(new
                {
                    message = "Shop item was not found or is unavailable."
                }),

            AvatarOperationStatus.EquippedItemNotFound
                => NotFound(new
                {
                    message = "Equipped avatar item was not found."
                }),

            AvatarOperationStatus.ItemNotOwned
                => StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message =
                            "You must purchase this item before equipping it."
                    }
                ),

            AvatarOperationStatus.ItemAlreadyEquipped
                => Conflict(new
                {
                    message =
                        "This item is already equipped on the avatar."
                }),

            _ => StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "An unexpected Avatar Studio error occurred."
                }
            )
        };
    }

    private int? GetCurrentUserId()
    {
        string? claimValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        return int.TryParse(claimValue, out int ownerId)
            ? ownerId
            : null;
    }
}
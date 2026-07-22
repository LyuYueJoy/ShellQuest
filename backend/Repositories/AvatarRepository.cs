using backend.Data;
using backend.DTOs.Avatar;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class AvatarRepository : IAvatarRepository
{
    private readonly WebAPIDBContext _context;
    private readonly TimeProvider _timeProvider;

    public AvatarRepository(
        WebAPIDBContext context,
        TimeProvider timeProvider
    )
    {
        _context = context;
        _timeProvider = timeProvider;
    }

    public async Task<AvatarResponse?>
        GetOrCreateAvatarAsync(
            int tortoiseId,
            int ownerId
        )
    {
        Tortoise? tortoise =
            await _context.Tortoises
                .FirstOrDefaultAsync(tortoise =>
                    tortoise.TortoiseId == tortoiseId &&
                    tortoise.OwnerId == ownerId
                );

        if (tortoise is null)
        {
            return null;
        }

        TortoiseAvatar? avatar =
            await GetAvatarEntityAsync(
                tortoiseId,
                ownerId
            );

        if (avatar is null)
        {
            avatar = new TortoiseAvatar
            {
                TortoiseId = tortoiseId,
                CanvasWidth = 800,
                CanvasHeight = 800,
                UpdatedAt = GetUtcNow()
            };

            await _context.TortoiseAvatars.AddAsync(
                avatar
            );

            await _context.SaveChangesAsync();

            avatar = await GetAvatarEntityAsync(
                tortoiseId,
                ownerId
            );
        }

        return avatar is null
            ? null
            : ToAvatarResponse(avatar);
    }

    public async Task<AvatarOperationResult>
        EquipItemAsync(
            int tortoiseId,
            int shopItemId,
            int ownerId
        )
    {
        Tortoise? tortoise =
            await _context.Tortoises
                .AsNoTracking()
                .FirstOrDefaultAsync(tortoise =>
                    tortoise.TortoiseId == tortoiseId &&
                    tortoise.OwnerId == ownerId
                );

        if (tortoise is null)
        {
            return Result(
                AvatarOperationStatus.TortoiseNotFound
            );
        }

        ShopItem? shopItem =
            await _context.ShopItems
                .AsNoTracking()
                .FirstOrDefaultAsync(item =>
                    item.ShopItemId == shopItemId &&
                    item.IsActive
                );

        if (shopItem is null)
        {
            return Result(
                AvatarOperationStatus.ShopItemNotFound
            );
        }

        bool isOwned =
            await _context.UserInventoryItems
                .AnyAsync(inventoryItem =>
                    inventoryItem.OwnerId == ownerId &&
                    inventoryItem.ShopItemId ==
                        shopItemId
                );

        if (!isOwned)
        {
            return Result(
                AvatarOperationStatus.ItemNotOwned
            );
        }

        TortoiseAvatar? avatar =
            await _context.TortoiseAvatars
                .FirstOrDefaultAsync(candidate =>
                    candidate.TortoiseId == tortoiseId
                );

        if (avatar is null)
        {
            avatar = new TortoiseAvatar
            {
                TortoiseId = tortoiseId,
                CanvasWidth = 800,
                CanvasHeight = 800,
                UpdatedAt = GetUtcNow()
            };

            await _context.TortoiseAvatars.AddAsync(
                avatar
            );

            await _context.SaveChangesAsync();
        }

        bool alreadyEquipped =
            await _context.AvatarEquippedItems
                .AnyAsync(equippedItem =>
                    equippedItem.TortoiseAvatarId ==
                        avatar.TortoiseAvatarId &&
                    equippedItem.ShopItemId ==
                        shopItemId
                );

        if (alreadyEquipped)
        {
            return Result(
                AvatarOperationStatus
                    .ItemAlreadyEquipped
            );
        }

        AvatarEquippedItem equippedItem =
            new AvatarEquippedItem
            {
                TortoiseAvatarId =
                    avatar.TortoiseAvatarId,

                ShopItemId = shopItem.ShopItemId,
                X = shopItem.DefaultX,
                Y = shopItem.DefaultY,

                // Avatar items currently allow a
                // maximum scale of 3.
                Scale = Math.Clamp(
                    shopItem.DefaultScale,
                    0.05,
                    3
                ),

                Rotation = Math.Clamp(
                    shopItem.DefaultRotation,
                    -180,
                    180
                ),

                ZIndex = shopItem.DefaultZIndex
            };

        avatar.UpdatedAt = GetUtcNow();

        await _context.AvatarEquippedItems.AddAsync(
            equippedItem
        );

        await _context.SaveChangesAsync();

        return await SuccessResultAsync(
            tortoiseId,
            ownerId
        );
    }

    public async Task<AvatarOperationResult>
        UpdateItemAsync(
            int tortoiseId,
            int equippedItemId,
            UpdateAvatarItemRequest request,
            int ownerId
        )
    {
        bool tortoiseExists =
            await _context.Tortoises
                .AsNoTracking()
                .AnyAsync(tortoise =>
                    tortoise.TortoiseId == tortoiseId &&
                    tortoise.OwnerId == ownerId
                );

        if (!tortoiseExists)
        {
            return Result(
                AvatarOperationStatus.TortoiseNotFound
            );
        }

        TortoiseAvatar? avatar =
            await _context.TortoiseAvatars
                .FirstOrDefaultAsync(candidate =>
                    candidate.TortoiseId == tortoiseId
                );

        if (avatar is null)
        {
            return Result(
                AvatarOperationStatus.AvatarNotFound
            );
        }

        AvatarEquippedItem? equippedItem =
            await _context.AvatarEquippedItems
                .FirstOrDefaultAsync(item =>
                    item.AvatarEquippedItemId ==
                        equippedItemId &&
                    item.TortoiseAvatarId ==
                        avatar.TortoiseAvatarId
                );

        if (equippedItem is null)
        {
            return Result(
                AvatarOperationStatus
                    .EquippedItemNotFound
            );
        }

        equippedItem.X = request.X;
        equippedItem.Y = request.Y;
        equippedItem.Scale = request.Scale;
        equippedItem.Rotation = request.Rotation;
        equippedItem.ZIndex = request.ZIndex;

        avatar.UpdatedAt = GetUtcNow();

        await _context.SaveChangesAsync();

        return await SuccessResultAsync(
            tortoiseId,
            ownerId
        );
    }

    public async Task<AvatarOperationResult>
        RemoveItemAsync(
            int tortoiseId,
            int equippedItemId,
            int ownerId
        )
    {
        bool tortoiseExists =
            await _context.Tortoises
                .AsNoTracking()
                .AnyAsync(tortoise =>
                    tortoise.TortoiseId == tortoiseId &&
                    tortoise.OwnerId == ownerId
                );

        if (!tortoiseExists)
        {
            return Result(
                AvatarOperationStatus.TortoiseNotFound
            );
        }

        TortoiseAvatar? avatar =
            await _context.TortoiseAvatars
                .FirstOrDefaultAsync(candidate =>
                    candidate.TortoiseId == tortoiseId
                );

        if (avatar is null)
        {
            return Result(
                AvatarOperationStatus.AvatarNotFound
            );
        }

        AvatarEquippedItem? equippedItem =
            await _context.AvatarEquippedItems
                .FirstOrDefaultAsync(item =>
                    item.AvatarEquippedItemId ==
                        equippedItemId &&
                    item.TortoiseAvatarId ==
                        avatar.TortoiseAvatarId
                );

        if (equippedItem is null)
        {
            return Result(
                AvatarOperationStatus
                    .EquippedItemNotFound
            );
        }

        _context.AvatarEquippedItems.Remove(
            equippedItem
        );

        avatar.UpdatedAt = GetUtcNow();

        await _context.SaveChangesAsync();

        return await SuccessResultAsync(
            tortoiseId,
            ownerId
        );
    }

    public async Task<AvatarOperationResult>
        UpdateCanvasAsync(
            int tortoiseId,
            UpdateAvatarCanvasRequest request,
            int ownerId
        )
    {
        bool tortoiseExists =
            await _context.Tortoises
                .AsNoTracking()
                .AnyAsync(tortoise =>
                    tortoise.TortoiseId == tortoiseId &&
                    tortoise.OwnerId == ownerId
                );

        if (!tortoiseExists)
        {
            return Result(
                AvatarOperationStatus.TortoiseNotFound
            );
        }

        TortoiseAvatar? avatar =
            await _context.TortoiseAvatars
                .FirstOrDefaultAsync(candidate =>
                    candidate.TortoiseId == tortoiseId
                );

        if (avatar is null)
        {
            avatar = new TortoiseAvatar
            {
                TortoiseId = tortoiseId
            };

            await _context.TortoiseAvatars.AddAsync(
                avatar
            );
        }

        avatar.CanvasWidth = request.CanvasWidth;
        avatar.CanvasHeight = request.CanvasHeight;
        avatar.UpdatedAt = GetUtcNow();

        await _context.SaveChangesAsync();

        return await SuccessResultAsync(
            tortoiseId,
            ownerId
        );
    }

    private async Task<TortoiseAvatar?>
        GetAvatarEntityAsync(
            int tortoiseId,
            int ownerId
        )
    {
        return await _context.TortoiseAvatars
            .AsNoTracking()
            .Include(avatar => avatar.Tortoise)
            .Include(avatar => avatar.EquippedItems)
                .ThenInclude(item => item.ShopItem)
            .FirstOrDefaultAsync(avatar =>
                avatar.TortoiseId == tortoiseId &&
                avatar.Tortoise.OwnerId == ownerId
            );
    }

    private async Task<AvatarOperationResult>
        SuccessResultAsync(
            int tortoiseId,
            int ownerId
        )
    {
        TortoiseAvatar? avatar =
            await GetAvatarEntityAsync(
                tortoiseId,
                ownerId
            );

        return new AvatarOperationResult
        {
            Status = AvatarOperationStatus.Success,

            Response = avatar is null
                ? null
                : ToAvatarResponse(avatar)
        };
    }

    private static AvatarOperationResult Result(
        AvatarOperationStatus status
    )
    {
        return new AvatarOperationResult
        {
            Status = status
        };
    }

    private DateTime GetUtcNow()
    {
        return _timeProvider
            .GetUtcNow()
            .UtcDateTime;
    }

    private static AvatarResponse ToAvatarResponse(
        TortoiseAvatar avatar
    )
    {
        return new AvatarResponse
        {
            TortoiseAvatarId =
                avatar.TortoiseAvatarId,

            TortoiseId = avatar.TortoiseId,
            TortoiseName = avatar.Tortoise.Name,

            TortoisePhotoUrl =
                avatar.Tortoise.PhotoUrl,

            CanvasWidth = avatar.CanvasWidth,
            CanvasHeight = avatar.CanvasHeight,
            UpdatedAt = avatar.UpdatedAt,

            EquippedItems = avatar.EquippedItems
                .OrderBy(item => item.ZIndex)
                .ThenBy(item =>
                    item.AvatarEquippedItemId
                )
                .Select(ToEquippedItemResponse)
                .ToList()
        };
    }

    private static AvatarEquippedItemResponse
        ToEquippedItemResponse(
            AvatarEquippedItem equippedItem
        )
    {
        ShopItem shopItem =
            equippedItem.ShopItem;

        return new AvatarEquippedItemResponse
        {
            AvatarEquippedItemId =
                equippedItem.AvatarEquippedItemId,

            ShopItemId = shopItem.ShopItemId,
            Name = shopItem.Name,
            Category = shopItem.Category,
            AssetKey = shopItem.AssetKey,
            AssetUrl = shopItem.AssetUrl,
            AssetType = shopItem.AssetType,
            X = equippedItem.X,
            Y = equippedItem.Y,
            Scale = equippedItem.Scale,
            Rotation = equippedItem.Rotation,
            ZIndex = equippedItem.ZIndex
        };
    }
}
using backend.DTOs.Avatar;

namespace backend.Repositories;

public interface IAvatarRepository
{
    Task<AvatarResponse?> GetOrCreateAvatarAsync(
        int tortoiseId,
        int ownerId
    );

    Task<AvatarOperationResult> EquipItemAsync(
        int tortoiseId,
        int shopItemId,
        int ownerId
    );

    Task<AvatarOperationResult> UpdateItemAsync(
        int tortoiseId,
        int equippedItemId,
        UpdateAvatarItemRequest request,
        int ownerId
    );

    Task<AvatarOperationResult> RemoveItemAsync(
        int tortoiseId,
        int equippedItemId,
        int ownerId
    );

    Task<AvatarOperationResult> UpdateCanvasAsync(
        int tortoiseId,
        UpdateAvatarCanvasRequest request,
        int ownerId
    );
}

public enum AvatarOperationStatus
{
    Success,
    TortoiseNotFound,
    AvatarNotFound,
    ShopItemNotFound,
    ItemNotOwned,
    ItemAlreadyEquipped,
    EquippedItemNotFound
}

public class AvatarOperationResult
{
    public AvatarOperationStatus Status { get; set; }

    public AvatarResponse? Response { get; set; }
}
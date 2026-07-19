using backend.DTOs.Shop;

namespace backend.Repositories
{
    public interface IShopRepository
    {
        Task<ShopResponse?> GetShopAsync(int ownerId);

        Task<InventoryResponse?> GetInventoryAsync(
            int ownerId
        );

        Task<ShopPurchaseResult> PurchaseItemAsync(
            int itemId,
            int ownerId
        );
    }
}
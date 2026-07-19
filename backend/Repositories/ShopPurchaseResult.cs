using backend.DTOs.Shop;

namespace backend.Repositories
{
    public enum ShopPurchaseStatus
    {
        Success,
        UserNotFound,
        ItemNotFound,
        AlreadyOwned,
        InsufficientCoins
    }

    public class ShopPurchaseResult
    {
        public ShopPurchaseStatus Status { get; set; }

        public PurchaseResponse? Response { get; set; }
    }
}
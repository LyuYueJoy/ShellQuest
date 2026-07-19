namespace backend.DTOs.Shop
{
    public class PurchaseResponse
    {
        public InventoryItemResponse PurchasedItem
        {
            get;
            set;
        } = new();

        public int PricePaid { get; set; }

        public int RemainingCoins { get; set; }
    }
}
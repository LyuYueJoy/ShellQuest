namespace backend.DTOs.Shop
{
    public class ShopResponse
    {
        public int Coins { get; set; }

        public List<ShopItemResponse> Items { get; set; }
            = new();
    }
}
namespace backend.DTOs.Shop
{
    public class InventoryResponse
    {
        public int TotalItems { get; set; }

        public List<InventoryItemResponse> Items { get; set; }
            = new();
    }
}
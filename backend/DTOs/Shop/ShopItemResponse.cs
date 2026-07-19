namespace backend.DTOs.Shop
{
    public class ShopItemResponse
    {
        public int ShopItemId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; }
            = string.Empty;

        public string Category { get; set; }
            = string.Empty;

        public int Price { get; set; }

        public string AssetKey { get; set; }
            = string.Empty;

        public string AssetUrl { get; set; }
            = string.Empty;

        public string? ThumbnailUrl { get; set; }

        public string AssetType { get; set; }
            = string.Empty;

        public double DefaultX { get; set; }

        public double DefaultY { get; set; }

        public double DefaultScale { get; set; }

        public double DefaultRotation { get; set; }

        public int DefaultZIndex { get; set; }

        public bool IsOwned { get; set; }

        public bool CanAfford { get; set; }
    }
}
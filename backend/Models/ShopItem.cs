using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ShopItem
    {
        [Key]
        public int ShopItemId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string Category { get; set; } = string.Empty;

        [Range(0, 100000)]
        public int Price { get; set; }

        [Required]
        [MaxLength(100)]
        public string AssetKey { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string AssetUrl { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        [Required]
        [MaxLength(30)]
        public string AssetType { get; set; } = "Image";

        [Range(
            typeof(double),
            "0",
            "1",
            ErrorMessage = "Default X must be between 0 and 1."
        )]
        public double DefaultX { get; set; } = 0.5;

        [Range(
            typeof(double),
            "0",
            "1",
            ErrorMessage = "Default Y must be between 0 and 1."
        )]
        public double DefaultY { get; set; } = 0.5;

        [Range(
            typeof(double),
            "0.05",
            "5",
            ErrorMessage = "Default scale must be between 0.05 and 5."
        )]
        public double DefaultScale { get; set; } = 0.4;

        [Range(
            typeof(double),
            "-360",
            "360",
            ErrorMessage = "Rotation must be between -360 and 360 degrees."
        )]
        public double DefaultRotation { get; set; }

        [Range(0, 100)]
        public int DefaultZIndex { get; set; } = 1;

        public bool IsActive { get; set; } = true;

        [Range(0, 10000)]
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public ICollection<UserInventoryItem> InventoryItems
        {
            get;
            set;
        } = new List<UserInventoryItem>();

        public ICollection<PurchaseTransaction> Purchases
        {
            get;
            set;
        } = new List<PurchaseTransaction>();
    }
}
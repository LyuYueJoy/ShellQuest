using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserInventoryItem
    {
        [Key]
        public int UserInventoryItemId { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        public int ShopItemId { get; set; }

        public DateTime AcquiredAt { get; set; }
            = DateTime.UtcNow;

        public User Owner { get; set; } = null!;

        public ShopItem ShopItem { get; set; } = null!;
    }
}
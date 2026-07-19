using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PurchaseTransaction
    {
        [Key]
        public int PurchaseTransactionId { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        public int ShopItemId { get; set; }

        [Range(0, 100000)]
        public int PricePaid { get; set; }

        public DateTime PurchasedAt { get; set; }
            = DateTime.UtcNow;

        public User Owner { get; set; } = null!;

        public ShopItem ShopItem { get; set; } = null!;
    }
}
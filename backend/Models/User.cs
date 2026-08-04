using System.ComponentModel.DataAnnotations;
namespace backend.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "User";

        [Range(0, int.MaxValue)]
        public int TotalXp { get; set; }

        [Range(0, int.MaxValue)]
        public int Coins { get; set; }

        [Range(0, int.MaxValue)]
        public int CurrentStreak { get; set; }

        [Range(0, int.MaxValue)]
        public int LongestStreak { get; set; }

        public DateOnly? LastActiveDate { get; set; }

        public ICollection<Tortoise> Tortoises { get; set; } = new List<Tortoise>();

        public ICollection<DailyCareTask> DailyCareTasks { get; set; }
    = new List<DailyCareTask>();

        public ICollection<UserAchievement> Achievements { get; set; }
            = new List<UserAchievement>();

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

        public ICollection<ForumPost> ForumPosts { get; set; }
    = new List<ForumPost>();

        public ICollection<ForumReply> ForumReplies { get; set; }
            = new List<ForumReply>();

        public ICollection<ForumPostLike> ForumPostLikes { get; set; }
            = new List<ForumPostLike>();

        public ICollection<ChatMessage> SentMessages { get; set; }
    = new List<ChatMessage>();

        public ICollection<ChatMessage> ReceivedMessages { get; set; }
            = new List<ChatMessage>();
    }
}
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserAchievement
    {
        [Key]
        public int UserAchievementId { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        [MaxLength(50)]
        public string AchievementType { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(300)]
        public string Description { get; set; } = string.Empty;

        public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;

        public User Owner { get; set; } = null!;
    }
}
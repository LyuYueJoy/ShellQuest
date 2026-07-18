using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class DailyCareTask
    {
        [Key]
        public int DailyCareTaskId { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        public int TortoiseId { get; set; }

        [Required]
        [MaxLength(30)]
        public string TaskType { get; set; } = string.Empty;

        public DateOnly TaskDate { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime? CompletedAt { get; set; }

        [Range(0, 1000)]
        public int XpReward { get; set; }

        [Range(0, 1000)]
        public int CoinReward { get; set; }

        public User Owner { get; set; } = null!;

        public Tortoise Tortoise { get; set; } = null!;
    }
}
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Tortoise
    {
        [Key]
        public int TortoiseId { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 2400)]
        public int? AgeMonths { get; set; }

        [Range(typeof(decimal), "0.1", "100000")]
        public decimal? WeightGrams { get; set; }

        [MaxLength(500)]
        public string? PhotoUrl { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User Owner { get; set; } = null!;

        public ICollection<DailyCareTask> DailyCareTasks { get; set; }
    = new List<DailyCareTask>();
    }
}
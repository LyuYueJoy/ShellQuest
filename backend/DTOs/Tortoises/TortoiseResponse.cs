namespace backend.DTOs.Tortoises
{
    public class TortoiseResponse
    {
        public int TortoiseId { get; set; }

        public string Name { get; set; } = string.Empty;

        public int? AgeMonths { get; set; }

        public decimal? WeightGrams { get; set; }

        public string? PhotoUrl { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
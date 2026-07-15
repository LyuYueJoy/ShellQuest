using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Tortoises
{
    public class UpdateTortoiseRequest
    {
        [Required(ErrorMessage = "Tortoise name is required.")]
        [MaxLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [Range(
            0,
            2400,
            ErrorMessage = "Age must be between 0 and 2400 months."
        )]
        public int? AgeMonths { get; set; }

        [Range(
            typeof(decimal),
            "0.1",
            "100000",
            ErrorMessage = "Weight must be between 0.1 and 100000 grams."
        )]
        public decimal? WeightGrams { get; set; }

        [MaxLength(500, ErrorMessage = "Notes cannot exceed 500 characters.")]
        public string? Notes { get; set; }
    }
}
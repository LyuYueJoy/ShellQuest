namespace backend.DTOs.Dashboard
{
    public class AchievementResponse
    {
        public int AchievementId { get; set; }

        public string AchievementType { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime UnlockedAt { get; set; }
    }
}
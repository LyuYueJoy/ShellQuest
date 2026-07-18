using backend.DTOs.Dashboard;

namespace backend.DTOs.CareTasks
{
    public class CompleteCareTaskResponse
    {
        public int TaskId { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CompletedAt { get; set; }

        public int XpEarned { get; set; }

        public int CoinsEarned { get; set; }

        public int TotalXp { get; set; }

        public int Coins { get; set; }

        public int Level { get; set; }

        public int CurrentStreak { get; set; }

        public AchievementResponse? UnlockedAchievement
        {
            get;
            set;
        }
    }
}
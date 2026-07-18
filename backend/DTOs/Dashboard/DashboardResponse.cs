namespace backend.DTOs.Dashboard
{
    public class DashboardResponse
    {
        public int Level { get; set; }

        public int TotalXp { get; set; }

        public int CurrentLevelXp { get; set; }

        public int XpRequiredForNextLevel { get; set; }

        public int Coins { get; set; }

        public int CurrentStreak { get; set; }

        public int LongestStreak { get; set; }

        public TodayProgressResponse TodayProgress { get; set; }
            = new();

        public List<DashboardTaskResponse> TodayTasks { get; set; }
            = new();

        public AchievementResponse? RecentAchievement { get; set; }
    }
}
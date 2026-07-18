namespace backend.DTOs.Dashboard
{
    public class DashboardTaskResponse
    {
        public int TaskId { get; set; }

        public string TaskType { get; set; } = string.Empty;

        public int TortoiseId { get; set; }

        public string TortoiseName { get; set; } = string.Empty;

        public bool IsCompleted { get; set; }

        public DateTime? CompletedAt { get; set; }

        public int XpReward { get; set; }

        public int CoinReward { get; set; }
    }
}
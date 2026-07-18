using backend.Data;
using backend.DTOs.Dashboard;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private const int XpPerLevel = 100;
        private const int DefaultXpReward = 10;
        private const int DefaultCoinReward = 5;

        private static readonly string[] DailyTaskTypes =
        {
            "Feed",
            "Bath",
            "Clean",
            "UVB",
            "Temperature"
        };

        private readonly WebAPIDBContext _context;
        private readonly TimeProvider _timeProvider;

        public DashboardRepository(
            WebAPIDBContext context,
            TimeProvider timeProvider
        )
        {
            _context = context;
            _timeProvider = timeProvider;
        }

        public async Task<DashboardResponse?> GetDashboardAsync(
            int ownerId
        )
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user =>
                    user.UserId == ownerId
                );

            if (user is null)
            {
                return null;
            }

            var today = GetAucklandDate();

            await EnsureTodayTasksExistAsync(ownerId, today);

            var todayTasks = await _context.DailyCareTasks
                .AsNoTracking()
                .Where(task =>
                    task.OwnerId == ownerId &&
                    task.TaskDate == today
                )
                .Include(task => task.Tortoise)
                .OrderBy(task => task.Tortoise.Name)
                .ThenBy(task => task.DailyCareTaskId)
                .Select(task => new DashboardTaskResponse
                {
                    TaskId = task.DailyCareTaskId,
                    TaskType = task.TaskType,
                    TortoiseId = task.TortoiseId,
                    TortoiseName = task.Tortoise.Name,
                    IsCompleted = task.IsCompleted,
                    CompletedAt = task.CompletedAt,
                    XpReward = task.XpReward,
                    CoinReward = task.CoinReward
                })
                .ToListAsync();

            var recentAchievement =
                await _context.UserAchievements
                    .AsNoTracking()
                    .Where(achievement =>
                        achievement.OwnerId == ownerId
                    )
                    .OrderByDescending(achievement =>
                        achievement.UnlockedAt
                    )
                    .Select(achievement =>
                        new AchievementResponse
                        {
                            AchievementId =
                                achievement.UserAchievementId,

                            AchievementType =
                                achievement.AchievementType,

                            Title = achievement.Title,

                            Description =
                                achievement.Description,

                            UnlockedAt =
                                achievement.UnlockedAt
                        }
                    )
                    .FirstOrDefaultAsync();

            var completedCount = todayTasks.Count(task =>
                task.IsCompleted
            );

            var totalCount = todayTasks.Count;

            var percentage = totalCount == 0
                ? 0
                : completedCount * 100 / totalCount;

            return new DashboardResponse
            {
                Level = user.TotalXp / XpPerLevel + 1,

                TotalXp = user.TotalXp,

                CurrentLevelXp =
                    user.TotalXp % XpPerLevel,

                XpRequiredForNextLevel = XpPerLevel,

                Coins = user.Coins,

                CurrentStreak = user.CurrentStreak,

                LongestStreak = user.LongestStreak,

                TodayProgress = new TodayProgressResponse
                {
                    Completed = completedCount,
                    Total = totalCount,
                    Percentage = percentage
                },

                TodayTasks = todayTasks,

                RecentAchievement = recentAchievement
            };
        }

        private async Task EnsureTodayTasksExistAsync(
            int ownerId,
            DateOnly today
        )
        {
            var tortoiseIds = await _context.Tortoises
                .AsNoTracking()
                .Where(tortoise =>
                    tortoise.OwnerId == ownerId
                )
                .Select(tortoise =>
                    tortoise.TortoiseId
                )
                .ToListAsync();

            if (tortoiseIds.Count == 0)
            {
                return;
            }

            var existingTasks = await _context.DailyCareTasks
                .AsNoTracking()
                .Where(task =>
                    task.OwnerId == ownerId &&
                    task.TaskDate == today
                )
                .Select(task => new
                {
                    task.TortoiseId,
                    task.TaskType
                })
                .ToListAsync();

            var existingTaskKeys = existingTasks
                .Select(task =>
                    $"{task.TortoiseId}:{task.TaskType}"
                )
                .ToHashSet(
                    StringComparer.OrdinalIgnoreCase
                );

            var newTasks = new List<DailyCareTask>();

            foreach (var tortoiseId in tortoiseIds)
            {
                foreach (var taskType in DailyTaskTypes)
                {
                    var taskKey =
                        $"{tortoiseId}:{taskType}";

                    if (existingTaskKeys.Contains(taskKey))
                    {
                        continue;
                    }

                    newTasks.Add(new DailyCareTask
                    {
                        OwnerId = ownerId,
                        TortoiseId = tortoiseId,
                        TaskType = taskType,
                        TaskDate = today,
                        IsCompleted = false,
                        XpReward = DefaultXpReward,
                        CoinReward = DefaultCoinReward
                    });
                }
            }

            if (newTasks.Count == 0)
            {
                return;
            }

            await _context.DailyCareTasks
                .AddRangeAsync(newTasks);

            await _context.SaveChangesAsync();
        }

        private DateOnly GetAucklandDate()
        {
            var timeZone = GetAucklandTimeZone();

            var aucklandTime =
                TimeZoneInfo.ConvertTime(
                    _timeProvider.GetUtcNow(),
                    timeZone
                );

            return DateOnly.FromDateTime(
                aucklandTime.DateTime
            );
        }

        private static TimeZoneInfo GetAucklandTimeZone()
        {
            try
            {
                // Linux, Azure and Docker
                return TimeZoneInfo.FindSystemTimeZoneById(
                    "Pacific/Auckland"
                );
            }
            catch (TimeZoneNotFoundException)
            {
                // Windows fallback
                return TimeZoneInfo.FindSystemTimeZoneById(
                    "New Zealand Standard Time"
                );
            }
        }
    }
}
using backend.Data;
using backend.DTOs.CareTasks;
using backend.DTOs.Dashboard;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class CareTaskRepository : ICareTaskRepository
    {
        private const int XpPerLevel = 100;

        private readonly WebAPIDBContext _context;
        private readonly TimeProvider _timeProvider;

        public CareTaskRepository(
            WebAPIDBContext context,
            TimeProvider timeProvider
        )
        {
            _context = context;
            _timeProvider = timeProvider;
        }

        public async Task<CareTaskCompletionResult>
            CompleteTaskAsync(
                int taskId,
                int ownerId
            )
        {
            await using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            DailyCareTask? task =
                await _context.DailyCareTasks
                    .FirstOrDefaultAsync(task =>
                        task.DailyCareTaskId == taskId &&
                        task.OwnerId == ownerId
                    );

            if (task is null)
            {
                return new CareTaskCompletionResult
                {
                    Status =
                        CareTaskCompletionStatus.NotFound
                };
            }

            if (task.IsCompleted)
            {
                return new CareTaskCompletionResult
                {
                    Status =
                        CareTaskCompletionStatus
                            .AlreadyCompleted
                };
            }

            User? user = await _context.Users
                .FirstOrDefaultAsync(user =>
                    user.UserId == ownerId
                );

            if (user is null)
            {
                return new CareTaskCompletionResult
                {
                    Status =
                        CareTaskCompletionStatus.NotFound
                };
            }

            DateTime completedAt =
                _timeProvider.GetUtcNow().UtcDateTime;

            DateOnly today = GetAucklandDate();

            task.IsCompleted = true;
            task.CompletedAt = completedAt;

            user.TotalXp += task.XpReward;
            user.Coins += task.CoinReward;

            UpdateStreak(user, today);

            UserAchievement? unlockedAchievement =
                await TryUnlockAchievementAsync(
                    user,
                    completedAt
                );

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new CareTaskCompletionResult
            {
                Status = CareTaskCompletionStatus.Success,

                Response = new CompleteCareTaskResponse
                {
                    TaskId = task.DailyCareTaskId,
                    IsCompleted = true,
                    CompletedAt = completedAt,
                    XpEarned = task.XpReward,
                    CoinsEarned = task.CoinReward,
                    TotalXp = user.TotalXp,
                    Coins = user.Coins,

                    Level =
                        user.TotalXp / XpPerLevel + 1,

                    CurrentStreak =
                        user.CurrentStreak,

                    UnlockedAchievement =
                        unlockedAchievement is null
                            ? null
                            : ToAchievementResponse(
                                unlockedAchievement
                            )
                }
            };
        }

        private static void UpdateStreak(
            User user,
            DateOnly today
        )
        {
            if (user.LastActiveDate == today)
            {
                return;
            }

            DateOnly yesterday = today.AddDays(-1);

            if (user.LastActiveDate == yesterday)
            {
                user.CurrentStreak++;
            }
            else
            {
                user.CurrentStreak = 1;
            }

            if (user.CurrentStreak > user.LongestStreak)
            {
                user.LongestStreak =
                    user.CurrentStreak;
            }

            user.LastActiveDate = today;
        }

        private async Task<UserAchievement?>
            TryUnlockAchievementAsync(
                User user,
                DateTime unlockedAt
            )
        {
            AchievementDefinition? definition = null;

            bool hasCompletedTaskAchievement =
                await _context.UserAchievements
                    .AnyAsync(achievement =>
                        achievement.OwnerId ==
                            user.UserId &&
                        achievement.AchievementType ==
                            "FIRST_TASK"
                    );

            if (!hasCompletedTaskAchievement)
            {
                definition = new AchievementDefinition(
                    "FIRST_TASK",
                    "First Step",
                    "Completed your first tortoise care task."
                );
            }
            else if (user.CurrentStreak >= 7)
            {
                definition = new AchievementDefinition(
                    "STREAK_7",
                    "Seven Day Streak",
                    "Completed tortoise care tasks for seven consecutive days."
                );
            }
            else if (user.CurrentStreak >= 3)
            {
                definition = new AchievementDefinition(
                    "STREAK_3",
                    "Three Day Streak",
                    "Completed tortoise care tasks for three consecutive days."
                );
            }

            if (definition is null)
            {
                return null;
            }

            bool alreadyUnlocked =
                await _context.UserAchievements
                    .AnyAsync(achievement =>
                        achievement.OwnerId ==
                            user.UserId &&
                        achievement.AchievementType ==
                            definition.Type
                    );

            if (alreadyUnlocked)
            {
                return null;
            }

            var achievement = new UserAchievement
            {
                OwnerId = user.UserId,
                AchievementType = definition.Type,
                Title = definition.Title,
                Description = definition.Description,
                UnlockedAt = unlockedAt
            };

            await _context.UserAchievements.AddAsync(
                achievement
            );

            return achievement;
        }

        private DateOnly GetAucklandDate()
        {
            TimeZoneInfo timeZone =
                GetAucklandTimeZone();

            DateTimeOffset aucklandTime =
                TimeZoneInfo.ConvertTime(
                    _timeProvider.GetUtcNow(),
                    timeZone
                );

            return DateOnly.FromDateTime(
                aucklandTime.DateTime
            );
        }

        private static TimeZoneInfo
            GetAucklandTimeZone()
        {
            try
            {
                return TimeZoneInfo
                    .FindSystemTimeZoneById(
                        "Pacific/Auckland"
                    );
            }
            catch (TimeZoneNotFoundException)
            {
                return TimeZoneInfo
                    .FindSystemTimeZoneById(
                        "New Zealand Standard Time"
                    );
            }
        }

        private static AchievementResponse
            ToAchievementResponse(
                UserAchievement achievement
            )
        {
            return new AchievementResponse
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
            };
        }

        private sealed record AchievementDefinition(
            string Type,
            string Title,
            string Description
        );
    }
}
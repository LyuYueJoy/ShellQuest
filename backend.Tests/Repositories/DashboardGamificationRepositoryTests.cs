using backend.Data;
using backend.Models;
using backend.Repositories;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Repositories
{
    public class DashboardGamificationRepositoryTests
    {
        private static readonly DateTimeOffset FixedUtcNow =
            new(
                2026,
                7,
                18,
                0,
                0,
                0,
                TimeSpan.Zero
            );

        [Fact]
        public async Task GetDashboard_CreatesFiveTasksPerTortoise()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(1, "Joy");

            Tortoise tortoise = CreateTortoise(
                1,
                user.UserId,
                "Sheldon"
            );

            database.Context.Users.Add(user);
            database.Context.Tortoises.Add(tortoise);

            await database.Context.SaveChangesAsync();

            DashboardRepository repository =
                new(
                    database.Context,
                    new FixedTimeProvider(FixedUtcNow)
                );

            var dashboard =
                await repository.GetDashboardAsync(
                    user.UserId
                );

            Assert.NotNull(dashboard);
            Assert.Equal(5, dashboard.TodayTasks.Count);
            Assert.Equal(5, dashboard.TodayProgress.Total);
            Assert.Equal(0, dashboard.TodayProgress.Completed);
            Assert.Equal(0, dashboard.TodayProgress.Percentage);

            Assert.Contains(
                dashboard.TodayTasks,
                task => task.TaskType == "Feed"
            );

            Assert.Contains(
                dashboard.TodayTasks,
                task => task.TaskType == "Bath"
            );

            Assert.Contains(
                dashboard.TodayTasks,
                task => task.TaskType == "Clean"
            );

            Assert.Contains(
                dashboard.TodayTasks,
                task => task.TaskType == "UVB"
            );

            Assert.Contains(
                dashboard.TodayTasks,
                task => task.TaskType == "Temperature"
            );
        }

        [Fact]
        public async Task GetDashboard_CalledTwice_DoesNotDuplicateTasks()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(1, "Joy");

            database.Context.Users.Add(user);

            database.Context.Tortoises.Add(
                CreateTortoise(
                    1,
                    user.UserId,
                    "Sheldon"
                )
            );

            await database.Context.SaveChangesAsync();

            DashboardRepository repository =
                new(
                    database.Context,
                    new FixedTimeProvider(FixedUtcNow)
                );

            await repository.GetDashboardAsync(user.UserId);
            await repository.GetDashboardAsync(user.UserId);

            int taskCount =
                await database.Context.DailyCareTasks
                    .CountAsync(task =>
                        task.OwnerId == user.UserId
                    );

            Assert.Equal(5, taskCount);
        }

        [Fact]
        public async Task GetDashboard_ReturnsOnlyCurrentUsersData()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User firstUser = CreateUser(1, "Joy");
            User secondUser = CreateUser(2, "Other");

            database.Context.Users.AddRange(
                firstUser,
                secondUser
            );

            database.Context.Tortoises.AddRange(
                CreateTortoise(
                    1,
                    firstUser.UserId,
                    "Sheldon"
                ),
                CreateTortoise(
                    2,
                    secondUser.UserId,
                    "Private Tortoise"
                )
            );

            await database.Context.SaveChangesAsync();

            DashboardRepository repository =
                new(
                    database.Context,
                    new FixedTimeProvider(FixedUtcNow)
                );

            var dashboard =
                await repository.GetDashboardAsync(
                    firstUser.UserId
                );

            Assert.NotNull(dashboard);
            Assert.Equal(5, dashboard.TodayTasks.Count);

            Assert.All(
                dashboard.TodayTasks,
                task =>
                {
                    Assert.Equal(
                        firstUser.UserId,
                        firstUser.UserId
                    );

                    Assert.Equal(
                        "Sheldon",
                        task.TortoiseName
                    );
                }
            );

            Assert.DoesNotContain(
                dashboard.TodayTasks,
                task =>
                    task.TortoiseName ==
                    "Private Tortoise"
            );
        }

        [Fact]
        public async Task CompleteTask_AwardsXpCoinsStreakAndAchievementOnce()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(1, "Joy");

            database.Context.Users.Add(user);

            database.Context.Tortoises.Add(
                CreateTortoise(
                    1,
                    user.UserId,
                    "Sheldon"
                )
            );

            await database.Context.SaveChangesAsync();

            FixedTimeProvider timeProvider =
                new(FixedUtcNow);

            DashboardRepository dashboardRepository =
                new(
                    database.Context,
                    timeProvider
                );

            var dashboard =
                await dashboardRepository
                    .GetDashboardAsync(user.UserId);

            Assert.NotNull(dashboard);

            int taskId =
                dashboard.TodayTasks.First().TaskId;

            CareTaskRepository careTaskRepository =
                new(
                    database.Context,
                    timeProvider
                );

            CareTaskCompletionResult firstResult =
                await careTaskRepository
                    .CompleteTaskAsync(
                        taskId,
                        user.UserId
                    );

            Assert.Equal(
                CareTaskCompletionStatus.Success,
                firstResult.Status
            );

            Assert.NotNull(firstResult.Response);
            Assert.Equal(10, firstResult.Response.XpEarned);
            Assert.Equal(5, firstResult.Response.CoinsEarned);
            Assert.Equal(10, firstResult.Response.TotalXp);
            Assert.Equal(5, firstResult.Response.Coins);
            Assert.Equal(1, firstResult.Response.CurrentStreak);

            Assert.Equal(
                "FIRST_TASK",
                firstResult.Response
                    .UnlockedAchievement?
                    .AchievementType
            );

            CareTaskCompletionResult secondResult =
                await careTaskRepository
                    .CompleteTaskAsync(
                        taskId,
                        user.UserId
                    );

            Assert.Equal(
                CareTaskCompletionStatus.AlreadyCompleted,
                secondResult.Status
            );

            database.Context.ChangeTracker.Clear();

            User savedUser =
                await database.Context.Users.SingleAsync(
                    savedUser =>
                        savedUser.UserId == user.UserId
                );

            Assert.Equal(10, savedUser.TotalXp);
            Assert.Equal(5, savedUser.Coins);
            Assert.Equal(1, savedUser.CurrentStreak);

            Assert.Equal(
                1,
                await database.Context
                    .UserAchievements
                    .CountAsync()
            );
        }

        private static User CreateUser(
            int userId,
            string userName
        )
        {
            return new User
            {
                UserId = userId,
                UserName = userName,
                Email =
                    $"{userName.ToLowerInvariant()}@example.com",
                PasswordHash = "test-password-hash",
                Role = "User"
            };
        }

        private static Tortoise CreateTortoise(
            int tortoiseId,
            int ownerId,
            string name
        )
        {
            return new Tortoise
            {
                TortoiseId = tortoiseId,
                OwnerId = ownerId,
                Name = name,
                CreatedAt = FixedUtcNow.UtcDateTime
            };
        }

        private sealed class FixedTimeProvider
            : TimeProvider
        {
            private readonly DateTimeOffset _utcNow;

            public FixedTimeProvider(
                DateTimeOffset utcNow
            )
            {
                _utcNow = utcNow;
            }

            public override DateTimeOffset GetUtcNow()
            {
                return _utcNow;
            }
        }

        private sealed class TestDatabase
            : IAsyncDisposable
        {
            private readonly SqliteConnection _connection;

            public WebAPIDBContext Context { get; }

            private TestDatabase(
                SqliteConnection connection,
                WebAPIDBContext context
            )
            {
                _connection = connection;
                Context = context;
            }

            public static async Task<TestDatabase>
                CreateAsync()
            {
                SqliteConnection connection =
                    new("Data Source=:memory:");

                await connection.OpenAsync();

                DbContextOptions<WebAPIDBContext> options =
                    new DbContextOptionsBuilder<
                        WebAPIDBContext
                    >()
                    .UseSqlite(connection)
                    .Options;

                WebAPIDBContext context =
                    new(options);

                await context.Database.EnsureCreatedAsync();

                return new TestDatabase(
                    connection,
                    context
                );
            }

            public async ValueTask DisposeAsync()
            {
                await Context.DisposeAsync();
                await _connection.DisposeAsync();
            }
        }
    }
}
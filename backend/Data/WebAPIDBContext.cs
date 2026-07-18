using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class WebAPIDBContext : DbContext
    {
        public WebAPIDBContext(DbContextOptions<WebAPIDBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Tortoise> Tortoises => Set<Tortoise>();

        public DbSet<DailyCareTask> DailyCareTasks => Set<DailyCareTask>();

        public DbSet<UserAchievement> UserAchievements =>
            Set<UserAchievement>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();

            modelBuilder.Entity<Tortoise>()
                .HasOne(tortoise => tortoise.Owner)
                .WithMany(user => user.Tortoises)
                .HasForeignKey(tortoise => tortoise.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DailyCareTask>()
    .HasOne(task => task.Owner)
    .WithMany(user => user.DailyCareTasks)
    .HasForeignKey(task => task.OwnerId)
    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DailyCareTask>()
                .HasOne(task => task.Tortoise)
                .WithMany(tortoise => tortoise.DailyCareTasks)
                .HasForeignKey(task => task.TortoiseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DailyCareTask>()
                .HasIndex(task => new
                {
                    task.OwnerId,
                    task.TortoiseId,
                    task.TaskType,
                    task.TaskDate
                })
                .IsUnique();

            modelBuilder.Entity<UserAchievement>()
                .HasOne(achievement => achievement.Owner)
                .WithMany(user => user.Achievements)
                .HasForeignKey(achievement => achievement.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserAchievement>()
                .HasIndex(achievement => new
                {
                    achievement.OwnerId,
                    achievement.AchievementType
                })
                .IsUnique();
        }
    }
}

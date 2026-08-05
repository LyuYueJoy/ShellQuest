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

        public DbSet<ShopItem> ShopItems =>
            Set<ShopItem>();

        public DbSet<UserInventoryItem> UserInventoryItems =>
            Set<UserInventoryItem>();

        public DbSet<PurchaseTransaction> PurchaseTransactions =>
            Set<PurchaseTransaction>();
        public DbSet<TortoiseAvatar> TortoiseAvatars { get; set; }

        public DbSet<AvatarEquippedItem> AvatarEquippedItems { get; set; }

        public DbSet<ForumPost> ForumPosts { get; set; }
        public DbSet<ForumReply> ForumReplies { get; set; }
        public DbSet<ForumPostLike> ForumPostLikes { get; set; }
        public DbSet<ChatMessage> ChatMessages =>
    Set<ChatMessage>();
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

            modelBuilder.Entity<Tortoise>()
                .Property(tortoise => tortoise.WeightGrams)
                .HasPrecision(18, 2);

            modelBuilder.Entity<DailyCareTask>()
                .HasOne(task => task.Owner)
                .WithMany(user => user.DailyCareTasks)
                .HasForeignKey(task => task.OwnerId)
                .OnDelete(DeleteBehavior.NoAction);

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

            modelBuilder.Entity<ShopItem>()
    .HasIndex(item => item.AssetKey)
    .IsUnique();

            modelBuilder.Entity<UserInventoryItem>()
                .HasOne(inventoryItem => inventoryItem.Owner)
                .WithMany(user => user.InventoryItems)
                .HasForeignKey(inventoryItem => inventoryItem.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserInventoryItem>()
                .HasOne(inventoryItem => inventoryItem.ShopItem)
                .WithMany(shopItem => shopItem.InventoryItems)
                .HasForeignKey(inventoryItem => inventoryItem.ShopItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserInventoryItem>()
                .HasIndex(inventoryItem => new
                {
                    inventoryItem.OwnerId,
                    inventoryItem.ShopItemId
                })
                .IsUnique();

            modelBuilder.Entity<PurchaseTransaction>()
                .HasOne(purchase => purchase.Owner)
                .WithMany(user => user.Purchases)
                .HasForeignKey(purchase => purchase.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PurchaseTransaction>()
                .HasOne(purchase => purchase.ShopItem)
                .WithMany(shopItem => shopItem.Purchases)
                .HasForeignKey(purchase => purchase.ShopItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PurchaseTransaction>()
                .HasIndex(purchase => new
                {
                    purchase.OwnerId,
                    purchase.PurchasedAt
                });

            modelBuilder.Entity<TortoiseAvatar>()
    .HasIndex(avatar => avatar.TortoiseId)
    .IsUnique();

            modelBuilder.Entity<TortoiseAvatar>()
                .HasOne(avatar => avatar.Tortoise)
                .WithOne()
                .HasForeignKey<TortoiseAvatar>(
                    avatar => avatar.TortoiseId
                )
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AvatarEquippedItem>()
                .HasIndex(item => new
                {
                    item.TortoiseAvatarId,
                    item.ShopItemId
                })
                .IsUnique();

            modelBuilder.Entity<AvatarEquippedItem>()
                .HasOne(item => item.TortoiseAvatar)
                .WithMany(avatar => avatar.EquippedItems)
                .HasForeignKey(item => item.TortoiseAvatarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AvatarEquippedItem>()
                .HasOne(item => item.ShopItem)
                .WithMany()
                .HasForeignKey(item => item.ShopItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ForumPost>(entity =>
            {
                entity.HasKey(post => post.ForumPostId);

                entity.HasOne(post => post.Author)
                    .WithMany(user => user.ForumPosts)
                    .HasForeignKey(post => post.AuthorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ForumReply>(entity =>
            {
                entity.HasKey(reply => reply.ForumReplyId);

                entity.HasOne(reply => reply.ForumPost)
                    .WithMany(post => post.Replies)
                    .HasForeignKey(reply => reply.ForumPostId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(reply => reply.Author)
                    .WithMany(user => user.ForumReplies)
                    .HasForeignKey(reply => reply.AuthorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ForumPostLike>(entity =>
            {
                entity.HasKey(like => like.ForumPostLikeId);

                entity.HasIndex(like => new { like.ForumPostId, like.UserId })
                    .IsUnique();

                entity.HasOne(like => like.ForumPost)
                    .WithMany(post => post.Likes)
                    .HasForeignKey(like => like.ForumPostId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(like => like.User)
                    .WithMany(user => user.ForumPostLikes)
                    .HasForeignKey(like => like.UserId)
                    .OnDelete(DeleteBehavior.Restrict);


            });
            modelBuilder.Entity<ChatMessage>()
            .HasOne(message => message.Sender)
            .WithMany(user => user.SentMessages)
            .HasForeignKey(message => message.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(message => message.Receiver)
                .WithMany(user => user.ReceivedMessages)
                .HasForeignKey(message => message.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasIndex(message => new
                {
                    message.SenderId,
                    message.ReceiverId,
                    message.SentAt
                });

        }
    }
}

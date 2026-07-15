using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class WebAPIDBContext : DbContext
    {
        public WebAPIDBContext(DbContextOptions<WebAPIDBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Tortoise> Tortoises => Set<Tortoise>();

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
        }
    }
}

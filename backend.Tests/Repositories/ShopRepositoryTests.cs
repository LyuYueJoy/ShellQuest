using backend.Data;
using backend.Models;
using backend.Repositories;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Repositories
{
    public class ShopRepositoryTests
    {
        private static readonly DateTimeOffset FixedUtcNow =
            new(
                2026,
                7,
                19,
                6,
                0,
                0,
                TimeSpan.Zero
            );

        [Fact]
        public async Task GetShop_WithNoItems_ReturnsCoinsAndEmptyList()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 50
            );

            database.Context.Users.Add(user);
            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            var result = await repository.GetShopAsync(
                user.UserId
            );

            Assert.NotNull(result);
            Assert.Equal(50, result.Coins);
            Assert.Empty(result.Items);
        }

        [Fact]
        public async Task GetShop_ReturnsOnlyActiveItems()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 50
            );

            ShopItem activeItem = CreateShopItem(
                itemId: 1,
                name: "Straw Hat",
                price: 25,
                isActive: true
            );

            ShopItem inactiveItem = CreateShopItem(
                itemId: 2,
                name: "Hidden Hat",
                price: 10,
                isActive: false
            );

            database.Context.Users.Add(user);

            database.Context.ShopItems.AddRange(
                activeItem,
                inactiveItem
            );

            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            var result = await repository.GetShopAsync(
                user.UserId
            );

            Assert.NotNull(result);
            Assert.Single(result.Items);
            Assert.Equal("Straw Hat", result.Items[0].Name);
            Assert.True(result.Items[0].CanAfford);
            Assert.False(result.Items[0].IsOwned);
        }

        [Fact]
        public async Task GetShop_MarksOwnedItemCorrectly()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 100
            );

            ShopItem item = CreateShopItem(
                itemId: 1,
                name: "Straw Hat",
                price: 25
            );

            database.Context.Users.Add(user);
            database.Context.ShopItems.Add(item);

            database.Context.UserInventoryItems.Add(
                new UserInventoryItem
                {
                    OwnerId = user.UserId,
                    ShopItemId = item.ShopItemId,
                    AcquiredAt = FixedUtcNow.UtcDateTime
                }
            );

            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            var result = await repository.GetShopAsync(
                user.UserId
            );

            Assert.NotNull(result);

            var responseItem = Assert.Single(
                result.Items
            );

            Assert.True(responseItem.IsOwned);
            Assert.False(responseItem.CanAfford);
        }

        [Fact]
        public async Task PurchaseItem_WithEnoughCoins_CompletesPurchase()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 100
            );

            ShopItem item = CreateShopItem(
                itemId: 1,
                name: "Straw Hat",
                price: 25
            );

            database.Context.Users.Add(user);
            database.Context.ShopItems.Add(item);

            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            ShopPurchaseResult result =
                await repository.PurchaseItemAsync(
                    item.ShopItemId,
                    user.UserId
                );

            Assert.Equal(
                ShopPurchaseStatus.Success,
                result.Status
            );

            Assert.NotNull(result.Response);
            Assert.Equal(25, result.Response.PricePaid);
            Assert.Equal(
                75,
                result.Response.RemainingCoins
            );

            Assert.Equal(
                "Straw Hat",
                result.Response.PurchasedItem.Name
            );

            database.Context.ChangeTracker.Clear();

            User savedUser =
                await database.Context.Users
                    .SingleAsync(savedUser =>
                        savedUser.UserId == user.UserId
                    );

            Assert.Equal(75, savedUser.Coins);

            UserInventoryItem inventoryItem =
                await database.Context
                    .UserInventoryItems
                    .SingleAsync();

            Assert.Equal(
                user.UserId,
                inventoryItem.OwnerId
            );

            Assert.Equal(
                item.ShopItemId,
                inventoryItem.ShopItemId
            );

            PurchaseTransaction purchase =
                await database.Context
                    .PurchaseTransactions
                    .SingleAsync();

            Assert.Equal(25, purchase.PricePaid);
            Assert.Equal(
                FixedUtcNow.UtcDateTime,
                purchase.PurchasedAt
            );
        }

        [Fact]
        public async Task PurchaseItem_WithInsufficientCoins_DoesNotPurchase()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 10
            );

            ShopItem item = CreateShopItem(
                itemId: 1,
                name: "Golden Crown",
                price: 100
            );

            database.Context.Users.Add(user);
            database.Context.ShopItems.Add(item);

            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            ShopPurchaseResult result =
                await repository.PurchaseItemAsync(
                    item.ShopItemId,
                    user.UserId
                );

            Assert.Equal(
                ShopPurchaseStatus.InsufficientCoins,
                result.Status
            );

            Assert.Null(result.Response);
            Assert.Equal(10, user.Coins);

            Assert.Empty(
                database.Context.UserInventoryItems
            );

            Assert.Empty(
                database.Context.PurchaseTransactions
            );
        }

        [Fact]
        public async Task PurchaseItem_WhenAlreadyOwned_DoesNotChargeAgain()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User user = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 100
            );

            ShopItem item = CreateShopItem(
                itemId: 1,
                name: "Straw Hat",
                price: 25
            );

            database.Context.Users.Add(user);
            database.Context.ShopItems.Add(item);

            database.Context.UserInventoryItems.Add(
                new UserInventoryItem
                {
                    OwnerId = user.UserId,
                    ShopItemId = item.ShopItemId,
                    AcquiredAt = FixedUtcNow.UtcDateTime
                }
            );

            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            ShopPurchaseResult result =
                await repository.PurchaseItemAsync(
                    item.ShopItemId,
                    user.UserId
                );

            Assert.Equal(
                ShopPurchaseStatus.AlreadyOwned,
                result.Status
            );

            Assert.Equal(100, user.Coins);

            Assert.Equal(
                1,
                await database.Context
                    .UserInventoryItems
                    .CountAsync()
            );

            Assert.Empty(
                database.Context.PurchaseTransactions
            );
        }

        [Fact]
        public async Task GetInventory_ReturnsOnlyCurrentUsersItems()
        {
            await using TestDatabase database =
                await TestDatabase.CreateAsync();

            User firstUser = CreateUser(
                userId: 1,
                userName: "Joy",
                coins: 50
            );

            User secondUser = CreateUser(
                userId: 2,
                userName: "Other",
                coins: 50
            );

            ShopItem firstItem = CreateShopItem(
                itemId: 1,
                name: "Straw Hat",
                price: 25
            );

            ShopItem secondItem = CreateShopItem(
                itemId: 2,
                name: "Galaxy Shell",
                price: 120
            );

            database.Context.Users.AddRange(
                firstUser,
                secondUser
            );

            database.Context.ShopItems.AddRange(
                firstItem,
                secondItem
            );

            database.Context.UserInventoryItems.AddRange(
                new UserInventoryItem
                {
                    OwnerId = firstUser.UserId,
                    ShopItemId = firstItem.ShopItemId,
                    AcquiredAt = FixedUtcNow.UtcDateTime
                },
                new UserInventoryItem
                {
                    OwnerId = secondUser.UserId,
                    ShopItemId = secondItem.ShopItemId,
                    AcquiredAt = FixedUtcNow.UtcDateTime
                }
            );

            await database.Context.SaveChangesAsync();

            ShopRepository repository = CreateRepository(
                database.Context
            );

            var result =
                await repository.GetInventoryAsync(
                    firstUser.UserId
                );

            Assert.NotNull(result);
            Assert.Equal(1, result.TotalItems);

            var inventoryItem = Assert.Single(
                result.Items
            );

            Assert.Equal(
                "Straw Hat",
                inventoryItem.Name
            );

            Assert.DoesNotContain(
                result.Items,
                item => item.Name == "Galaxy Shell"
            );
        }

        private static ShopRepository CreateRepository(
            WebAPIDBContext context
        )
        {
            return new ShopRepository(
                context,
                new FixedTimeProvider(FixedUtcNow)
            );
        }

        private static User CreateUser(
            int userId,
            string userName,
            int coins
        )
        {
            return new User
            {
                UserId = userId,
                UserName = userName,
                Email =
                    $"{userName.ToLowerInvariant()}@example.com",
                PasswordHash = "test-password-hash",
                Role = "User",
                Coins = coins
            };
        }

        private static ShopItem CreateShopItem(
            int itemId,
            string name,
            int price,
            bool isActive = true
        )
        {
            return new ShopItem
            {
                ShopItemId = itemId,
                Name = name,
                Description = $"Description for {name}.",
                Category = "Hat",
                Price = price,
                AssetKey =
                    $"item_{itemId}",
                AssetUrl =
                    $"/assets/shop/item-{itemId}.png",
                AssetType = "Overlay",
                DefaultX = 0.5,
                DefaultY = 0.2,
                DefaultScale = 0.35,
                DefaultRotation = 0,
                DefaultZIndex = 3,
                IsActive = isActive,
                SortOrder = itemId,
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

                WebAPIDBContext context = new(options);

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
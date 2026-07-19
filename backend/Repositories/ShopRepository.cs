using backend.Data;
using backend.DTOs.Shop;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ShopRepository : IShopRepository
    {
        private readonly WebAPIDBContext _context;
        private readonly TimeProvider _timeProvider;

        public ShopRepository(
            WebAPIDBContext context,
            TimeProvider timeProvider
        )
        {
            _context = context;
            _timeProvider = timeProvider;
        }

        public async Task<ShopResponse?> GetShopAsync(
            int ownerId
        )
        {
            User? user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user =>
                    user.UserId == ownerId
                );

            if (user is null)
            {
                return null;
            }

            HashSet<int> ownedItemIds =
                (
                    await _context.UserInventoryItems
                        .AsNoTracking()
                        .Where(inventoryItem =>
                            inventoryItem.OwnerId ==
                            ownerId
                        )
                        .Select(inventoryItem =>
                            inventoryItem.ShopItemId
                        )
                        .ToListAsync()
                )
                .ToHashSet();

            List<ShopItem> shopItems =
                await _context.ShopItems
                    .AsNoTracking()
                    .Where(item => item.IsActive)
                    .OrderBy(item => item.SortOrder)
                    .ThenBy(item => item.Name)
                    .ToListAsync();

            List<ShopItemResponse> itemResponses =
                shopItems
                    .Select(item =>
                        ToShopItemResponse(
                            item,
                            user.Coins,
                            ownedItemIds.Contains(
                                item.ShopItemId
                            )
                        )
                    )
                    .ToList();

            return new ShopResponse
            {
                Coins = user.Coins,
                Items = itemResponses
            };
        }

        public async Task<InventoryResponse?>
            GetInventoryAsync(int ownerId)
        {
            bool userExists = await _context.Users
                .AsNoTracking()
                .AnyAsync(user =>
                    user.UserId == ownerId
                );

            if (!userExists)
            {
                return null;
            }

            List<UserInventoryItem> inventoryItems =
                await _context.UserInventoryItems
                    .AsNoTracking()
                    .Where(inventoryItem =>
                        inventoryItem.OwnerId == ownerId
                    )
                    .Include(inventoryItem =>
                        inventoryItem.ShopItem
                    )
                    .OrderBy(inventoryItem =>
                        inventoryItem.ShopItem.SortOrder
                    )
                    .ThenByDescending(inventoryItem =>
                        inventoryItem.AcquiredAt
                    )
                    .ToListAsync();

            List<InventoryItemResponse> itemResponses =
                inventoryItems
                    .Select(ToInventoryItemResponse)
                    .ToList();

            return new InventoryResponse
            {
                TotalItems = itemResponses.Count,
                Items = itemResponses
            };
        }

        public async Task<ShopPurchaseResult>
            PurchaseItemAsync(
                int itemId,
                int ownerId
            )
        {
            await using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            User? user = await _context.Users
                .FirstOrDefaultAsync(user =>
                    user.UserId == ownerId
                );

            if (user is null)
            {
                return new ShopPurchaseResult
                {
                    Status =
                        ShopPurchaseStatus.UserNotFound
                };
            }

            ShopItem? shopItem =
                await _context.ShopItems
                    .FirstOrDefaultAsync(item =>
                        item.ShopItemId == itemId &&
                        item.IsActive
                    );

            if (shopItem is null)
            {
                return new ShopPurchaseResult
                {
                    Status =
                        ShopPurchaseStatus.ItemNotFound
                };
            }

            bool alreadyOwned =
                await _context.UserInventoryItems
                    .AnyAsync(inventoryItem =>
                        inventoryItem.OwnerId ==
                            ownerId &&
                        inventoryItem.ShopItemId ==
                            itemId
                    );

            if (alreadyOwned)
            {
                return new ShopPurchaseResult
                {
                    Status =
                        ShopPurchaseStatus.AlreadyOwned
                };
            }

            if (user.Coins < shopItem.Price)
            {
                return new ShopPurchaseResult
                {
                    Status =
                        ShopPurchaseStatus
                            .InsufficientCoins
                };
            }

            DateTime purchasedAt =
                _timeProvider.GetUtcNow().UtcDateTime;

            user.Coins -= shopItem.Price;

            UserInventoryItem inventoryItem =
                new UserInventoryItem
                {
                    OwnerId = ownerId,
                    ShopItemId = shopItem.ShopItemId,
                    AcquiredAt = purchasedAt
                };

            PurchaseTransaction purchase =
                new PurchaseTransaction
                {
                    OwnerId = ownerId,
                    ShopItemId = shopItem.ShopItemId,
                    PricePaid = shopItem.Price,
                    PurchasedAt = purchasedAt
                };

            await _context.UserInventoryItems.AddAsync(
                inventoryItem
            );

            await _context.PurchaseTransactions.AddAsync(
                purchase
            );

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            inventoryItem.ShopItem = shopItem;

            return new ShopPurchaseResult
            {
                Status = ShopPurchaseStatus.Success,

                Response = new PurchaseResponse
                {
                    PurchasedItem =
                        ToInventoryItemResponse(
                            inventoryItem
                        ),

                    PricePaid = shopItem.Price,

                    RemainingCoins = user.Coins
                }
            };
        }

        private static ShopItemResponse
            ToShopItemResponse(
                ShopItem item,
                int userCoins,
                bool isOwned
            )
        {
            return new ShopItemResponse
            {
                ShopItemId = item.ShopItemId,
                Name = item.Name,
                Description = item.Description,
                Category = item.Category,
                Price = item.Price,
                AssetKey = item.AssetKey,
                AssetUrl = item.AssetUrl,
                ThumbnailUrl = item.ThumbnailUrl,
                AssetType = item.AssetType,
                DefaultX = item.DefaultX,
                DefaultY = item.DefaultY,
                DefaultScale = item.DefaultScale,
                DefaultRotation = item.DefaultRotation,
                DefaultZIndex = item.DefaultZIndex,
                IsOwned = isOwned,
                CanAfford =
                    !isOwned && userCoins >= item.Price
            };
        }

        private static InventoryItemResponse
            ToInventoryItemResponse(
                UserInventoryItem inventoryItem
            )
        {
            ShopItem item = inventoryItem.ShopItem;

            return new InventoryItemResponse
            {
                UserInventoryItemId =
                    inventoryItem.UserInventoryItemId,

                ShopItemId = item.ShopItemId,
                Name = item.Name,
                Description = item.Description,
                Category = item.Category,
                AssetKey = item.AssetKey,
                AssetUrl = item.AssetUrl,
                ThumbnailUrl = item.ThumbnailUrl,
                AssetType = item.AssetType,
                DefaultX = item.DefaultX,
                DefaultY = item.DefaultY,
                DefaultScale = item.DefaultScale,
                DefaultRotation = item.DefaultRotation,
                DefaultZIndex = item.DefaultZIndex,
                AcquiredAt = inventoryItem.AcquiredAt
            };
        }
    }
}
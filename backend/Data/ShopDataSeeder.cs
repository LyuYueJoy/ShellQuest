using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class ShopDataSeeder
    {
        public static async Task SeedAsync(
            WebAPIDBContext context
        )
        {
            string[] existingAssetKeys =
                await context.ShopItems
                    .Select(item => item.AssetKey)
                    .ToArrayAsync();

            HashSet<string> existingKeys =
                existingAssetKeys.ToHashSet(
                    StringComparer.OrdinalIgnoreCase
                );

            List<ShopItem> initialItems =
                GetInitialItems();

            List<ShopItem> missingItems =
                initialItems
                    .Where(item =>
                        !existingKeys.Contains(
                            item.AssetKey
                        )
                    )
                    .ToList();

            if (missingItems.Count == 0)
            {
                return;
            }

            await context.ShopItems.AddRangeAsync(
                missingItems
            );

            await context.SaveChangesAsync();
        }

        private static List<ShopItem>
            GetInitialItems()
        {
            return
            [
                new ShopItem
                {
                    Name = "Sunny Straw Hat",
                    Description =
                        "A warm straw hat for sunny garden adventures.",
                    Category = "Hat",
                    Price = 25,
                    AssetKey = "hat_straw",
                    AssetUrl =
                        "/assets/shop/hats/hat-straw.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.18,
                    DefaultScale = 0.35,
                    DefaultRotation = 0,
                    DefaultZIndex = 3,
                    IsActive = true,
                    SortOrder = 1
                },

                new ShopItem
                {
                    Name = "Moss Wizard Hat",
                    Description =
                        "A magical moss-green hat for a wise tortoise.",
                    Category = "Hat",
                    Price = 50,
                    AssetKey = "hat_wizard",
                    AssetUrl =
                        "/assets/shop/hats/hat-wizard.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.18,
                    DefaultScale = 0.38,
                    DefaultRotation = 0,
                    DefaultZIndex = 3,
                    IsActive = true,
                    SortOrder = 2
                },

                new ShopItem
                {
                    Name = "Golden Shell Crown",
                    Description =
                        "A tiny golden crown for a legendary shell keeper.",
                    Category = "Hat",
                    Price = 100,
                    AssetKey = "hat_crown",
                    AssetUrl =
                        "/assets/shop/hats/hat-crown.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.16,
                    DefaultScale = 0.3,
                    DefaultRotation = 0,
                    DefaultZIndex = 3,
                    IsActive = true,
                    SortOrder = 3
                },

                new ShopItem
                {
                    Name = "Forest Shell",
                    Description =
                        "A leafy green shell style inspired by the forest.",
                    Category = "Shell",
                    Price = 40,
                    AssetKey = "shell_forest",
                    AssetUrl =
                        "/assets/shop/shells/shell-forest.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.55,
                    DefaultScale = 0.65,
                    DefaultRotation = 0,
                    DefaultZIndex = 2,
                    IsActive = true,
                    SortOrder = 4
                },

                new ShopItem
                {
                    Name = "Sunset Shell",
                    Description =
                        "A warm orange shell inspired by an Auckland sunset.",
                    Category = "Shell",
                    Price = 60,
                    AssetKey = "shell_sunset",
                    AssetUrl =
                        "/assets/shop/shells/shell-sunset.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.55,
                    DefaultScale = 0.65,
                    DefaultRotation = 0,
                    DefaultZIndex = 2,
                    IsActive = true,
                    SortOrder = 5
                },

                new ShopItem
                {
                    Name = "Galaxy Shell",
                    Description =
                        "A colourful shell filled with stars and soft nebulae.",
                    Category = "Shell",
                    Price = 120,
                    AssetKey = "shell_galaxy",
                    AssetUrl =
                        "/assets/shop/shells/shell-galaxy.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.55,
                    DefaultScale = 0.65,
                    DefaultRotation = 0,
                    DefaultZIndex = 2,
                    IsActive = true,
                    SortOrder = 6
                },

                new ShopItem
                {
                    Name = "Dandelion Flower",
                    Description =
                        "A cheerful flower for tortoises who love dandelions.",
                    Category = "Accessory",
                    Price = 20,
                    AssetKey = "accessory_flower",
                    AssetUrl =
                        "/assets/shop/accessories/flower-dandelion.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.66,
                    DefaultY = 0.32,
                    DefaultScale = 0.2,
                    DefaultRotation = 0,
                    DefaultZIndex = 4,
                    IsActive = true,
                    SortOrder = 7
                },

                new ShopItem
                {
                    Name = "Round Explorer Glasses",
                    Description =
                        "Round glasses for a curious little explorer.",
                    Category = "Accessory",
                    Price = 45,
                    AssetKey = "accessory_glasses",
                    AssetUrl =
                        "/assets/shop/accessories/glasses-round.png",
                    ThumbnailUrl = null,
                    AssetType = "Overlay",
                    DefaultX = 0.5,
                    DefaultY = 0.3,
                    DefaultScale = 0.28,
                    DefaultRotation = 0,
                    DefaultZIndex = 4,
                    IsActive = true,
                    SortOrder = 8
                },

                new ShopItem
                {
                    Name = "Peaceful Garden",
                    Description =
                        "A calm garden background for a relaxing portrait.",
                    Category = "Background",
                    Price = 70,
                    AssetKey = "background_garden",
                    AssetUrl =
                        "/assets/shop/backgrounds/garden.webp",
                    ThumbnailUrl = null,
                    AssetType = "Background",
                    DefaultX = 0.5,
                    DefaultY = 0.5,
                    DefaultScale = 1,
                    DefaultRotation = 0,
                    DefaultZIndex = 0,
                    IsActive = true,
                    SortOrder = 9
                }
            ];
        }
    }
}
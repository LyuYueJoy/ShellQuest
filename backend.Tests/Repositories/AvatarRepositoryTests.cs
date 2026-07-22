using backend.Data;
using backend.DTOs.Avatar;
using backend.Models;
using backend.Repositories;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Repositories;

public class AvatarRepositoryTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly WebAPIDBContext _context;
    private readonly AvatarRepository _repository;

    public AvatarRepositoryTests()
    {
        _connection = new SqliteConnection(
            "Data Source=:memory:"
        );

        _connection.Open();

        DbContextOptions<WebAPIDBContext> options =
            new DbContextOptionsBuilder<WebAPIDBContext>()
                .UseSqlite(_connection)
                .Options;

        _context = new WebAPIDBContext(options);
        _context.Database.EnsureCreated();

        _repository = new AvatarRepository(
            _context,
            TimeProvider.System
        );
    }

    [Fact]
    public async Task GetOrCreateAvatarAsync_CreatesAvatar_WhenNoneExists()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        // Act
        AvatarResponse? result =
            await _repository.GetOrCreateAvatarAsync(
                tortoise.TortoiseId,
                owner.UserId
            );

        // Assert
        Assert.NotNull(result);
        Assert.Equal(
            tortoise.TortoiseId,
            result.TortoiseId
        );
        Assert.Equal("Mochi", result.TortoiseName);
        Assert.Equal(800, result.CanvasWidth);
        Assert.Equal(800, result.CanvasHeight);
        Assert.Empty(result.EquippedItems);

        TortoiseAvatar avatar =
            await _context.TortoiseAvatars.SingleAsync();

        Assert.Equal(
            tortoise.TortoiseId,
            avatar.TortoiseId
        );
    }

    [Fact]
    public async Task GetOrCreateAvatarAsync_DoesNotCreateDuplicateAvatar()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        // Act
        AvatarResponse? firstResult =
            await _repository.GetOrCreateAvatarAsync(
                tortoise.TortoiseId,
                owner.UserId
            );

        AvatarResponse? secondResult =
            await _repository.GetOrCreateAvatarAsync(
                tortoise.TortoiseId,
                owner.UserId
            );

        // Assert
        Assert.NotNull(firstResult);
        Assert.NotNull(secondResult);

        Assert.Equal(
            firstResult.TortoiseAvatarId,
            secondResult.TortoiseAvatarId
        );

        Assert.Equal(
            1,
            await _context.TortoiseAvatars.CountAsync()
        );
    }

    [Fact]
    public async Task GetOrCreateAvatarAsync_ReturnsNull_ForAnotherUsersTortoise()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        User otherUser = await AddUserAsync(
            "other@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        // Act
        AvatarResponse? result =
            await _repository.GetOrCreateAvatarAsync(
                tortoise.TortoiseId,
                otherUser.UserId
            );

        // Assert
        Assert.Null(result);
        Assert.Empty(_context.TortoiseAvatars);
    }

    [Fact]
    public async Task EquipItemAsync_ReturnsItemNotOwned_WhenItemWasNotPurchased()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        ShopItem shopItem = await AddShopItemAsync(
            "straw-hat"
        );

        // Act
        AvatarOperationResult result =
            await _repository.EquipItemAsync(
                tortoise.TortoiseId,
                shopItem.ShopItemId,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.ItemNotOwned,
            result.Status
        );

        Assert.Empty(_context.AvatarEquippedItems);
    }

    [Fact]
    public async Task EquipItemAsync_EquipsOwnedItem_AndSavesDefaultValues()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        ShopItem shopItem = await AddShopItemAsync(
            "straw-hat",
            defaultX: 0.45,
            defaultY: 0.20,
            defaultScale: 0.75,
            defaultRotation: 12,
            defaultZIndex: 4
        );

        await AddInventoryItemAsync(
            owner.UserId,
            shopItem.ShopItemId
        );

        // Act
        AvatarOperationResult result =
            await _repository.EquipItemAsync(
                tortoise.TortoiseId,
                shopItem.ShopItemId,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.Success,
            result.Status
        );

        Assert.NotNull(result.Response);

        AvatarEquippedItemResponse responseItem =
            Assert.Single(
                result.Response.EquippedItems
            );

        Assert.Equal(
            shopItem.ShopItemId,
            responseItem.ShopItemId
        );
        Assert.Equal(0.45, responseItem.X);
        Assert.Equal(0.20, responseItem.Y);
        Assert.Equal(0.75, responseItem.Scale);
        Assert.Equal(12, responseItem.Rotation);
        Assert.Equal(4, responseItem.ZIndex);

        AvatarEquippedItem savedItem =
            await _context.AvatarEquippedItems
                .SingleAsync();

        Assert.Equal(0.45, savedItem.X);
        Assert.Equal(0.20, savedItem.Y);
        Assert.Equal(0.75, savedItem.Scale);
        Assert.Equal(12, savedItem.Rotation);
        Assert.Equal(4, savedItem.ZIndex);
    }

    [Fact]
    public async Task EquipItemAsync_ClampsScaleAndRotation_ToAvatarLimits()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        ShopItem shopItem = await AddShopItemAsync(
            "large-crown",
            defaultScale: 5,
            defaultRotation: 300
        );

        await AddInventoryItemAsync(
            owner.UserId,
            shopItem.ShopItemId
        );

        // Act
        AvatarOperationResult result =
            await _repository.EquipItemAsync(
                tortoise.TortoiseId,
                shopItem.ShopItemId,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.Success,
            result.Status
        );

        AvatarEquippedItem savedItem =
            await _context.AvatarEquippedItems
                .SingleAsync();

        Assert.Equal(3, savedItem.Scale);
        Assert.Equal(180, savedItem.Rotation);
    }

    [Fact]
    public async Task EquipItemAsync_ReturnsAlreadyEquipped_WhenItemIsEquippedTwice()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        ShopItem shopItem = await AddShopItemAsync(
            "straw-hat"
        );

        await AddInventoryItemAsync(
            owner.UserId,
            shopItem.ShopItemId
        );

        await _repository.EquipItemAsync(
            tortoise.TortoiseId,
            shopItem.ShopItemId,
            owner.UserId
        );

        // Act
        AvatarOperationResult result =
            await _repository.EquipItemAsync(
                tortoise.TortoiseId,
                shopItem.ShopItemId,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.ItemAlreadyEquipped,
            result.Status
        );

        Assert.Equal(
            1,
            await _context.AvatarEquippedItems.CountAsync()
        );
    }

    [Fact]
    public async Task UpdateItemAsync_UpdatesPositionScaleRotationAndZIndex()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        ShopItem shopItem = await AddShopItemAsync(
            "straw-hat"
        );

        await AddInventoryItemAsync(
            owner.UserId,
            shopItem.ShopItemId
        );

        AvatarOperationResult equipResult =
            await _repository.EquipItemAsync(
                tortoise.TortoiseId,
                shopItem.ShopItemId,
                owner.UserId
            );

        int equippedItemId =
            Assert.Single(
                equipResult.Response!.EquippedItems
            ).AvatarEquippedItemId;

        UpdateAvatarItemRequest request = new()
        {
            X = 0.60,
            Y = 0.25,
            Scale = 1.20,
            Rotation = -15,
            ZIndex = 8
        };

        // Act
        AvatarOperationResult result =
            await _repository.UpdateItemAsync(
                tortoise.TortoiseId,
                equippedItemId,
                request,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.Success,
            result.Status
        );

        AvatarEquippedItem savedItem =
            await _context.AvatarEquippedItems
                .SingleAsync();

        Assert.Equal(0.60, savedItem.X);
        Assert.Equal(0.25, savedItem.Y);
        Assert.Equal(1.20, savedItem.Scale);
        Assert.Equal(-15, savedItem.Rotation);
        Assert.Equal(8, savedItem.ZIndex);
    }

    [Fact]
    public async Task RemoveItemAsync_RemovesEquippedItemFromDatabase()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        ShopItem shopItem = await AddShopItemAsync(
            "straw-hat"
        );

        await AddInventoryItemAsync(
            owner.UserId,
            shopItem.ShopItemId
        );

        AvatarOperationResult equipResult =
            await _repository.EquipItemAsync(
                tortoise.TortoiseId,
                shopItem.ShopItemId,
                owner.UserId
            );

        int equippedItemId =
            Assert.Single(
                equipResult.Response!.EquippedItems
            ).AvatarEquippedItemId;

        // Act
        AvatarOperationResult result =
            await _repository.RemoveItemAsync(
                tortoise.TortoiseId,
                equippedItemId,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.Success,
            result.Status
        );

        Assert.NotNull(result.Response);
        Assert.Empty(result.Response.EquippedItems);
        Assert.Empty(_context.AvatarEquippedItems);
    }

    [Fact]
    public async Task UpdateCanvasAsync_CreatesAvatarAndSavesCanvasSize()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        UpdateAvatarCanvasRequest request = new()
        {
            CanvasWidth = 1000,
            CanvasHeight = 700
        };

        // Act
        AvatarOperationResult result =
            await _repository.UpdateCanvasAsync(
                tortoise.TortoiseId,
                request,
                owner.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.Success,
            result.Status
        );

        Assert.NotNull(result.Response);
        Assert.Equal(
            1000,
            result.Response.CanvasWidth
        );
        Assert.Equal(
            700,
            result.Response.CanvasHeight
        );

        TortoiseAvatar savedAvatar =
            await _context.TortoiseAvatars
                .SingleAsync();

        Assert.Equal(1000, savedAvatar.CanvasWidth);
        Assert.Equal(700, savedAvatar.CanvasHeight);
    }

    [Fact]
    public async Task UpdateCanvasAsync_ReturnsTortoiseNotFound_ForAnotherUser()
    {
        // Arrange
        User owner = await AddUserAsync(
            "owner@example.com"
        );

        User otherUser = await AddUserAsync(
            "other@example.com"
        );

        Tortoise tortoise = await AddTortoiseAsync(
            owner.UserId,
            "Mochi"
        );

        UpdateAvatarCanvasRequest request = new()
        {
            CanvasWidth = 900,
            CanvasHeight = 900
        };

        // Act
        AvatarOperationResult result =
            await _repository.UpdateCanvasAsync(
                tortoise.TortoiseId,
                request,
                otherUser.UserId
            );

        // Assert
        Assert.Equal(
            AvatarOperationStatus.TortoiseNotFound,
            result.Status
        );

        Assert.Empty(_context.TortoiseAvatars);
    }

    private async Task<User> AddUserAsync(
        string email
    )
    {
        User user = new()
        {
            UserName = email.Split('@')[0],
            Email = email,
            PasswordHash = "test-password-hash",
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    private async Task<Tortoise> AddTortoiseAsync(
        int ownerId,
        string name
    )
    {
        Tortoise tortoise = new()
        {
            OwnerId = ownerId,
            Name = name,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tortoises.Add(tortoise);
        await _context.SaveChangesAsync();

        return tortoise;
    }

    private async Task<ShopItem> AddShopItemAsync(
        string assetKey,
        double defaultX = 0.5,
        double defaultY = 0.5,
        double defaultScale = 0.4,
        double defaultRotation = 0,
        int defaultZIndex = 1
    )
    {
        ShopItem shopItem = new()
        {
            Name = assetKey,
            Description = $"Test item: {assetKey}",
            Category = "Hat",
            Price = 100,
            AssetKey = assetKey,
            AssetUrl = $"/assets/{assetKey}.png",
            AssetType = "Image",
            DefaultX = defaultX,
            DefaultY = defaultY,
            DefaultScale = defaultScale,
            DefaultRotation = defaultRotation,
            DefaultZIndex = defaultZIndex,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.ShopItems.Add(shopItem);
        await _context.SaveChangesAsync();

        return shopItem;
    }

    private async Task AddInventoryItemAsync(
        int ownerId,
        int shopItemId
    )
    {
        UserInventoryItem inventoryItem = new()
        {
            OwnerId = ownerId,
            ShopItemId = shopItemId,
            AcquiredAt = DateTime.UtcNow
        };

        _context.UserInventoryItems.Add(
            inventoryItem
        );

        await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        _connection.Dispose();

        GC.SuppressFinalize(this);
    }
}
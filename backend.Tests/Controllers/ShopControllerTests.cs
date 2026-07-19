using backend.Controllers;
using backend.DTOs.Shop;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace backend.Tests.Controllers
{
    public class ShopControllerTests
    {
        private readonly Mock<IShopRepository>
            _repositoryMock;

        public ShopControllerTests()
        {
            _repositoryMock =
                new Mock<IShopRepository>();
        }

        [Fact]
        public async Task GetShop_WithValidJwt_ReturnsShop()
        {
            int ownerId = 7;

            ShopResponse response = new()
            {
                Coins = 50,
                Items = new List<ShopItemResponse>()
            };

            _repositoryMock
                .Setup(repository =>
                    repository.GetShopAsync(ownerId)
                )
                .ReturnsAsync(response);

            ShopController controller =
                CreateController(ownerId.ToString());

            ActionResult<ShopResponse> result =
                await controller.GetShop();

            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(
                    result.Result
                );

            ShopResponse resultResponse =
                Assert.IsType<ShopResponse>(
                    okResult.Value
                );

            Assert.Equal(50, resultResponse.Coins);
            Assert.Empty(resultResponse.Items);

            _repositoryMock.Verify(
                repository =>
                    repository.GetShopAsync(ownerId),
                Times.Once
            );
        }

        [Fact]
        public async Task GetShop_WithInvalidJwt_ReturnsUnauthorized()
        {
            ShopController controller =
                CreateController("invalid-user-id");

            ActionResult<ShopResponse> result =
                await controller.GetShop();

            Assert.IsType<UnauthorizedObjectResult>(
                result.Result
            );

            _repositoryMock.Verify(
                repository =>
                    repository.GetShopAsync(
                        It.IsAny<int>()
                    ),
                Times.Never
            );
        }

        [Fact]
        public async Task PurchaseItem_WhenSuccessful_ReturnsPurchase()
        {
            int ownerId = 7;
            int itemId = 3;

            PurchaseResponse purchaseResponse = new()
            {
                PricePaid = 25,
                RemainingCoins = 75,

                PurchasedItem =
                    new InventoryItemResponse
                    {
                        UserInventoryItemId = 10,
                        ShopItemId = itemId,
                        Name = "Sunny Straw Hat",
                        Category = "Hat",
                        AssetKey = "hat_straw",
                        AssetUrl =
                            "/assets/shop/hats/hat-straw.png",
                        AssetType = "Overlay",
                        AcquiredAt = DateTime.UtcNow
                    }
            };

            _repositoryMock
                .Setup(repository =>
                    repository.PurchaseItemAsync(
                        itemId,
                        ownerId
                    )
                )
                .ReturnsAsync(
                    new ShopPurchaseResult
                    {
                        Status =
                            ShopPurchaseStatus.Success,
                        Response = purchaseResponse
                    }
                );

            ShopController controller =
                CreateController(ownerId.ToString());

            ActionResult<PurchaseResponse> result =
                await controller.PurchaseItem(itemId);

            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(
                    result.Result
                );

            PurchaseResponse response =
                Assert.IsType<PurchaseResponse>(
                    okResult.Value
                );

            Assert.Equal(25, response.PricePaid);
            Assert.Equal(75, response.RemainingCoins);
            Assert.Equal(
                "Sunny Straw Hat",
                response.PurchasedItem.Name
            );

            _repositoryMock.Verify(
                repository =>
                    repository.PurchaseItemAsync(
                        itemId,
                        ownerId
                    ),
                Times.Once
            );
        }

        [Fact]
        public async Task PurchaseItem_WithInsufficientCoins_ReturnsConflict()
        {
            int ownerId = 7;
            int itemId = 3;

            _repositoryMock
                .Setup(repository =>
                    repository.PurchaseItemAsync(
                        itemId,
                        ownerId
                    )
                )
                .ReturnsAsync(
                    new ShopPurchaseResult
                    {
                        Status =
                            ShopPurchaseStatus
                                .InsufficientCoins
                    }
                );

            ShopController controller =
                CreateController(ownerId.ToString());

            ActionResult<PurchaseResponse> result =
                await controller.PurchaseItem(itemId);

            Assert.IsType<ConflictObjectResult>(
                result.Result
            );
        }

        [Fact]
        public async Task PurchaseItem_WhenAlreadyOwned_ReturnsConflict()
        {
            int ownerId = 7;
            int itemId = 3;

            _repositoryMock
                .Setup(repository =>
                    repository.PurchaseItemAsync(
                        itemId,
                        ownerId
                    )
                )
                .ReturnsAsync(
                    new ShopPurchaseResult
                    {
                        Status =
                            ShopPurchaseStatus.AlreadyOwned
                    }
                );

            ShopController controller =
                CreateController(ownerId.ToString());

            ActionResult<PurchaseResponse> result =
                await controller.PurchaseItem(itemId);

            Assert.IsType<ConflictObjectResult>(
                result.Result
            );
        }

        [Fact]
        public async Task PurchaseItem_WhenItemDoesNotExist_ReturnsNotFound()
        {
            int ownerId = 7;
            int itemId = 999;

            _repositoryMock
                .Setup(repository =>
                    repository.PurchaseItemAsync(
                        itemId,
                        ownerId
                    )
                )
                .ReturnsAsync(
                    new ShopPurchaseResult
                    {
                        Status =
                            ShopPurchaseStatus.ItemNotFound
                    }
                );

            ShopController controller =
                CreateController(ownerId.ToString());

            ActionResult<PurchaseResponse> result =
                await controller.PurchaseItem(itemId);

            Assert.IsType<NotFoundObjectResult>(
                result.Result
            );
        }

        private ShopController CreateController(
            string userId
        )
        {
            ClaimsIdentity identity = new(
                new[]
                {
                    new Claim(
                        ClaimTypes.NameIdentifier,
                        userId
                    )
                },
                "TestAuthentication"
            );

            ClaimsPrincipal user = new(identity);

            return new ShopController(
                _repositoryMock.Object
            )
            {
                ControllerContext =
                    new ControllerContext
                    {
                        HttpContext =
                            new DefaultHttpContext
                            {
                                User = user
                            }
                    }
            };
        }
    }
}
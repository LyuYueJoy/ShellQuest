using backend.Controllers;
using backend.DTOs.Shop;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace backend.Tests.Controllers
{
    public class InventoryControllerTests
    {
        private readonly Mock<IShopRepository>
            _repositoryMock;

        public InventoryControllerTests()
        {
            _repositoryMock =
                new Mock<IShopRepository>();
        }

        [Fact]
        public async Task GetInventory_WithValidJwt_ReturnsInventory()
        {
            int ownerId = 7;

            InventoryResponse response = new()
            {
                TotalItems = 1,

                Items =
                [
                    new InventoryItemResponse
                    {
                        UserInventoryItemId = 1,
                        ShopItemId = 3,
                        Name = "Sunny Straw Hat",
                        Category = "Hat",
                        AssetKey = "hat_straw",
                        AssetUrl =
                            "/assets/shop/hats/hat-straw.png",
                        AssetType = "Overlay",
                        AcquiredAt = DateTime.UtcNow
                    }
                ]
            };

            _repositoryMock
                .Setup(repository =>
                    repository.GetInventoryAsync(ownerId)
                )
                .ReturnsAsync(response);

            InventoryController controller =
                CreateController(ownerId.ToString());

            ActionResult<InventoryResponse> result =
                await controller.GetInventory();

            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(
                    result.Result
                );

            InventoryResponse resultResponse =
                Assert.IsType<InventoryResponse>(
                    okResult.Value
                );

            Assert.Equal(1, resultResponse.TotalItems);

            InventoryItemResponse item =
                Assert.Single(resultResponse.Items);

            Assert.Equal(
                "Sunny Straw Hat",
                item.Name
            );

            _repositoryMock.Verify(
                repository =>
                    repository.GetInventoryAsync(ownerId),
                Times.Once
            );
        }

        [Fact]
        public async Task GetInventory_WithInvalidJwt_ReturnsUnauthorized()
        {
            InventoryController controller =
                CreateController("invalid-user-id");

            ActionResult<InventoryResponse> result =
                await controller.GetInventory();

            Assert.IsType<UnauthorizedObjectResult>(
                result.Result
            );

            _repositoryMock.Verify(
                repository =>
                    repository.GetInventoryAsync(
                        It.IsAny<int>()
                    ),
                Times.Never
            );
        }

        private InventoryController CreateController(
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

            return new InventoryController(
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
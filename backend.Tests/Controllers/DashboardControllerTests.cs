using backend.Controllers;
using backend.DTOs.Dashboard;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace backend.Tests.Controllers
{
    public class DashboardControllerTests
    {
        private readonly Mock<IDashboardRepository>
            _repositoryMock;

        public DashboardControllerTests()
        {
            _repositoryMock =
                new Mock<IDashboardRepository>();
        }

        [Fact]
        public async Task GetDashboard_WithValidJwt_ReturnsDashboard()
        {
            int ownerId = 7;

            DashboardResponse dashboard =
                new()
                {
                    Level = 2,
                    TotalXp = 120,
                    CurrentLevelXp = 20,
                    XpRequiredForNextLevel = 100,
                    Coins = 50,
                    CurrentStreak = 3,
                    LongestStreak = 5
                };

            _repositoryMock
                .Setup(repository =>
                    repository.GetDashboardAsync(ownerId)
                )
                .ReturnsAsync(dashboard);

            DashboardController controller =
                CreateController(ownerId.ToString());

            ActionResult<DashboardResponse> result =
                await controller.GetDashboard();

            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(
                    result.Result
                );

            DashboardResponse response =
                Assert.IsType<DashboardResponse>(
                    okResult.Value
                );

            Assert.Equal(2, response.Level);
            Assert.Equal(120, response.TotalXp);
            Assert.Equal(50, response.Coins);

            _repositoryMock.Verify(
                repository =>
                    repository.GetDashboardAsync(ownerId),
                Times.Once
            );
        }

        [Fact]
        public async Task GetDashboard_WithInvalidJwt_ReturnsUnauthorized()
        {
            DashboardController controller =
                CreateController("invalid-user-id");

            ActionResult<DashboardResponse> result =
                await controller.GetDashboard();

            Assert.IsType<UnauthorizedObjectResult>(
                result.Result
            );

            _repositoryMock.Verify(
                repository =>
                    repository.GetDashboardAsync(
                        It.IsAny<int>()
                    ),
                Times.Never
            );
        }

        private DashboardController CreateController(
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

            return new DashboardController(
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
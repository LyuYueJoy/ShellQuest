using backend.Controllers;
using backend.DTOs.Tortoises;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace backend.Tests.Controllers
{
    public class TortoisesControllerTests
    {
        private readonly Mock<ITortoiseRepository>
            _repositoryMock;

        private readonly Mock<IWebHostEnvironment>
            _environmentMock;

        public TortoisesControllerTests()
        {
            _repositoryMock =
                new Mock<ITortoiseRepository>();

            _environmentMock =
                new Mock<IWebHostEnvironment>();

            _environmentMock
                .Setup(environment => environment.ContentRootPath)
                .Returns(Path.GetTempPath());
        }

        [Fact]
        public async Task GetTortoises_WithValidUser_ReturnsUsersTortoises()
        {
            // Arrange
            int ownerId = 7;

            List<Tortoise> tortoises =
            [
                new Tortoise
                {
                    TortoiseId = 1,
                    OwnerId = ownerId,
                    Name = "Sheldon",
                    AgeMonths = 18,
                    WeightGrams = 420,
                    Notes = "Likes dandelion leaves.",
                    CreatedAt = DateTime.UtcNow
                },
                new Tortoise
                {
                    TortoiseId = 2,
                    OwnerId = ownerId,
                    Name = "Speedy",
                    AgeMonths = 12,
                    WeightGrams = 310,
                    CreatedAt = DateTime.UtcNow
                }
            ];

            _repositoryMock
                .Setup(repository =>
                    repository.GetAllByOwnerIdAsync(ownerId)
                )
                .ReturnsAsync(tortoises);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            ActionResult<IEnumerable<TortoiseResponse>> result =
                await controller.GetTortoises();

            // Assert
            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(result.Result);

            List<TortoiseResponse> response =
                Assert.IsType<List<TortoiseResponse>>(
                    okResult.Value
                );

            Assert.Equal(2, response.Count);
            Assert.Equal("Sheldon", response[0].Name);
            Assert.Equal("Speedy", response[1].Name);

            _repositoryMock.Verify(
                repository =>
                    repository.GetAllByOwnerIdAsync(ownerId),
                Times.Once
            );
        }

        [Fact]
        public async Task GetTortoise_WhenTortoiseExists_ReturnsTortoise()
        {
            // Arrange
            int ownerId = 7;
            int tortoiseId = 3;

            Tortoise tortoise = new Tortoise
            {
                TortoiseId = tortoiseId,
                OwnerId = ownerId,
                Name = "Shelly",
                AgeMonths = 24,
                WeightGrams = 500,
                CreatedAt = DateTime.UtcNow
            };

            _repositoryMock
                .Setup(repository =>
                    repository.GetByIdAsync(
                        tortoiseId,
                        ownerId
                    )
                )
                .ReturnsAsync(tortoise);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            ActionResult<TortoiseResponse> result =
                await controller.GetTortoise(tortoiseId);

            // Assert
            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(result.Result);

            TortoiseResponse response =
                Assert.IsType<TortoiseResponse>(
                    okResult.Value
                );

            Assert.Equal(tortoiseId, response.TortoiseId);
            Assert.Equal("Shelly", response.Name);
        }

        [Fact]
        public async Task GetTortoise_WhenTortoiseDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            int ownerId = 7;
            int tortoiseId = 999;

            _repositoryMock
                .Setup(repository =>
                    repository.GetByIdAsync(
                        tortoiseId,
                        ownerId
                    )
                )
                .ReturnsAsync((Tortoise?)null);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            ActionResult<TortoiseResponse> result =
                await controller.GetTortoise(tortoiseId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(
                result.Result
            );
        }

        [Fact]
        public async Task CreateTortoise_UsesUserIdFromJwt()
        {
            // Arrange
            int ownerId = 7;

            CreateTortoiseRequest request =
                new CreateTortoiseRequest
                {
                    Name = "  Sheldon  ",
                    AgeMonths = 18,
                    WeightGrams = 420,
                    Notes = "  Likes dandelions.  "
                };

            Tortoise? savedTortoise = null;

            _repositoryMock
                .Setup(repository =>
                    repository.CreateAsync(
                        It.IsAny<Tortoise>()
                    )
                )
                .ReturnsAsync((Tortoise tortoise) =>
                {
                    tortoise.TortoiseId = 10;
                    savedTortoise = tortoise;
                    return tortoise;
                });

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            ActionResult<TortoiseResponse> result =
                await controller.CreateTortoise(request);

            // Assert
            CreatedAtActionResult createdResult =
                Assert.IsType<CreatedAtActionResult>(
                    result.Result
                );

            TortoiseResponse response =
                Assert.IsType<TortoiseResponse>(
                    createdResult.Value
                );

            Assert.NotNull(savedTortoise);
            Assert.Equal(ownerId, savedTortoise.OwnerId);
            Assert.Equal("Sheldon", savedTortoise.Name);
            Assert.Equal(
                "Likes dandelions.",
                savedTortoise.Notes
            );

            Assert.Equal(10, response.TortoiseId);
            Assert.Equal("Sheldon", response.Name);
            Assert.Null(response.PhotoUrl);
        }

        [Fact]
        public async Task UpdateTortoise_WhenTortoiseExists_UpdatesFields()
        {
            // Arrange
            int ownerId = 7;
            int tortoiseId = 4;

            Tortoise tortoise = new Tortoise
            {
                TortoiseId = tortoiseId,
                OwnerId = ownerId,
                Name = "Old Name",
                AgeMonths = 10,
                WeightGrams = 250,
                PhotoUrl = "/uploads/tortoises/7/photo.png",
                Notes = "Old notes",
                CreatedAt = DateTime.UtcNow
            };

            UpdateTortoiseRequest request =
                new UpdateTortoiseRequest
                {
                    Name = "  New Name  ",
                    AgeMonths = 11,
                    WeightGrams = 275,
                    Notes = "  Updated notes  "
                };

            _repositoryMock
                .Setup(repository =>
                    repository.GetByIdAsync(
                        tortoiseId,
                        ownerId
                    )
                )
                .ReturnsAsync(tortoise);

            _repositoryMock
                .Setup(repository =>
                    repository.UpdateAsync(tortoise)
                )
                .ReturnsAsync(true);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            ActionResult<TortoiseResponse> result =
                await controller.UpdateTortoise(
                    tortoiseId,
                    request
                );

            // Assert
            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(
                    result.Result
                );

            TortoiseResponse response =
                Assert.IsType<TortoiseResponse>(
                    okResult.Value
                );

            Assert.Equal("New Name", response.Name);
            Assert.Equal(11, response.AgeMonths);
            Assert.Equal(275, response.WeightGrams);
            Assert.Equal("Updated notes", response.Notes);

            Assert.Equal(
                "/uploads/tortoises/7/photo.png",
                response.PhotoUrl
            );

            _repositoryMock.Verify(
                repository =>
                    repository.UpdateAsync(tortoise),
                Times.Once
            );
        }

        [Fact]
        public async Task UpdateTortoise_WhenTortoiseDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            int ownerId = 7;
            int tortoiseId = 999;

            UpdateTortoiseRequest request =
                new UpdateTortoiseRequest
                {
                    Name = "Sheldon",
                    AgeMonths = 18,
                    WeightGrams = 420
                };

            _repositoryMock
                .Setup(repository =>
                    repository.GetByIdAsync(
                        tortoiseId,
                        ownerId
                    )
                )
                .ReturnsAsync((Tortoise?)null);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            ActionResult<TortoiseResponse> result =
                await controller.UpdateTortoise(
                    tortoiseId,
                    request
                );

            // Assert
            Assert.IsType<NotFoundObjectResult>(
                result.Result
            );

            _repositoryMock.Verify(
                repository =>
                    repository.UpdateAsync(
                        It.IsAny<Tortoise>()
                    ),
                Times.Never
            );
        }

        [Fact]
        public async Task DeleteTortoise_WhenTortoiseExists_ReturnsNoContent()
        {
            // Arrange
            int ownerId = 7;
            int tortoiseId = 5;

            Tortoise tortoise = new Tortoise
            {
                TortoiseId = tortoiseId,
                OwnerId = ownerId,
                Name = "Sheldon",
                CreatedAt = DateTime.UtcNow
            };

            _repositoryMock
                .Setup(repository =>
                    repository.GetByIdAsync(
                        tortoiseId,
                        ownerId
                    )
                )
                .ReturnsAsync(tortoise);

            _repositoryMock
                .Setup(repository =>
                    repository.DeleteAsync(tortoise)
                )
                .ReturnsAsync(true);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            IActionResult result =
                await controller.DeleteTortoise(
                    tortoiseId
                );

            // Assert
            Assert.IsType<NoContentResult>(result);

            _repositoryMock.Verify(
                repository =>
                    repository.DeleteAsync(tortoise),
                Times.Once
            );
        }

        [Fact]
        public async Task DeleteTortoise_WhenTortoiseDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            int ownerId = 7;
            int tortoiseId = 999;

            _repositoryMock
                .Setup(repository =>
                    repository.GetByIdAsync(
                        tortoiseId,
                        ownerId
                    )
                )
                .ReturnsAsync((Tortoise?)null);

            TortoisesController controller =
                CreateController(ownerId);

            // Act
            IActionResult result =
                await controller.DeleteTortoise(
                    tortoiseId
                );

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);

            _repositoryMock.Verify(
                repository =>
                    repository.DeleteAsync(
                        It.IsAny<Tortoise>()
                    ),
                Times.Never
            );
        }

        [Fact]
        public async Task GetTortoises_WithoutUserIdClaim_ReturnsUnauthorized()
        {
            // Arrange
            TortoisesController controller =
                CreateController(null);

            // Act
            ActionResult<IEnumerable<TortoiseResponse>> result =
                await controller.GetTortoises();

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(
                result.Result
            );

            _repositoryMock.Verify(
                repository =>
                    repository.GetAllByOwnerIdAsync(
                        It.IsAny<int>()
                    ),
                Times.Never
            );
        }

        private TortoisesController CreateController(
            int? userId
        )
        {
            TortoisesController controller =
                new TortoisesController(
                    _repositoryMock.Object,
                    _environmentMock.Object
                );

            List<Claim> claims = [];

            if (userId.HasValue)
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.NameIdentifier,
                        userId.Value.ToString()
                    )
                );
            }

            ClaimsIdentity identity = new ClaimsIdentity(
                claims,
                "TestAuthentication"
            );

            ClaimsPrincipal user =
                new ClaimsPrincipal(identity);

            controller.ControllerContext =
                new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = user
                    }
                };

            return controller;
        }
    }
}
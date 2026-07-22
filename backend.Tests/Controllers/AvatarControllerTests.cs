using System.Security.Claims;
using backend.Controllers;
using backend.DTOs.Avatar;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers;

public class AvatarControllerTests
{
    private readonly Mock<IAvatarRepository> _repositoryMock;
    private readonly AvatarController _controller;

    public AvatarControllerTests()
    {
        _repositoryMock = new Mock<IAvatarRepository>();

        _controller = new AvatarController(
            _repositoryMock.Object
        );

        SetAuthenticatedUser(ownerId: 7);
    }

    [Fact]
    public async Task GetAvatar_ReturnsOk_WhenAvatarExists()
    {
        // Arrange
        AvatarResponse response = CreateAvatarResponse();

        _repositoryMock
            .Setup(repository =>
                repository.GetOrCreateAvatarAsync(3, 7)
            )
            .ReturnsAsync(response);

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.GetAvatar(3);

        // Assert
        OkObjectResult okResult =
            Assert.IsType<OkObjectResult>(result.Result);

        AvatarResponse returnedAvatar =
            Assert.IsType<AvatarResponse>(okResult.Value);

        Assert.Equal(3, returnedAvatar.TortoiseId);
        Assert.Equal("Mochi", returnedAvatar.TortoiseName);

        _repositoryMock.Verify(
            repository =>
                repository.GetOrCreateAvatarAsync(3, 7),
            Times.Once
        );
    }

    [Fact]
    public async Task GetAvatar_ReturnsNotFound_WhenTortoiseDoesNotExist()
    {
        // Arrange
        _repositoryMock
            .Setup(repository =>
                repository.GetOrCreateAvatarAsync(99, 7)
            )
            .ReturnsAsync((AvatarResponse?)null);

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.GetAvatar(99);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetAvatar_ReturnsUnauthorized_WhenUserIdIsMissing()
    {
        // Arrange
        SetUnauthenticatedUser();

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.GetAvatar(3);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(
            result.Result
        );

        _repositoryMock.Verify(
            repository =>
                repository.GetOrCreateAvatarAsync(
                    It.IsAny<int>(),
                    It.IsAny<int>()
                ),
            Times.Never
        );
    }

    [Fact]
    public async Task EquipItem_ReturnsOk_WhenItemIsOwned()
    {
        // Arrange
        EquipAvatarItemRequest request = new()
        {
            ShopItemId = 5
        };

        AvatarOperationResult repositoryResult =
            CreateSuccessfulResult();

        _repositoryMock
            .Setup(repository =>
                repository.EquipItemAsync(3, 5, 7)
            )
            .ReturnsAsync(repositoryResult);

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.EquipItem(3, request);

        // Assert
        OkObjectResult okResult =
            Assert.IsType<OkObjectResult>(result.Result);

        Assert.IsType<AvatarResponse>(okResult.Value);

        _repositoryMock.Verify(
            repository =>
                repository.EquipItemAsync(3, 5, 7),
            Times.Once
        );
    }

    [Fact]
    public async Task EquipItem_ReturnsForbidden_WhenItemIsNotOwned()
    {
        // Arrange
        EquipAvatarItemRequest request = new()
        {
            ShopItemId = 5
        };

        _repositoryMock
            .Setup(repository =>
                repository.EquipItemAsync(3, 5, 7)
            )
            .ReturnsAsync(new AvatarOperationResult
            {
                Status = AvatarOperationStatus.ItemNotOwned
            });

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.EquipItem(3, request);

        // Assert
        ObjectResult objectResult =
            Assert.IsType<ObjectResult>(result.Result);

        Assert.Equal(
            StatusCodes.Status403Forbidden,
            objectResult.StatusCode
        );
    }

    [Fact]
    public async Task EquipItem_ReturnsConflict_WhenItemAlreadyEquipped()
    {
        // Arrange
        EquipAvatarItemRequest request = new()
        {
            ShopItemId = 5
        };

        _repositoryMock
            .Setup(repository =>
                repository.EquipItemAsync(3, 5, 7)
            )
            .ReturnsAsync(new AvatarOperationResult
            {
                Status =
                    AvatarOperationStatus.ItemAlreadyEquipped
            });

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.EquipItem(3, request);

        // Assert
        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateItem_ReturnsOk_WhenItemExists()
    {
        // Arrange
        UpdateAvatarItemRequest request = new()
        {
            X = 0.45,
            Y = 0.25,
            Scale = 0.8,
            Rotation = 15,
            ZIndex = 4
        };

        _repositoryMock
            .Setup(repository =>
                repository.UpdateItemAsync(
                    3,
                    12,
                    request,
                    7
                )
            )
            .ReturnsAsync(CreateSuccessfulResult());

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.UpdateItem(
                3,
                12,
                request
            );

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);

        _repositoryMock.Verify(
            repository =>
                repository.UpdateItemAsync(
                    3,
                    12,
                    request,
                    7
                ),
            Times.Once
        );
    }

    [Fact]
    public async Task UpdateItem_ReturnsNotFound_WhenEquippedItemDoesNotExist()
    {
        // Arrange
        UpdateAvatarItemRequest request = new()
        {
            X = 0.5,
            Y = 0.5,
            Scale = 1,
            Rotation = 0,
            ZIndex = 1
        };

        _repositoryMock
            .Setup(repository =>
                repository.UpdateItemAsync(
                    3,
                    999,
                    request,
                    7
                )
            )
            .ReturnsAsync(new AvatarOperationResult
            {
                Status =
                    AvatarOperationStatus.EquippedItemNotFound
            });

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.UpdateItem(
                3,
                999,
                request
            );

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task RemoveItem_ReturnsOk_WhenItemExists()
    {
        // Arrange
        _repositoryMock
            .Setup(repository =>
                repository.RemoveItemAsync(3, 12, 7)
            )
            .ReturnsAsync(CreateSuccessfulResult());

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.RemoveItem(3, 12);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);

        _repositoryMock.Verify(
            repository =>
                repository.RemoveItemAsync(3, 12, 7),
            Times.Once
        );
    }

    [Fact]
    public async Task RemoveItem_ReturnsNotFound_WhenAvatarDoesNotExist()
    {
        // Arrange
        _repositoryMock
            .Setup(repository =>
                repository.RemoveItemAsync(3, 12, 7)
            )
            .ReturnsAsync(new AvatarOperationResult
            {
                Status = AvatarOperationStatus.AvatarNotFound
            });

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.RemoveItem(3, 12);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateCanvas_ReturnsOk_WhenTortoiseExists()
    {
        // Arrange
        UpdateAvatarCanvasRequest request = new()
        {
            CanvasWidth = 900,
            CanvasHeight = 700
        };

        _repositoryMock
            .Setup(repository =>
                repository.UpdateCanvasAsync(
                    3,
                    request,
                    7
                )
            )
            .ReturnsAsync(CreateSuccessfulResult());

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.UpdateCanvas(3, request);

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);

        _repositoryMock.Verify(
            repository =>
                repository.UpdateCanvasAsync(
                    3,
                    request,
                    7
                ),
            Times.Once
        );
    }

    [Fact]
    public async Task UpdateCanvas_ReturnsNotFound_WhenTortoiseDoesNotExist()
    {
        // Arrange
        UpdateAvatarCanvasRequest request = new()
        {
            CanvasWidth = 800,
            CanvasHeight = 800
        };

        _repositoryMock
            .Setup(repository =>
                repository.UpdateCanvasAsync(
                    99,
                    request,
                    7
                )
            )
            .ReturnsAsync(new AvatarOperationResult
            {
                Status =
                    AvatarOperationStatus.TortoiseNotFound
            });

        // Act
        ActionResult<AvatarResponse> result =
            await _controller.UpdateCanvas(99, request);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    private void SetAuthenticatedUser(int ownerId)
    {
        Claim[] claims =
        [
            new Claim(
                ClaimTypes.NameIdentifier,
                ownerId.ToString()
            )
        ];

        ClaimsIdentity identity = new(
            claims,
            authenticationType: "TestAuthentication"
        );

        ClaimsPrincipal user = new(identity);

        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = user
                }
            };
    }

    private void SetUnauthenticatedUser()
    {
        _controller.ControllerContext =
            new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(
                        new ClaimsIdentity()
                    )
                }
            };
    }

    private static AvatarResponse CreateAvatarResponse()
    {
        return new AvatarResponse
        {
            TortoiseAvatarId = 10,
            TortoiseId = 3,
            TortoiseName = "Mochi",
            TortoisePhotoUrl =
                "/uploads/tortoises/mochi.png",
            CanvasWidth = 800,
            CanvasHeight = 800,
            UpdatedAt = DateTime.UtcNow,
            EquippedItems = []
        };
    }

    private static AvatarOperationResult
        CreateSuccessfulResult()
    {
        return new AvatarOperationResult
        {
            Status = AvatarOperationStatus.Success,
            Response = CreateAvatarResponse()
        };
    }
}
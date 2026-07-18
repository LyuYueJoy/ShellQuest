using backend.Controllers;
using backend.DTOs.CareTasks;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace backend.Tests.Controllers
{
    public class CareTasksControllerTests
    {
        private readonly Mock<ICareTaskRepository>
            _repositoryMock;

        public CareTasksControllerTests()
        {
            _repositoryMock =
                new Mock<ICareTaskRepository>();
        }

        [Fact]
        public async Task CompleteTask_WithValidJwt_ReturnsReward()
        {
            int ownerId = 7;
            int taskId = 12;

            CompleteCareTaskResponse response =
                new()
                {
                    TaskId = taskId,
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow,
                    XpEarned = 10,
                    CoinsEarned = 5,
                    TotalXp = 110,
                    Coins = 45,
                    Level = 2,
                    CurrentStreak = 3
                };

            _repositoryMock
                .Setup(repository =>
                    repository.CompleteTaskAsync(
                        taskId,
                        ownerId
                    )
                )
                .ReturnsAsync(
                    new CareTaskCompletionResult
                    {
                        Status =
                            CareTaskCompletionStatus.Success,
                        Response = response
                    }
                );

            CareTasksController controller =
                CreateController(ownerId.ToString());

            ActionResult<CompleteCareTaskResponse> result =
                await controller.CompleteTask(taskId);

            OkObjectResult okResult =
                Assert.IsType<OkObjectResult>(
                    result.Result
                );

            CompleteCareTaskResponse resultResponse =
                Assert.IsType<CompleteCareTaskResponse>(
                    okResult.Value
                );

            Assert.True(resultResponse.IsCompleted);
            Assert.Equal(10, resultResponse.XpEarned);
            Assert.Equal(5, resultResponse.CoinsEarned);

            _repositoryMock.Verify(
                repository =>
                    repository.CompleteTaskAsync(
                        taskId,
                        ownerId
                    ),
                Times.Once
            );
        }

        [Fact]
        public async Task CompleteTask_WhenAlreadyCompleted_ReturnsConflict()
        {
            int ownerId = 7;
            int taskId = 12;

            _repositoryMock
                .Setup(repository =>
                    repository.CompleteTaskAsync(
                        taskId,
                        ownerId
                    )
                )
                .ReturnsAsync(
                    new CareTaskCompletionResult
                    {
                        Status =
                            CareTaskCompletionStatus
                                .AlreadyCompleted
                    }
                );

            CareTasksController controller =
                CreateController(ownerId.ToString());

            ActionResult<CompleteCareTaskResponse> result =
                await controller.CompleteTask(taskId);

            Assert.IsType<ConflictObjectResult>(
                result.Result
            );
        }

        [Fact]
        public async Task CompleteTask_ForAnotherUser_ReturnsNotFound()
        {
            int currentOwnerId = 7;
            int taskId = 99;

            _repositoryMock
                .Setup(repository =>
                    repository.CompleteTaskAsync(
                        taskId,
                        currentOwnerId
                    )
                )
                .ReturnsAsync(
                    new CareTaskCompletionResult
                    {
                        Status =
                            CareTaskCompletionStatus.NotFound
                    }
                );

            CareTasksController controller =
                CreateController(
                    currentOwnerId.ToString()
                );

            ActionResult<CompleteCareTaskResponse> result =
                await controller.CompleteTask(taskId);

            Assert.IsType<NotFoundObjectResult>(
                result.Result
            );

            _repositoryMock.Verify(
                repository =>
                    repository.CompleteTaskAsync(
                        taskId,
                        currentOwnerId
                    ),
                Times.Once
            );
        }

        private CareTasksController CreateController(
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

            return new CareTasksController(
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
using System.Security.Claims;
using backend.Controllers;
using backend.DTOs.Chat;
using backend.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Tests.Controllers
{
    public class ChatControllerTests
    {
        private readonly Mock<IChatRepository> _repositoryMock = new();

        [Fact]
        public async Task GetChatUsers_WithValidUser_ReturnsUsers()
        {
            const int currentUserId = 7;
            List<ChatUserDto> users =
            [
                new() { UserId = 2, UserName = "Alice" },
                new() { UserId = 9, UserName = "Bob" }
            ];

            _repositoryMock
                .Setup(repository =>
                    repository.GetChatUsersAsync(currentUserId)
                )
                .ReturnsAsync(users);

            ChatController controller = CreateController(
                currentUserId.ToString()
            );

            ActionResult<List<ChatUserDto>> result =
                await controller.GetChatUsers();

            OkObjectResult okResult = Assert.IsType<OkObjectResult>(
                result.Result
            );
            List<ChatUserDto> response =
                Assert.IsType<List<ChatUserDto>>(okResult.Value);

            Assert.Equal(2, response.Count);
            Assert.Equal("Alice", response[0].UserName);
            _repositoryMock.Verify(
                repository =>
                    repository.GetChatUsersAsync(currentUserId),
                Times.Once
            );
        }

        [Fact]
        public async Task GetChatUsers_WithInvalidUserId_ReturnsUnauthorized()
        {
            ChatController controller = CreateController("invalid-user-id");

            ActionResult<List<ChatUserDto>> result =
                await controller.GetChatUsers();

            Assert.IsType<UnauthorizedResult>(result.Result);
            _repositoryMock.Verify(
                repository =>
                    repository.GetChatUsersAsync(It.IsAny<int>()),
                Times.Never
            );
        }

        [Fact]
        public async Task GetConversation_WithInvalidUserId_ReturnsUnauthorized()
        {
            ChatController controller = CreateController("invalid-user-id");

            ActionResult<List<ChatMessageDto>> result =
                await controller.GetConversation(2);

            Assert.IsType<UnauthorizedResult>(result.Result);
            VerifyConversationRepositoryWasNotCalled();
        }

        [Fact]
        public async Task GetConversation_WithCurrentUser_ReturnsBadRequest()
        {
            const int currentUserId = 7;
            ChatController controller = CreateController(
                currentUserId.ToString()
            );

            ActionResult<List<ChatMessageDto>> result =
                await controller.GetConversation(currentUserId);

            Assert.IsType<BadRequestObjectResult>(result.Result);
            VerifyConversationRepositoryWasNotCalled();
        }

        [Fact]
        public async Task GetConversation_WithUnknownUser_ReturnsNotFound()
        {
            const int currentUserId = 7;
            const int otherUserId = 99;
            _repositoryMock
                .Setup(repository =>
                    repository.UserExistsAsync(otherUserId)
                )
                .ReturnsAsync(false);
            ChatController controller = CreateController(
                currentUserId.ToString()
            );

            ActionResult<List<ChatMessageDto>> result =
                await controller.GetConversation(otherUserId);

            Assert.IsType<NotFoundObjectResult>(result.Result);
            _repositoryMock.Verify(
                repository => repository.UserExistsAsync(otherUserId),
                Times.Once
            );
            _repositoryMock.Verify(
                repository => repository.GetConversationAsync(
                    It.IsAny<int>(),
                    It.IsAny<int>()
                ),
                Times.Never
            );
        }

        [Fact]
        public async Task GetConversation_WithExistingUser_ReturnsMessages()
        {
            const int currentUserId = 7;
            const int otherUserId = 2;
            List<ChatMessageDto> messages =
            [
                new()
                {
                    ChatMessageId = 11,
                    SenderId = currentUserId,
                    SenderName = "Current user",
                    ReceiverId = otherUserId,
                    ReceiverName = "Alice",
                    Content = "Hello",
                    SentAt = new DateTime(2026, 8, 4, 10, 30, 0,
                        DateTimeKind.Utc)
                }
            ];
            _repositoryMock
                .Setup(repository =>
                    repository.UserExistsAsync(otherUserId)
                )
                .ReturnsAsync(true);
            _repositoryMock
                .Setup(repository => repository.GetConversationAsync(
                    currentUserId,
                    otherUserId
                ))
                .ReturnsAsync(messages);
            ChatController controller = CreateController(
                currentUserId.ToString()
            );

            ActionResult<List<ChatMessageDto>> result =
                await controller.GetConversation(otherUserId);

            OkObjectResult okResult = Assert.IsType<OkObjectResult>(
                result.Result
            );
            List<ChatMessageDto> response =
                Assert.IsType<List<ChatMessageDto>>(okResult.Value);

            ChatMessageDto message = Assert.Single(response);
            Assert.Equal(11, message.ChatMessageId);
            Assert.Equal("Hello", message.Content);
            _repositoryMock.Verify(
                repository => repository.UserExistsAsync(otherUserId),
                Times.Once
            );
            _repositoryMock.Verify(
                repository => repository.GetConversationAsync(
                    currentUserId,
                    otherUserId
                ),
                Times.Once
            );
        }

        private ChatController CreateController(string? userId)
        {
            List<Claim> claims = [];
            if (userId != null)
            {
                claims.Add(new Claim(ClaimTypes.NameIdentifier, userId));
            }

            ClaimsPrincipal user = new(
                new ClaimsIdentity(claims, "TestAuthentication")
            );

            return new ChatController(_repositoryMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = user }
                }
            };
        }

        private void VerifyConversationRepositoryWasNotCalled()
        {
            _repositoryMock.Verify(
                repository => repository.UserExistsAsync(It.IsAny<int>()),
                Times.Never
            );
            _repositoryMock.Verify(
                repository => repository.GetConversationAsync(
                    It.IsAny<int>(),
                    It.IsAny<int>()
                ),
                Times.Never
            );
        }
    }
}

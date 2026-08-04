using System.Security.Claims;
using backend.DTOs.Chat;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatRepository _chatRepository;

        public ChatHub(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                Context.Abort();
                return;
            }

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                GetUserGroup(currentUserId.Value)
            );

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(
            Exception? exception
        )
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId != null)
            {
                await Groups.RemoveFromGroupAsync(
                    Context.ConnectionId,
                    GetUserGroup(currentUserId.Value)
                );
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendPrivateMessage(
            SendChatMessageDto request
        )
        {
            var senderId = GetCurrentUserId();

            if (senderId == null)
            {
                throw new HubException(
                    "You must be logged in to send messages."
                );
            }

            if (request.ReceiverId <= 0)
            {
                throw new HubException(
                    "Please select a valid receiver."
                );
            }

            if (request.ReceiverId == senderId.Value)
            {
                throw new HubException(
                    "You cannot send a message to yourself."
                );
            }

            var content = request.Content?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new HubException(
                    "Message content is required."
                );
            }

            if (content.Length > 1000)
            {
                throw new HubException(
                    "Messages cannot exceed 1000 characters."
                );
            }

            var receiverExists =
                await _chatRepository.UserExistsAsync(
                    request.ReceiverId
                );

            if (!receiverExists)
            {
                throw new HubException(
                    "The selected user was not found."
                );
            }

            var createdMessage =
                await _chatRepository.CreateMessageAsync(
                    senderId.Value,
                    new SendChatMessageDto
                    {
                        ReceiverId = request.ReceiverId,
                        Content = content
                    }
                );

            if (createdMessage == null)
            {
                throw new HubException(
                    "The message could not be sent."
                );
            }

            await Clients.Groups(
                GetUserGroup(senderId.Value),
                GetUserGroup(request.ReceiverId)
            ).SendAsync(
                "ReceivePrivateMessage",
                createdMessage
            );
        }

        private int? GetCurrentUserId()
        {
            var userIdValue =
                Context.User?.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            return int.TryParse(userIdValue, out var userId)
                ? userId
                : null;
        }

        private static string GetUserGroup(int userId)
        {
            return $"user-{userId}";
        }
    }
}
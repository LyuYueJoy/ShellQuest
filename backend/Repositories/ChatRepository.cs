using backend.Data;
using backend.DTOs.Chat;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly WebAPIDBContext _context;

        public ChatRepository(WebAPIDBContext context)
        {
            _context = context;
        }

        public async Task<List<ChatUserDto>> GetChatUsersAsync(
            int currentUserId
        )
        {
            return await _context.Users
                .AsNoTracking()
                .Where(user => user.UserId != currentUserId)
                .OrderBy(user => user.UserName)
                .Select(user => new ChatUserDto
                {
                    UserId = user.UserId,
                    UserName = user.UserName
                })
                .ToListAsync();
        }

        public async Task<List<ChatMessageDto>> GetConversationAsync(
            int currentUserId,
            int otherUserId
        )
        {
            return await _context.ChatMessages
                .AsNoTracking()
                .Where(message =>
                    (message.SenderId == currentUserId &&
                     message.ReceiverId == otherUserId) ||
                    (message.SenderId == otherUserId &&
                     message.ReceiverId == currentUserId)
                )
                .OrderBy(message => message.SentAt)
                .Select(message => new ChatMessageDto
                {
                    ChatMessageId = message.ChatMessageId,
                    SenderId = message.SenderId,
                    SenderName = message.Sender.UserName,
                    ReceiverId = message.ReceiverId,
                    ReceiverName = message.Receiver.UserName,
                    Content = message.Content,
                    SentAt = message.SentAt,
                    IsRead = message.IsRead
                })
                .ToListAsync();
        }

        public async Task<ChatMessageDto?> CreateMessageAsync(
            int senderId,
            SendChatMessageDto request
        )
        {
            var content = request.Content.Trim();

            if (string.IsNullOrWhiteSpace(content))
            {
                return null;
            }

            var users = await _context.Users
                .AsNoTracking()
                .Where(user =>
                    user.UserId == senderId ||
                    user.UserId == request.ReceiverId
                )
                .Select(user => new
                {
                    user.UserId,
                    user.UserName
                })
                .ToListAsync();

            var sender = users.FirstOrDefault(
                user => user.UserId == senderId
            );

            var receiver = users.FirstOrDefault(
                user => user.UserId == request.ReceiverId
            );

            if (sender == null || receiver == null)
            {
                return null;
            }

            var message = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = request.ReceiverId,
                Content = content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return new ChatMessageDto
            {
                ChatMessageId = message.ChatMessageId,
                SenderId = sender.UserId,
                SenderName = sender.UserName,
                ReceiverId = receiver.UserId,
                ReceiverName = receiver.UserName,
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = message.IsRead
            };
        }

        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _context.Users
                .AsNoTracking()
                .AnyAsync(user => user.UserId == userId);
        }
    }
}
using backend.DTOs.Chat;

namespace backend.Repositories
{
    public interface IChatRepository
    {
        Task<List<ChatUserDto>> GetChatUsersAsync(
            int currentUserId
        );

        Task<List<ChatMessageDto>> GetConversationAsync(
            int currentUserId,
            int otherUserId
        );

        Task<ChatMessageDto?> CreateMessageAsync(
            int senderId,
            SendChatMessageDto request
        );

        Task<bool> UserExistsAsync(int userId);
    }
}
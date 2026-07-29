using backend.DTOs.Forum;

namespace backend.Repositories
{
    public interface IForumRepository
    {
        Task<List<ForumPostSummaryResponse>> GetPostsAsync(
            int? currentUserId);

        Task<ForumPostDetailResponse?> GetPostByIdAsync(
            int postId,
            int? currentUserId);

        Task<ForumPostDetailResponse?> CreatePostAsync(
            int authorId,
            CreateForumPostRequest request);

        Task<bool> DeletePostAsync(
            int postId,
            int currentUserId);

        Task<ForumReplyResponse?> CreateReplyAsync(
            int postId,
            int authorId,
            CreateForumReplyRequest request);

        Task<bool> DeleteReplyAsync(
            int replyId,
            int currentUserId);

        Task<ToggleForumLikeResponse?> ToggleLikeAsync(
            int postId,
            int currentUserId);
    }
}
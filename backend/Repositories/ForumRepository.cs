using backend.Data;
using backend.DTOs.Forum;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ForumRepository : IForumRepository
    {
        private readonly WebAPIDBContext _context;

        public ForumRepository(WebAPIDBContext context)
        {
            _context = context;
        }

        public async Task<List<ForumPostSummaryResponse>> GetPostsAsync(
            int? currentUserId)
        {
            return await _context.ForumPosts
                .AsNoTracking()
                .OrderByDescending(post => post.CreatedAt)
                .Select(post => new ForumPostSummaryResponse
                {
                    ForumPostId = post.ForumPostId,
                    AuthorId = post.AuthorId,
                    AuthorName = post.Author.UserName,
                    Title = post.Title,
                    Content = post.Content,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    ReplyCount = post.Replies.Count,
                    LikeCount = post.Likes.Count,

                    IsLikedByCurrentUser =
                        currentUserId.HasValue &&
                        post.Likes.Any(like =>
                            like.UserId == currentUserId.Value),

                    IsAuthor =
                        currentUserId.HasValue &&
                        post.AuthorId == currentUserId.Value
                })
                .ToListAsync();
        }

        public async Task<ForumPostDetailResponse?> GetPostByIdAsync(
            int postId,
            int? currentUserId)
        {
            return await _context.ForumPosts
                .AsNoTracking()
                .Where(post => post.ForumPostId == postId)
                .Select(post => new ForumPostDetailResponse
                {
                    ForumPostId = post.ForumPostId,
                    AuthorId = post.AuthorId,
                    AuthorName = post.Author.UserName,
                    Title = post.Title,
                    Content = post.Content,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt,
                    LikeCount = post.Likes.Count,

                    IsLikedByCurrentUser =
                        currentUserId.HasValue &&
                        post.Likes.Any(like =>
                            like.UserId == currentUserId.Value),

                    IsAuthor =
                        currentUserId.HasValue &&
                        post.AuthorId == currentUserId.Value,

                    Replies = post.Replies
                        .OrderBy(reply => reply.CreatedAt)
                        .Select(reply => new ForumReplyResponse
                        {
                            ForumReplyId = reply.ForumReplyId,
                            ForumPostId = reply.ForumPostId,
                            AuthorId = reply.AuthorId,
                            AuthorName = reply.Author.UserName,
                            Content = reply.Content,
                            CreatedAt = reply.CreatedAt,

                            IsAuthor =
                                currentUserId.HasValue &&
                                reply.AuthorId == currentUserId.Value
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ForumPostDetailResponse?> CreatePostAsync(
            int authorId,
            CreateForumPostRequest request)
        {
            bool userExists = await _context.Users
                .AnyAsync(user => user.UserId == authorId);

            if (!userExists)
            {
                return null;
            }

            var now = DateTime.UtcNow;

            var post = new ForumPost
            {
                AuthorId = authorId,
                Title = request.Title.Trim(),
                Content = request.Content.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.ForumPosts.Add(post);
            await _context.SaveChangesAsync();

            return await GetPostByIdAsync(post.ForumPostId, authorId);
        }

        public async Task<bool> DeletePostAsync(
            int postId,
            int currentUserId)
        {
            var post = await _context.ForumPosts
                .FirstOrDefaultAsync(post =>
                    post.ForumPostId == postId &&
                    post.AuthorId == currentUserId);

            if (post == null)
            {
                return false;
            }

            _context.ForumPosts.Remove(post);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ForumReplyResponse?> CreateReplyAsync(
            int postId,
            int authorId,
            CreateForumReplyRequest request)
        {
            bool postExists = await _context.ForumPosts
                .AnyAsync(post => post.ForumPostId == postId);

            bool userExists = await _context.Users
                .AnyAsync(user => user.UserId == authorId);

            if (!postExists || !userExists)
            {
                return null;
            }

            var reply = new ForumReply
            {
                ForumPostId = postId,
                AuthorId = authorId,
                Content = request.Content.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.ForumReplies.Add(reply);
            await _context.SaveChangesAsync();

            return await _context.ForumReplies
                .AsNoTracking()
                .Where(item => item.ForumReplyId == reply.ForumReplyId)
                .Select(item => new ForumReplyResponse
                {
                    ForumReplyId = item.ForumReplyId,
                    ForumPostId = item.ForumPostId,
                    AuthorId = item.AuthorId,
                    AuthorName = item.Author.UserName,
                    Content = item.Content,
                    CreatedAt = item.CreatedAt,
                    IsAuthor = item.AuthorId == authorId
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteReplyAsync(
            int replyId,
            int currentUserId)
        {
            var reply = await _context.ForumReplies
                .FirstOrDefaultAsync(reply =>
                    reply.ForumReplyId == replyId &&
                    reply.AuthorId == currentUserId);

            if (reply == null)
            {
                return false;
            }

            _context.ForumReplies.Remove(reply);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<ToggleForumLikeResponse?> ToggleLikeAsync(
            int postId,
            int currentUserId)
        {
            bool postExists = await _context.ForumPosts
                .AnyAsync(post => post.ForumPostId == postId);

            if (!postExists)
            {
                return null;
            }

            var existingLike = await _context.ForumPostLikes
                .FirstOrDefaultAsync(like =>
                    like.ForumPostId == postId &&
                    like.UserId == currentUserId);

            bool isLiked;

            if (existingLike == null)
            {
                var newLike = new ForumPostLike
                {
                    ForumPostId = postId,
                    UserId = currentUserId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ForumPostLikes.Add(newLike);
                isLiked = true;
            }
            else
            {
                _context.ForumPostLikes.Remove(existingLike);
                isLiked = false;
            }

            await _context.SaveChangesAsync();

            int likeCount = await _context.ForumPostLikes
                .CountAsync(like => like.ForumPostId == postId);

            return new ToggleForumLikeResponse
            {
                IsLiked = isLiked,
                LikeCount = likeCount
            };
        }
    }
}
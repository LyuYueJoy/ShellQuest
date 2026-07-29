using System.Security.Claims;
using backend.DTOs.Forum;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/forum")]
    public class ForumController : ControllerBase
    {
        private readonly IForumRepository _forumRepository;

        public ForumController(IForumRepository forumRepository)
        {
            _forumRepository = forumRepository;
        }

        // GET: /api/forum/posts
        // 游客也可以查看帖子
        [HttpGet("posts")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ForumPostSummaryResponse>>> GetPosts()
        {
            int? currentUserId = GetOptionalUserId();

            var posts = await _forumRepository.GetPostsAsync(currentUserId);

            return Ok(posts);
        }

        // GET: /api/forum/posts/5
        // 游客也可以查看帖子详情和回复
        [HttpGet("posts/{postId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<ForumPostDetailResponse>> GetPost(
            int postId)
        {
            int? currentUserId = GetOptionalUserId();

            var post = await _forumRepository.GetPostByIdAsync(
                postId,
                currentUserId);

            if (post == null)
            {
                return NotFound(new
                {
                    message = "Forum post was not found."
                });
            }

            return Ok(post);
        }

        // POST: /api/forum/posts
        // 只有登录用户可以发帖
        [HttpPost("posts")]
        [Authorize]
        public async Task<ActionResult<ForumPostDetailResponse>> CreatePost(
            [FromBody] CreateForumPostRequest request)
        {
            int? currentUserId = GetOptionalUserId();

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "A valid user token is required."
                });
            }

            var post = await _forumRepository.CreatePostAsync(
                currentUserId.Value,
                request);

            if (post == null)
            {
                return BadRequest(new
                {
                    message = "The forum post could not be created."
                });
            }

            return CreatedAtAction(
                nameof(GetPost),
                new { postId = post.ForumPostId },
                post);
        }

        // DELETE: /api/forum/posts/5
        // 用户只能删除自己的帖子
        [HttpDelete("posts/{postId:int}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int postId)
        {
            int? currentUserId = GetOptionalUserId();

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "A valid user token is required."
                });
            }

            bool deleted = await _forumRepository.DeletePostAsync(
                postId,
                currentUserId.Value);

            if (!deleted)
            {
                return NotFound(new
                {
                    message =
                        "The post was not found or you are not its author."
                });
            }

            return NoContent();
        }

        // POST: /api/forum/posts/5/replies
        // 只有登录用户可以回复
        [HttpPost("posts/{postId:int}/replies")]
        [Authorize]
        public async Task<ActionResult<ForumReplyResponse>> CreateReply(
            int postId,
            [FromBody] CreateForumReplyRequest request)
        {
            int? currentUserId = GetOptionalUserId();

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "A valid user token is required."
                });
            }

            var reply = await _forumRepository.CreateReplyAsync(
                postId,
                currentUserId.Value,
                request);

            if (reply == null)
            {
                return NotFound(new
                {
                    message = "The forum post or user was not found."
                });
            }

            return Ok(reply);
        }

        // DELETE: /api/forum/replies/5
        // 用户只能删除自己的回复
        [HttpDelete("replies/{replyId:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteReply(int replyId)
        {
            int? currentUserId = GetOptionalUserId();

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "A valid user token is required."
                });
            }

            bool deleted = await _forumRepository.DeleteReplyAsync(
                replyId,
                currentUserId.Value);

            if (!deleted)
            {
                return NotFound(new
                {
                    message =
                        "The reply was not found or you are not its author."
                });
            }

            return NoContent();
        }

        // POST: /api/forum/posts/5/like
        // 第一次调用点赞，再次调用取消点赞
        [HttpPost("posts/{postId:int}/like")]
        [Authorize]
        public async Task<ActionResult<ToggleForumLikeResponse>> ToggleLike(
            int postId)
        {
            int? currentUserId = GetOptionalUserId();

            if (!currentUserId.HasValue)
            {
                return Unauthorized(new
                {
                    message = "A valid user token is required."
                });
            }

            var result = await _forumRepository.ToggleLikeAsync(
                postId,
                currentUserId.Value);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "The forum post was not found."
                });
            }

            return Ok(result);
        }

        private int? GetOptionalUserId()
        {
            string? userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (int.TryParse(userIdValue, out int userId))
            {
                return userId;
            }

            return null;
        }
    }
}
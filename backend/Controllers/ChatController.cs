using System.Security.Claims;
using backend.DTOs.Chat;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;

        public ChatController(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<ChatUserDto>>> GetChatUsers()
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            var users = await _chatRepository.GetChatUsersAsync(
                currentUserId.Value
            );

            return Ok(users);
        }

        [HttpGet("conversation/{otherUserId:int}")]
        public async Task<ActionResult<List<ChatMessageDto>>> GetConversation(
            int otherUserId
        )
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            if (otherUserId == currentUserId.Value)
            {
                return BadRequest(
                    new
                    {
                        message = "You cannot start a conversation with yourself."
                    }
                );
            }

            var otherUserExists =
                await _chatRepository.UserExistsAsync(otherUserId);

            if (!otherUserExists)
            {
                return NotFound(
                    new
                    {
                        message = "The selected user was not found."
                    }
                );
            }

            var messages =
                await _chatRepository.GetConversationAsync(
                    currentUserId.Value,
                    otherUserId
                );

            return Ok(messages);
        }

        private int? GetCurrentUserId()
        {
            var userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            return int.TryParse(userIdValue, out var userId)
                ? userId
                : null;
        }
    }
}
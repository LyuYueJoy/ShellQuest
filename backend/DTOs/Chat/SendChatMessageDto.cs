using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Chat
{
    public class SendChatMessageDto
    {
        [Range(1, int.MaxValue)]
        public int ReceiverId { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; } = string.Empty;
    }
}
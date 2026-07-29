using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Forum
{
    public class CreateForumReplyRequest
    {
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; } = string.Empty;
    }
}
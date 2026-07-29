using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Forum
{
    public class CreateForumPostRequest
    {
        [Required]
        [StringLength(120, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000, MinimumLength = 3)]
        public string Content { get; set; } = string.Empty;
    }
}
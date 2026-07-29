using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ForumReply
    {
        public int ForumReplyId { get; set; }

        public int ForumPostId { get; set; }

        public int AuthorId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public ForumPost ForumPost { get; set; } = null!;

        public User Author { get; set; } = null!;
    }
}
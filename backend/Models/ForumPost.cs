using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ForumPost
    {
        public int ForumPostId { get; set; }

        public int AuthorId { get; set; }

        [Required]
        [MaxLength(120)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public User Author { get; set; } = null!;

        public ICollection<ForumReply> Replies { get; set; }
            = new List<ForumReply>();

        public ICollection<ForumPostLike> Likes { get; set; }
            = new List<ForumPostLike>();
    }
}
namespace backend.Models
{
    public class ForumPostLike
    {
        public int ForumPostLikeId { get; set; }

        public int ForumPostId { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public ForumPost ForumPost { get; set; } = null!;

        public User User { get; set; } = null!;
    }
}
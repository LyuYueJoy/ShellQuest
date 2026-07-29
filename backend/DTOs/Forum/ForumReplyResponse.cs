namespace backend.DTOs.Forum
{
    public class ForumReplyResponse
    {
        public int ForumReplyId { get; set; }

        public int ForumPostId { get; set; }

        public int AuthorId { get; set; }

        public string AuthorName { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public bool IsAuthor { get; set; }
    }
}
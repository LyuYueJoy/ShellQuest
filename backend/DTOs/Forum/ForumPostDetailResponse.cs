namespace backend.DTOs.Forum
{
    public class ForumPostDetailResponse
    {
        public int ForumPostId { get; set; }

        public int AuthorId { get; set; }

        public string AuthorName { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int LikeCount { get; set; }

        public bool IsLikedByCurrentUser { get; set; }

        public bool IsAuthor { get; set; }

        public List<ForumReplyResponse> Replies { get; set; }
            = new List<ForumReplyResponse>();
    }
}
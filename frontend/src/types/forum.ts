export interface ForumPostSummary {
  forumPostId: number;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  isAuthor: boolean;
}

export interface ForumReply {
  forumReplyId: number;
  forumPostId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  isAuthor: boolean;
}

export interface ForumPostDetail {
  forumPostId: number;
  authorId: number;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  isAuthor: boolean;
  replies: ForumReply[];
}

export interface CreateForumPostRequest {
  title: string;
  content: string;
}

export interface CreateForumReplyRequest {
  content: string;
}

export interface ToggleForumLikeResponse {
  isLiked: boolean;
  likeCount: number;
}
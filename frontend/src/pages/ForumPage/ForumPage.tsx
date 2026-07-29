import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useEffect, useMemo, useState } from "react";
import { forumService } from "../../services/forumService";
import type { ForumPostDetail, ForumPostSummary } from "../../types/forum";
import {
  AuthorAvatar,
  AuthorGroup,
  AuthorName,
  CreatePostButton,
  ErrorText,
  Eyebrow,
  ForumLayout,
  HeaderCard,
  HeaderContent,
  HeaderText,
  LikeButton,
  PageContainer,
  PageDescription,
  PageRoot,
  PageTitle,
  PostCard,
  PostContent,
  PostDate,
  PostFooter,
  PostHeader,
  PostsColumn,
  PostStats,
  PostTitle,
  RetryButton,
  SearchField,
  SectionTitle,
  Sidebar,
  SidebarCard,
  StatChip,
  StatusCard,
  StatusIcon,
  DetailActions,
  DetailAuthorRow,
  DetailContent,
  EmptyReplies,
  RepliesHeader,
  RepliesList,
  ReplyCard,
  ReplyContent,
  ReplyForm,
  ReplyHeader,
} from "./ForumPage.styles";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

interface CreatePostForm {
  title: string;
  content: string;
}

const emptyCreatePostForm: CreatePostForm = {
  title: "",
  content: "",
};

const ForumPage = () => {
  const [posts, setPosts] = useState<ForumPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [createPostForm, setCreatePostForm] =
    useState<CreatePostForm>(emptyCreatePostForm);

  const [createError, setCreateError] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [likingPostId, setLikingPostId] = useState<number | null>(null);

  const [actionMessage, setActionMessage] = useState("");

  const [selectedPost, setSelectedPost] = useState<ForumPostDetail | null>(
    null,
  );

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isCreatingReply, setIsCreatingReply] = useState(false);

  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);

  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const token = sessionStorage.getItem("shellQuestToken");
  const isLoggedIn = Boolean(token);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const loadedPosts = await forumService.getPosts();

      setPosts(loadedPosts);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Forum posts could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return posts;
    }

    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(normalizedSearchTerm) ||
        post.content.toLowerCase().includes(normalizedSearchTerm) ||
        post.authorName.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }, [posts, searchTerm]);

  const formatDate = (dateValue: string) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getAuthorInitial = (authorName: string) => {
    const trimmedName = authorName.trim();

    if (!trimmedName) {
      return "?";
    }

    return trimmedName.charAt(0).toUpperCase();
  };

  const handleOpenCreateDialog = () => {
    setActionMessage("");

    if (!isLoggedIn) {
      setActionMessage(
        "Please log in or create an account before creating a post.",
      );
      return;
    }

    setCreateError("");
    setCreatePostForm(emptyCreatePostForm);
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    if (isCreatingPost) {
      return;
    }

    setIsCreateDialogOpen(false);
    setCreateError("");
    setCreatePostForm(emptyCreatePostForm);
  };

  const handleCreatePost = async () => {
    const title = createPostForm.title.trim();
    const content = createPostForm.content.trim();

    if (!title || !content) {
      setCreateError("Please enter both a title and content.");
      return;
    }

    try {
      setIsCreatingPost(true);
      setCreateError("");

      const createdPost = await forumService.createPost({
        title,
        content,
      });

      const newPostSummary: ForumPostSummary = {
        forumPostId: createdPost.forumPostId,
        authorId: createdPost.authorId,
        authorName: createdPost.authorName,
        title: createdPost.title,
        content: createdPost.content,
        createdAt: createdPost.createdAt,
        updatedAt: createdPost.updatedAt,
        replyCount: createdPost.replies.length,
        likeCount: createdPost.likeCount,
        isLikedByCurrentUser: createdPost.isLikedByCurrentUser,
        isAuthor: createdPost.isAuthor,
      };

      setPosts((currentPosts) => [newPostSummary, ...currentPosts]);

      setIsCreateDialogOpen(false);
      setCreatePostForm(emptyCreatePostForm);
      setActionMessage("Your forum post was created.");
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "The forum post could not be created.",
      );
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleToggleLike = async (
    event: React.MouseEvent<HTMLButtonElement>,
    postId: number,
  ) => {
    event.stopPropagation();
    setActionMessage("");

    if (!isLoggedIn) {
      setActionMessage(
        "Please log in or create an account before liking posts.",
      );
      return;
    }

    try {
      setLikingPostId(postId);

      const result = await forumService.toggleLike(postId);

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.forumPostId === postId
            ? {
                ...post,
                isLikedByCurrentUser: result.isLiked,
                likeCount: result.likeCount,
              }
            : post,
        ),
      );
    } catch (error) {
      setActionMessage(
        error instanceof Error
          ? error.message
          : "The like could not be updated.",
      );
    } finally {
      setLikingPostId(null);
    }
  };

  const handlePostClick = async (postId: number) => {
    try {
      setIsDetailOpen(true);
      setIsLoadingDetail(true);
      setDetailError("");
      setReplyError("");
      setReplyContent("");
      setSelectedPost(null);

      const post = await forumService.getPost(postId);

      setSelectedPost(post);
    } catch (error) {
      setDetailError(
        error instanceof Error
          ? error.message
          : "The forum post could not be loaded.",
      );
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    if (isCreatingReply || isDeletingPost || deletingReplyId !== null) {
      return;
    }

    setIsDetailOpen(false);
    setSelectedPost(null);
    setDetailError("");
    setReplyError("");
    setReplyContent("");
  };

  const handleCreateReply = async () => {
    const content = replyContent.trim();

    if (!selectedPost || !content) {
      setReplyError("Please enter a reply.");
      return;
    }

    if (!isLoggedIn) {
      setReplyError("Please log in or create an account before replying.");
      return;
    }

    try {
      setIsCreatingReply(true);
      setReplyError("");

      const createdReply = await forumService.createReply(
        selectedPost.forumPostId,
        { content },
      );

      setSelectedPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              replies: [...currentPost.replies, createdReply],
            }
          : currentPost,
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.forumPostId === selectedPost.forumPostId
            ? {
                ...post,
                replyCount: post.replyCount + 1,
              }
            : post,
        ),
      );

      setReplyContent("");
    } catch (error) {
      setReplyError(
        error instanceof Error
          ? error.message
          : "Your reply could not be published.",
      );
    } finally {
      setIsCreatingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    if (!selectedPost) {
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this reply?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingReplyId(replyId);
      setReplyError("");

      await forumService.deleteReply(replyId);

      setSelectedPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              replies: currentPost.replies.filter(
                (reply) => reply.forumReplyId !== replyId,
              ),
            }
          : currentPost,
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.forumPostId === selectedPost.forumPostId
            ? {
                ...post,
                replyCount: Math.max(0, post.replyCount - 1),
              }
            : post,
        ),
      );
    } catch (error) {
      setReplyError(
        error instanceof Error
          ? error.message
          : "The reply could not be deleted.",
      );
    } finally {
      setDeletingReplyId(null);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) {
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this post and all its replies?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeletingPost(true);
      setDetailError("");

      await forumService.deletePost(selectedPost.forumPostId);

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.forumPostId !== selectedPost.forumPostId,
        ),
      );

      setIsDetailOpen(false);
      setSelectedPost(null);
      setActionMessage("Your forum post was deleted.");
    } catch (error) {
      setDetailError(
        error instanceof Error
          ? error.message
          : "The forum post could not be deleted.",
      );
    } finally {
      setIsDeletingPost(false);
    }
  };

  const renderPosts = () => {
    if (isLoading) {
      return (
        <StatusCard>
          <CircularProgress color="success" />

          <Typography sx={{ mt: 2, fontWeight: 800 }}>
            Loading community posts...
          </Typography>
        </StatusCard>
      );
    }

    if (loadError) {
      return (
        <StatusCard>
          <StatusIcon>!</StatusIcon>

          <Typography variant="h6" sx={{ fontWeight: 850 }}>
            We could not load the forum
          </Typography>

          <ErrorText>{loadError}</ErrorText>

          <RetryButton
            variant="outlined"
            color="success"
            onClick={() => void loadPosts()}
          >
            Try again
          </RetryButton>
        </StatusCard>
      );
    }

    if (posts.length === 0) {
      return (
        <StatusCard>
          <StatusIcon>💬</StatusIcon>

          <Typography variant="h6" sx={{ fontWeight: 850 }}>
            No posts yet
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Start the first conversation in the ShellQuest community.
          </Typography>

          <RetryButton
            variant="contained"
            color="success"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenCreateDialog}
          >
            Create first post
          </RetryButton>
        </StatusCard>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <StatusCard>
          <StatusIcon>🔍</StatusIcon>

          <Typography variant="h6" sx={{ fontWeight: 850 }}>
            No matching posts
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try searching with a different title, author or keyword.
          </Typography>

          <RetryButton
            variant="outlined"
            color="success"
            onClick={() => setSearchTerm("")}
          >
            Clear search
          </RetryButton>
        </StatusCard>
      );
    }

    return filteredPosts.map((post) => (
      <PostCard
        key={post.forumPostId}
        onClick={() => handlePostClick(post.forumPostId)}
      >
        <PostHeader>
          <AuthorGroup>
            <AuthorAvatar>{getAuthorInitial(post.authorName)}</AuthorAvatar>

            <Box sx={{ minWidth: 0 }}>
              <AuthorName>{post.authorName}</AuthorName>

              <PostDate variant="caption">
                {formatDate(post.createdAt)}
              </PostDate>
            </Box>
          </AuthorGroup>

          {post.isAuthor && (
            <StatChip size="small" label="Your post" color="success" />
          )}
        </PostHeader>

        <PostTitle variant="h5">{post.title}</PostTitle>

        <PostContent>{post.content}</PostContent>

        <PostFooter>
          <PostStats>
            <StatChip
              size="small"
              icon={<ChatBubbleOutlineRoundedIcon />}
              label={`${post.replyCount} ${
                post.replyCount === 1 ? "reply" : "replies"
              }`}
            />

            <StatChip
              size="small"
              icon={<FavoriteBorderRoundedIcon />}
              label={`${post.likeCount} ${
                post.likeCount === 1 ? "like" : "likes"
              }`}
            />
          </PostStats>

          <LikeButton
            liked={post.isLikedByCurrentUser}
            disabled={likingPostId === post.forumPostId}
            aria-label={post.isLikedByCurrentUser ? "Unlike post" : "Like post"}
            onClick={(event) => void handleToggleLike(event, post.forumPostId)}
          >
            {likingPostId === post.forumPostId ? (
              <CircularProgress size={20} color="inherit" />
            ) : post.isLikedByCurrentUser ? (
              <FavoriteRoundedIcon />
            ) : (
              <FavoriteBorderRoundedIcon />
            )}
          </LikeButton>
        </PostFooter>
      </PostCard>
    ));
  };

  return (
    <PageRoot>
      <PageContainer maxWidth="lg">
        <HeaderCard>
          <HeaderContent>
            <HeaderText>
              <Eyebrow label="ShellQuest Community" />

              <PageTitle variant="h3">Tortoise Forum</PageTitle>

              <PageDescription>
                Ask questions, share tortoise-care advice and celebrate progress
                with other ShellQuest keepers.
              </PageDescription>
            </HeaderText>

            <CreatePostButton
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreateDialog}
            >
              Create post
            </CreatePostButton>
          </HeaderContent>
        </HeaderCard>

        {actionMessage && (
          <Alert
            severity={actionMessage.includes("created") ? "success" : "info"}
            onClose={() => setActionMessage("")}
          >
            {actionMessage}
          </Alert>
        )}

        <ForumLayout>
          <PostsColumn>{renderPosts()}</PostsColumn>

          <Sidebar>
            <SidebarCard>
              <SectionTitle variant="h6">Search discussions</SectionTitle>

              <SearchField
                fullWidth
                size="small"
                value={searchTerm}
                placeholder="Search posts..."
                onChange={(event) => setSearchTerm(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </SidebarCard>

            <SidebarCard>
              <SectionTitle variant="h6">Community guide</SectionTitle>

              <Stack spacing={1.25}>
                <Typography variant="body2" color="text.secondary">
                  🐢 Share helpful tortoise-care experiences.
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  🌿 Keep discussions friendly and respectful.
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  💚 Support other keepers by replying and liking useful posts.
                </Typography>
              </Stack>
            </SidebarCard>

            <SidebarCard>
              <SectionTitle variant="h6">Forum activity</SectionTitle>

              <Typography color="text.secondary">
                {posts.length}{" "}
                {posts.length === 1 ? "discussion" : "discussions"}
              </Typography>
            </SidebarCard>
          </Sidebar>
        </ForumLayout>
      </PageContainer>

      <Dialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: { xs: 0.5, sm: 1 },
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Create a new post</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ask a question or share something with the ShellQuest community.
          </Typography>

          <Stack spacing={2}>
            <TextField
              autoFocus
              fullWidth
              required
              label="Post title"
              value={createPostForm.title}
              slotProps={{
                htmlInput: {
                  maxLength: 120,
                },
              }}
              helperText={`${createPostForm.title.length}/120`}
              onChange={(event) =>
                setCreatePostForm((currentForm) => ({
                  ...currentForm,
                  title: event.target.value,
                }))
              }
            />

            <TextField
              fullWidth
              required
              multiline
              minRows={5}
              label="What would you like to share?"
              value={createPostForm.content}
              slotProps={{
                htmlInput: {
                  maxLength: 2000,
                },
              }}
              helperText={`${createPostForm.content.length}/2000`}
              onChange={(event) =>
                setCreatePostForm((currentForm) => ({
                  ...currentForm,
                  content: event.target.value,
                }))
              }
            />

            {createError && <Alert severity="error">{createError}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            color="inherit"
            disabled={isCreatingPost}
            onClick={handleCloseCreateDialog}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            disabled={
              isCreatingPost ||
              !createPostForm.title.trim() ||
              !createPostForm.content.trim()
            }
            startIcon={
              isCreatingPost ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <AddRoundedIcon />
              )
            }
            onClick={() => void handleCreatePost()}
          >
            {isCreatingPost ? "Publishing..." : "Publish post"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDetailOpen}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="md"
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              minHeight: { sm: 500 },
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Community discussion</DialogTitle>

        <DialogContent dividers>
          {isLoadingDetail && (
            <Box
              sx={{
                display: "grid",
                minHeight: 280,
                placeItems: "center",
              }}
            >
              <Stack spacing={2} sx={{ alignItems: "center" }}>
                <CircularProgress color="success" />

                <Typography color="text.secondary">
                  Loading discussion...
                </Typography>
              </Stack>
            </Box>
          )}

          {!isLoadingDetail && detailError && (
            <Alert severity="error">{detailError}</Alert>
          )}

          {!isLoadingDetail && selectedPost && (
            <>
              <DetailAuthorRow>
                <AuthorGroup>
                  <AuthorAvatar>
                    {getAuthorInitial(selectedPost.authorName)}
                  </AuthorAvatar>

                  <Box sx={{ minWidth: 0 }}>
                    <AuthorName>{selectedPost.authorName}</AuthorName>

                    <PostDate variant="caption">
                      {formatDate(selectedPost.createdAt)}
                    </PostDate>
                  </Box>
                </AuthorGroup>

                {selectedPost.isAuthor && (
                  <StatChip size="small" color="success" label="Your post" />
                )}
              </DetailAuthorRow>

              <PostTitle variant="h4">{selectedPost.title}</PostTitle>

              <DetailContent>{selectedPost.content}</DetailContent>

              <DetailActions>
                <Stack direction="row" spacing={1}>
                  <StatChip
                    size="small"
                    icon={<FavoriteBorderRoundedIcon />}
                    label={`${selectedPost.likeCount} ${
                      selectedPost.likeCount === 1 ? "like" : "likes"
                    }`}
                  />

                  <StatChip
                    size="small"
                    icon={<ChatBubbleOutlineRoundedIcon />}
                    label={`${selectedPost.replies.length} ${
                      selectedPost.replies.length === 1 ? "reply" : "replies"
                    }`}
                  />
                </Stack>

                {selectedPost.isAuthor && (
                  <Button
                    color="error"
                    disabled={isDeletingPost}
                    startIcon={
                      isDeletingPost ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <DeleteOutlineRoundedIcon />
                      )
                    }
                    onClick={() => void handleDeletePost()}
                  >
                    {isDeletingPost ? "Deleting..." : "Delete post"}
                  </Button>
                )}
              </DetailActions>

              <RepliesHeader>
                <Typography variant="h6" sx={{ fontWeight: 850 }}>
                  Replies
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {selectedPost.replies.length} total
                </Typography>
              </RepliesHeader>

              {selectedPost.replies.length === 0 ? (
                <EmptyReplies>
                  No replies yet. Be the first person to respond.
                </EmptyReplies>
              ) : (
                <RepliesList>
                  {selectedPost.replies.map((reply) => (
                    <ReplyCard key={reply.forumReplyId}>
                      <ReplyHeader>
                        <AuthorGroup>
                          <AuthorAvatar>
                            {getAuthorInitial(reply.authorName)}
                          </AuthorAvatar>

                          <Box sx={{ minWidth: 0 }}>
                            <AuthorName>{reply.authorName}</AuthorName>

                            <PostDate variant="caption">
                              {formatDate(reply.createdAt)}
                            </PostDate>
                          </Box>
                        </AuthorGroup>

                        {reply.isAuthor && (
                          <IconButton
                            color="error"
                            size="small"
                            disabled={deletingReplyId === reply.forumReplyId}
                            aria-label="Delete reply"
                            onClick={() =>
                              void handleDeleteReply(reply.forumReplyId)
                            }
                          >
                            {deletingReplyId === reply.forumReplyId ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <DeleteOutlineRoundedIcon />
                            )}
                          </IconButton>
                        )}
                      </ReplyHeader>

                      <ReplyContent>{reply.content}</ReplyContent>
                    </ReplyCard>
                  ))}
                </RepliesList>
              )}

              <ReplyForm>
                <Typography variant="h6" sx={{ fontWeight: 850 }}>
                  Add a reply
                </Typography>

                {!isLoggedIn && (
                  <Alert severity="info">
                    Please log in or create an account to join the discussion.
                  </Alert>
                )}

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Write your reply"
                  value={replyContent}
                  disabled={!isLoggedIn || isCreatingReply}
                  slotProps={{
                    htmlInput: {
                      maxLength: 1000,
                    },
                  }}
                  helperText={`${replyContent.length}/1000`}
                  onChange={(event) => setReplyContent(event.target.value)}
                />

                {replyError && <Alert severity="error">{replyError}</Alert>}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    disabled={
                      !isLoggedIn || isCreatingReply || !replyContent.trim()
                    }
                    startIcon={
                      isCreatingReply ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendRoundedIcon />
                      )
                    }
                    onClick={() => void handleCreateReply()}
                  >
                    {isCreatingReply ? "Posting..." : "Post reply"}
                  </Button>
                </Box>
              </ReplyForm>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            color="inherit"
            disabled={
              isCreatingReply || isDeletingPost || deletingReplyId !== null
            }
            onClick={handleCloseDetail}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </PageRoot>
  );
};

export default ForumPage;
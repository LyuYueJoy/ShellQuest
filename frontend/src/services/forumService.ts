import type {
  CreateForumPostRequest,
  CreateForumReplyRequest,
  ForumPostDetail,
  ForumPostSummary,
  ForumReply,
  ToggleForumLikeResponse,
} from "../types/forum";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is not configured. Check your .env file.",
  );
}

// Remove a trailing slash to prevent URLs such as:
// https://localhost:7068//api/forum
const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, "");

const forumApiUrl = `${normalizedApiBaseUrl}/api/forum`;

const getToken = (): string | null => {
  return sessionStorage.getItem("shellQuestToken");
};

const getHeaders = (): HeadersInit => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

const handleResponse = async <T>(
  response: Response,
): Promise<T> => {
  if (!response.ok) {
    let errorMessage = "Something went wrong.";

    try {
      const errorData = (await response.json()) as {
        message?: string;
        title?: string;
        errors?: Record<string, string[]>;
      };

      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        const validationMessages = Object.values(
          errorData.errors,
        ).flat();

        errorMessage =
          validationMessages.join(" ") ||
          errorData.title ||
          errorMessage;
      } else if (errorData.title) {
        errorMessage = errorData.title;
      }
    } catch {
      // Some failed responses may not contain JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

const handleEmptyResponse = async (
  response: Response,
): Promise<void> => {
  if (!response.ok) {
    await handleResponse<never>(response);
  }
};

export const forumService = {
  async getPosts(): Promise<ForumPostSummary[]> {
    const response = await fetch(
      `${forumApiUrl}/posts`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return handleResponse<ForumPostSummary[]>(response);
  },

  async getPost(
    postId: number,
  ): Promise<ForumPostDetail> {
    const response = await fetch(
      `${forumApiUrl}/posts/${postId}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return handleResponse<ForumPostDetail>(response);
  },

  async createPost(
    request: CreateForumPostRequest,
  ): Promise<ForumPostDetail> {
    const response = await fetch(
      `${forumApiUrl}/posts`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(request),
      },
    );

    return handleResponse<ForumPostDetail>(response);
  },

  async deletePost(postId: number): Promise<void> {
    const response = await fetch(
      `${forumApiUrl}/posts/${postId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      },
    );

    await handleEmptyResponse(response);
  },

  async createReply(
    postId: number,
    request: CreateForumReplyRequest,
  ): Promise<ForumReply> {
    const response = await fetch(
      `${forumApiUrl}/posts/${postId}/replies`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(request),
      },
    );

    return handleResponse<ForumReply>(response);
  },

  async deleteReply(replyId: number): Promise<void> {
    const response = await fetch(
      `${forumApiUrl}/replies/${replyId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      },
    );

    await handleEmptyResponse(response);
  },

  async toggleLike(
    postId: number,
  ): Promise<ToggleForumLikeResponse> {
    const response = await fetch(
      `${forumApiUrl}/posts/${postId}/like`,
      {
        method: "POST",
        headers: getHeaders(),
      },
    );

    return handleResponse<ToggleForumLikeResponse>(
      response,
    );
  },
};
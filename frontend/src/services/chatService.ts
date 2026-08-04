import type {
  ChatMessage,
  ChatUser,
} from "../types/chat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://localhost:7215";
const CHAT_API_URL = `${API_BASE_URL}/api/Chat`;
const getToken = (): string => {
  return sessionStorage.getItem("shellQuestToken") ?? "";
};

const getAuthorisationHeaders = (): HeadersInit => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getErrorMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<string> => {
  try {
    const errorData = (await response.json()) as {
      message?: string;
      title?: string;
    };

    return (
      errorData.message ??
      errorData.title ??
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
};

export const getChatUsers = async (): Promise<
  ChatUser[]
> => {
  const response = await fetch(
    `${CHAT_API_URL}/users`,
    {
      method: "GET",
      headers: getAuthorisationHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Unable to load chat users.",
      ),
    );
  }

  return (await response.json()) as ChatUser[];
};

export const getConversation = async (
  otherUserId: number,
): Promise<ChatMessage[]> => {
  const response = await fetch(
    `${CHAT_API_URL}/conversation/${otherUserId}`,
    {
      method: "GET",
      headers: getAuthorisationHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Unable to load the conversation.",
      ),
    );
  }

  return (await response.json()) as ChatMessage[];
};
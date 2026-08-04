import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ChatMessage } from "../types/chat";
import ChatPage from "./ChatPage";

const mocks = vi.hoisted(() => ({
  createChatConnection: vi.fn(),
  startChatConnection: vi.fn(),
  stopChatConnection: vi.fn(),
  sendPrivateMessage: vi.fn(),
  getChatUsers: vi.fn(),
  getConversation: vi.fn(),
}));

vi.mock("../services/chatHubService", () => ({
  createChatConnection: mocks.createChatConnection,
  startChatConnection: mocks.startChatConnection,
  stopChatConnection: mocks.stopChatConnection,
  sendPrivateMessage: mocks.sendPrivateMessage,
}));

vi.mock("../services/chatService", () => ({
  getChatUsers: mocks.getChatUsers,
  getConversation: mocks.getConversation,
}));

const storedCurrentUser = JSON.stringify({
  userId: 7,
  userName: "Current user",
});

const existingMessage: ChatMessage = {
  chatMessageId: 11,
  senderId: 2,
  senderName: "Alice",
  receiverId: 7,
  receiverName: "Current user",
  content: "Hello from Alice",
  sentAt: "2026-08-04T10:30:00Z",
  isRead: false,
};

describe("ChatPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("shellQuestUser", storedCurrentUser);
    mocks.getChatUsers.mockResolvedValue([
      { userId: 2, userName: "Alice" },
      { userId: 9, userName: "Bob" },
    ]);
    mocks.getConversation.mockResolvedValue([existingMessage]);
    mocks.startChatConnection.mockResolvedValue(undefined);
    mocks.stopChatConnection.mockResolvedValue(undefined);
    mocks.sendPrivateMessage.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a login error and does not initialise chat without a user", async () => {
    sessionStorage.clear();

    render(<ChatPage />);

    expect(
      await screen.findByText(
        "Your login information could not be found. Please log in again.",
      ),
    ).toBeInTheDocument();
    expect(mocks.getChatUsers).not.toHaveBeenCalled();
    expect(mocks.createChatConnection).not.toHaveBeenCalled();
  });

  it("loads users, connects, and displays the first conversation", async () => {
    render(<ChatPage />);

    expect(await screen.findByText("Hello from Alice")).toBeInTheDocument();
    expect(mocks.getChatUsers).toHaveBeenCalledOnce();
    expect(mocks.createChatConnection).toHaveBeenCalledOnce();
    expect(mocks.startChatConnection).toHaveBeenCalledOnce();
    expect(mocks.getConversation).toHaveBeenCalledWith(2);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("sends a trimmed message to the selected user", async () => {
    const user = userEvent.setup();
    mocks.getConversation.mockResolvedValue([]);
    render(<ChatPage />);

    const input = await screen.findByPlaceholderText("Message Alice...");
    await user.type(input, "  How are you?  ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mocks.sendPrivateMessage).toHaveBeenCalledWith({
        receiverId: 2,
        content: "How are you?",
      });
    });
    expect(input).toHaveValue("");
  });

  it("adds a relevant real-time message only once", async () => {
    mocks.getConversation.mockResolvedValue([]);
    render(<ChatPage />);

    await screen.findByText("No messages yet");
    const onMessageReceived = mocks.createChatConnection.mock.calls[0][0] as (
      message: ChatMessage,
    ) => void;

    onMessageReceived(existingMessage);
    onMessageReceived(existingMessage);

    expect(await screen.findByText("Hello from Alice")).toBeInTheDocument();
    expect(screen.getAllByText("Hello from Alice")).toHaveLength(1);
  });
});

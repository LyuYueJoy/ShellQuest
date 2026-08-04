import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Alert,
  CircularProgress,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createChatConnection,
  sendPrivateMessage,
  startChatConnection,
  stopChatConnection,
} from "../services/chatHubService";
import {
  getChatUsers,
  getConversation,
} from "../services/chatService";
import type {
  ChatMessage,
  ChatUser,
} from "../types/chat";

import {
  ChatLayout,
  ChatPageRoot,
  ConnectionChip,
  ConversationHeader,
  ConversationPanel,
  MessageArea,
  MessageBubble,
  MessageComposer,
  MessageInput,
  MessageRow,
  MobileSendButton,
  MobileUserSelector,
  SendButton,
  StateContainer,
  UserAvatar,
  UserButton,
  UserList,
  UserPanel,
  UserPanelHeader,
} from "./ChatPage.styles";

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

interface StoredUser {
  userId?: number;
  UserId?: number;
  id?: number;
  userName?: string;
  UserName?: string;
}

const getCurrentUserId = (): number | null => {
  const storedUser = sessionStorage.getItem(
    "shellQuestUser",
  );

  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;

    const userId =
      user.userId ??
      user.UserId ??
      user.id;

    return typeof userId === "number"
      ? userId
      : null;
  } catch {
    return null;
  }
};

const formatMessageTime = (
  sentAt: string,
): string => {
  const date = new Date(sentAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const ChatPage = () => {
  const currentUserId = getCurrentUserId();

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<
    ChatMessage[]
  >([]);
  const [messageText, setMessageText] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [usersLoading, setUsersLoading] =
    useState(true);
  const [messagesLoading, setMessagesLoading] =
    useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  const selectedUserIdRef = useRef<number | null>(
    null,
  );
  const messageAreaRef = useRef<HTMLDivElement | null>(
    null,
  );

  const selectedUser =
    users.find(
      (user) => user.userId === selectedUserId,
    ) ?? null;

  useEffect(() => {
    selectedUserIdRef.current = selectedUserId;
  }, [selectedUserId]);

  const addMessageIfRelevant = useCallback(
    (message: ChatMessage) => {
      const activeUserId = selectedUserIdRef.current;

      if (
        currentUserId === null ||
        activeUserId === null
      ) {
        return;
      }

      const belongsToConversation =
        (message.senderId === currentUserId &&
          message.receiverId === activeUserId) ||
        (message.senderId === activeUserId &&
          message.receiverId === currentUserId);

      if (!belongsToConversation) {
        return;
      }

      setMessages((currentMessages) => {
        const alreadyExists = currentMessages.some(
          (currentMessage) =>
            currentMessage.chatMessageId ===
            message.chatMessageId,
        );

        if (alreadyExists) {
          return currentMessages;
        }

        return [...currentMessages, message];
      });
    },
    [currentUserId],
  );

  useEffect(() => {
    let active = true;

    const initialiseChat = async () => {
      if (currentUserId === null) {
        setError(
          "Your login information could not be found. Please log in again.",
        );
        setUsersLoading(false);
        setConnectionStatus("disconnected");
        return;
      }

      try {
        setError(null);
        setUsersLoading(true);

        const loadedUsers = await getChatUsers();

        if (!active) {
          return;
        }

        setUsers(loadedUsers);

        if (loadedUsers.length > 0) {
          setSelectedUserId((currentSelection) => {
            const selectionStillExists =
              loadedUsers.some(
                (user) =>
                  user.userId === currentSelection,
              );

            return selectionStillExists
              ? currentSelection
              : loadedUsers[0].userId;
          });
        }

        setConnectionStatus("connecting");

        createChatConnection(
          addMessageIfRelevant,
          () => {
            if (active) {
              setConnectionStatus("reconnecting");
            }
          },
          () => {
            if (active) {
              setConnectionStatus("connected");
            }
          },
          () => {
            if (active) {
              setConnectionStatus("disconnected");
            }
          },
        );

        await startChatConnection();

        if (active) {
          setConnectionStatus("connected");
        }
      } catch (chatError) {
        if (!active) {
          return;
        }

        setConnectionStatus("disconnected");
        setError(
          chatError instanceof Error
            ? chatError.message
            : "Unable to start the chat.",
        );
      } finally {
        if (active) {
          setUsersLoading(false);
        }
      }
    };

    void initialiseChat();

    return () => {
      active = false;
      void stopChatConnection();
    };
  }, [addMessageIfRelevant, currentUserId]);

  useEffect(() => {
    let active = true;

    const loadMessages = async () => {
      if (selectedUserId === null) {
        setMessages([]);
        return;
      }

      try {
        setError(null);
        setMessagesLoading(true);

        const conversation =
          await getConversation(selectedUserId);

        if (active) {
          setMessages(conversation);
        }
      } catch (conversationError) {
        if (!active) {
          return;
        }

        setError(
          conversationError instanceof Error
            ? conversationError.message
            : "Unable to load the conversation.",
        );
      } finally {
        if (active) {
          setMessagesLoading(false);
        }
      }
    };

    void loadMessages();

    return () => {
      active = false;
    };
  }, [selectedUserId]);

  useEffect(() => {
    const messageArea = messageAreaRef.current;

    if (messageArea) {
      messageArea.scrollTop =
        messageArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const content = messageText.trim();

    if (
      selectedUserId === null ||
      content.length === 0 ||
      sending ||
      connectionStatus !== "connected"
    ) {
      return;
    }

    try {
      setError(null);
      setSending(true);

      await sendPrivateMessage({
        receiverId: selectedUserId,
        content,
      });

      setMessageText("");
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send the message.",
      );
    } finally {
      setSending(false);
    }
  };

  const getConnectionChip = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          label: "Live",
          color: "success" as const,
        };

      case "connecting":
        return {
          label: "Connecting",
          color: "warning" as const,
        };

      case "reconnecting":
        return {
          label: "Reconnecting",
          color: "warning" as const,
        };

      default:
        return {
          label: "Offline",
          color: "error" as const,
        };
    }
  };

  const connectionChip = getConnectionChip();

  return (
    <ChatPageRoot>
      <ChatLayout elevation={0}>
        <UserPanel>
          <UserPanelHeader>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: 900 }}
            >
              Messages
            </Typography>

            <Typography
              component="p"
              variant="body2"
              color="text.secondary"
            >
              Chat with other tortoise keepers
            </Typography>
          </UserPanelHeader>

          <UserList>
            {usersLoading ? (
              <StateContainer>
                <CircularProgress size={30} />

                <Typography
                  component="p"
                  variant="body2"
                >
                  Loading users...
                </Typography>
              </StateContainer>
            ) : users.length === 0 ? (
              <StateContainer>
                <Typography
                  component="h2"
                  variant="body1"
                  sx={{ fontWeight: 700 }}
                >
                  No other users yet
                </Typography>

                <Typography
                  component="p"
                  variant="body2"
                >
                  Another registered user is needed to
                  start a private chat.
                </Typography>
              </StateContainer>
            ) : (
              users.map((user) => (
                <UserButton
                  key={user.userId}
                  active={
                    selectedUserId === user.userId
                  }
                  onClick={() =>
                    setSelectedUserId(user.userId)
                  }
                >
                  <UserAvatar>
                    {user.userName
                      .charAt(0)
                      .toUpperCase()}
                  </UserAvatar>

                  <Stack sx={{ minWidth: 0 }}>
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ fontWeight: 800 }}
                      noWrap
                    >
                      {user.userName}
                    </Typography>

                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      Private conversation
                    </Typography>
                  </Stack>
                </UserButton>
              ))
            )}
          </UserList>
        </UserPanel>

        <ConversationPanel>
          <ConversationHeader>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", minWidth: 0 }}
            >
              {selectedUser && (
                <UserAvatar>
                  {selectedUser.userName
                    .charAt(0)
                    .toUpperCase()}
                </UserAvatar>
              )}

              <Stack sx={{ minWidth: 0 }}>
                <Typography
                  component="h2"
                  variant="body1"
                  sx={{ fontWeight: 900 }}
                  noWrap
                >
                  {selectedUser?.userName ??
                    "Private Chat"}
                </Typography>

                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  noWrap
                >
                  {selectedUser
                    ? "Messages are saved securely"
                    : "Select someone to begin"}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center" }}
            >
              <MobileUserSelector
                select
                size="small"
                label="Chat with"
                value={selectedUserId ?? ""}
                onChange={(event) => {
                  setSelectedUserId(
                    Number(event.target.value),
                  );
                }}
                disabled={users.length === 0}
              >
                {users.map((user) => (
                  <MenuItem
                    key={user.userId}
                    value={user.userId}
                  >
                    {user.userName}
                  </MenuItem>
                ))}
              </MobileUserSelector>

              <ConnectionChip
                size="small"
                label={connectionChip.label}
                color={connectionChip.color}
              />
            </Stack>
          </ConversationHeader>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ borderRadius: 0 }}
            >
              {error}
            </Alert>
          )}

          <MessageArea ref={messageAreaRef}>
            {selectedUserId === null ? (
              <StateContainer>
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{ fontWeight: 800 }}
                >
                  Select a conversation
                </Typography>

                <Typography
                  component="p"
                  variant="body2"
                >
                  Choose another user to start chatting.
                </Typography>
              </StateContainer>
            ) : messagesLoading ? (
              <StateContainer>
                <CircularProgress size={32} />

                <Typography
                  component="p"
                  variant="body2"
                >
                  Loading messages...
                </Typography>
              </StateContainer>
            ) : messages.length === 0 ? (
              <StateContainer>
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{ fontWeight: 800 }}
                >
                  No messages yet
                </Typography>

                <Typography
                  component="p"
                  variant="body2"
                >
                  Send the first message to{" "}
                  {selectedUser?.userName}.
                </Typography>
              </StateContainer>
            ) : (
              messages.map((message) => {
                const own =
                  message.senderId === currentUserId;

                return (
                  <MessageRow
                    key={message.chatMessageId}
                    own={own}
                  >
                    <MessageBubble own={own}>
                      {!own && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            display: "block",
                            fontWeight: 800,
                            mb: 0.4,
                          }}
                        >
                          {message.senderName}
                        </Typography>
                      )}

                      <Typography
                        component="p"
                        variant="body2"
                        sx={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {message.content}
                      </Typography>

                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          textAlign: "right",
                          opacity: 0.72,
                        }}
                      >
                        {formatMessageTime(
                          message.sentAt,
                        )}
                      </Typography>
                    </MessageBubble>
                  </MessageRow>
                );
              })
            )}
          </MessageArea>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSendMessage();
            }}
            style={{ display: "contents" }}
          >
            <MessageComposer>
              <MessageInput
              multiline
              maxRows={4}
              fullWidth
              placeholder={
                selectedUser
                  ? `Message ${selectedUser.userName}...`
                  : "Select a user first"
              }
              value={messageText}
              disabled={
                selectedUserId === null ||
                connectionStatus !== "connected"
              }
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              onChange={(event) =>
                setMessageText(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
            />

              <SendButton
              type="submit"
              variant="contained"
              endIcon={<SendRoundedIcon />}
              disabled={
                selectedUserId === null ||
                messageText.trim().length === 0 ||
                sending ||
                connectionStatus !== "connected"
              }
            >
              {sending ? "Sending" : "Send"}
            </SendButton>

              <MobileSendButton
              type="submit"
              aria-label="Send message"
              disabled={
                selectedUserId === null ||
                messageText.trim().length === 0 ||
                sending ||
                connectionStatus !== "connected"
              }
            >
              <SendRoundedIcon />
              </MobileSendButton>
            </MessageComposer>
          </form>
        </ConversationPanel>
      </ChatLayout>
    </ChatPageRoot>
  );
};

export default ChatPage;
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

import type {
  ChatMessage,
  SendChatMessage,
} from "../types/chat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://localhost:7215";
const CHAT_HUB_URL = `${API_BASE_URL}/hubs/chat`;
let connection: HubConnection | null = null;

const getToken = (): string => {
  return sessionStorage.getItem("shellQuestToken") ?? "";
};

export const createChatConnection = (
  onMessageReceived: (message: ChatMessage) => void,
  onReconnecting?: () => void,
  onReconnected?: () => void,
  onClosed?: () => void,
): HubConnection => {
  if (connection !== null) {
    connection.off("ReceivePrivateMessage");
    void connection.stop();
  }

  connection = new HubConnectionBuilder()
    .withUrl(`${CHAT_HUB_URL}`, {
      accessTokenFactory: () => getToken(),
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .configureLogging(LogLevel.Information)
    .build();

  connection.on(
    "ReceivePrivateMessage",
    (message: ChatMessage) => {
      onMessageReceived(message);
    },
  );

  connection.onreconnecting(() => {
    onReconnecting?.();
  });

  connection.onreconnected(() => {
    onReconnected?.();
  });

  connection.onclose(() => {
    onClosed?.();
  });

  return connection;
};

export const startChatConnection =
  async (): Promise<void> => {
    if (connection === null) {
      throw new Error(
        "The chat connection has not been created.",
      );
    }

    if (
      connection.state ===
      HubConnectionState.Disconnected
    ) {
      await connection.start();
    }
  };

export const sendPrivateMessage = async (
  message: SendChatMessage,
): Promise<void> => {
  if (
    connection === null ||
    connection.state !== HubConnectionState.Connected
  ) {
    throw new Error(
      "The real-time chat connection is unavailable.",
    );
  }

  await connection.invoke(
    "SendPrivateMessage",
    message,
  );
};

export const stopChatConnection =
  async (): Promise<void> => {
    if (
      connection !== null &&
      connection.state !==
        HubConnectionState.Disconnected
    ) {
      await connection.stop();
    }

    connection = null;
  };
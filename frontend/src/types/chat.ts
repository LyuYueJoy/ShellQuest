export interface ChatUser {
  userId: number;
  userName: string;
}

export interface ChatMessage {
  chatMessageId: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface SendChatMessage {
  receiverId: number;
  content: string;
}
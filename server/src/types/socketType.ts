import { Socket } from "socket.io";

export interface UserPayload {
  id: string;
  email: string;
  username: string;
}

export interface CustomSocket extends Socket {
  user?: UserPayload;
}

export interface AuthenticatedSocket extends Socket {
  user: UserPayload;
}

export interface ServerToClientEvents {
  "message:new": (data: MessageData) => void;
  "message:updated": (data: MessageData) => void;
  "message:deleted": (data: { messageId: string; chatId: string }) => void;
  "message:typing": (data: TypingData) => void;
  "message:stopTyping": (data: TypingData) => void;
  "message:read": (data: MessageReadData) => void;

  "chat:created": (data: ChatData) => void;
  "chat:updated": (data: ChatData) => void;
  "chat:deleted": (data: { chatId: string }) => void;
  "chat:memberAdded": (data: ChatMemberData) => void;
  "chat:memberRemoved": (data: ChatMemberData) => void;

  "user:online": (data: UserPresenceData) => void;
  "user:offline": (data: UserPresenceData) => void;
  "user:profileUpdated": (data: any) => void;

  "notification:new": (data: NotificationData) => void;

  error: (data: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  "auth:join": (data: { token: string }) => void;

  "message:send": (data: SendMessageData) => void;
  "message:edit": (data: EditMessageData) => void;
  "message:delete": (data: { messageId: string }) => void;
  "message:typing": (data: { chatId: string }) => void;
  "message:stopTyping": (data: { chatId: string }) => void;
  "message:markAsRead": (data: { messageId: string; chatId: string }) => void;

  "chat:join": (data: { chatId: string }) => void;
  "chat:leave": (data: { chatId: string }) => void;
  "chat:create": (data: CreateChatData) => void;
  "chat:addMember": (data: { chatId: string; userId: string }) => void;
  "chat:removeMember": (data: { chatId: string; userId: string }) => void;

  "user:updatePresence": (data: { status: "online" | "away" | "busy" }) => void;
}

export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  chatId: string;
  timestamp: Date;
  seenBy: string[];
  editedAt?: Date;
}

export interface TypingData {
  userId: string;
  username: string;
  chatId: string;
}

export interface MessageReadData {
  messageId: string;
  chatId: string;
  userId: string;
  timestamp: Date;
}

export interface ChatData {
  id: string;
  name?: string;
  members: string[];
  lastMessage?: MessageData;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPresenceData {
  userId: string;
  status: "online" | "offline" | "away" | "busy";
  timestamp: Date;
}

export interface SendMessageData {
  chat: string;
  content: string;
  list: string;
  tempId?: string;
}

export interface EditMessageData {
  messageId: string;
  content: string;
}

export interface CreateChatData {
  members: string[];
  name?: string;
  description?: string;
}

export interface ChatMemberData {
  chatId: string;
  userId: string;
  username: string;
}

export interface NotificationData {
  id: string;
  type: "message" | "mention" | "reaction" | "chat_invite" | "friend_request";
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  chatId?: string;
  messageId?: string;
  timestamp: Date;
  read: boolean;
}

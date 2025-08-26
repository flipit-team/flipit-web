import { apiClient, handleApiCall } from '~/lib/api-client';
import { ChatDTO, MessageDTO, CreateChatRequest, SendMessageRequest } from '~/types/api';

export class ChatService {
  // Get user's chats
  static async getUserChats() {
    return handleApiCall(() =>
      apiClient.get<ChatDTO[]>('/v1/chats', { requireAuth: true })
    );
  }

  // Create new chat
  static async createChat(chatData: CreateChatRequest) {
    return handleApiCall(() =>
      apiClient.post<ChatDTO>('/chats/create', chatData, { requireAuth: true })
    );
  }

  // Get chat messages for a specific chat
  static async getChatMessages(chatId: string) {
    return handleApiCall(() =>
      apiClient.get<MessageDTO[]>(`/v1/chats/${chatId}/messages`, { requireAuth: true })
    );
  }

  // Send message in chat conversation
  static async sendMessage(messageData: SendMessageRequest) {
    return handleApiCall(() =>
      apiClient.post<MessageDTO>('/v1/chats/message', messageData, { requireAuth: true })
    );
  }

  // Delete chat
  static async deleteChat(chatId: string) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/v1/chats/${chatId}`, { requireAuth: true })
    );
  }

  // Mark messages as read (if endpoint exists)
  static async markMessagesAsRead(chatId: string) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/chats/${chatId}/read`, {}, { requireAuth: true })
    );
  }

  // Get unread message count (if endpoint exists)
  static async getUnreadCount() {
    return handleApiCall(() =>
      apiClient.get<{ count: number }>('/chats/unread-count', { requireAuth: true })
    );
  }

  // Search chats (if endpoint exists)
  static async searchChats(query: string) {
    return handleApiCall(() =>
      apiClient.get<ChatDTO[]>(`/chats/search?q=${encodeURIComponent(query)}`, { requireAuth: true })
    );
  }
}

export default ChatService;
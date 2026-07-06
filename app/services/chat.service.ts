import { apiClient, handleApiCall } from '~/lib/api-client';
import { ChatDTO, MessageDTO, CreateChatRequest, SendMessageRequest } from '~/types/api';

export class ChatService {
  // Get user's chats
  static async getUserChats() {
    return handleApiCall(() =>
      apiClient.get<any>('/v1/chats', { requireAuth: true })
    );
  }

  // Create new chat
  static async createChat(chatData: CreateChatRequest) {
    return handleApiCall(() =>
      apiClient.post<ChatDTO>('/v1/chats', chatData, { requireAuth: true })
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

}

export default ChatService;
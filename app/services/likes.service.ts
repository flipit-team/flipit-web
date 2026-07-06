import { apiClient, handleApiCall } from '~/lib/api-client';
import { ItemDTO } from '~/types/api';

export class LikesService {
  // Like an item
  static async likeItem(itemId: number) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>(`/v1/likes/items/${itemId}`, {}, { requireAuth: true })
    );
  }

  // Unlike an item
  static async unlikeItem(itemId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/v1/likes/items/${itemId}`, { requireAuth: true })
    );
  }

  // Get user's liked items
  static async getLikedItems() {
    return handleApiCall(() =>
      apiClient.get<ItemDTO[]>('/v1/likes/items', { requireAuth: true })
    );
  }
}

export default LikesService;
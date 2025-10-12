import { apiClient, handleApiCall, buildQueryString } from '~/lib/api-client';
import {
  ItemDTO,
  CreateItemRequest,
  UpdateItemRequest,
  CategoryDTO,
  ItemsQueryParams,
  PaginatedResponse,
  ItemCondition
} from '~/types/api';

export class ItemsService {
  // Get items with filtering and pagination - UPDATED to direct backend
  static async getItems(params?: ItemsQueryParams) {
    const queryString = params ? buildQueryString(params) : '';
    return handleApiCall(() =>
      apiClient.get<PaginatedResponse<ItemDTO>>(`/items${queryString}`)
    );
  }

  // Get item by ID - UPDATED to direct backend
  static async getItemById(itemId: number) {
    return handleApiCall(() =>
      apiClient.get<ItemDTO>(`/items/${itemId}`)
    );
  }

  // Create new item - UPDATED to direct backend
  static async createItem(itemData: CreateItemRequest) {
    return handleApiCall(() =>
      apiClient.post<ItemDTO>('/items', itemData, { requireAuth: true })
    );
  }

  // Update item - CORRECT
  static async updateItem(itemId: number, itemData: UpdateItemRequest) {
    return handleApiCall(() =>
      apiClient.put<ItemDTO>(`/items/${itemId}`, itemData, { requireAuth: true })
    );
  }

  // Delete item - CORRECT
  static async deleteItem(itemId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/items/${itemId}`, { requireAuth: true })
    );
  }

  // Get categories - Use new direct API route
  static async getCategories() {
    return handleApiCall(() =>
      apiClient.get<CategoryDTO[]>('/items/categories')
    );
  }

  // Get item conditions - CORRECT
  static async getItemConditions() {
    return handleApiCall(() =>
      apiClient.get<ItemCondition[]>('/items/itemConditions')
    );
  }

  // Get user's items - UPDATED to direct backend
  static async getUserItems(userId: number) {
    return handleApiCall(() =>
      apiClient.get<ItemDTO[]>(`/items/user/${userId}`, { requireAuth: true })
    );
  }

  // Search items (alternative endpoint if needed)
  static async searchItems(query: string, page = 0, size = 15) {
    const params = { search: query, page, size };
    return this.getItems(params);
  }
}

export default ItemsService;
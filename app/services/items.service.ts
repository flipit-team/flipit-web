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
  // Get items with filtering and pagination
  static async getItems(params?: ItemsQueryParams) {
    const queryString = params ? buildQueryString(params) : '';
    return handleApiCall(() =>
      apiClient.get<PaginatedResponse<ItemDTO>>(`/items/get-items${queryString}`)
    );
  }

  // Get item by ID
  static async getItemById(itemId: number) {
    return handleApiCall(() =>
      apiClient.get<ItemDTO>(`/items/get-item?id=${itemId}`)
    );
  }

  // Create new item
  static async createItem(itemData: CreateItemRequest) {
    return handleApiCall(() =>
      apiClient.post<ItemDTO>('/items/create', itemData, { requireAuth: true })
    );
  }

  // Update item
  static async updateItem(itemId: number, itemData: UpdateItemRequest) {
    return handleApiCall(() =>
      apiClient.put<ItemDTO>(`/items/${itemId}`, itemData, { requireAuth: true })
    );
  }

  // Delete item
  static async deleteItem(itemId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/items/${itemId}`, { requireAuth: true })
    );
  }

  // Get categories
  static async getCategories() {
    return handleApiCall(() =>
      apiClient.get<CategoryDTO[]>('/items/get-categories')
    );
  }

  // Get item conditions
  static async getItemConditions() {
    return handleApiCall(() =>
      apiClient.get<ItemCondition[]>('/items/itemConditions')
    );
  }

  // Get user's items
  static async getUserItems(userId: number) {
    return handleApiCall(() =>
      apiClient.get<ItemDTO[]>(`/items/get-user-items?userId=${userId}`, { requireAuth: true })
    );
  }

  // Search items (alternative endpoint if needed)
  static async searchItems(query: string, page = 0, size = 15) {
    const params = { search: query, page, size };
    return this.getItems(params);
  }
}

export default ItemsService;
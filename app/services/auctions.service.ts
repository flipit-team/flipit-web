import { apiClient, handleApiCall } from '~/lib/api-client';
import { AuctionDTO, CreateAuctionRequest, UpdateAuctionRequest } from '~/types/api';

export class AuctionsService {
  // Create auction
  static async createAuction(auctionData: CreateAuctionRequest) {
    return handleApiCall(() =>
      apiClient.post<AuctionDTO>('/v1/auction', auctionData, { requireAuth: true })
    );
  }

  // Get auction by ID
  static async getAuctionById(auctionId: number) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO>(`/v1/auction/${auctionId}`)
    );
  }

  // Update auction
  static async updateAuction(auctionId: number, auctionData: UpdateAuctionRequest) {
    return handleApiCall(() =>
      apiClient.put<AuctionDTO>(`/v1/auction/${auctionId}`, auctionData, { requireAuth: true })
    );
  }

  // Delete auction
  static async deleteAuction(auctionId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/v1/auction/${auctionId}`, { requireAuth: true })
    );
  }

  // Get all auctions (if endpoint exists)
  static async getAuctions(page = 0, size = 15) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/v1/auction?page=${page}&size=${size}`)
    );
  }

  // Get user's auctions (if endpoint exists)
  static async getUserAuctions(userId: number) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/v1/auction/user/${userId}`, { requireAuth: true })
    );
  }

  // Get active auctions with filters
  static async getActiveAuctions(params?: {
    page?: number;
    size?: number;
    category?: string;
    subcategory?: string;
    stateCode?: string;
    lgaCode?: string;
    minAmount?: number;
    maxAmount?: number;
    isVerifiedSeller?: boolean;
    hasDiscount?: boolean;
    sort?: string;
    search?: string;
  }) {
    const {
      page = 0,
      size = 15,
      category,
      subcategory,
      stateCode,
      lgaCode,
      minAmount,
      maxAmount,
      isVerifiedSeller,
      hasDiscount,
      sort,
      search
    } = params || {};

    const queryParams = new URLSearchParams();
    queryParams.set('page', page.toString());
    queryParams.set('size', size.toString());

    if (category) queryParams.set('category', category);
    if (subcategory) queryParams.set('subcategory', subcategory);
    if (stateCode) queryParams.set('stateCode', stateCode);
    if (lgaCode) queryParams.set('lgaCode', lgaCode);
    if (minAmount !== undefined) queryParams.set('minAmount', minAmount.toString());
    if (maxAmount !== undefined) queryParams.set('maxAmount', maxAmount.toString());
    if (isVerifiedSeller) queryParams.set('isVerifiedSeller', 'true');
    if (hasDiscount) queryParams.set('hasDiscount', 'true');
    if (sort) queryParams.set('sort', sort);
    if (search) queryParams.set('search', search);

    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/v1/auction?${queryParams.toString()}`)
    );
  }

  // Reactivate deactivated auction
  static async reactivateAuction(auctionId: number) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/v1/auction/${auctionId}/reactivate`, {}, { requireAuth: true })
    );
  }

  // Deactivate active auction
  static async deactivateAuction(auctionId: number) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/v1/auction/${auctionId}/deactivate`, {}, { requireAuth: true })
    );
  }
}

export default AuctionsService;
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

  // Get active auctions (if endpoint exists)
  static async getActiveAuctions(page = 0, size = 15) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/v1/auction/active?page=${page}&size=${size}`)
    );
  }
}

export default AuctionsService;
import { apiClient, handleApiCall } from '~/lib/api-client';
import { AuctionDTO, CreateAuctionRequest, UpdateAuctionRequest } from '~/types/api';

export class AuctionsService {
  // Create auction
  static async createAuction(auctionData: CreateAuctionRequest) {
    return handleApiCall(() =>
      apiClient.post<AuctionDTO>('/auction', auctionData, { requireAuth: true })
    );
  }

  // Get auction by ID
  static async getAuctionById(auctionId: number) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO>(`/auction/${auctionId}`)
    );
  }

  // Update auction
  static async updateAuction(auctionId: number, auctionData: UpdateAuctionRequest) {
    return handleApiCall(() =>
      apiClient.put<AuctionDTO>(`/auction/${auctionId}`, auctionData, { requireAuth: true })
    );
  }

  // Delete auction
  static async deleteAuction(auctionId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/auction/${auctionId}`, { requireAuth: true })
    );
  }

  // Get all auctions (if endpoint exists)
  static async getAuctions(page = 0, size = 15) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/auction?page=${page}&size=${size}`)
    );
  }

  // Get user's auctions (if endpoint exists)
  static async getUserAuctions(userId: number) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/auction/user/${userId}`, { requireAuth: true })
    );
  }

  // Get active auctions (if endpoint exists)
  static async getActiveAuctions(page = 0, size = 15) {
    return handleApiCall(() =>
      apiClient.get<AuctionDTO[]>(`/auction/active?page=${page}&size=${size}`)
    );
  }
}

export default AuctionsService;
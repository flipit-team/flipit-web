import { apiClient, handleApiCall } from '~/lib/api-client';
import { BidDTO, CreateBidRequest } from '~/types/api';

export class BiddingService {
  // Place a bid
  static async placeBid(bidData: CreateBidRequest) {
    return handleApiCall(() =>
      apiClient.post<BidDTO>('/bids/create', bidData, { requireAuth: true })
    );
  }

  // Get bids for an auction
  static async getAuctionBids(auctionId: number) {
    return handleApiCall(() =>
      apiClient.get<BidDTO[]>(`/bidding/auction/${auctionId}`)
    );
  }

  // Get user's bids
  static async getUserBids(userId: number) {
    return handleApiCall(() =>
      apiClient.get<BidDTO[]>(`/bids/get-user-bids?userId=${userId}`, { requireAuth: true })
    );
  }

  // Get current user's bids
  static async getCurrentUserBids() {
    return handleApiCall(() =>
      apiClient.get<BidDTO[]>('/bids/get-user-bids', { requireAuth: true })
    );
  }

  // Get highest bid for auction (if endpoint exists)
  static async getHighestBid(auctionId: number) {
    return handleApiCall(() =>
      apiClient.get<BidDTO>(`/bidding/auction/${auctionId}/highest`)
    );
  }

  // Get bid history for auction (if endpoint exists)
  static async getBidHistory(auctionId: number) {
    return handleApiCall(() =>
      apiClient.get<BidDTO[]>(`/bidding/auction/${auctionId}/history`)
    );
  }
}

export default BiddingService;
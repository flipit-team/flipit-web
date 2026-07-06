import { apiClient, handleApiCall } from '~/lib/api-client';
import { BidDTO, CreateBidRequest } from '~/types/api';

export class BiddingService {
  // Place a bid
  static async placeBid(bidData: CreateBidRequest) {
    return handleApiCall(() =>
      apiClient.post<BidDTO>('/v1/bidding', bidData, { requireAuth: true })
    );
  }

  // Get bids for an auction
  static async getAuctionBids(auctionId: number) {
    return handleApiCall(() =>
      apiClient.get<BidDTO[]>(`/v1/bidding/auction/${auctionId}`)
    );
  }

}

export default BiddingService;
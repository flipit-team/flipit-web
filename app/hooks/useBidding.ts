'use client';

import { useCallback, useEffect } from 'react';
import { BiddingService } from '~/services/bidding.service';
import { BidDTO, CreateBidRequest } from '~/types/api';
import useApi from './useApi';

export function useBidding() {
  const { data, loading, error, execute } = useApi<BidDTO>();

  const placeBid = useCallback(async (bidData: CreateBidRequest) => {
    return execute(() => BiddingService.placeBid(bidData));
  }, [execute]);

  return {
    bid: data,
    loading,
    error,
    placeBid,
  };
}

export function useAuctionBids(auctionId: number | null) {
  const { data: bids, loading, error, execute } = useApi<BidDTO[]>();

  const fetchBids = useCallback(async () => {
    if (!auctionId) return;
    return execute(() => BiddingService.getAuctionBids(auctionId));
  }, [auctionId, execute]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return {
    bids: bids || [],
    loading,
    error,
    refetch: fetchBids,
  };
}

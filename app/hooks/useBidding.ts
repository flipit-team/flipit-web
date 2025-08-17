'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function useUserBids(userId?: number, disabled?: boolean) {
  const { data: bids, loading, error, execute } = useApi<BidDTO[]>();

  const fetchUserBids = useCallback(async () => {
    if (disabled) return;
    
    if (userId) {
      return execute(() => BiddingService.getUserBids(userId));
    } else {
      return execute(() => BiddingService.getCurrentUserBids());
    }
  }, [userId, execute, disabled]);

  useEffect(() => {
    if (!disabled) {
      fetchUserBids();
    }
  }, [fetchUserBids, disabled]);

  const refetch = useCallback(() => {
    return fetchUserBids();
  }, [fetchUserBids]);

  return {
    bids: bids || [],
    loading,
    error,
    refetch,
  };
}

export function useBidHistory(auctionId: number | null) {
  const { data: bidHistory, loading, error, execute } = useApi<BidDTO[]>();

  const fetchBidHistory = useCallback(async () => {
    if (!auctionId) return;
    return execute(() => BiddingService.getBidHistory(auctionId));
  }, [auctionId, execute]);

  useEffect(() => {
    fetchBidHistory();
  }, [fetchBidHistory]);

  return {
    bidHistory: bidHistory || [],
    loading,
    error,
    refetch: fetchBidHistory,
  };
}

export function useHighestBid(auctionId: number | null) {
  const { data: highestBid, loading, error, execute } = useApi<BidDTO>();

  const fetchHighestBid = useCallback(async () => {
    if (!auctionId) return;
    return execute(() => BiddingService.getHighestBid(auctionId));
  }, [auctionId, execute]);

  useEffect(() => {
    fetchHighestBid();
  }, [fetchHighestBid]);

  return {
    highestBid,
    loading,
    error,
    refetch: fetchHighestBid,
  };
}
'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import HomeService from '~/services/home.service';
import { NotificationDTO } from '~/types/api';
import { useAppContext } from './AppContext';

interface UnreadCounts {
  messagesCount: number;
  notificationsCount: number;
  auctionsCount: number;
  biddingCount: number;
  topNotifications: NotificationDTO[];
}

interface UnreadCountContextType {
  counts: UnreadCounts;
  decrementMessageCount: (amount?: number) => void;
  decrementNotificationCount: (amount?: number) => void;
  refreshCounts: () => Promise<void>;
  setCounts: (counts: Partial<UnreadCounts>) => void;
}

const UnreadCountContext = createContext<UnreadCountContextType | undefined>(undefined);

export const UnreadCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  const [counts, setCounts] = useState<UnreadCounts>({
    messagesCount: 0,
    notificationsCount: 0,
    auctionsCount: 0,
    biddingCount: 0,
    topNotifications: [],
  });

  const refreshCounts = useCallback(async () => {
    if (!user) return;
    try {
      const result = await HomeService.getTopNavCounters();
      if (result.data) {
        setCounts({
          messagesCount: result.data.messagesCount || 0,
          notificationsCount: result.data.notificationsCount || 0,
          auctionsCount: result.data.auctionsCount || 0,
          biddingCount: result.data.biddingCount || 0,
          topNotifications: result.data.topNotifications || [],
        });
      }
    } catch (error) {
      console.error('Failed to refresh counts:', error);
    }
  }, [user]);

  const decrementMessageCount = useCallback((amount: number = 1) => {
    setCounts(prev => ({
      ...prev,
      messagesCount: Math.max(0, prev.messagesCount - amount),
    }));
  }, []);

  const decrementNotificationCount = useCallback((amount: number = 1) => {
    setCounts(prev => ({
      ...prev,
      notificationsCount: Math.max(0, prev.notificationsCount - amount),
    }));
  }, []);

  const updateCounts = useCallback((newCounts: Partial<UnreadCounts>) => {
    setCounts(prev => ({ ...prev, ...newCounts }));
  }, []);

  // Initial fetch and polling — only when logged in
  useEffect(() => {
    if (!user) return;

    refreshCounts();

    const interval = setInterval(refreshCounts, 30000);

    return () => clearInterval(interval);
  }, [user, refreshCounts]);

  const value = useMemo(() => ({
    counts,
    decrementMessageCount,
    decrementNotificationCount,
    refreshCounts,
    setCounts: updateCounts,
  }), [counts, decrementMessageCount, decrementNotificationCount, refreshCounts, updateCounts]);

  return (
    <UnreadCountContext.Provider value={value}>
      {children}
    </UnreadCountContext.Provider>
  );
};

export const useUnreadCount = () => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error('useUnreadCount must be used within UnreadCountProvider');
  }
  return context;
};

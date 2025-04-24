'use client';

import useSWR from 'swr';
import {Chat, Message} from '~/utils/interface';

const fetcher = async (url: string) => {
    const res = await fetch(url, {cache: 'no-store'});

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.apierror?.message || 'Failed to fetch messages');
    }

    return res.json();
};

export function useChatMessages(chatId?: string | null) {
    const {data, error, isLoading} = useSWR(chatId ? `/api/chats/get-chat?chatId=${chatId}` : null, fetcher, {
        refreshInterval: 5000 // ⏱ Poll every 5 seconds
    });

    return {
        messages: data as Message[],
        isLoading,
        error
    };
}

export function useUserMessages(userId?: string | null) {
    const {data, error, isLoading} = useSWR(userId ? `/api/chats/get-user-chats?userId=${userId}` : null, fetcher, {
        refreshInterval: 5000 // ⏱ Poll every 5 seconds
    });

    return {
        messages: data as Chat[],
        isLoading,
        error
    };
}

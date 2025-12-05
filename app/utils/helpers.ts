import {formatDistanceToNow} from 'date-fns';
import {ApiError, ErrorResponse} from './interface';

export const fetcher = async (url: string, {arg}: {arg: any}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(arg)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }
    return res.json();
};

export const fetcherGET = (url: string) => fetch(url).then((res) => res.json());

export function formatToNaira(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

export function timeAgo(date?: Date | string): string {
    if (date) {
        return `Posted ${formatDistanceToNow(new Date(date), {addSuffix: false})} ago`;
    } else {
        return '';
    }
}

export function formatTimeTo12Hour(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const hours = d.getHours();
    const minutes = d.getMinutes();

    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${hour12}:${paddedMinutes}${ampm}`;
}

export function formatMessageTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();

    // Reset time to midnight for date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get time in 12-hour format
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const timeStr = `${hour12}:${paddedMinutes}${ampm}`;

    // Determine date prefix
    if (messageDate.getTime() === today.getTime()) {
        return `Today ${timeStr}`;
    } else if (messageDate.getTime() === yesterday.getTime()) {
        return `Yesterday ${timeStr}`;
    } else {
        // For older messages, show date
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const year = d.getFullYear() !== now.getFullYear() ? ` ${d.getFullYear()}` : '';
        return `${month} ${day}${year} ${timeStr}`;
    }
}

export async function sendMessage(chatId: string, message: string) {
    const res = await fetch('/api/v1/chats/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chatId, message}) // Changed from 'content' to 'message'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.details || error.message || 'Failed to send message');
    }

    return res.json();
}

// Transform ChatWithUnreadCountDTO to Chat
export function transformChatsResponse(response: import('./interface').ChatsResponse): {buyer: import('./interface').Chat[]; seller: import('./interface').Chat[]} {
    const transformChat = (dto: import('./interface').ChatWithUnreadCountDTO): import('./interface').Chat => ({
        chatId: dto.chat.chatId,
        title: dto.chat.title,
        initiatorId: dto.chat.initiatorId,
        receiverId: dto.chat.receiverId,
        initiatorAvatar: dto.chat.initiatorAvatar,
        receiverAvatar: dto.chat.receiverAvatar,
        initiatorName: dto.chat.initiatorName,
        receiverName: dto.chat.receiverName,
        dateCreated: new Date(dto.chat.dateCreated),
        unreadCount: dto.unreadCount
    });

    return {
        buyer: response.buyer.map(transformChat),
        seller: response.seller.map(transformChat)
    };
}

export async function createMessage(receiverId: string, title: string, itemId: string) {
    const res = await fetch('/api/chats/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({receiverId: Number(receiverId), title, itemId: Number(itemId)})
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.details || 'Failed to send message');
    }

    return res.json();
}

export function formatToMonthDay(dateInput: Date | string) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const options: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
}

export function handleApiError(response: ErrorResponse) {
    try {
        const parsedDetails: {apierror: ApiError} = JSON.parse(response.details);
        return parsedDetails.apierror.message;
    } catch {
        return 'An unexpected error occurred.';
    }
}

import {formatDistanceToNow} from 'date-fns';

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

export async function sendMessage(chatId: string, message: string) {
    const res = await fetch('/api/chats/send-chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chatId, message})
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.details || 'Failed to send message');
    }

    return res.json();
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

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

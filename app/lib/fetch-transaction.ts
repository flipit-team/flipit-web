import {TransactionDTO} from '~/types/transaction';
import {API_BASE_PATH} from '~/lib/config';

/**
 * Fetches a transaction by ID and enriches item image URLs.
 * Workaround for backend bug #7: TransactionDTO returns unsigned image URLs.
 * Remove item fetch once backend signs URLs in transaction response.
 */
export async function fetchTransaction(id: string, token: string): Promise<TransactionDTO | null> {
    try {
        const response = await fetch(`${API_BASE_PATH}/transactions/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) return null;
        const tx = await response.json();

        if (tx.item?.id) {
            try {
                const itemRes = await fetch(`${API_BASE_PATH}/items/${tx.item.id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                    cache: 'no-store',
                });
                if (itemRes.ok) {
                    const itemData = await itemRes.json();
                    tx.item = {...tx.item, ...itemData};
                }
            } catch {}
        }

        return tx;
    } catch {
        return null;
    }
}

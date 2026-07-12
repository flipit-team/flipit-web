/**
 * In-memory mock store for development.
 * Simulates backend state — mutations persist for the duration of the dev server session.
 * Supports any buyer/seller pair: pre-seeded transactions for test users 11/12,
 * dynamically created transactions for all other user combinations.
 * To use real backend: set USE_MOCK_API=false in .env.local
 */

import { TransactionDTO, TransactionStatus, TransactionType } from '~/types/transaction';
import { UserDTO } from '~/types/api';

export const USE_MOCK = process.env.USE_MOCK_API === 'true';

const mockUser = (id: number, first: string, last: string): UserDTO => ({
    id,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}@flipit.ng`,
    phoneNumber: '08012345678',
    avatar: undefined,
    avgRating: 4.5,
    reviewCount: 12,
    status: 'Registered',
    phoneNumberVerified: true,
    dateCreated: new Date().toISOString(),
    dateVerified: '',
});

// Test accounts on api.flipit.ng
const testBuyer  = mockUser(11, 'Test', 'Buyer');   // testbuyer@flipit.ng
const testSeller = mockUser(12, 'Test', 'Seller');  // testseller@flipit.ng

function makeTx(id: number, buyerUser: UserDTO, sellerUser: UserDTO, type: TransactionType, status: TransactionStatus): TransactionDTO {
    return {
        id,
        buyer: buyerUser,
        seller: sellerUser,
        amount: 420000,
        status,
        type,
        description: 'iPad Pro 11 inch 2022',
        reference: `FLPT-${id}`,
        transactionDate: new Date().toISOString(),
    };
}

// Pre-seeded transactions for test users — backward compat shortcuts:
//   ID 1: user 11 = buyer,  user 12 = seller, PENDING  (buyer pays first)
//   ID 2: user 12 = buyer,  user 11 = seller, SUCCESS  (quick-start seller shipping flow)
const seededTransactions: Record<number, TransactionDTO> = {
    1: makeTx(1, testBuyer,  testSeller, 'CASH_ONLY', 'PENDING'),
    2: makeTx(2, testSeller, testBuyer,  'CASH_ONLY', 'SUCCESS'),
};

// Dynamic transactions for any other user combinations (auto-created at runtime)
let nextTxId = 100;
const dynamicTransactions: Record<number, TransactionDTO> = {};

// Build a minimal user stub for unknown IDs — real name/avatar will come from auth context on the FE
function stubUser(id: number): UserDTO {
    return mockUser(id, `User`, `${id}`);
}

function resolveUser(id: number): UserDTO {
    if (id === 11) return testBuyer;
    if (id === 12) return testSeller;
    return stubUser(id);
}

function allTxs(): Record<number, TransactionDTO> {
    return { ...seededTransactions, ...dynamicTransactions };
}

export function getTransaction(id: number): TransactionDTO | null {
    return allTxs()[id] ?? null;
}

export function updateTransactionStatus(id: number, status: TransactionStatus): TransactionDTO | null {
    const all = allTxs();
    const tx = all[id];
    if (!tx) return null;
    tx.status = status;
    return { ...tx };
}

export function createTransaction(body: {
    buyerId: number;
    sellerId: number;
    type: TransactionType;
    amount?: number;
    description?: string;
}): TransactionDTO {
    // --- Pre-seeded shortcuts for test accounts ---
    if (body.buyerId === 11 && body.sellerId === 12) {
        const tx = seededTransactions[1];
        tx.type = body.type;
        if (body.amount !== undefined) tx.amount = body.amount;
        if (body.description) tx.description = body.description;
        return { ...tx };
    }
    if (body.buyerId === 12 && body.sellerId === 11) {
        const tx = seededTransactions[2];
        tx.type = body.type;
        if (body.amount !== undefined) tx.amount = body.amount;
        if (body.description) tx.description = body.description;
        return { ...tx };
    }

    // --- Dynamic: find or create a transaction for this buyer/seller pair ---
    const existing = Object.values(dynamicTransactions).find(
        tx => tx.buyer.id === body.buyerId && tx.seller.id === body.sellerId
    );
    if (existing) {
        existing.type = body.type;
        if (body.amount !== undefined) existing.amount = body.amount;
        if (body.description) existing.description = body.description;
        return { ...existing };
    }

    const id = nextTxId++;
    const tx: TransactionDTO = {
        id,
        buyer: resolveUser(body.buyerId),
        seller: resolveUser(body.sellerId),
        amount: body.amount ?? 0,
        status: 'PENDING',
        type: body.type,
        description: body.description || 'Item',
        reference: `FLPT-${id}`,
        transactionDate: new Date().toISOString(),
    };
    dynamicTransactions[id] = tx;
    return { ...tx };
}

import { ItemDTO, UserDTO } from './api';

// Transaction Types — matches backend enum
export type TransactionType = 'SWAP' | 'CASH_ONLY' | 'SWAP_WITH_CASH';

// Transaction Status — matches backend enum exactly
export type TransactionStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'SHIPPED'    // NEW: seller has shipped the item, in transit
  | 'DELIVERED'  // item arrived at buyer, pending confirmation
  | 'ARRIVED'    // legacy/mock alias for DELIVERED
  | 'VERIFIED'
  | 'COMPLETED'
  | 'RELEASED';

// Main Transaction DTO — matches API response exactly
export interface TransactionDTO {
  id: number;
  orderId?: number;
  buyer: UserDTO;
  seller: UserDTO;
  item?: ItemDTO;           // NEW: the primary item in the transaction
  offeredItem?: ItemDTO;    // NEW: the buyer's offered item (SWAP / SWAP_WITH_CASH)
  amount?: number;
  platformFee?: number;     // NEW: platform fee deducted from amount
  sellerPayout?: number;    // NEW: amount seller actually receives
  reference?: string;
  transactionDate?: string;
  status: TransactionStatus;
  type: TransactionType;
  paymentMethod?: string;
  description?: string;
}

// Create Transaction Request — matches POST /api/v1/transactions
export interface CreateTransactionRequest {
  orderId?: number;
  buyerId: number;
  sellerId: number;
  amount?: number;
  type: TransactionType;
  paymentMethod?: string;
  description?: string;
}

// Transaction Filter Options
export interface TransactionFilterOptions {
  status?: TransactionStatus;
  type?: TransactionType;
  page?: number;
  size?: number;
}

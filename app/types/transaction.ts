import { UserDTO, ItemDTO } from './api';

// Transaction Types
export type TransactionType = 'ITEM_EXCHANGE' | 'ITEM_PLUS_CASH' | 'CASH_ONLY' | 'AUCTION_WIN';

// Transaction Status Enum
export type TransactionStatus =
  | 'OFFER_ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'SHIPPING_PENDING'
  | 'SELLER_SHIPPED'
  | 'BUYER_SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'REVIEW_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

// Shipping Status
export type ShippingStatus =
  | 'NOT_STARTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED';

// Payment Status
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'IN_ESCROW';

// Shipping Details Interface
export interface ShippingDetails {
  id: number;
  transactionId: number;
  waybillNumber?: string;
  courierName: string;
  trackingUrl?: string;
  status: ShippingStatus;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  pickupDate?: string;
  deliveryDate?: string;
  estimatedDelivery?: string;
  notes?: string;
  dateCreated: string;
  dateUpdated: string;
}

// Payment Details Interface
export interface PaymentDetails {
  id: number;
  transactionId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  paymentReference?: string;
  paymentGateway?: string;
  paidBy?: UserDTO;
  paidTo?: UserDTO;
  escrowReleased: boolean;
  dateInitiated: string;
  dateCompleted?: string;
  dateFailed?: string;
}

// Transaction Timeline Event
export interface TransactionTimelineEvent {
  id: number;
  transactionId: number;
  status: TransactionStatus;
  title: string;
  description?: string;
  actor?: UserDTO;
  metadata?: Record<string, any>;
  dateCreated: string;
}

// Main Transaction DTO
export interface TransactionDTO {
  id: number;
  transactionType: TransactionType;
  status: TransactionStatus;

  // Parties involved
  seller: UserDTO;
  buyer: UserDTO;

  // Items involved
  sellerItem: ItemDTO;
  buyerItem?: ItemDTO; // Optional for exchanges

  // Financial details
  cashAmount?: number;
  totalValue: number;

  // Related entities
  offerId?: number;
  bidId?: number;
  auctionId?: number;

  // Shipping details
  sellerShipping?: ShippingDetails;
  buyerShipping?: ShippingDetails;

  // Payment details
  payment?: PaymentDetails;

  // Timeline
  timeline: TransactionTimelineEvent[];

  // Reviews
  sellerReviewId?: number;
  buyerReviewId?: number;

  // Metadata
  notes?: string;
  cancellationReason?: string;
  disputeReason?: string;

  // Timestamps
  dateCreated: string;
  dateUpdated: string;
  dateCompleted?: string;
  dateCancelled?: string;
}

// Create Transaction Request
export interface CreateTransactionRequest {
  transactionType: TransactionType;
  sellerId: number;
  buyerId: number;
  sellerItemId: number;
  buyerItemId?: number;
  cashAmount?: number;
  offerId?: number;
  bidId?: number;
  auctionId?: number;
}

// Update Transaction Status Request
export interface UpdateTransactionStatusRequest {
  status: TransactionStatus;
  notes?: string;
  metadata?: Record<string, any>;
}

// Create Shipping Request
export interface CreateShippingRequest {
  transactionId: number;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  pickupDate?: string;
  notes?: string;
}

// Update Shipping Request
export interface UpdateShippingRequest {
  waybillNumber?: string;
  status?: ShippingStatus;
  trackingUrl?: string;
  pickupDate?: string;
  deliveryDate?: string;
  estimatedDelivery?: string;
  notes?: string;
}

// Initialize Payment Request
export interface InitializePaymentRequest {
  transactionId: number;
  amount: number;
  paymentMethod: string;
  callbackUrl?: string;
}

// Verify Payment Request
export interface VerifyPaymentRequest {
  transactionId: number;
  paymentReference: string;
}

// Transaction Statistics (for user dashboard)
export interface TransactionStats {
  totalTransactions: number;
  completedTransactions: number;
  activeTransactions: number;
  totalValue: number;
  averageRating: number;
}

// Transaction Filter Options
export interface TransactionFilterOptions {
  status?: TransactionStatus;
  transactionType?: TransactionType;
  userId?: number;
  startDate?: string;
  endDate?: string;
  minValue?: number;
  maxValue?: number;
}

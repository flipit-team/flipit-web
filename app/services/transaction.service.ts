import { apiClient, handleApiCall } from '~/lib/api-client';
import {
  TransactionDTO,
  CreateTransactionRequest,
  UpdateTransactionStatusRequest,
  CreateShippingRequest,
  UpdateShippingRequest,
  InitializePaymentRequest,
  VerifyPaymentRequest,
  TransactionStats,
  TransactionFilterOptions,
  ShippingDetails,
  PaymentDetails
} from '~/types/transaction';

export class TransactionService {
  // ===== Transaction Management =====

  // Create a new transaction
  static async createTransaction(data: CreateTransactionRequest) {
    return handleApiCall(() =>
      apiClient.post<TransactionDTO>('/v1/transactions', data, { requireAuth: true })
    );
  }

  // Get transaction by ID
  static async getTransactionById(transactionId: number) {
    return handleApiCall(() =>
      apiClient.get<TransactionDTO>(`/v1/transactions/${transactionId}`, { requireAuth: true })
    );
  }

  // Get user's transactions
  static async getUserTransactions(userId: number, filters?: TransactionFilterOptions) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = `/v1/transactions/user/${userId}${queryString ? `?${queryString}` : ''}`;

    return handleApiCall(() =>
      apiClient.get<TransactionDTO[]>(url, { requireAuth: true })
    );
  }

  // Get current user's transactions
  static async getMyTransactions(filters?: TransactionFilterOptions) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = `/v1/transactions/me${queryString ? `?${queryString}` : ''}`;

    return handleApiCall(() =>
      apiClient.get<TransactionDTO[]>(url, { requireAuth: true })
    );
  }

  // Update transaction status
  static async updateTransactionStatus(
    transactionId: number,
    data: UpdateTransactionStatusRequest
  ) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/status`,
        data,
        { requireAuth: true }
      )
    );
  }

  // Cancel transaction
  static async cancelTransaction(transactionId: number, reason?: string) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/cancel`,
        { reason },
        { requireAuth: true }
      )
    );
  }

  // Mark transaction as completed
  static async completeTransaction(transactionId: number) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/complete`,
        {},
        { requireAuth: true }
      )
    );
  }

  // Get transaction statistics
  static async getTransactionStats(userId?: number) {
    const url = userId ? `/v1/transactions/stats/${userId}` : '/v1/transactions/stats/me';
    return handleApiCall(() =>
      apiClient.get<TransactionStats>(url, { requireAuth: true })
    );
  }

  // ===== Shipping Management =====

  // Create shipping details
  static async createShipping(data: CreateShippingRequest) {
    return handleApiCall(() =>
      apiClient.post<ShippingDetails>('/v1/transactions/shipping', data, { requireAuth: true })
    );
  }

  // Update shipping details
  static async updateShipping(shippingId: number, data: UpdateShippingRequest) {
    return handleApiCall(() =>
      apiClient.put<ShippingDetails>(
        `/v1/transactions/shipping/${shippingId}`,
        data,
        { requireAuth: true }
      )
    );
  }

  // Get shipping details
  static async getShippingDetails(shippingId: number) {
    return handleApiCall(() =>
      apiClient.get<ShippingDetails>(`/v1/transactions/shipping/${shippingId}`, { requireAuth: true })
    );
  }

  // Schedule pickup with GIG Logistics
  static async schedulePickup(shippingId: number, pickupDate: string) {
    return handleApiCall(() =>
      apiClient.post<ShippingDetails>(
        `/v1/transactions/shipping/${shippingId}/schedule-pickup`,
        { pickupDate },
        { requireAuth: true }
      )
    );
  }

  // Track shipment
  static async trackShipment(waybillNumber: string) {
    return handleApiCall(() =>
      apiClient.get<any>(`/v1/transactions/shipping/track/${waybillNumber}`, { requireAuth: true })
    );
  }

  // Confirm delivery
  static async confirmDelivery(transactionId: number, shippingId: number) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/confirm-delivery`,
        { shippingId },
        { requireAuth: true }
      )
    );
  }

  // ===== Payment Management =====

  // Initialize payment
  static async initializePayment(data: InitializePaymentRequest) {
    return handleApiCall(() =>
      apiClient.post<PaymentDetails>('/v1/transactions/payment/initialize', data, { requireAuth: true })
    );
  }

  // Verify payment
  static async verifyPayment(data: VerifyPaymentRequest) {
    return handleApiCall(() =>
      apiClient.post<PaymentDetails>('/v1/transactions/payment/verify', data, { requireAuth: true })
    );
  }

  // Get payment details
  static async getPaymentDetails(paymentId: number) {
    return handleApiCall(() =>
      apiClient.get<PaymentDetails>(`/v1/transactions/payment/${paymentId}`, { requireAuth: true })
    );
  }

  // Release escrow
  static async releaseEscrow(transactionId: number) {
    return handleApiCall(() =>
      apiClient.put<PaymentDetails>(
        `/v1/transactions/${transactionId}/release-escrow`,
        {},
        { requireAuth: true }
      )
    );
  }

  // Request refund
  static async requestRefund(transactionId: number, reason: string) {
    return handleApiCall(() =>
      apiClient.post<PaymentDetails>(
        `/v1/transactions/${transactionId}/refund`,
        { reason },
        { requireAuth: true }
      )
    );
  }

  // ===== Helper Methods =====

  // Check if user can perform action on transaction
  static canUserPerformAction(transaction: TransactionDTO, userId: number, action: string): boolean {
    const isSeller = transaction.seller.id === userId;
    const isBuyer = transaction.buyer.id === userId;

    switch (action) {
      case 'cancel':
        return (isSeller || isBuyer) && ['OFFER_ACCEPTED', 'PAYMENT_PENDING'].includes(transaction.status);
      case 'pay':
        return isBuyer && transaction.status === 'PAYMENT_PENDING';
      case 'ship':
        return isSeller && ['PAYMENT_RECEIVED', 'SHIPPING_PENDING'].includes(transaction.status);
      case 'confirm_delivery':
        return isBuyer && transaction.status === 'DELIVERED';
      case 'review':
        return (isSeller || isBuyer) && transaction.status === 'REVIEW_PENDING';
      default:
        return false;
    }
  }

  // Get user role in transaction
  static getUserRole(transaction: TransactionDTO, userId: number): 'seller' | 'buyer' | null {
    if (transaction.seller.id === userId) return 'seller';
    if (transaction.buyer.id === userId) return 'buyer';
    return null;
  }

  // Get next action for user
  static getNextAction(transaction: TransactionDTO, userId: number): string | null {
    const role = this.getUserRole(transaction, userId);
    if (!role) return null;

    switch (transaction.status) {
      case 'OFFER_ACCEPTED':
      case 'PAYMENT_PENDING':
        return role === 'buyer' ? 'Make Payment' : 'Waiting for Payment';
      case 'PAYMENT_RECEIVED':
      case 'SHIPPING_PENDING':
        return role === 'seller' ? 'Ship Item' : 'Waiting for Shipment';
      case 'SELLER_SHIPPED':
        return role === 'buyer' && transaction.transactionType === 'ITEM_EXCHANGE'
          ? 'Ship Your Item'
          : 'Waiting for Delivery';
      case 'IN_TRANSIT':
        return 'Track Shipment';
      case 'DELIVERED':
        return role === 'buyer' ? 'Confirm Delivery' : 'Waiting for Confirmation';
      case 'REVIEW_PENDING':
        return 'Leave Review';
      case 'COMPLETED':
        return 'Transaction Complete';
      default:
        return null;
    }
  }
}

export default TransactionService;

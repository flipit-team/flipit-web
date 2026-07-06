import { apiClient, handleApiCall } from '~/lib/api-client';
import {
  TransactionDTO,
  CreateTransactionRequest,
  TransactionFilterOptions,
} from '~/types/transaction';

export class TransactionService {
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

  // Release funds for a transaction
  static async releaseTransaction(transactionId: number) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/release`,
        {},
        { requireAuth: true }
      )
    );
  }

  // Confirm delivery
  static async confirmDelivery(transactionId: number) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/confirm-delivery`,
        {},
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

  // Cancel transaction
  static async cancelTransaction(transactionId: number) {
    return handleApiCall(() =>
      apiClient.put<TransactionDTO>(
        `/v1/transactions/${transactionId}/cancel`,
        {},
        { requireAuth: true }
      )
    );
  }

  // Verify transaction
  static async verifyTransaction(transactionId: number) {
    return handleApiCall(() =>
      apiClient.post<TransactionDTO>(
        `/v1/transactions/${transactionId}/verify`,
        {},
        { requireAuth: true }
      )
    );
  }

  // ===== Helper Methods =====

  // Get user role in transaction
  static getUserRole(transaction: TransactionDTO, userId: number): 'seller' | 'buyer' | null {
    if (transaction.seller.id === userId) return 'seller';
    if (transaction.buyer.id === userId) return 'buyer';
    return null;
  }

  // Check if user can perform action on transaction
  static canUserPerformAction(transaction: TransactionDTO, userId: number, action: string): boolean {
    const isSeller = transaction.seller.id === userId;
    const isBuyer = transaction.buyer.id === userId;

    switch (action) {
      case 'cancel':
        return (isSeller || isBuyer) && transaction.status === 'PENDING';
      case 'pay':
        return isBuyer && transaction.status === 'PENDING';
      case 'ship':
        return isSeller && transaction.status === 'SUCCESS';
      case 'confirm_delivery':
        return isBuyer && transaction.status === 'DELIVERED';
      case 'review':
        return (isSeller || isBuyer) && transaction.status === 'VERIFIED';
      default:
        return false;
    }
  }

  // Get next action for user
  static getNextAction(transaction: TransactionDTO, userId: number): string | null {
    const role = this.getUserRole(transaction, userId);
    if (!role) return null;

    switch (transaction.status) {
      case 'PENDING':
        return role === 'buyer' ? 'Make Payment' : 'Waiting for Payment';
      case 'SUCCESS':
        return role === 'seller' ? 'Ship Item' : 'Waiting for Shipment';
      case 'DELIVERED':
        return role === 'buyer' ? 'Confirm Delivery' : 'Waiting for Confirmation';
      case 'VERIFIED':
        return 'Leave Review';
      case 'COMPLETED':
        return 'Transaction Complete';
      case 'RELEASED':
        return 'Funds Released';
      default:
        return null;
    }
  }
}

export default TransactionService;

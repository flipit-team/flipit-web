import { apiClient, handleApiCall } from '~/lib/api-client';
import { PaymentDTO, PaymentInitiateRequest, PaymentVerifyRequest } from '~/types/api';

export class PaymentService {
  // Initiate payment — returns authorization URL to redirect user to payment gateway
  static async initiatePayment(data: PaymentInitiateRequest) {
    return handleApiCall(() =>
      apiClient.post<PaymentDTO>('/v1/payments/initiate', data, { requireAuth: true })
    );
  }

  // Verify payment status after gateway callback
  static async verifyPayment(data: PaymentVerifyRequest) {
    return handleApiCall(() =>
      apiClient.post<PaymentDTO>('/v1/payments/verify', data, { requireAuth: true })
    );
  }

  // Get payment details
  static async getPaymentDetails(paymentId: number) {
    return handleApiCall(() =>
      apiClient.get<PaymentDTO>(`/v1/payments/${paymentId}`, { requireAuth: true })
    );
  }

  // Release payment to seller
  static async releasePayment(paymentId: number) {
    return handleApiCall(() =>
      apiClient.put<PaymentDTO>(`/v1/payments/${paymentId}/release`, {}, { requireAuth: true })
    );
  }

  // Refund payment to buyer
  static async refundPayment(paymentId: number) {
    return handleApiCall(() =>
      apiClient.post<PaymentDTO>(`/v1/payments/${paymentId}/refund`, {}, { requireAuth: true })
    );
  }
}

export default PaymentService;

import { apiClient, handleApiCall } from '~/lib/api-client';

// GIG Logistics Types
export interface GIGShipmentRequest {
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  senderState: string;
  senderLGA: string;

  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  receiverState: string;
  receiverLGA: string;

  itemDescription: string;
  itemValue: number;
  itemWeight?: number;
  itemQuantity?: number;

  deliveryType: 'STANDARD' | 'EXPRESS' | 'PRIORITY';
  paymentMethod: 'PREPAID' | 'CASH_ON_DELIVERY';

  pickupDate?: string;
  specialInstructions?: string;
}

export interface GIGShipmentResponse {
  waybillNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  shippingCost: number;
  status: string;
  pickupScheduled: boolean;
  dateCreated: string;
}

export interface GIGTrackingInfo {
  waybillNumber: string;
  status: string;
  currentLocation?: string;
  history: GIGTrackingEvent[];
  estimatedDelivery?: string;
  actualDelivery?: string;
  recipient?: string;
  recipientSignature?: string;
}

export interface GIGTrackingEvent {
  status: string;
  location: string;
  description: string;
  dateTime: string;
}

export interface GIGPickupRequest {
  waybillNumber: string;
  pickupDate: string;
  pickupTimeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  specialInstructions?: string;
}

export interface GIGQuoteRequest {
  originState: string;
  originLGA: string;
  destinationState: string;
  destinationLGA: string;
  weight: number;
  deliveryType: 'STANDARD' | 'EXPRESS' | 'PRIORITY';
}

export interface GIGQuoteResponse {
  cost: number;
  estimatedDays: number;
  deliveryType: string;
  currency: string;
}

export class ShippingService {
  // ===== GIG Logistics Integration =====

  // Create shipment
  static async createShipment(data: GIGShipmentRequest) {
    return handleApiCall(() =>
      apiClient.post<GIGShipmentResponse>('/v1/shipping/gig/create', data, { requireAuth: true })
    );
  }

  // Get shipping quote
  static async getShippingQuote(data: GIGQuoteRequest) {
    return handleApiCall(() =>
      apiClient.post<GIGQuoteResponse>('/v1/shipping/gig/quote', data, { requireAuth: true })
    );
  }

  // Track shipment
  static async trackShipment(waybillNumber: string) {
    return handleApiCall(() =>
      apiClient.get<GIGTrackingInfo>(`/v1/shipping/gig/track/${waybillNumber}`, { requireAuth: true })
    );
  }

  // Schedule pickup
  static async schedulePickup(data: GIGPickupRequest) {
    return handleApiCall(() =>
      apiClient.post<GIGShipmentResponse>('/v1/shipping/gig/schedule-pickup', data, { requireAuth: true })
    );
  }

  // Cancel shipment
  static async cancelShipment(waybillNumber: string, reason: string) {
    return handleApiCall(() =>
      apiClient.post<{ success: boolean; message: string }>(
        '/v1/shipping/gig/cancel',
        { waybillNumber, reason },
        { requireAuth: true }
      )
    );
  }

  // Get available delivery slots
  static async getDeliverySlots(state: string, lga: string, date: string) {
    return handleApiCall(() =>
      apiClient.get<{ slots: string[] }>(
        `/v1/shipping/gig/delivery-slots?state=${state}&lga=${lga}&date=${date}`,
        { requireAuth: true }
      )
    );
  }

  // Confirm delivery
  static async confirmDelivery(waybillNumber: string, recipientName: string) {
    return handleApiCall(() =>
      apiClient.post<{ success: boolean; message: string }>(
        '/v1/shipping/gig/confirm-delivery',
        { waybillNumber, recipientName },
        { requireAuth: true }
      )
    );
  }

  // Report issue with shipment
  static async reportShipmentIssue(waybillNumber: string, issue: string, description: string) {
    return handleApiCall(() =>
      apiClient.post<{ ticketNumber: string; message: string }>(
        '/v1/shipping/gig/report-issue',
        { waybillNumber, issue, description },
        { requireAuth: true }
      )
    );
  }

  // ===== Helper Methods =====

  // Format tracking status for display
  static formatTrackingStatus(status: string): { label: string; color: string; icon: string } {
    const statusMap: Record<string, { label: string; color: string; icon: string }> = {
      'PICKUP_PENDING': { label: 'Pickup Pending', color: 'text-yellow-600', icon: '📦' },
      'PICKED_UP': { label: 'Picked Up', color: 'text-blue-600', icon: '✅' },
      'IN_TRANSIT': { label: 'In Transit', color: 'text-blue-600', icon: '🚚' },
      'OUT_FOR_DELIVERY': { label: 'Out for Delivery', color: 'text-green-600', icon: '🚛' },
      'DELIVERED': { label: 'Delivered', color: 'text-green-600', icon: '✓' },
      'FAILED_DELIVERY': { label: 'Failed Delivery', color: 'text-red-600', icon: '⚠️' },
      'RETURNED': { label: 'Returned to Sender', color: 'text-red-600', icon: '↩️' },
    };

    return statusMap[status] || { label: status, color: 'text-gray-600', icon: '📋' };
  }

  // Calculate estimated delivery date
  static calculateEstimatedDelivery(
    deliveryType: 'STANDARD' | 'EXPRESS' | 'PRIORITY',
    originState: string,
    destinationState: string
  ): number {
    // Base delivery days
    const baseDays = {
      STANDARD: 5,
      EXPRESS: 3,
      PRIORITY: 1,
    };

    // Add extra days for inter-state delivery
    const isInterState = originState !== destinationState;
    const extraDays = isInterState ? 2 : 0;

    return baseDays[deliveryType] + extraDays;
  }

  // Validate address
  static validateAddress(address: string, state: string, lga: string): boolean {
    return !!(address && address.length > 10 && state && lga);
  }

  // Format waybill number for display
  static formatWaybillNumber(waybill: string): string {
    // Format like: GIG-1234-5678-9012
    return waybill.replace(/(.{4})/g, '$1-').slice(0, -1);
  }
}

export default ShippingService;

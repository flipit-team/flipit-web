import { apiClient, handleApiCall } from '~/lib/api-client';
import { ShipmentDTO, ShipmentCreateRequest } from '~/types/api';

export interface ShipmentRequestPayload {
  courierService: string;
  transactionId?: number;
  [key: string]: any;
}

export class ShippingService {
  // Create shipment
  static async createShipment(data: ShipmentCreateRequest) {
    return handleApiCall(() =>
      apiClient.post<ShipmentDTO>('/v1/shipping/create', { ...data, courierService: data.courierService || 'GIG' }, { requireAuth: true })
    );
  }

  // Get shipping quote
  static async getShippingQuote(data: ShipmentRequestPayload) {
    return handleApiCall(() =>
      apiClient.post<ShipmentDTO>('/v1/shipping/quote', { ...data, courierService: data.courierService || 'GIG' }, { requireAuth: true })
    );
  }

  // Get shipping details
  static async getShippingDetails(data: ShipmentRequestPayload) {
    return handleApiCall(() =>
      apiClient.post<ShipmentDTO>('/v1/shipping/details', { ...data, courierService: data.courierService || 'GIG' }, { requireAuth: true })
    );
  }

  // Track shipment
  static async trackShipment(data: ShipmentRequestPayload) {
    return handleApiCall(() =>
      apiClient.post<ShipmentDTO>('/v1/shipping/track', { ...data, courierService: data.courierService || 'GIG' }, { requireAuth: true })
    );
  }

  // Schedule pickup
  static async schedulePickup(data: { waybillNumber: string; pickupDate: string; pickupTimeSlot?: string; specialInstructions?: string }) {
    return handleApiCall(() =>
      apiClient.post<void>('/v1/shipping/schedule-pickup', data, { requireAuth: true })
    );
  }

  // Confirm delivery
  static async confirmDelivery(waybillNumber: string) {
    return handleApiCall(() =>
      apiClient.post<void>('/v1/shipping/confirm-delivery', { waybill: waybillNumber }, { requireAuth: true })
    );
  }

  // Cancel shipment
  static async cancelShipment(data: ShipmentRequestPayload) {
    return handleApiCall(() =>
      apiClient.post<ShipmentDTO>('/v1/shipping/cancel', { ...data, courierService: data.courierService || 'GIG' }, { requireAuth: true })
    );
  }

  // ===== Helper Methods =====

  static formatTrackingStatus(status: string): { label: string; color: string } {
    const statusMap: Record<string, { label: string; color: string }> = {
      'PENDING': { label: 'Pending', color: 'text-yellow-600' },
      'PICKED_UP': { label: 'Picked Up', color: 'text-blue-600' },
      'IN_TRANSIT': { label: 'In Transit', color: 'text-blue-600' },
      'OUT_FOR_DELIVERY': { label: 'Out for Delivery', color: 'text-green-600' },
      'DELIVERED': { label: 'Delivered', color: 'text-green-600' },
      'CANCELLED': { label: 'Cancelled', color: 'text-red-600' },
      'RETURNED': { label: 'Returned', color: 'text-red-600' },
    };
    return statusMap[status] || { label: status, color: 'text-gray-600' };
  }
}

export default ShippingService;

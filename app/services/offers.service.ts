import { apiClient, handleApiCall } from '~/lib/api-client';
import { OfferDTO, CreateOfferRequest } from '~/types/api';

export class OffersService {
  // Create offer
  static async createOffer(offerData: CreateOfferRequest) {
    return handleApiCall(() =>
      apiClient.post<OfferDTO>('/v1/offer', offerData, { requireAuth: true })
    );
  }

  // Get offer by ID
  static async getOfferById(offerId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO>(`/v1/offer/${offerId}`, { requireAuth: true })
    );
  }

  // Get offers for an item
  static async getOffersForItem(itemId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO[]>(`/v1/offer/items/${itemId}/offers`, { requireAuth: true })
    );
  }

  // Get user's offers (DEPRECATED - use getUserOffersSent or getUserOffersReceived)
  static async getUserOffers(userId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO[]>(`/v1/offer/user/${userId}/offers`, { requireAuth: true })
    );
  }

  // Get offers sent by user - NEW
  static async getUserOffersSent(userId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO[]>(`/v1/offer/user/${userId}/sent`, { requireAuth: true })
    );
  }

  // Get offers received by user - NEW
  static async getUserOffersReceived(userId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO[]>(`/v1/offer/user/${userId}/received`, { requireAuth: true })
    );
  }

  // Delete offer
  static async deleteOffer(offerId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/v1/offer/${offerId}`, { requireAuth: true })
    );
  }

  // Accept offer (if endpoint exists)
  static async acceptOffer(offerId: number) {
    return handleApiCall(() =>
      apiClient.put<OfferDTO>(`/offer/${offerId}/accept`, {}, { requireAuth: true })
    );
  }

  // Reject offer (if endpoint exists)
  static async rejectOffer(offerId: number) {
    return handleApiCall(() =>
      apiClient.put<OfferDTO>(`/offer/${offerId}/reject`, {}, { requireAuth: true })
    );
  }
}

export default OffersService;
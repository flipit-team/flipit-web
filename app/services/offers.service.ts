import { apiClient, handleApiCall } from '~/lib/api-client';
import { OfferDTO, CreateOfferRequest } from '~/types/api';

export class OffersService {
  // Create offer
  static async createOffer(offerData: CreateOfferRequest) {
    return handleApiCall(() =>
      apiClient.post<OfferDTO>('/offer', offerData, { requireAuth: true })
    );
  }

  // Get offer by ID
  static async getOfferById(offerId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO>(`/offer/${offerId}`, { requireAuth: true })
    );
  }

  // Get offers for an item
  static async getOffersForItem(itemId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO[]>(`/offer/items/${itemId}/offers`, { requireAuth: true })
    );
  }

  // Get user's offers
  static async getUserOffers(userId: number) {
    return handleApiCall(() =>
      apiClient.get<OfferDTO[]>(`/offer/user/${userId}/offers`, { requireAuth: true })
    );
  }

  // Delete offer
  static async deleteOffer(offerId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/offer/${offerId}`, { requireAuth: true })
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
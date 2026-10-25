import { apiClient, handleApiCall } from '~/lib/api-client';
import { DisputeDTO, CreateDisputeRequest, DisputeEvidenceRequest } from '~/types/api';

export class DisputesService {
  static async openDispute(data: CreateDisputeRequest) {
    return handleApiCall(() =>
      apiClient.post<DisputeDTO>('/v1/disputes', data, { requireAuth: true })
    );
  }

  static async getDispute(disputeId: number) {
    return handleApiCall(() =>
      apiClient.get<DisputeDTO>(`/v1/disputes/${disputeId}`, { requireAuth: true })
    );
  }

  static async submitEvidence(disputeId: number, data: DisputeEvidenceRequest) {
    return handleApiCall(() =>
      apiClient.post<void>(`/v1/disputes/${disputeId}/evidence`, data, { requireAuth: true })
    );
  }
}

export default DisputesService;

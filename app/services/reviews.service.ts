import { apiClient, handleApiCall } from '~/lib/api-client';
import { ReviewDTO, CreateReviewRequest } from '~/types/api';

export class ReviewsService {
  // Create review
  static async createReview(reviewData: CreateReviewRequest) {
    return handleApiCall(() =>
      apiClient.post<ReviewDTO>('/v1/reviews', reviewData, { requireAuth: true })
    );
  }

  // Get reviews for a user
  static async getUserReviews(userId: number) {
    return handleApiCall(() =>
      apiClient.get<ReviewDTO[]>(`/v1/reviews/user/${userId}`)
    );
  }
}

export default ReviewsService;

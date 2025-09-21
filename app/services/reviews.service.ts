import { apiClient, handleApiCall } from '~/lib/api-client';
import { ReviewDTO } from '~/utils/interface';

export interface CreateReviewRequest {
  rating: number;
  message: string;
  userId: number;
}

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

  // Get review by ID (if endpoint exists)
  static async getReviewById(reviewId: number) {
    return handleApiCall(() =>
      apiClient.get<ReviewDTO>(`/reviews/${reviewId}`, { requireAuth: true })
    );
  }

  // Update review (if endpoint exists)
  static async updateReview(reviewId: number, reviewData: CreateReviewRequest) {
    return handleApiCall(() =>
      apiClient.put<ReviewDTO>(`/reviews/${reviewId}`, reviewData, { requireAuth: true })
    );
  }

  // Delete review (if endpoint exists)
  static async deleteReview(reviewId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/reviews/${reviewId}`, { requireAuth: true })
    );
  }

  // Get average rating for user (if endpoint exists)
  static async getUserRating(userId: number) {
    return handleApiCall(() =>
      apiClient.get<{ averageRating: number; totalReviews: number }>(`/reviews/user/${userId}/rating`)
    );
  }
}

export default ReviewsService;
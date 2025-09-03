// Export all services for easy importing
export { AuthService } from './auth.service';
export { UserService } from './user.service';
export { ItemsService } from './items.service';
export { OffersService } from './offers.service';
export { AuctionsService } from './auctions.service';
export { BiddingService } from './bidding.service';
export { ReviewsService } from './reviews.service';
export { ChatService } from './chat.service';
export { NotificationsService } from './notifications.service';
export { FilesService } from './files.service';
export { LikesService } from './likes.service';

// Re-export API client utilities
export { apiClient, handleApiCall, buildQueryString, ApiClientError } from '~/lib/api-client';

// Re-export types
export * from '~/types/api';
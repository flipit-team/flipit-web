// Primary API types (DTOs, requests, responses)
export * from './api';

// Common base types - only export names unique to common.ts
// Note: common.ts also defines Item and ApiResponse/PaginatedResponse;
// use ~/types/common directly for those if needed.
export type { User, Category, Bidding, BaseItem } from './common';

// Legacy entity types from utils/interface.ts - only export names unique to entities.ts
// For overlapping names (ApiResponse, ApiError, ErrorResponse, ReviewDTO, Item),
// import directly from ~/types/entities or ~/types/common as needed.
export type {
  Bid,
  Chat,
  ChatWithUnreadCountDTO,
  ChatsResponse,
  Message,
  Notification,
  Profile,
  SupportCallbackRequest,
  AbuseReportRequest,
  ItemSortOption,
  LikedItemsResponse,
} from './entities';

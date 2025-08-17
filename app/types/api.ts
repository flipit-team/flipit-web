// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  jwt?: string;
  user: UserDTO;
  message?: {
    token?: string;
    jwt?: string;
    user: UserDTO;
  };
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  roleIds?: number[];
}

export interface SignupRequestBackend {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  roleIds?: number[];
}

export interface SignupResponse {
  token?: string;
  jwt?: string;
  user: UserDTO;
  message?: {
    token?: string;
    jwt?: string;
    user: UserDTO;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User Types
export interface UserDTO {
  id: number;
  username?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  title?: string;
  avatar?: string;
  avgRating?: number;
  reviewCount?: number;
  status?: string;
  mostRecentReview?: any;
  phoneNumberVerified?: boolean;
  dateVerified?: string;
  dateCreated: string;
  bio?: string;
  // Legacy compatibility fields
  phone?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
}

// Item Types
export interface ItemDTO {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  acceptCash: boolean;
  cashAmount: number;
  published: boolean;
  sold: boolean;
  location: string;
  condition: string;
  brand: string;
  dateCreated: string;
  seller: UserDTO;
  itemCategories: CategoryDTO[];
}

export interface CreateItemRequest {
  title: string;
  description: string;
  imageKeys: string[];
  acceptCash: boolean;
  cashAmount: number;
  location: string;
  condition: string;
  brand: string;
  itemCategories: string[];
}

export interface UpdateItemRequest {
  title: string;
  description: string;
  imageKeys: string[];
  acceptCash: boolean;
  cashAmount: number;
  location: string;
  condition: string;
  brand: string;
  itemCategories: string[];
}

export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
}

export interface ItemsQueryParams {
  page?: number;
  size?: number;
  search?: string;
  categories?: string[];
}

// Offer Types
export interface OfferDTO {
  id: number;
  itemId: number;
  withCash: boolean;
  cashAmount?: number;
  offeredItemId?: number;
  status: string;
  dateCreated: string;
  offeredBy: UserDTO;
  item: ItemDTO;
  offeredItem?: ItemDTO;
}

export interface CreateOfferRequest {
  itemId: number;
  withCash: boolean;
  cashAmount?: number;
  offeredItemId?: number;
}

// Auction Types
export interface AuctionDTO {
  id: number;
  startDate: string;
  endDate: string;
  reservePrice: number;
  bidIncrement: number;
  startingBid: number;
  currentBid: number;
  status: string;
  item: ItemDTO;
  winner?: UserDTO;
  dateCreated: string;
}

export interface CreateAuctionRequest {
  startDate: string;
  endDate: string;
  reservePrice: number;
  bidIncrement: number;
  startingBid: number;
  itemId: number;
  title: string;
  description: string;
  imageKeys: string[];
  location: string;
  condition: string;
  brand: string;
  itemCategories: string[];
}

export interface UpdateAuctionRequest {
  startDate: string;
  endDate: string;
  reservePrice: number;
  bidIncrement: number;
  startingBid: number;
  title: string;
  description: string;
  imageKeys: string[];
  location: string;
  condition: string;
  brand: string;
  itemCategories: string[];
}

// Bidding Types
export interface BidDTO {
  id: number;
  auctionId: number;
  bidAmount: number;
  bidder: UserDTO;
  dateCreated: string;
  status: string;
}

export interface CreateBidRequest {
  auctionId: number;
  bidAmount: number;
}

// Review Types
export interface ReviewDTO {
  id: number;
  rating: number;
  comment: string;
  reviewer: UserDTO;
  reviewedUser: UserDTO;
  dateCreated: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  reviewedUserId: number;
}

// Chat Types
export interface ChatDTO {
  id: string;
  participants: UserDTO[];
  item?: ItemDTO;
  lastMessage?: MessageDTO;
  dateCreated: string;
  dateUpdated: string;
}

export interface MessageDTO {
  id: string;
  chatId: string;
  senderId: number;
  message: string;
  dateCreated: string;
  read: boolean;
}

export interface CreateChatRequest {
  recipientId: number;
  itemId?: number;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

// Notification Types
export interface NotificationDTO {
  id: number;
  type: string;
  title: string;
  message: string;
  resourceLink: string;
  read: boolean;
  dateCreated: string;
}

export interface NotificationsQueryParams {
  page?: number;
  size?: number;
  read?: boolean;
}

// File Upload Types
export interface PresignUploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export interface PresignDownloadUrlResponse {
  downloadUrl: string;
}

export interface UploadFileRequest {
  file: File;
  oldKey?: string;
}

export interface UploadFileResponse {
  key: string;
  url: string;
}

// Error Types
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  debugMessage?: string;
  subErrors?: any[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string;
}

// Common Types
export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type AuctionStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
export type NotificationType = 'BID' | 'OFFER' | 'CHAT' | 'AUCTION' | 'SYSTEM';
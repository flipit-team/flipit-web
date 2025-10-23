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
  confirmPassword: string;
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
  mostRecentReview?: ReviewDTO;  // Updated to use ReviewDTO
  phoneNumberVerified: boolean;  // NEW: Enhanced seller verification (for verified profile)
  idVerified?: boolean;          // NEW: ID document verification (for verified ID badge)
  dateVerified: string;         // NEW: Verification date
  dateCreated: string;
  bio?: string;
  // Legacy compatibility fields
  phone?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio?: string;
  avatar?: string;
}

// User Verification Types
export interface PhoneVerificationRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface ProfileVerificationRequest {
  documentType: string;
  documentImages: string[];
  additionalInfo?: string;
}

export interface UserStatusUpdate {
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  reason?: string;
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
  delivered?: boolean;     // NEW: Item delivery status
  location: string;
  condition: string;
  brand: string;
  dateCreated: string;
  promoted: boolean;        // NEW: Item promotion status
  liked: boolean;          // NEW: Whether current user liked this item
  seller: UserDTO;
  itemCategory: CategoryDTO;
  subcategory?: string;    // NEW: Subcategory within the main category
  stateCode?: string;      // NEW: State code for location
  lgaCode?: string;        // NEW: LGA code for location
}

export interface CreateItemRequest {
  title: string;
  description: string;
  imageKeys: string[];
  acceptCash: boolean;
  cashAmount: number;
  stateCode: string;       // CHANGED: from location
  lgaCode: string;         // NEW: LGA code
  condition: string;
  brand: string;
  itemCategory: string;
  subcategory?: string;    // NEW: Optional subcategory
}

export interface UpdateItemRequest {
  title: string;
  description: string;
  imageKeys: string[];
  acceptCash: boolean;
  cashAmount: number;
  stateCode: string;       // CHANGED: from location
  lgaCode: string;         // NEW: LGA code
  condition: string;
  brand: string;
  itemCategory: string;
  subcategory?: string;    // NEW: Optional subcategory
  published: boolean;
}

export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
  thumbnail?: string;      // NEW: Category thumbnail URL
  subcategories?: string[]; // NEW: List of subcategory names
}

export interface ItemsQueryParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  subcategory?: string;    // NEW: Filter by subcategory
  stateCode?: string;
  lgaCode?: string;
  sort?: string;
  minAmount?: number;      // NEW: Minimum price filter
  maxAmount?: number;      // NEW: Maximum price filter
  isVerifiedSeller?: boolean; // NEW: Filter by verified sellers
  hasDiscount?: boolean;   // NEW: Filter discounted items
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
export interface AuctionBiddingDTO {
  auctionId: number;
  bidder: UserDTO;
  amount: number;
  bidTime: string;
}

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
  biddingsCount?: number;
  biddings?: AuctionBiddingDTO[];
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
  stateCode: string;      // CHANGED: from location
  lgaCode: string;        // NEW: LGA code
  condition: string;
  brand: string;
  itemCategory: string;
  subcategory?: string;   // NEW: Optional subcategory
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
  bidderId: number;
  amount: number;
}

// Additional Bidding Types for enhanced functionality
export interface BidHistoryDTO extends BidDTO {
  isWinning?: boolean;
  isHighest?: boolean;
}

export type BidStatus = 'ACTIVE' | 'OUTBID' | 'WINNING' | 'WON' | 'LOST';

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
  receiverId: number;
  itemId?: number;
  title?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  itemId?: string;
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

// Location Types
export interface StateDTO {
  id: number;
  name: string;
  code: string;
  lgas?: LGADTO[];
}

export interface LGADTO {
  id: number;
  name: string;
  code: string;
  state?: StateDTO;
}

// Common Types
export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type AuctionStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
export type NotificationType = 'BID' | 'OFFER' | 'CHAT' | 'AUCTION' | 'SYSTEM';
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
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleIds?: number[];
}

// Matches backend UserRequest schema
export interface SignupRequestBackend {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
  confirmPassword: string;
}

export interface ChangePasswordRequest {
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

// Matches backend ProfileRequest — only phoneNumber and avatar are updatable
export interface UpdateProfileRequest {
  phoneNumber: string;
  avatar?: string;
}

// User Verification Types
export interface PhoneVerificationRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface ProfileVerificationRequest {
  idType: string;
  bvn: string;
  idFilePath: string;
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
  withCash: boolean;
  cashAmount?: number;
  status: string;
  sentBy: UserDTO;
  item: ItemDTO;
  offeredItem?: ItemDTO;
  dateCreated: string;
}

export interface CreateOfferRequest {
  itemId: number;
  withCash: boolean;
  cashAmount?: number;
  offeredItemId?: number;
  offerValid?: boolean;
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
  acceptCash?: boolean;
  cashAmount?: number;
  stateCode: string;
  lgaCode: string;
  condition: string;
  brand: string;
  itemCategory: string;
  subcategory?: string;
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

// Matches backend BiddingRequest — bidder inferred from JWT
export interface CreateBidRequest {
  auctionId: number;
  amount: number;
}

// Additional Bidding Types for enhanced functionality
export interface BidHistoryDTO extends BidDTO {
  isWinning?: boolean;
  isHighest?: boolean;
}

export type BidStatus = 'ACTIVE' | 'OUTBID' | 'WINNING' | 'WON' | 'LOST';

// Review Types — matches API ReviewDTO
export interface ReviewDTO {
  rating: number;
  message: string;
  userId: number;
  postedById: number;
  createdDate: string;
}

export interface CreateReviewRequest {
  userId: number;
  itemId: number;
  rating: number;
  message: string;
}

// Home Types
export interface TopNavDTO {
  auctionsCount: number;      // Total auctions for user
  messagesCount: number;       // Unread messages count
  biddingCount: number;        // Active bids count
  notificationsCount: number;  // Unread notifications count
  topNotifications: NotificationDTO[];  // Top 5 recent notifications
}

// Chat Types
export interface ChatDTO {
  chatId: string;
  title: string;
  initiatorId: number;
  receiverId: number;
  initiatorAvatar: string;    // Full URL to avatar image
  receiverAvatar: string;     // Full URL to avatar image
  initiatorName: string;
  receiverName: string;
  dateCreated: string;        // ISO datetime
  // Legacy fields for backward compatibility
  id?: string;
  participants?: UserDTO[];
  item?: ItemDTO;
  lastMessage?: MessageDTO;
  dateUpdated?: string;
}

// Matches backend ChatMessageDTO
export interface MessageDTO {
  message: string;
  sentBy: number;
  chatId: string;
  readByReceiver?: boolean;
  dateCreated: string;
}

// Matches backend StartChatRequest
export interface CreateChatRequest {
  receiverId: number;
  title: string;
  itemId?: number;
}

// Matches backend CreateMessageRequest
export interface SendMessageRequest {
  chatId: string;
  message: string;
}

// Notification Types
export interface NotificationDTO {
  id: number;
  type: string;
  avatar: string;
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

// Admin Types
export interface DashboardSummaryDTO {
  totalListings: number;
  totalListingsChangePercent: number;
  customers: number;
  customersChangePercent: number;
  totalBids: number;
  totalBidsChangePercent: number;
}

export interface ListingsSummaryDTO {
  activeListings: number;
  activeListingsChangePercent: number;
  soldListings: number;
  soldListingsChangePercent: number;
  pendingListings: number;
  pendingListingsChangePercent: number;
}

export interface ListingDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface CustomersSummaryDTO {
  totalCustomers: number;
  totalCustomersChangePercent: number;
  activeCustomers: number;
  activeCustomersChangePercent: number;
  blacklistedCustomers: number;
  blacklistedCustomersChangePercent: number;
}

export interface BidsSummaryDTO {
  totalBids: number;
  totalBidsChangePercent: number;
  pendingBids: number;
  pendingBidsChangePercent: number;
  acceptedBids: number;
  acceptedBidsChangePercent: number;
}

export interface AdminActivityDTO {
  id: string;
  timestamp: string;
  activity: string;
  userId: string;
  action: string;
}

export interface AdminCustomerDTO {
  custId: string;
  name: string;
  email: string;
  regDate: string;
  status: string;
  listingsBids: string;
}

export interface AdminBidDTO {
  bidId: string;
  listingId: string;
  customerId: string;
  bidAmount: string;
  bidDate: string;
  status: string;
}
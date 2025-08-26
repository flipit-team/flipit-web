// Common user interface to reduce duplication
export interface User {
  id: string | number;
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  profileImageUrl?: string;
  avgRating?: number;
  reviewCount?: number;
  status?: string;
  phoneNumberVerified?: boolean;
  dateVerified?: Date | string;
  dateCreated?: Date | string;
}

// Common item category interface
export interface Category {
  id?: number;
  name: string;
  description: string;
}

// Common bidding interface
export interface Bidding {
  auctionId: number;
  bidder: User;
  amount: number;
  bidTime: string;
}

// Base item interface without auction-specific fields
export interface BaseItem {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  flipForImgUrls?: string[];
  acceptCash: boolean;
  cashAmount: number;
  condition: string | null;
  published: boolean;
  sold?: boolean;
  location: string;
  brand?: string;
  dateCreated: Date | string;
  seller: User;
  itemCategories: Category[];
}

// Extended item interface with auction support
export interface Item extends BaseItem {
  // Auction-specific fields
  isAuction?: boolean;
  auctionId?: number;
  startingBid?: number;
  currentBid?: number;
  bidIncrement?: number;
  reservePrice?: number;
  startDate?: string;
  endDate?: string;
  auctionStatus?: string;
  biddingsCount?: number;
  biddings?: Bidding[];
}

// API response wrapper types
export interface ApiResponse<T> {
  data?: T;
  error?: any;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}
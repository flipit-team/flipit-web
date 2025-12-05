# Flipit API Structure & Frontend Integration

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Chat/Messages System](#chatmessages-system)
- [Items & Auctions](#items--auctions)
- [Offers & Bidding](#offers--bidding)
- [User Management](#user-management)
- [Common Patterns](#common-patterns)

---

## Overview

**Base URL:** `https://api.flipit.ng`
**API Version:** 1.0
**Authentication:** JWT Bearer Token
**OpenAPI Spec:** `https://api.flipit.ng/v3/api-docs`

---

## Authentication

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/forgot-password` | Initiate password reset |
| POST | `/api/v1/auth/reset-password` | Complete password reset |
| GET | `/api/v1/auth/login/google` | Get Google OAuth URL |
| GET | `/api/v1/auth/google/callback` | Handle Google OAuth callback |
| GET | `/api/v1/auth/roles` | Get system roles |

### Request/Response Schemas
```typescript
// Login Request
interface LoginRequest {
  username: string;
  password: string;
}

// Login Response
interface LoginResponse {
  token?: string;
  jwt?: string;
  user: UserDTO;
}
```

---

## Chat/Messages System

### ⚠️ IMPORTANT CHANGES (Breaking Changes)
The backend now wraps Chat objects in `ChatWithUnreadCountDTO` which includes an unread count.

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/chats` | Get all user chats (buyer & seller) |
| POST | `/api/v1/chats` | Start new chat |
| POST | `/api/v1/chats/message` | Send message |
| GET | `/api/v1/chats/{chatId}/messages` | Get chat messages |
| GET | `/api/v1/chats/{chatId}` | Get specific chat |

### Current Backend Schemas (v1.0)

```typescript
// ✅ NEW: Response from GET /api/v1/chats
interface ChatsResponse {
  seller: ChatWithUnreadCountDTO[];  // ⚠️ Changed from Chat[]
  buyer: ChatWithUnreadCountDTO[];   // ⚠️ Changed from Chat[]
}

// ✅ NEW: Wrapper object with unread count
interface ChatWithUnreadCountDTO {
  chat: ChatDTO;           // ⚠️ Chat is now nested
  unreadCount: number;     // ⚠️ NEW field
}

// Base Chat object
interface ChatDTO {
  chatId: string;
  title: string;
  initiatorId: number;
  receiverId: number;
  initiatorAvatar: string;
  receiverAvatar: string;
  initiatorName: string;
  receiverName: string;
  dateCreated: string;  // ISO 8601 date-time
}

// Message object
interface ChatMessageDTO {
  message: string;
  sentBy: number;
  chatId: string;
  readByReceiver: boolean;
  dateCreated: string;  // ISO 8601 date-time
}

// Start chat request
interface StartChatRequest {
  receiverId: number;      // Required
  title?: string;          // Optional
  itemId?: number;         // Optional
}

// Send message request
interface CreateMessageRequest {
  chatId: string;          // Required
  message: string;         // Required, max 2000 chars
}
```

### Frontend Current Schema (Outdated)

```typescript
// ❌ OLD: What frontend expects
interface Chat {
  chatId: string;
  title: string;
  initiatorId: number;
  receiverId: number;
  initiatorAvatar: string;
  receiverAvatar: string;
  initiatorName: string;
  receiverName: string;
  dateCreated: Date;       // ❌ Should be string
}
```

### 🔧 Required Frontend Changes

1. **Update `app/utils/interface.ts`:**
   - Add `ChatWithUnreadCountDTO` interface
   - Update Chat response handling to unwrap the nested structure
   - Add unreadCount support

2. **Update `app/ui/wrappers/MainChats.tsx`:**
   - Transform `ChatWithUnreadCountDTO[]` to `Chat[]`
   - Display unread count badges

3. **Update `app/api/v1/chats/route.ts` (proxy):**
   - Handle the new response structure

---

## Items & Auctions

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/items` | Search/filter items |
| POST | `/api/v1/items` | Create new item |
| GET | `/api/v1/items/{id}` | Get item by ID |
| PUT | `/api/v1/items/{id}` | Update item |
| DELETE | `/api/v1/items/{id}` | Delete item |
| PUT | `/api/v1/items/{id}/markAsSold` | Mark item as sold |
| GET | `/api/v1/items/user/{userId}` | Get user's items |
| GET | `/api/v1/items/categories` | Get all categories |
| GET | `/api/v1/items/itemConditions` | Get item conditions |

### Auction Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auction` | Get all auctions |
| POST | `/api/v1/auction` | Create new auction |
| GET | `/api/v1/auction/{id}` | Get auction by ID |
| PUT | `/api/v1/auction/{id}` | Update auction |
| PUT | `/api/v1/auction/{id}/deactivate` | Deactivate auction |
| PUT | `/api/v1/auction/{id}/reactivate` | Reactivate auction |

---

## Offers & Bidding

### Offer Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/offer` | Create new offer |
| GET | `/api/v1/offer/{offerId}` | Get offer by ID |
| GET | `/api/v1/offer/items/{itemId}/offers` | Get offers for item |
| GET | `/api/v1/offer/user/{userId}/received` | Get received offers |
| GET | `/api/v1/offer/user/{userId}/sent` | Get sent offers |

### Bidding Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/bidding` | Place a bid |
| GET | `/api/v1/bidding/auction/{auctionId}` | Get auction bids |

---

## User Management

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/user/signup` | Register new user |
| GET | `/api/v1/user/profile` | Get user profile |
| PUT | `/api/v1/user/update-profile` | Update profile |
| POST | `/api/v1/user/change-password` | Change password |
| GET | `/api/v1/user/performance` | Get performance metrics |
| GET | `/api/v1/user/findAll` | List users (admin) |
| GET | `/api/v1/user/{id}` | Get user by ID |

---

## Common Patterns

### Pagination
All list endpoints return paginated responses:

```typescript
interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
```

### Error Responses
```typescript
interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}
```

### Authentication Header
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🔄 Migration Checklist

When backend API changes occur:

1. ✅ Fetch latest OpenAPI spec from `/v3/api-docs`
2. ✅ Identify changed endpoints and schemas
3. ✅ Update TypeScript interfaces in `app/types/api.ts`
4. ✅ Update service layer (`app/services/*.service.ts`)
5. ✅ Update UI components that consume the data
6. ✅ Update proxy API routes (`app/api/v1/*`)
7. ✅ Test affected functionality
8. ✅ Update this documentation

---

## 📝 Notes

- Always check for nested structures (like `ChatWithUnreadCountDTO`)
- Backend uses ISO 8601 date strings, frontend should convert to Date objects
- Some endpoints return wrapped responses in `{ data: T }` format
- File uploads use pre-signed URLs from `/api/v1/files/presign-upload-url`

---

**Last Updated:** December 5, 2025
**API Version:** 1.0
**Document Version:** 1.0.0

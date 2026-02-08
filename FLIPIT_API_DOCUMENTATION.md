# Flipit REST API - Complete Documentation

**Base URL:** `https://api.flipit.ng`
**Version:** 1.0
**OpenAPI Version:** 3.1.0

## Authentication

All endpoints use JWT (JSON Web Token) authentication with the `Bearer` scheme.

**Security Scheme:**
- Type: HTTP Bearer
- Scheme: bearer
- Bearer Format: JWT
- Header: Authorization

**Usage:** Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## API Endpoints

### 1. Authentication (auth-controller)

#### POST /api/v1/auth/login
**Description:** User login / Create authentication token
**Operation ID:** `createAuthenticationToken`

**Request Body:**
```json
{
  "username": "string (required, min length: 1)",
  "password": "string (required, min length: 1)"
}
```

**Response (200 OK):**
```json
{
  "jwt": "string",
  "user": { /* UserDTO */ }
}
```

---

#### POST /api/v1/auth/logout
**Description:** Logout user
**Operation ID:** `logout`

**Headers:**
- `Authorization` (required): Bearer token

**Response (200 OK):** `string`

---

#### POST /api/v1/auth/forgot-password
**Description:** Request password reset
**Operation ID:** `forgotPassword`

**Query Parameters:**
- `email` (required, string): User's email address

**Response (200 OK):** `object`

---

#### POST /api/v1/auth/reset-password
**Description:** Reset user password
**Operation ID:** `resetPassword`

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response (200 OK):** `object`

---

#### GET /api/v1/auth/login/google
**Description:** Get Google OAuth login URL
**Operation ID:** `getLoginUrl`

**Response (200 OK):** `string` (Google OAuth URL)

---

#### GET /api/v1/auth/google/callback
**Description:** Handle Google OAuth callback
**Operation ID:** `handleCallback`

**Query Parameters:**
- `code` (optional, string, default: ""): OAuth authorization code

**Response (200 OK):** `string`

---

### 2. User Management (user-controller)

#### POST /api/v1/user/signup
**Description:** Register a new user
**Operation ID:** `signup`

**Request Body:**
```json
{
  "title": "string (optional)",
  "firstName": "string (required, min length: 1)",
  "middleName": "string (optional)",
  "lastName": "string (required, min length: 1)",
  "email": "string (required, email format, min length: 1)",
  "phoneNumber": "string (optional, pattern: ^(\\+[1-9]\\d{1,14}|0\\d{9,15})$)",
  "password": "string (required, min length: 1)",
  "roleIds": ["array of integers (int64)"]
}
```

**Response (200 OK):**
```json
{
  "jwt": "string",
  "user": { /* UserDTO */ }
}
```

---

#### GET /api/v1/user/{id}
**Description:** Get user by ID
**Operation ID:** `getUser`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Response (200 OK):** `UserDTO`

---

#### PUT /api/v1/user/{id}
**Description:** Update user
**Operation ID:** `updateUser`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Request Body:** `UserRequest` (same schema as signup)

**Response (200 OK):** `UserDTO`

---

#### DELETE /api/v1/user/{id}
**Description:** Delete user
**Operation ID:** `deleteUser`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Response (200 OK)**

---

#### GET /api/v1/user/profile
**Description:** Get current user's profile
**Operation ID:** `getUserProfile`

**Response (200 OK):** `UserDTO`

---

#### PUT /api/v1/user/update-profile
**Description:** Update current user's profile
**Operation ID:** `updateProfile`

**Request Body:**
```json
{
  "phoneNumber": "string (optional, pattern: ^(\\+[1-9]\\d{1,14}|0\\d{9,15})$)",
  "avatar": "string (optional)"
}
```

**Response (200 OK):** `UserDTO`

---

#### GET /api/v1/user/performance
**Description:** Get user performance metrics
**Operation ID:** `getUserPerformance`

**Response (200 OK):**
```json
{
  "impressionsCount": "integer (int32)",
  "visitorsCount": "integer (int32)",
  "phoneViewsCount": "integer (int32)",
  "chatRequestsCount": "integer (int32)"
}
```

---

#### GET /api/v1/user/findAll
**Description:** Get all users (paginated)
**Operation ID:** `getUsers`

**Query Parameters:**
- `page` (optional, integer int32, default: 0)
- `size` (optional, integer int32, default: 15)

**Response (200 OK):** `Array<UserDTO>`

---

#### PUT /api/v1/user/{id}/deactivateUser
**Description:** Deactivate user account
**Operation ID:** `deactivateUser`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Response (200 OK)**

---

#### PUT /api/v1/user/{id}/reactivateUser
**Description:** Reactivate user account
**Operation ID:** `reactivateUser`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Response (200 OK)**

---

#### POST /api/v1/user/{id}/verifyProfile
**Description:** Submit profile verification documents
**Operation ID:** `saveUserIdPath`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Request Body:**
```json
{
  "idType": "string (enum: Drivers_License, International_Passport, National_ID)",
  "bvn": "string (required, min length: 1)",
  "idFilePath": "string (optional)"
}
```

**Response (200 OK)**

---

#### GET /api/v1/user/{id}/verify-email
**Description:** Verify user email address
**Operation ID:** `verifyUserEmail`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Query Parameters:**
- `code` (required, string): Verification code

**Response (200 OK):** `string`

---

#### POST /api/v1/user/{id}/verify-phoneNumber
**Description:** Verify user phone number
**Operation ID:** `verifyEmail`

**Path Parameters:**
- `id` (required, integer int64): User ID

**Query Parameters:**
- `code` (required, string): Verification code

**Response (200 OK):**
```json
{
  "responseCode": "string",
  "responseMessage": "string"
}
```

---

#### POST /api/v1/user/change-password
**Description:** Change user password
**Operation ID:** `changePassword`

**Request Body:**
```json
{
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response (200 OK):** `object`

---

### 3. Items Management (items-controller)

#### GET /api/v1/items
**Description:** Search/filter items
**Operation ID:** `getItems`

**Query Parameters (ItemSearchRequest):**
- `page` (optional, integer int32)
- `size` (optional, integer int32)
- `search` (optional, string): Search term
- `sort` (optional, string): Sort order
- `category` (optional, string): Category filter
- `subcategory` (optional, string): Subcategory filter
- `stateCode` (optional, string): State code filter
- `lgaCode` (optional, string): LGA code filter
- `minAmount` (optional, number): Minimum price
- `maxAmount` (optional, number): Maximum price
- `isVerifiedSeller` (optional, boolean): Filter by verified sellers
- `hasDiscount` (optional, boolean): Filter items with discount

**Response (200 OK):** `Array<ItemDTO>`

---

#### POST /api/v1/items
**Description:** Create a new item
**Operation ID:** `createItem`

**Request Body:**
```json
{
  "title": "string (required, min length: 1)",
  "description": "string (optional)",
  "imageKeys": ["array of strings"],
  "acceptCash": "boolean (optional)",
  "cashAmount": "number (optional)",
  "stateCode": "string (optional)",
  "lgaCode": "string (optional)",
  "condition": "string (optional)",
  "brand": "string (optional)",
  "itemCategory": "string (optional)",
  "subcategory": "string (optional)"
}
```

**Response (201 Created):** `ItemDTO`

---

#### GET /api/v1/items/{id}
**Description:** Get item details
**Operation ID:** `getItemDetails`

**Path Parameters:**
- `id` (required, integer int64): Item ID

**Response (200 OK):** `ItemDTO`

---

#### PUT /api/v1/items/{id}
**Description:** Edit/update an item
**Operation ID:** `editItem`

**Path Parameters:**
- `id` (required, integer int64): Item ID

**Request Body:** `ItemRequest` (same schema as create)

**Response (200 OK):** `ItemDTO`

---

#### DELETE /api/v1/items/{id}
**Description:** Delete an item
**Operation ID:** `deleteItem`

**Path Parameters:**
- `id` (required, integer int64): Item ID

**Response (204 No Content)**

---

#### GET /api/v1/items/user/{userId}
**Description:** Get all items by a specific user
**Operation ID:** `getItemsByUserId`

**Path Parameters:**
- `userId` (required, integer int64): User ID

**Response (200 OK):** `Array<ItemDTO>`

---

#### PUT /api/v1/items/{id}/markAsSold
**Description:** Mark item as sold
**Operation ID:** `markAsSold`

**Path Parameters:**
- `id` (required, integer int64): Item ID

**Response (200 OK)**

---

#### GET /api/v1/items/categories
**Description:** Get all item categories
**Operation ID:** `getCategories`

**Response (200 OK):** `Array<CategoryDTO>`

---

#### GET /api/v1/items/itemConditions
**Description:** Get available item conditions
**Operation ID:** `getItemConditions`

**Response (200 OK):** `Array<string>` (enum: NEW, FAIRLY_USED)

---

### 4. Auction Management (auction-controller)

#### GET /api/v1/auction
**Description:** Get active auctions (paginated with filters)
**Operation ID:** `getActiveAuctions`

**Query Parameters:**
- `page` (optional, integer int32, default: 0)
- `size` (optional, integer int32, default: 10)
- `search` (optional, string): Search term
- `sort` (optional, string): Sort order
- `category` (optional, string): Category filter
- `subcategory` (optional, string): Subcategory filter
- `stateCode` (optional, string): State code filter
- `lgaCode` (optional, string): LGA code filter
- `minAmount` (optional, number): Minimum amount
- `maxAmount` (optional, number): Maximum amount
- `isVerifiedSeller` (optional, boolean): Filter by verified sellers
- `hasDiscount` (optional, boolean): Filter auctions with discount

**Response (200 OK):** `Array<AuctionDTO>`

---

#### POST /api/v1/auction
**Description:** Create a new auction
**Operation ID:** `createAuction`

**Request Body:**
```json
{
  "title": "string (required, min length: 1)",
  "description": "string (optional)",
  "imageKeys": ["array of strings"],
  "acceptCash": "boolean (optional)",
  "cashAmount": "number (optional)",
  "stateCode": "string (optional)",
  "lgaCode": "string (optional)",
  "condition": "string (optional)",
  "brand": "string (optional)",
  "itemCategory": "string (optional)",
  "subcategory": "string (optional)",
  "startDate": "string (required, ISO 8601 date-time)",
  "endDate": "string (required, ISO 8601 date-time)",
  "reservePrice": "number (optional, minimum: 0.0)",
  "bidIncrement": "number (optional)",
  "startingBid": "number (optional, minimum: 0.0)"
}
```

**Response (201 Created):** `AuctionDTO`

---

#### GET /api/v1/auction/{id}
**Description:** Get auction details
**Operation ID:** `getAuction`

**Path Parameters:**
- `id` (required, integer int64): Auction ID

**Response (200 OK):** `AuctionDTO`

---

#### PUT /api/v1/auction/{id}
**Description:** Update an auction
**Operation ID:** `updateAuction`

**Path Parameters:**
- `id` (required, integer int64): Auction ID

**Request Body:** `AuctionRequest` (same schema as create)

**Response (200 OK):** `AuctionDTO`

---

#### DELETE /api/v1/auction/{id}
**Description:** Delete an auction
**Operation ID:** `deleteAuction`

**Path Parameters:**
- `id` (required, integer int64): Auction ID

**Response (204 No Content)**

---

#### PUT /api/v1/auction/{id}/deactivate
**Description:** Deactivate an auction
**Operation ID:** `deactivateAuction`

**Path Parameters:**
- `id` (required, integer int64): Auction ID

**Response (200 OK):** `AuctionDTO`

---

#### PUT /api/v1/auction/{id}/reactivate
**Description:** Reactivate an auction
**Operation ID:** `reactivateAuction`

**Path Parameters:**
- `id` (required, integer int64): Auction ID

**Response (200 OK):** `AuctionDTO`

---

### 5. Bidding (bidding-controller)

#### POST /api/v1/bidding
**Description:** Place a bid on an auction
**Operation ID:** `placeBid`

**Request Body:**
```json
{
  "auctionId": "integer (required, int64)",
  "amount": "number (required, minimum: 0.0)"
}
```

**Response (201 Created):** `BiddingDTO`

---

#### GET /api/v1/bidding/auction/{auctionId}
**Description:** Get all bids for a specific auction
**Operation ID:** `getBidsForAuction`

**Path Parameters:**
- `auctionId` (required, integer int64): Auction ID

**Response (200 OK):** `Array<BiddingDTO>`

---

### 6. Offers (offer-controller)

#### POST /api/v1/offer
**Description:** Create a new offer
**Operation ID:** `createNewOffer`

**Request Body:**
```json
{
  "itemId": "integer (required, int64)",
  "withCash": "boolean (optional)",
  "cashAmount": "number (optional)",
  "offeredItemId": "integer (optional, int64)",
  "offerValid": "boolean (optional)"
}
```

**Response (201 Created):** `OfferDTO`

---

#### GET /api/v1/offer/{offerId}
**Description:** Get offer details
**Operation ID:** `getOffer`

**Path Parameters:**
- `offerId` (required, integer int64): Offer ID

**Response (200 OK):** `OfferDTO`

---

#### DELETE /api/v1/offer/{offerId}
**Description:** Delete an offer
**Operation ID:** `deleteOffer`

**Path Parameters:**
- `offerId` (required, integer int64): Offer ID

**Response (204 No Content)**

---

#### GET /api/v1/offer/user/{userId}/sent
**Description:** Get offers sent by a user
**Operation ID:** `getOffersMadeByUser`

**Path Parameters:**
- `userId` (required, integer int64): User ID

**Response (200 OK):** `Array<OfferDTO>`

---

#### GET /api/v1/offer/user/{userId}/received
**Description:** Get offers received by a user
**Operation ID:** `getOffersReceivedByUser`

**Path Parameters:**
- `userId` (required, integer int64): User ID

**Response (200 OK):** `Array<OfferDTO>`

---

#### GET /api/v1/offer/items/{itemId}/offers
**Description:** Get all offers for a specific item
**Operation ID:** `getOffersByItemId`

**Path Parameters:**
- `itemId` (required, integer int64): Item ID

**Response (200 OK):** `Array<OfferDTO>`

---

### 7. Chat (chat-controller)

#### GET /api/v1/chats
**Description:** Get all chats for current user
**Operation ID:** `getChats`

**Response (200 OK):**
```json
{
  "seller": [
    {
      "chat": { /* ChatDTO */ },
      "unreadCount": "integer (int64)"
    }
  ],
  "buyer": [
    {
      "chat": { /* ChatDTO */ },
      "unreadCount": "integer (int64)"
    }
  ]
}
```

---

#### POST /api/v1/chats
**Description:** Start a new chat
**Operation ID:** `startNewChat`

**Request Body:**
```json
{
  "receiverId": "integer (required, int64)",
  "title": "string (optional)",
  "itemId": "integer (optional, int64)"
}
```

**Response (201 Created):** `ChatDTO`

---

#### GET /api/v1/chats/{chatId}/messages
**Description:** Get all messages in a chat
**Operation ID:** `getChatMessages`

**Path Parameters:**
- `chatId` (required, string): Chat ID

**Response (200 OK):** `Array<ChatMessageDTO>`

---

#### POST /api/v1/chats/message
**Description:** Send a message in a chat
**Operation ID:** `sendMessage`

**Request Body:**
```json
{
  "chatId": "string (required, min length: 1)",
  "message": "string (required, min length: 0, max length: 2000)"
}
```

**Response (200 OK):** `ChatMessageDTO`

---

#### DELETE /api/v1/chats/{chatId}
**Description:** Delete a chat
**Operation ID:** `deleteChat`

**Path Parameters:**
- `chatId` (required, string): Chat ID

**Response (200 OK)**

---

### 8. Likes (like-controller)

#### POST /api/v1/likes/items/{itemId}
**Description:** Like an item
**Operation ID:** `likeItem`

**Path Parameters:**
- `itemId` (required, integer int64): Item ID

**Response (200 OK)**

---

#### DELETE /api/v1/likes/items/{itemId}
**Description:** Unlike an item
**Operation ID:** `unlikeItem`

**Path Parameters:**
- `itemId` (required, integer int64): Item ID

**Response (200 OK)**

---

#### GET /api/v1/likes/items
**Description:** Get all items liked by current user
**Operation ID:** `getLikedItems`

**Response (200 OK):** `Array<ItemDTO>`

---

### 9. Reviews (review-controller)

#### POST /api/v1/reviews
**Description:** Create a review
**Operation ID:** `createReview`

**Request Body:**
```json
{
  "userId": "integer (required, int64)",
  "itemId": "integer (optional, int64)",
  "rating": "integer (required, int32, minimum: 1, maximum: 5)",
  "message": "string (optional, min length: 0, max length: 1000)"
}
```

**Response (201 Created):** `ReviewDTO`

---

#### GET /api/v1/reviews/user/{userId}
**Description:** Get all reviews for a user
**Operation ID:** `getReviewsByUser`

**Path Parameters:**
- `userId` (required, integer int64): User ID

**Response (200 OK):** `Array<ReviewDTO>`

---

### 10. Notifications (notifications-controller)

#### GET /api/v1/notifications
**Description:** Get notifications for current user (paginated)
**Operation ID:** `getNotifications`

**Query Parameters:**
- `page` (optional, integer int32, default: 0)
- `size` (optional, integer int32, default: 10)
- `read` (optional, boolean): Filter by read status

**Response (200 OK):** `Array<NotificationDTO>`

---

#### PUT /api/v1/notifications/{id}/markAsRead
**Description:** Mark a notification as read
**Operation ID:** `markAsRead`

**Path Parameters:**
- `id` (required, integer int64): Notification ID

**Response (200 OK):** `NotificationDTO`

---

### 11. Files (file-controller)

#### POST /api/v1/files/upload
**Description:** Upload a file
**Operation ID:** `upload`

**Query Parameters:**
- `oldKey` (optional, string): Key of old file to replace

**Request Body:**
```json
{
  "file": "binary (required)"
}
```

**Response (200 OK):** `object (Map<string, string>)`

---

#### GET /api/v1/files/presign-upload-url
**Description:** Get presigned URL for uploading
**Operation ID:** `getPresignUploadUrl`

**Query Parameters:**
- `key` (required, string): File key

**Response (200 OK):** `object (Map<string, string>)`

---

#### GET /api/v1/files/presign-download-url
**Description:** Get presigned URL for downloading
**Operation ID:** `getPresignDownloadUrl`

**Query Parameters:**
- `key` (required, string): File key

**Response (200 OK):** `object (Map<string, string>)`

---

### 12. Location (state-controller)

#### GET /api/v1/state
**Description:** Get states and LGAs
**Operation ID:** `getStates`

**Query Parameters:**
- `countryCode` (optional, string, default: "NG"): Country code

**Response (200 OK):** `Array<StateDTO>`

---

### 13. Support (support-controller)

#### POST /api/v1/support/request_callback
**Description:** Request a callback from support
**Operation ID:** `requestCallback`

**Request Body:**
```json
{
  "name": "string (required, min length: 1)",
  "phoneNumber": "string (required, min length: 1)",
  "email": "string (optional)",
  "message": "string (optional)"
}
```

**Response (201 Created)**

---

#### POST /api/v1/support/report_abuse
**Description:** Report abuse
**Operation ID:** `reportAbuse`

**Request Body:**
```json
{
  "reason": "string (required, min length: 1)",
  "description": "string (required, min length: 1)"
}
```

**Response (201 Created)**

---

### 14. Home (home-controller)

#### GET /api/v1/home/top_nav
**Description:** Get top navigation data (counts and notifications)
**Operation ID:** `getAuction_1`

**Response (200 OK):**
```json
{
  "auctionsCount": "integer (int64)",
  "messagesCount": "integer (int64)",
  "biddingCount": "integer (int64)",
  "notificationsCount": "integer (int64)",
  "topNotifications": [ /* Array<NotificationDTO> */ ]
}
```

---

### 15. Roles (role-controller)

#### GET /api/v1/auth/roles
**Description:** Get all available roles
**Operation ID:** `getRoles`

**Response (200 OK):** `Array<RoleDTO>`

---

### 16. Ping/Health (ping-controller)

#### GET /
**Description:** Ping endpoint
**Operation ID:** `ping`

**Response (200 OK):** `string`

---

#### GET /checkJwt
**Description:** Check JWT validity
**Operation ID:** `hello`

**Response (200 OK):** `string`

---

## Data Models / Schemas

### UserDTO
```json
{
  "id": "integer (int64)",
  "title": "string",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "avatar": "string",
  "avgRating": "number (double)",
  "reviewCount": "integer (int64)",
  "status": "string (enum: Registered, Verified, Deactivated)",
  "mostRecentReview": { /* ReviewDTO */ },
  "phoneNumberVerified": "boolean",
  "dateVerified": "string (ISO 8601 date-time)",
  "dateCreated": "string (ISO 8601 date-time)"
}
```

### UserRequest
```json
{
  "title": "string",
  "firstName": "string (required, min length: 1)",
  "middleName": "string",
  "lastName": "string (required, min length: 1)",
  "email": "string (required, email format, min length: 1)",
  "phoneNumber": "string (pattern: ^(\\+[1-9]\\d{1,14}|0\\d{9,15})$)",
  "password": "string (required, min length: 1)",
  "roleIds": ["array of integers (int64)"]
}
```

### ProfileRequest
```json
{
  "phoneNumber": "string (pattern: ^(\\+[1-9]\\d{1,14}|0\\d{9,15})$)",
  "avatar": "string"
}
```

### ItemDTO
```json
{
  "id": "integer (int64)",
  "title": "string",
  "description": "string",
  "imageUrls": ["array of strings"],
  "acceptCash": "boolean",
  "cashAmount": "number",
  "location": "string",
  "condition": "string",
  "brand": "string",
  "sold": "boolean",
  "delivered": "boolean",
  "liked": "boolean",
  "published": "boolean",
  "promoted": "boolean",
  "dateCreated": "string (ISO 8601 date-time)",
  "itemCategory": { /* CategoryDTO */ },
  "subcategory": "string",
  "seller": { /* UserDTO */ }
}
```

### ItemRequest
```json
{
  "title": "string (required, min length: 1)",
  "description": "string",
  "imageKeys": ["array of strings"],
  "acceptCash": "boolean",
  "cashAmount": "number",
  "stateCode": "string",
  "lgaCode": "string",
  "condition": "string",
  "brand": "string",
  "itemCategory": "string",
  "subcategory": "string"
}
```

### ItemSearchRequest
```json
{
  "page": "integer (int32)",
  "size": "integer (int32)",
  "search": "string",
  "sort": "string",
  "category": "string",
  "subcategory": "string",
  "stateCode": "string",
  "lgaCode": "string",
  "minAmount": "number",
  "maxAmount": "number",
  "isVerifiedSeller": "boolean",
  "hasDiscount": "boolean"
}
```

### CategoryDTO
```json
{
  "name": "string",
  "description": "string",
  "thumbnail": "string",
  "brands": ["array of strings"],
  "subcategories": ["array of strings"]
}
```

### AuctionDTO
```json
{
  "id": "integer (int64)",
  "startDate": "string (ISO 8601 date-time)",
  "endDate": "string (ISO 8601 date-time)",
  "status": "string (enum: ACTIVE, ENDED, CANCELLED)",
  "reservePrice": "number",
  "bidIncrement": "number",
  "startingBid": "number",
  "item": { /* ItemDTO */ },
  "biddingsCount": "integer (int32)",
  "biddings": [ /* Array<BiddingDTO> */ ]
}
```

### AuctionRequest
```json
{
  "title": "string (required, min length: 1)",
  "description": "string",
  "imageKeys": ["array of strings"],
  "acceptCash": "boolean",
  "cashAmount": "number",
  "stateCode": "string",
  "lgaCode": "string",
  "condition": "string",
  "brand": "string",
  "itemCategory": "string",
  "subcategory": "string",
  "startDate": "string (required, ISO 8601 date-time)",
  "endDate": "string (required, ISO 8601 date-time)",
  "reservePrice": "number (minimum: 0.0)",
  "bidIncrement": "number",
  "startingBid": "number (minimum: 0.0)"
}
```

### BiddingDTO
```json
{
  "auctionId": "integer (int64)",
  "bidder": { /* UserDTO */ },
  "amount": "number",
  "bidTime": "string (ISO 8601 date-time)"
}
```

### BiddingRequest
```json
{
  "auctionId": "integer (required, int64)",
  "amount": "number (required, minimum: 0.0)"
}
```

### OfferDTO
```json
{
  "id": "integer (int64)",
  "withCash": "boolean",
  "cashAmount": "number",
  "status": "string",
  "sentBy": { /* UserDTO */ },
  "item": { /* ItemDTO */ },
  "offeredItem": { /* ItemDTO */ },
  "dateCreated": "string (ISO 8601 date-time)"
}
```

### OfferRequest
```json
{
  "itemId": "integer (required, int64)",
  "withCash": "boolean",
  "cashAmount": "number",
  "offeredItemId": "integer (int64)",
  "offerValid": "boolean"
}
```

### ChatDTO
```json
{
  "chatId": "string",
  "title": "string",
  "initiatorId": "integer (int64)",
  "receiverId": "integer (int64)",
  "initiatorAvatar": "string",
  "receiverAvatar": "string",
  "initiatorName": "string",
  "receiverName": "string",
  "dateCreated": "string (ISO 8601 date-time)"
}
```

### ChatMessageDTO
```json
{
  "message": "string",
  "sentBy": "integer (int64)",
  "chatId": "string",
  "readByReceiver": "boolean",
  "dateCreated": "string (ISO 8601 date-time)"
}
```

### ChatsResponse
```json
{
  "seller": [
    {
      "chat": { /* ChatDTO */ },
      "unreadCount": "integer (int64)"
    }
  ],
  "buyer": [
    {
      "chat": { /* ChatDTO */ },
      "unreadCount": "integer (int64)"
    }
  ]
}
```

### ChatWithUnreadCountDTO
```json
{
  "chat": { /* ChatDTO */ },
  "unreadCount": "integer (int64)"
}
```

### StartChatRequest
```json
{
  "receiverId": "integer (required, int64)",
  "title": "string",
  "itemId": "integer (int64)"
}
```

### CreateMessageRequest
```json
{
  "chatId": "string (required, min length: 1)",
  "message": "string (required, min length: 0, max length: 2000)"
}
```

### ReviewDTO
```json
{
  "rating": "integer (int32)",
  "message": "string",
  "userId": "integer (int64)",
  "postedById": "integer (int64)",
  "createdDate": "string (ISO 8601 date-time)"
}
```

### ReviewRequest
```json
{
  "userId": "integer (required, int64)",
  "itemId": "integer (int64)",
  "rating": "integer (required, int32, minimum: 1, maximum: 5)",
  "message": "string (min length: 0, max length: 1000)"
}
```

### NotificationDTO
```json
{
  "id": "integer (int64)",
  "type": "string (enum: NEW_BID, OUTBID, NEW_CHAT_MESSAGE)",
  "avatar": "string",
  "title": "string",
  "message": "string",
  "resourceLink": "string",
  "read": "boolean",
  "dateCreated": "string (ISO 8601 date-time)"
}
```

### StateDTO
```json
{
  "name": "string",
  "code": "string",
  "lgas": [ /* Array<LgaDTO> */ ]
}
```

### LgaDTO
```json
{
  "name": "string",
  "code": "string"
}
```

### RoleDTO
```json
{
  "id": "integer (int64)",
  "name": "string",
  "system": "boolean"
}
```

### PerformanceDTO
```json
{
  "impressionsCount": "integer (int32)",
  "visitorsCount": "integer (int32)",
  "phoneViewsCount": "integer (int32)",
  "chatRequestsCount": "integer (int32)"
}
```

### TopNavDTO
```json
{
  "auctionsCount": "integer (int64)",
  "messagesCount": "integer (int64)",
  "biddingCount": "integer (int64)",
  "notificationsCount": "integer (int64)",
  "topNotifications": [ /* Array<NotificationDTO> */ ]
}
```

### AuthRequest
```json
{
  "username": "string (required, min length: 1)",
  "password": "string (required, min length: 1)"
}
```

### AuthResponse
```json
{
  "jwt": "string",
  "user": { /* UserDTO */ }
}
```

### BaseResponse
```json
{
  "responseCode": "string",
  "responseMessage": "string"
}
```

### ChangePasswordRequest
```json
{
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### PasswordResetRequest
```json
{
  "token": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### ProfileVerificationRequest
```json
{
  "idType": "string (enum: Drivers_License, International_Passport, National_ID)",
  "bvn": "string (required, min length: 1)",
  "idFilePath": "string"
}
```

### CallbackRequest
```json
{
  "name": "string (required, min length: 1)",
  "phoneNumber": "string (required, min length: 1)",
  "email": "string",
  "message": "string"
}
```

### AbuseRequest
```json
{
  "reason": "string (required, min length: 1)",
  "description": "string (required, min length: 1)"
}
```

---

## Enumerations

### User Status
- `Registered`
- `Verified`
- `Deactivated`

### Auction Status
- `ACTIVE`
- `ENDED`
- `CANCELLED`

### Item Condition
- `NEW`
- `FAIRLY_USED`

### Notification Type
- `NEW_BID`
- `OUTBID`
- `NEW_CHAT_MESSAGE`

### ID Type (Profile Verification)
- `Drivers_License`
- `International_Passport`
- `National_ID`

---

## Pagination Pattern

The API uses standard pagination parameters for list endpoints:
- `page`: Zero-based page index (default: 0)
- `size`: Number of items per page (varies by endpoint, typically 10-15)

Endpoints that support pagination:
- `/api/v1/user/findAll` (default size: 15)
- `/api/v1/auction` (default size: 10)
- `/api/v1/notifications` (default size: 10)

---

## Search and Filtering Pattern

### Items and Auctions
Both items and auctions support comprehensive filtering:
- **Text Search**: `search` parameter for keyword search
- **Location**: `stateCode` and `lgaCode` for geographic filtering
- **Category**: `category` and `subcategory` for taxonomy filtering
- **Price Range**: `minAmount` and `maxAmount` for price filtering
- **Seller**: `isVerifiedSeller` boolean filter
- **Promotions**: `hasDiscount` boolean filter
- **Sorting**: `sort` parameter for ordering results

---

## File Upload Pattern

The API supports two methods for file uploads:

### 1. Direct Upload
`POST /api/v1/files/upload`
- Upload binary file directly
- Optionally replace an existing file with `oldKey` parameter
- Returns file metadata

### 2. Presigned URLs
- `GET /api/v1/files/presign-upload-url`: Get presigned URL for uploading
- `GET /api/v1/files/presign-download-url`: Get presigned URL for downloading
- Upload/download directly to/from storage (e.g., S3)

When creating items or auctions, use `imageKeys` array to reference uploaded files.

---

## Phone Number Format

Phone numbers must match the pattern: `^(\\+[1-9]\\d{1,14}|0\\d{9,15})$`

Valid formats:
- International format: `+234XXXXXXXXXX`
- Local format: `0XXXXXXXXXX`

---

## Date/Time Format

All date-time fields use ISO 8601 format:
- Example: `2024-01-15T14:30:00Z`
- Timezone: UTC recommended

---

## Error Handling

The API uses standard HTTP status codes:
- `200 OK`: Successful GET/PUT/DELETE
- `201 Created`: Successful POST creating a resource
- `204 No Content`: Successful DELETE with no response body
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Special Notes

### Authentication Flow
1. **Signup**: `POST /api/v1/user/signup` → Returns JWT + UserDTO
2. **Login**: `POST /api/v1/auth/login` → Returns JWT + UserDTO
3. **Use JWT**: Include in Authorization header for all subsequent requests
4. **Logout**: `POST /api/v1/auth/logout` → Invalidates token

### Email Verification
After signup, users receive a verification email. Use:
- `GET /api/v1/user/{id}/verify-email?code={code}` to verify

### Phone Number Verification
After adding/updating phone number:
- `POST /api/v1/user/{id}/verify-phoneNumber?code={code}` to verify

### Profile Verification (KYC)
For verified seller status:
- `POST /api/v1/user/{id}/verifyProfile` with BVN and ID document

### Password Management
- **Forgot Password**: `POST /api/v1/auth/forgot-password?email={email}`
- **Reset Password**: `POST /api/v1/auth/reset-password` with token
- **Change Password**: `POST /api/v1/user/change-password` (requires authentication)

### Chat System
- Chats are organized by role (seller/buyer)
- Each chat has a unique `chatId` (string)
- Messages have character limit of 2000
- Unread counts are tracked per chat

### Offer System
- Offers can include cash, items, or both
- `withCash`: true if offer includes cash amount
- `offeredItemId`: ID of item being offered in trade
- Users can view sent and received offers separately

### Auction System
- Auctions have start and end dates
- Status automatically updates based on dates
- Reserve price is minimum acceptable bid
- Bid increment defines minimum increase between bids
- Starting bid is the initial minimum bid

### Location System
- Default country: Nigeria (NG)
- States contain multiple LGAs (Local Government Areas)
- Both use code-based identification

### Likes/Favorites
- Like items with `POST /api/v1/likes/items/{itemId}`
- Unlike with `DELETE` on same endpoint
- View all liked items with `GET /api/v1/likes/items`

### Reviews/Ratings
- Rating scale: 1-5 stars
- Message max length: 1000 characters
- Reviews are tied to users and optionally items
- Average rating and review count tracked on UserDTO

### Notifications
- Three types: NEW_BID, OUTBID, NEW_CHAT_MESSAGE
- Can be filtered by read status
- Mark as read individually
- Top notifications available via `/api/v1/home/top_nav`

### Top Navigation Data
The `/api/v1/home/top_nav` endpoint provides dashboard data:
- Counts for auctions, messages, bids, notifications
- Top recent notifications array

---

## Contact Information

- **Website**: https://flipit-web.vercel.app/
- **Email**: flipialphatest@gmail.com
- **License**: https://flipit-web.vercel.app/license

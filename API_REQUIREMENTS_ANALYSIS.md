# FLIPIT API REQUIREMENTS - COMPREHENSIVE ANALYSIS
**Date:** January 17, 2026
**Prepared for:** Backend Development Team
**Project:** FlipIt Web Application - Item Exchange & Auction Marketplace

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Part 1: Current Integration Audit](#part-1-current-integration-audit)
3. [Part 2: Competitive Analysis & Flow Gaps](#part-2-competitive-analysis--flow-gaps)
4. [Detailed API Requirements](#detailed-api-requirements)
5. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 EXECUTIVE SUMMARY

### Project Overview
FlipIt is a peer-to-peer marketplace enabling users to:
- Exchange items for other items
- Sell items for cash
- Trade items + cash for higher-value items
- Create and participate in auctions
- Bid on auctions and win items

### Current Status
- ✅ **60% API Integration Complete** - Core features functional
- ⚠️ **40% Missing or Incorrect** - Critical business logic gaps
- 🚨 **Major Gaps:** Offer acceptance, transaction management, escrow, shipping

### Critical Findings
1. **Offer Accept/Reject APIs don't exist** - Users can't complete transactions
2. **Transaction system fully built in frontend but APIs not documented**
3. **Endpoint inconsistencies** - Many services use wrong API paths
4. **Missing advanced features** - Counter offers, proxy bidding, watchlist
5. **Payment & escrow integration incomplete**

---

## 📊 PART 1: CURRENT INTEGRATION AUDIT

### 1.1 Successfully Integrated APIs ✅

#### Authentication & User Management
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `POST /api/v1/auth/login` | ✅ Working | Login page |
| `POST /api/v1/auth/register` | ✅ Working | Signup page |
| `POST /api/v1/auth/logout` | ✅ Working | Navigation |
| `GET /api/v1/auth/me` | ✅ Working | Auth context |
| `GET /api/v1/auth/login/google` | ✅ Working | OAuth login |
| `POST /api/v1/auth/forgot-password` | ✅ Working | Reset password |
| `GET /api/v1/user/profile` | ✅ Working | Profile page |
| `PUT /api/v1/user/update-profile` | ✅ Working | Settings |

#### Items Management
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `GET /api/v1/items` | ✅ Working | Browse/search pages |
| `GET /api/v1/items/{id}` | ✅ Working | Item details |
| `POST /api/v1/items` | ✅ Working | Create item |
| `PUT /api/v1/items/{id}` | ✅ Working | Edit item |
| `DELETE /api/v1/items/{id}` | ✅ Working | Delete item |
| `GET /api/v1/items/categories` | ✅ Working | Category filters |
| `GET /api/v1/items/itemConditions` | ✅ Working | Item creation |

#### Auctions
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `GET /api/v1/auction` | ✅ Working | Auctions page |
| `GET /api/v1/auction/{id}` | ✅ Working | Auction details |
| `POST /api/v1/auction` | ✅ Working | Create auction |
| `PUT /api/v1/auction/{id}` | ✅ Working | Edit auction |
| `DELETE /api/v1/auction/{id}` | ✅ Working | Delete auction |
| `PUT /api/v1/auction/{id}/deactivate` | ✅ Working | Manage auction |
| `PUT /api/v1/auction/{id}/reactivate` | ✅ Working | Manage auction |

#### Bidding
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `POST /api/v1/bidding` | ✅ Working | Auction details |
| `GET /api/v1/bidding/auction/{auctionId}` | ✅ Working | Bid history |

#### Chat/Messaging
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `GET /api/v1/chats` | ✅ Working | Messages page |
| `GET /api/v1/chats/{chatId}/messages` | ✅ Working | Chat detail |
| `POST /api/v1/chats/message` | ✅ Working | Send message |
| `DELETE /api/v1/chats/{chatId}` | ✅ Working | Delete chat |

#### Likes/Favorites
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `POST /api/v1/likes/items/{itemId}` | ✅ Working | Item cards |
| `DELETE /api/v1/likes/items/{itemId}` | ✅ Working | Unlike items |
| `GET /api/v1/likes/items` | ✅ Working | Saved items page |

#### Reviews
| API Endpoint | Status | Where Used |
|-------------|--------|------------|
| `POST /api/v1/reviews` | ✅ Working | Transaction completion |
| `GET /api/v1/reviews/user/{userId}` | ✅ Working | User profiles |

---

### 1.2 APIs with Wrong Endpoints ⚠️

| Current Endpoint | Correct Endpoint | Where Used | Impact |
|-----------------|------------------|------------|--------|
| `POST /chats/create` | `POST /api/v1/chats` | Item details | **HIGH** - Can't start chats properly |
| `GET /notifications/get-notifications` | `GET /api/v1/notifications` | Notifications page | **HIGH** - Notifications broken |
| `PUT /notifications/{id}/markAsRead` | `PUT /api/v1/notifications/{id}/markAsRead` | Notification list | **MEDIUM** - Can't mark as read |
| `POST /upload` | `POST /api/v1/files/upload` | File uploads | **HIGH** - Images may fail |
| `GET /files/presign-upload-url` | `GET /api/v1/files/presign-upload-url` | Image optimization | **MEDIUM** |
| `GET /states` | `GET /api/v1/state` | Location selectors | **HIGH** - Location broken |
| `GET /bids/get-user-bids` | Not documented | Bidding history | **MEDIUM** |

---

### 1.3 Critical Missing APIs 🚨

## **OFFER MANAGEMENT** (CRITICAL - Transaction Blocker)

### 1. Accept Offer
**Endpoint:** `PUT /api/v1/offer/{offerId}/accept`
**Page/Component:**
- `/app/ui/wrappers/Offers.tsx` - Offers list
- `/app/ui/common/modals/AcceptOfferModal.tsx` - Accept modal
- `/app/(user)/(pages)/manage-item/[id]/page.tsx` - Item management

**What it does:**
- Seller accepts buyer's offer on their item
- Creates a new transaction record
- Changes offer status to "ACCEPTED"
- Locks the item from other offers
- Notifies buyer of acceptance
- Redirects both parties to transaction page

**Request Body:**
```json
{
  "offerId": 123,
  "acceptedAt": "2026-01-17T10:30:00Z"
}
```

**Response:**
```json
{
  "offer": {
    "id": 123,
    "status": "ACCEPTED",
    "acceptedAt": "2026-01-17T10:30:00Z"
  },
  "transaction": {
    "id": 456,
    "transactionType": "ITEM_PLUS_CASH",
    "status": "OFFER_ACCEPTED",
    "redirectUrl": "/transaction/456"
  }
}
```

**Current Status:** NOT INTEGRATED - Service method exists but no API
**Priority:** 🔴 **CRITICAL** - Blocks entire transaction flow
**Business Impact:** Users cannot complete any transactions

---

### 2. Reject Offer
**Endpoint:** `PUT /api/v1/offer/{offerId}/reject`
**Page/Component:**
- `/app/ui/wrappers/Offers.tsx` - Offers list
- `/app/ui/common/modals/DeclineOfferModal.tsx` - Decline modal

**What it does:**
- Seller rejects buyer's offer
- Updates offer status to "REJECTED"
- Unlocks the item for other offers
- Notifies buyer of rejection
- Optionally provides rejection reason

**Request Body:**
```json
{
  "offerId": 123,
  "rejectionReason": "Price too low",
  "rejectedAt": "2026-01-17T10:30:00Z"
}
```

**Response:**
```json
{
  "id": 123,
  "status": "REJECTED",
  "rejectionReason": "Price too low",
  "rejectedAt": "2026-01-17T10:30:00Z"
}
```

**Current Status:** NOT INTEGRATED - Service method exists but no API
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Sellers can't manage incoming offers

---

### 3. Get Offers Sent by User (Corrected)
**Endpoint:** `GET /api/v1/offer/user/{userId}/sent`
**Page/Component:**
- `/app/(user)/(pages)/offers/page.tsx` - "Sent" tab

**What it does:**
- Retrieves all offers the user has made on other people's items
- Shows offer status (pending, accepted, rejected)
- Allows user to cancel pending offers
- Displays item details for each offer

**Query Parameters:**
```
?page=0&size=10&status=PENDING
```

**Response:**
```json
[
  {
    "id": 123,
    "status": "PENDING",
    "withCash": true,
    "cashAmount": 50000,
    "offeredItem": { /* ItemDTO */ },
    "item": { /* ItemDTO they want */ },
    "sentBy": { /* UserDTO */ },
    "dateCreated": "2026-01-15T10:00:00Z"
  }
]
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/v1/offer/user/{userId}/offers`
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Users can't see their sent offers

---

### 4. Get Offers Received by User (Corrected)
**Endpoint:** `GET /api/v1/offer/user/{userId}/received`
**Page/Component:**
- `/app/(user)/(pages)/offers/page.tsx` - "Received" tab

**What it does:**
- Retrieves all offers received on the user's items
- Shows who made the offer and what they're offering
- Allows accepting or rejecting offers
- Highlights new/unread offers

**Query Parameters:**
```
?page=0&size=10&status=PENDING&unreadOnly=true
```

**Response:**
```json
[
  {
    "id": 456,
    "status": "PENDING",
    "withCash": false,
    "offeredItem": { /* ItemDTO buyer is offering */ },
    "item": { /* Your item */ },
    "sentBy": { /* Buyer UserDTO */ },
    "dateCreated": "2026-01-16T14:30:00Z",
    "isRead": false
  }
]
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/v1/offer/user/{userId}/offers`
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Users can't manage incoming offers

---

## **ITEM MANAGEMENT**

### 5. Mark Item as Sold
**Endpoint:** `PUT /api/v1/items/{id}/markAsSold`
**Page/Component:**
- `/app/(user)/(pages)/manage-item/[id]/page.tsx` - Item actions
- `/app/(user)/(pages)/my-adverts/page.tsx` - My items list

**What it does:**
- Marks an item as sold
- Removes item from active listings
- Prevents new offers/bids
- Updates item status to SOLD
- Optionally links to transaction

**Request Body:**
```json
{
  "transactionId": 456, // optional
  "soldAt": "2026-01-17T10:30:00Z"
}
```

**Response:**
```json
{
  "id": 789,
  "title": "iPhone 14 Pro",
  "sold": true,
  "soldAt": "2026-01-17T10:30:00Z",
  "published": false
}
```

**Current Status:** NOT INTEGRATED - API exists but not called from frontend
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Items remain active after being sold

---

### 6. Get User's Items (My Adverts)
**Endpoint:** `GET /api/v1/items/user/{userId}`
**Page/Component:**
- `/app/(user)/(pages)/my-adverts/page.tsx` - My adverts page

**What it does:**
- Retrieves all items posted by the user
- Filters by status (active, sold, draft)
- Shows item statistics (views, likes, offers)
- Allows bulk actions

**Query Parameters:**
```
?status=ACTIVE&page=0&size=20
```

**Response:**
```json
[
  {
    "id": 123,
    "title": "MacBook Pro 2023",
    "sold": false,
    "published": true,
    "views": 245,
    "likes": 12,
    "offers": 3,
    "dateCreated": "2026-01-10T08:00:00Z"
  }
]
```

**Current Status:** NOT INTEGRATED - Page shows placeholder
**Priority:** 🟠 **HIGH**
**Business Impact:** Users can't manage their listings

---

## **USER VERIFICATION & PERFORMANCE**

### 7. User Performance Metrics
**Endpoint:** `GET /api/v1/user/performance`
**Page/Component:**
- `/app/(user)/(pages)/performance/page.tsx` - Performance dashboard
- User profile stats section

**What it does:**
- Returns user's item performance analytics
- Shows impressions (views), visitors, phone reveals, chat requests
- Helps sellers understand their reach
- Provides insights for optimization

**Response:**
```json
{
  "impressionsCount": 1250,
  "visitorsCount": 340,
  "phoneViewsCount": 45,
  "chatRequestsCount": 28
}
```

**Current Status:** NOT INTEGRATED
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Users can't track their performance

---

### 8. Email Verification
**Endpoint:** `GET /api/v1/user/{id}/verify-email`
**Page/Component:**
- `/app/(user)/(pages)/settings/components/VerificationContent.tsx` - Email verification
- Email verification flow after signup

**What it does:**
- Verifies user's email address with code sent via email
- Updates user status to email-verified
- May unlock features requiring verification
- Sends confirmation notification

**Query Parameters:**
```
?code=ABC123XYZ
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "emailVerified": true,
    "dateVerified": "2026-01-17T10:30:00Z"
  }
}
```

**Current Status:** NOT INTEGRATED
**Priority:** 🟠 **HIGH**
**Business Impact:** Can't verify email addresses

---

### 9. Phone Number Verification
**Endpoint:** `POST /api/v1/user/{id}/verify-phoneNumber`
**Page/Component:**
- `/app/(user)/(pages)/settings/components/PhoneVerificationStep.tsx` - Phone verification

**What it does:**
- Verifies user's phone number with SMS code
- Updates user profile with verified phone
- Required for certain trust features
- May enable SMS notifications

**Query Parameters:**
```
?code=123456
```

**Response:**
```json
{
  "responseCode": "00",
  "responseMessage": "Phone number verified successfully",
  "user": {
    "phoneNumber": "+2348012345678",
    "phoneNumberVerified": true
  }
}
```

**Current Status:** PARTIALLY INTEGRATED - Wrong endpoint format
**Priority:** 🟠 **HIGH**
**Business Impact:** Users can't verify phone numbers

---

### 10. Profile Verification (KYC)
**Endpoint:** `POST /api/v1/user/{id}/verifyProfile`
**Page/Component:**
- `/app/(user)/(pages)/settings/components/ProfileVerificationStep.tsx` - KYC verification

**What it does:**
- Submits ID document and BVN for seller verification
- Enables "Verified Seller" badge
- Required for certain transaction limits
- Increases buyer trust

**Request Body:**
```json
{
  "idType": "National_ID",
  "bvn": "12345678901",
  "idFilePath": "uploads/id-documents/user123-nationalid.jpg"
}
```

**Response:**
```json
{
  "message": "Verification submitted. Review in 24-48 hours.",
  "verificationStatus": "PENDING",
  "submittedAt": "2026-01-17T10:30:00Z"
}
```

**Current Status:** PARTIALLY INTEGRATED - Service exists but not fully in UI
**Priority:** 🟠 **HIGH**
**Business Impact:** Can't verify sellers for trust

---

## **TRANSACTION SYSTEM** (Entire System Not Documented)

**Context:** Transaction system is fully built in frontend with comprehensive UI, but APIs are NOT in the API documentation. These are essential for the core business.

### 11. Create Transaction
**Endpoint:** `POST /api/v1/transactions`
**Page/Component:**
- `/app/services/transaction.service.ts` - `createTransaction()`
- Triggered when offer is accepted or auction is won

**What it does:**
- Creates a new transaction record after offer acceptance
- Determines transaction type (CASH_ONLY, ITEM_EXCHANGE, ITEM_PLUS_CASH, AUCTION_WIN)
- Sets initial status to OFFER_ACCEPTED
- Links buyer, seller, items involved
- Initializes escrow if payment required

**Request Body:**
```json
{
  "offerId": 123,
  "auctionId": null,
  "buyerId": 456,
  "sellerId": 789,
  "itemId": 321,
  "offeredItemId": 654,
  "transactionType": "ITEM_PLUS_CASH",
  "cashAmount": 50000,
  "totalAmount": 250000
}
```

**Response:**
```json
{
  "id": 999,
  "transactionType": "ITEM_PLUS_CASH",
  "status": "OFFER_ACCEPTED",
  "buyer": { /* UserDTO */ },
  "seller": { /* UserDTO */ },
  "item": { /* ItemDTO */ },
  "offeredItem": { /* ItemDTO */ },
  "cashAmount": 50000,
  "totalAmount": 250000,
  "createdAt": "2026-01-17T10:30:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Cannot create transactions at all

---

### 12. Get Transaction by ID
**Endpoint:** `GET /api/v1/transactions/{id}`
**Page/Component:**
- `/app/(user)/(pages)/transaction/[id]/page.tsx` - Transaction detail page
- `/app/ui/wrappers/TransactionHub.tsx` - Main transaction UI

**What it does:**
- Retrieves complete transaction details
- Includes buyer/seller info, items, payment status, shipping status
- Shows transaction timeline/history
- Provides next action recommendations

**Response:**
```json
{
  "id": 999,
  "transactionType": "ITEM_PLUS_CASH",
  "status": "SHIPPING_PENDING",
  "buyer": { /* Full UserDTO */ },
  "seller": { /* Full UserDTO */ },
  "item": { /* Full ItemDTO */ },
  "offeredItem": { /* Full ItemDTO */ },
  "cashAmount": 50000,
  "totalAmount": 250000,
  "payment": {
    "status": "IN_ESCROW",
    "paidAt": "2026-01-17T11:00:00Z",
    "paymentMethod": "CARD"
  },
  "shipping": {
    "sellerShipping": {
      "status": "PENDING",
      "waybillNumber": null
    },
    "buyerShipping": {
      "status": "PENDING",
      "waybillNumber": null
    }
  },
  "timeline": [
    {
      "status": "OFFER_ACCEPTED",
      "timestamp": "2026-01-17T10:30:00Z"
    },
    {
      "status": "PAYMENT_RECEIVED",
      "timestamp": "2026-01-17T11:00:00Z"
    }
  ],
  "createdAt": "2026-01-17T10:30:00Z",
  "updatedAt": "2026-01-17T11:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Transaction page cannot load

---

### 13. Update Transaction Status
**Endpoint:** `PUT /api/v1/transactions/{id}/status`
**Page/Component:**
- `/app/ui/transaction/PaymentSection.tsx` - After payment
- `/app/ui/transaction/ShippingSection.tsx` - After shipping
- Various transaction status updates

**What it does:**
- Updates transaction status (e.g., PAYMENT_PENDING → PAYMENT_RECEIVED)
- Validates status transitions
- Triggers notifications
- Updates timeline
- May trigger automated actions (e.g., release escrow)

**Request Body:**
```json
{
  "status": "PAYMENT_RECEIVED",
  "metadata": {
    "paymentReference": "PAY-123456",
    "paidAt": "2026-01-17T11:00:00Z"
  }
}
```

**Response:**
```json
{
  "id": 999,
  "status": "PAYMENT_RECEIVED",
  "previousStatus": "PAYMENT_PENDING",
  "updatedAt": "2026-01-17T11:00:00Z",
  "nextAction": "SHIP_ITEM"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Status cannot be updated

---

### 14. Cancel Transaction
**Endpoint:** `PUT /api/v1/transactions/{id}/cancel`
**Page/Component:**
- `/app/ui/wrappers/TransactionHub.tsx` - Cancel button
- Transaction overview sidebar

**What it does:**
- Cancels an active transaction
- Refunds payment if already made
- Unlocks items involved
- Notifies both parties
- Records cancellation reason

**Request Body:**
```json
{
  "reason": "Buyer no longer interested",
  "cancelledBy": "BUYER"
}
```

**Response:**
```json
{
  "id": 999,
  "status": "CANCELLED",
  "cancellationReason": "Buyer no longer interested",
  "cancelledBy": "BUYER",
  "cancelledAt": "2026-01-17T12:00:00Z",
  "refundStatus": "PROCESSING"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Users stuck in unwanted transactions

---

### 15. Complete Transaction
**Endpoint:** `PUT /api/v1/transactions/{id}/complete`
**Page/Component:**
- `/app/ui/transaction/ShippingSection.tsx` - Confirm delivery button
- Transaction completion flow

**What it does:**
- Marks transaction as completed
- Releases escrow payment to seller
- Unlocks review/rating
- Updates item status to sold
- Triggers completion notifications

**Request Body:**
```json
{
  "completedBy": "BUYER",
  "deliveryConfirmed": true,
  "completedAt": "2026-01-20T15:00:00Z"
}
```

**Response:**
```json
{
  "id": 999,
  "status": "REVIEW_PENDING",
  "completedAt": "2026-01-20T15:00:00Z",
  "escrowStatus": "RELEASED",
  "reviewsRequired": true
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Transactions cannot be completed

---

### 16. Get User Transactions
**Endpoint:** `GET /api/v1/transactions/user/{userId}`
**Page/Component:**
- Transaction history page
- User dashboard

**What it does:**
- Lists all transactions for a user
- Filters by role (buyer/seller)
- Filters by status
- Pagination support

**Query Parameters:**
```
?role=BUYER&status=COMPLETED&page=0&size=10
```

**Response:**
```json
[
  {
    "id": 999,
    "transactionType": "CASH_ONLY",
    "status": "COMPLETED",
    "otherParty": { /* UserDTO */ },
    "item": { /* ItemDTO */ },
    "amount": 150000,
    "completedAt": "2026-01-15T10:00:00Z"
  }
]
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🟠 **HIGH**
**Business Impact:** No transaction history

---

## **PAYMENT & ESCROW SYSTEM**

### 17. Initialize Payment
**Endpoint:** `POST /api/v1/transactions/payment/initialize`
**Page/Component:**
- `/app/ui/transaction/PaymentSection.tsx` - Pay Now button

**What it does:**
- Initializes payment with payment gateway (Paystack/Flutterwave)
- Creates payment session
- Returns authorization URL for redirect
- Sets up escrow hold

**Request Body:**
```json
{
  "transactionId": 999,
  "amount": 250000,
  "paymentMethod": "CARD",
  "callbackUrl": "https://flipit.ng/transaction/999/payment/callback"
}
```

**Response:**
```json
{
  "authorizationUrl": "https://checkout.paystack.com/abc123",
  "accessCode": "abc123xyz",
  "reference": "PAY-999-123456",
  "expiresAt": "2026-01-17T12:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** No payment possible

---

### 18. Verify Payment
**Endpoint:** `POST /api/v1/transactions/payment/verify`
**Page/Component:**
- `/app/(user)/(pages)/transaction/[id]/payment/callback/page.tsx` - Payment callback

**What it does:**
- Verifies payment with payment gateway
- Updates transaction payment status
- Moves payment to escrow
- Notifies seller of payment
- Updates transaction status

**Request Body:**
```json
{
  "reference": "PAY-999-123456",
  "transactionId": 999
}
```

**Response:**
```json
{
  "verified": true,
  "amount": 250000,
  "paidAt": "2026-01-17T11:30:00Z",
  "paymentMethod": "CARD",
  "reference": "PAY-999-123456",
  "escrowStatus": "HELD",
  "transactionStatus": "PAYMENT_RECEIVED"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Payment verification fails

---

### 19. Get Payment Details
**Endpoint:** `GET /api/v1/transactions/payment/{paymentId}`
**Page/Component:**
- Transaction payment tab
- Payment history

**What it does:**
- Retrieves payment details
- Shows payment method, status, timestamps
- Displays escrow status
- Provides transaction reference

**Response:**
```json
{
  "id": 456,
  "transactionId": 999,
  "amount": 250000,
  "status": "IN_ESCROW",
  "paymentMethod": "CARD",
  "reference": "PAY-999-123456",
  "paidAt": "2026-01-17T11:30:00Z",
  "escrowReleaseDate": null,
  "gatewayResponse": {
    "status": "success",
    "message": "Payment successful"
  }
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Limited payment transparency

---

### 20. Release Escrow
**Endpoint:** `PUT /api/v1/transactions/{id}/release-escrow`
**Page/Component:**
- Automatic trigger when buyer confirms delivery
- Admin panel for disputes

**What it does:**
- Releases escrowed funds to seller
- Triggered by delivery confirmation or dispute resolution
- Updates payment status
- Transfers funds to seller's wallet/bank
- Records release timestamp

**Request Body:**
```json
{
  "releaseReason": "DELIVERY_CONFIRMED",
  "releasedBy": "BUYER",
  "confirmedAt": "2026-01-20T15:00:00Z"
}
```

**Response:**
```json
{
  "transactionId": 999,
  "paymentStatus": "RELEASED",
  "releasedAmount": 250000,
  "releasedTo": "SELLER",
  "releasedAt": "2026-01-20T15:05:00Z",
  "sellerBalance": 1250000
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Sellers don't get paid

---

### 21. Request Refund
**Endpoint:** `POST /api/v1/transactions/{id}/refund`
**Page/Component:**
- Transaction dispute section
- Cancel transaction with refund

**What it does:**
- Processes refund request
- Returns escrowed funds to buyer
- Updates transaction status
- Records refund reason
- Notifies both parties

**Request Body:**
```json
{
  "reason": "Item not as described",
  "requestedBy": "BUYER",
  "supportingDocuments": ["proof1.jpg", "proof2.jpg"]
}
```

**Response:**
```json
{
  "refundId": 789,
  "transactionId": 999,
  "amount": 250000,
  "status": "PROCESSING",
  "refundReason": "Item not as described",
  "estimatedCompletionDate": "2026-01-25T10:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** No buyer protection

---

## **SHIPPING & LOGISTICS** (GIG Logistics Integration)

### 22. Create Shipment
**Endpoint:** `POST /api/v1/shipping/gig/create`
**Page/Component:**
- `/app/ui/transaction/ShippingSection.tsx` - Arrange shipping

**What it does:**
- Creates shipment with GIG Logistics
- Generates waybill number
- Schedules pickup from seller
- Provides tracking link
- Calculates shipping cost

**Request Body:**
```json
{
  "transactionId": 999,
  "senderName": "John Seller",
  "senderPhone": "+2348012345678",
  "senderAddress": "123 Market St, Yaba",
  "senderStateCode": "LA",
  "senderLgaCode": "YAB",
  "receiverName": "Jane Buyer",
  "receiverPhone": "+2348098765432",
  "receiverAddress": "456 Allen Ave, Ikeja",
  "receiverStateCode": "LA",
  "receiverLgaCode": "IKJ",
  "itemDescription": "MacBook Pro 2023",
  "itemValue": 450000,
  "itemWeight": 2.5,
  "deliveryType": "STANDARD",
  "paymentType": "PREPAID"
}
```

**Response:**
```json
{
  "shipmentId": "SHIP-999-001",
  "waybillNumber": "GIG123456789NG",
  "estimatedDelivery": "2026-01-20T17:00:00Z",
  "shippingCost": 3500,
  "trackingUrl": "https://gig.com.ng/track/GIG123456789NG",
  "pickupScheduled": "2026-01-18T09:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Cannot ship items

---

### 23. Get Shipping Quote
**Endpoint:** `POST /api/v1/shipping/gig/quote`
**Page/Component:**
- Shipping section before creating shipment
- Cost estimation

**What it does:**
- Calculates shipping cost before creating shipment
- Based on origin, destination, weight, delivery type
- Helps users estimate total transaction cost

**Request Body:**
```json
{
  "originStateCode": "LA",
  "originLgaCode": "YAB",
  "destinationStateCode": "LA",
  "destinationLgaCode": "IKJ",
  "weight": 2.5,
  "deliveryType": "STANDARD"
}
```

**Response:**
```json
{
  "cost": 3500,
  "estimatedDays": 2,
  "deliveryType": "STANDARD",
  "validUntil": "2026-01-17T23:59:59Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🟠 **HIGH**
**Business Impact:** No cost transparency

---

### 24. Track Shipment
**Endpoint:** `GET /api/v1/shipping/gig/track/{waybillNumber}`
**Page/Component:**
- `/app/ui/transaction/ShippingSection.tsx` - Track delivery section

**What it does:**
- Retrieves real-time shipment tracking info
- Shows current status and location
- Provides delivery history
- Estimates delivery time

**Response:**
```json
{
  "waybillNumber": "GIG123456789NG",
  "status": "IN_TRANSIT",
  "currentLocation": "Lagos Distribution Center",
  "estimatedDelivery": "2026-01-20T17:00:00Z",
  "trackingHistory": [
    {
      "status": "PICKED_UP",
      "location": "Yaba Pickup Point",
      "timestamp": "2026-01-18T10:30:00Z"
    },
    {
      "status": "AT_FACILITY",
      "location": "Lagos Distribution Center",
      "timestamp": "2026-01-18T14:00:00Z"
    },
    {
      "status": "OUT_FOR_DELIVERY",
      "location": "Ikeja Delivery Hub",
      "timestamp": "2026-01-19T08:00:00Z"
    }
  ]
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** No delivery visibility

---

### 25. Schedule Pickup
**Endpoint:** `POST /api/v1/shipping/gig/schedule-pickup`
**Page/Component:**
- Shipping section after creating shipment

**What it does:**
- Schedules courier pickup from seller
- Confirms pickup time slot
- Sends pickup notification to seller
- Provides pickup confirmation code

**Request Body:**
```json
{
  "shipmentId": "SHIP-999-001",
  "pickupDate": "2026-01-18",
  "pickupTimeSlot": "MORNING",
  "specialInstructions": "Call before arriving"
}
```

**Response:**
```json
{
  "pickupScheduled": true,
  "pickupDate": "2026-01-18T09:00:00Z",
  "pickupWindow": "09:00 - 12:00",
  "confirmationCode": "PK-123456",
  "courierPhone": "+2348011112222"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🟠 **HIGH**
**Business Impact:** Manual pickup coordination

---

### 26. Confirm Delivery
**Endpoint:** `POST /api/v1/transactions/{id}/confirm-delivery`
**Page/Component:**
- `/app/ui/transaction/ShippingSection.tsx` - Confirm Delivery button

**What it does:**
- Buyer confirms item received in good condition
- Triggers escrow release
- Updates transaction status to REVIEW_PENDING
- Notifies seller of confirmation
- Unlocks reviews

**Request Body:**
```json
{
  "confirmedBy": "BUYER",
  "conditionSatisfactory": true,
  "deliveryNotes": "Item received in perfect condition",
  "confirmedAt": "2026-01-20T15:00:00Z"
}
```

**Response:**
```json
{
  "transactionId": 999,
  "deliveryConfirmed": true,
  "status": "REVIEW_PENDING",
  "escrowReleased": true,
  "confirmedAt": "2026-01-20T15:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION
**Priority:** 🔴 **CRITICAL**
**Business Impact:** Transaction cannot complete

---

## **NOTIFICATIONS** (Fixed Endpoints)

### 27. Get Notifications (Corrected)
**Endpoint:** `GET /api/v1/notifications`
**Page/Component:**
- `/app/(user)/(pages)/notifications/page.tsx`
- Notification dropdown in navbar

**What it does:**
- Retrieves user notifications with pagination
- Filters by read/unread status
- Returns notification type, message, timestamp
- Includes action links

**Query Parameters:**
```
?page=0&size=10&read=false
```

**Response:**
```json
[
  {
    "id": 123,
    "type": "NEW_BID",
    "avatar": "https://...",
    "title": "New bid on your auction",
    "message": "John placed a bid of ₦150,000 on MacBook Pro",
    "resourceLink": "/auction/456",
    "read": false,
    "dateCreated": "2026-01-17T10:00:00Z"
  },
  {
    "id": 124,
    "type": "OFFER_RECEIVED",
    "title": "New offer received",
    "message": "Sarah made an offer on your iPhone 14",
    "resourceLink": "/offers",
    "read": false,
    "dateCreated": "2026-01-17T09:30:00Z"
  }
]
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/notifications/get-notifications`
**Priority:** 🟠 **HIGH**
**Business Impact:** Notifications not working

---

### 28. Mark Notification as Read (Corrected)
**Endpoint:** `PUT /api/v1/notifications/{id}/markAsRead`
**Page/Component:**
- Notification list items
- Notification dropdown

**What it does:**
- Marks a notification as read
- Updates unread count
- Returns updated notification

**Response:**
```json
{
  "id": 123,
  "read": true,
  "readAt": "2026-01-17T11:00:00Z"
}
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/notifications/{id}/markAsRead`
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Can't clear notifications

---

## **ADVANCED FEATURES** (Not in API Documentation)

### 29. Counter Offer
**Endpoint:** `POST /api/v1/offer/{offerId}/counter`
**Page/Component:**
- `/app/ui/common/modals/CounterOfferModal.tsx` - Counter offer modal
- Offers management page

**What it does:**
- Seller makes a counter-offer to buyer's offer
- Proposes different cash amount or different item
- Buyer can accept or reject counter-offer
- Creates negotiation thread

**Request Body:**
```json
{
  "originalOfferId": 123,
  "counterCashAmount": 75000,
  "counterItemId": null,
  "message": "Can you increase cash to ₦75,000?"
}
```

**Response:**
```json
{
  "id": 125,
  "originalOfferId": 123,
  "status": "PENDING",
  "counterCashAmount": 75000,
  "message": "Can you increase cash to ₦75,000?",
  "sentBy": "SELLER",
  "expiresAt": "2026-01-19T10:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION - No API exists
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Limited negotiation

---

### 30. Proxy Bidding (Auto-Bid)
**Endpoint:** `POST /api/v1/bidding/proxy`
**Page/Component:**
- `/app/(user)/(pages)/offers/page.tsx` - Shows max bid UI
- Auction bidding page

**What it does:**
- Sets maximum bid amount for automatic bidding
- System auto-bids on user's behalf up to max
- Only bids minimum increment to stay ahead
- Protects user's max bid privacy
- Common in eBay, BringATrailer

**Request Body:**
```json
{
  "auctionId": 456,
  "maxBidAmount": 200000,
  "bidIncrement": 5000
}
```

**Response:**
```json
{
  "proxyBidId": 789,
  "auctionId": 456,
  "maxBidAmount": 200000,
  "currentBid": 150000,
  "isHighestBidder": true,
  "bidsRemaining": 10,
  "expiresAt": "2026-01-20T18:00:00Z"
}
```

**Current Status:** NOT IN API DOCUMENTATION - No API exists
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Users must bid manually

**Industry Standard:** eBay, Bring a Trailer, LiveAuctioneers all use proxy bidding

---

### 31. Watchlist
**Endpoint:** `POST /api/v1/watchlist/items/{itemId}`
**Page/Component:**
- `/app/(user)/(pages)/offers/page.tsx` - Watchlist tab exists
- Item cards

**What it does:**
- Adds item/auction to watchlist for monitoring
- Sends notifications on price changes, new bids
- Different from "likes" - specifically for tracking
- Shows in dedicated watchlist section

**Request:** `POST /api/v1/watchlist/items/123`

**Response:**
```json
{
  "itemId": 123,
  "addedToWatchlist": true,
  "notifyOnPriceChange": true,
  "notifyOnNewBid": true,
  "addedAt": "2026-01-17T11:00:00Z"
}
```

**Get Watchlist:**
```
GET /api/v1/watchlist/items
```

**Current Status:** NOT IN API DOCUMENTATION - Tab exists but no API
**Priority:** 🟡 **MEDIUM**
**Business Impact:** No item monitoring

---

### 32. Mark Messages as Read
**Endpoint:** `PUT /api/v1/chats/{chatId}/messages/mark-read`
**Page/Component:**
- `/app/ui/wrappers/MainChats.tsx` - Chat message list

**What it does:**
- Marks all messages in a chat as read
- Clears unread count for that chat
- Updates last read timestamp
- Notifies sender of read status

**Request Body:**
```json
{
  "readAt": "2026-01-17T11:30:00Z"
}
```

**Response:**
```json
{
  "chatId": "chat123",
  "messagesMarkedRead": 5,
  "lastReadAt": "2026-01-17T11:30:00Z",
  "unreadCount": 0
}
```

**Current Status:** NOT IN API DOCUMENTATION - Service method exists
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Unread counts inaccurate

---

### 33. Get Unread Message Count
**Endpoint:** `GET /api/v1/chats/unread-count`
**Page/Component:**
- Navigation bar - Message icon badge
- Chat page header

**What it does:**
- Returns total unread message count across all chats
- Used for notification badges
- Updates in real-time

**Response:**
```json
{
  "totalUnreadCount": 8,
  "chatCounts": [
    {
      "chatId": "chat123",
      "unreadCount": 3
    },
    {
      "chatId": "chat456",
      "unreadCount": 5
    }
  ]
}
```

**Current Status:** NOT IN API DOCUMENTATION - Service method exists
**Priority:** 🟡 **MEDIUM**
**Business Impact:** No unread indicators

---

### 34. Get User Bids
**Endpoint:** `GET /api/v1/bidding/user/{userId}`
**Page/Component:**
- Bidding history page
- User profile

**What it does:**
- Retrieves all bids placed by user
- Shows auction details for each bid
- Indicates if user is current high bidder
- Filters by auction status

**Query Parameters:**
```
?status=ACTIVE&page=0&size=10
```

**Response:**
```json
[
  {
    "bidId": 789,
    "auction": { /* AuctionDTO */ },
    "bidAmount": 150000,
    "isHighestBid": true,
    "outbid": false,
    "bidTime": "2026-01-17T10:00:00Z"
  }
]
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/bids/get-user-bids`
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Can't track bids

---

### 35. Deactivate/Reactivate User
**Endpoints:**
- `PUT /api/v1/user/{id}/deactivateUser`
- `PUT /api/v1/user/{id}/reactivateUser`

**Page/Component:**
- `/app/(user)/(pages)/settings/components/DeleteAccountContent.tsx`
- Admin panel

**What it does:**
- Temporarily deactivates user account
- Hides all user's items from marketplace
- Preserves data for reactivation
- Alternative to permanent deletion

**Response:**
```json
{
  "id": 123,
  "status": "Deactivated",
  "deactivatedAt": "2026-01-17T12:00:00Z",
  "canReactivate": true
}
```

**Current Status:** PARTIALLY INTEGRATED - Service exists but not in UI
**Priority:** 🟢 **LOW**
**Business Impact:** Users must delete instead

---

### 36. Delete User Account
**Endpoint:** `DELETE /api/v1/user/{id}`
**Page/Component:**
- `/app/(user)/(pages)/settings/components/DeleteAccountContent.tsx`

**What it does:**
- Permanently deletes user account
- Removes personal data (GDPR compliance)
- Cancels active transactions
- Anonymizes completed transactions

**Request Body:**
```json
{
  "password": "user_password",
  "reason": "No longer needed",
  "confirmDeletion": true
}
```

**Response:**
```json
{
  "deleted": true,
  "deletedAt": "2026-01-17T12:00:00Z",
  "message": "Account permanently deleted"
}
```

**Current Status:** PARTIALLY INTEGRATED - Service exists but not in UI
**Priority:** 🟢 **LOW**
**Business Impact:** Account management limited

---

## **FILE UPLOADS** (Corrected Endpoints)

### 37. Upload File (Corrected)
**Endpoint:** `POST /api/v1/files/upload`
**Page/Component:**
- Item creation/editing - Image upload
- Auction creation - Image upload
- Profile settings - Avatar upload
- Verification - ID document upload

**What it does:**
- Uploads file to storage (S3/similar)
- Returns file key for database storage
- Supports multiple file types
- Optionally replaces old file

**Query Parameters:**
```
?oldKey=previous-file-key.jpg
```

**Request:** Multipart form data with file

**Response:**
```json
{
  "key": "items/item-123-img-1.jpg",
  "url": "https://cdn.flipit.ng/items/item-123-img-1.jpg",
  "uploadedAt": "2026-01-17T11:00:00Z"
}
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/upload` instead of `/api/v1/files/upload`
**Priority:** 🟠 **HIGH**
**Business Impact:** File uploads may fail

---

### 38. Get Presigned Upload URL
**Endpoint:** `GET /api/v1/files/presign-upload-url`
**Page/Component:**
- Direct S3 upload optimization

**What it does:**
- Generates presigned S3 URL for direct upload
- Bypasses server for large files
- Improves upload performance
- Returns temporary upload URL

**Query Parameters:**
```
?key=items/item-123-img-1.jpg
```

**Response:**
```json
{
  "uploadUrl": "https://s3.amazonaws.com/flipit-bucket/...",
  "key": "items/item-123-img-1.jpg",
  "expiresAt": "2026-01-17T12:00:00Z"
}
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/files/presign-upload-url`
**Priority:** 🟡 **MEDIUM**
**Business Impact:** Performance optimization unavailable

---

## **LOCATION SERVICES** (Corrected)

### 39. Get States and LGAs
**Endpoint:** `GET /api/v1/state`
**Page/Component:**
- Item creation - Location selection
- Auction creation - Location selection
- User registration - Location
- Shipping addresses

**What it does:**
- Returns list of states with their LGAs
- Supports country code parameter (default: NG)
- Used for location dropdowns throughout app

**Query Parameters:**
```
?countryCode=NG
```

**Response:**
```json
[
  {
    "name": "Lagos",
    "code": "LA",
    "lgas": [
      {
        "name": "Ikeja",
        "code": "IKJ"
      },
      {
        "name": "Yaba",
        "code": "YAB"
      }
    ]
  }
]
```

**Current Status:** ⚠️ WRONG ENDPOINT - Using `/states` instead of `/api/v1/state`
**Priority:** 🟠 **HIGH**
**Business Impact:** Location selection broken

---

## **ADMIN/ANALYTICS**

### 40. Get All Users (Admin)
**Endpoint:** `GET /api/v1/user/findAll`
**Page/Component:**
- `/app/ui/admin/pages/AdminCustomers.tsx` - Admin users page

**What it does:**
- Returns paginated list of all users
- Admin-only endpoint
- Supports filtering and search
- Shows user status, verification, activity

**Query Parameters:**
```
?page=0&size=15&status=Verified&search=john
```

**Response:**
```json
[
  {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "status": "Verified",
    "dateCreated": "2026-01-01T00:00:00Z",
    "totalTransactions": 15,
    "totalEarnings": 450000
  }
]
```

**Current Status:** PARTIALLY INTEGRATED - API exists, may need role check
**Priority:** 🟢 **LOW**
**Business Impact:** Admin functionality

---

---

## 📈 PART 2: COMPETITIVE ANALYSIS & FLOW GAPS

### 2.1 Competitive Landscape Research

Based on research of leading P2P marketplaces (eBay, OfferUp, Mercari, Poshmark, BringATrailer), here are the industry standards and gaps in FlipIt:

#### **Marketplace Leaders - Key Features**

| Platform | Primary Focus | Key Differentiator | Monthly Users |
|----------|--------------|-------------------|---------------|
| **eBay** | Auctions + Buy Now | Proxy bidding, buyer protection | 132M+ |
| **OfferUp** | Local selling | TruYou verification, ratings | 20M+ |
| **Mercari** | Shipping-first | Promote listings, price drops | 50M+ |
| **Poshmark** | Fashion resale | Social sharing, authentication | 80M+ |
| **BringATrailer** | Car auctions | Detailed inspections, community | 2M+ |

---

### 2.2 Critical Flow Gaps Identified

## **GAP 1: ESCROW & BUYER PROTECTION SYSTEM** 🔴 CRITICAL

**What Competitors Do:**
- **eBay:** Money Back Guarantee, holds payment until delivery confirmed
- **Mercari:** Funds held until buyer rates transaction
- **Poshmark:** Posh Protect - payment released 3 days after delivery
- **OfferUp:** TruYou + In-app payments with buyer protection

**What FlipIt Needs:**

### 1. Inspection Period After Delivery
**API:** `POST /api/v1/transactions/{id}/start-inspection`

**What it does:**
- Starts 3-day inspection period after delivery
- Buyer can inspect item before payment releases
- Auto-release if no action within 3 days
- Allows buyer to request refund if issues found

**Request Body:**
```json
{
  "deliveredAt": "2026-01-20T15:00:00Z",
  "inspectionPeriodDays": 3
}
```

**Response:**
```json
{
  "inspectionStarted": true,
  "inspectionEndsAt": "2026-01-23T15:00:00Z",
  "autoReleaseEnabled": true,
  "status": "INSPECTION_PERIOD"
}
```

**Priority:** 🔴 **CRITICAL**
**Business Impact:** Essential for buyer trust

---

### 2. Dispute Resolution System
**APIs Required:**

**a) Open Dispute**
`POST /api/v1/transactions/{id}/dispute/open`

**What it does:**
- Buyer or seller opens dispute
- Pauses escrow release
- Requests admin/mediator intervention
- Uploads evidence (photos, messages)

**Request Body:**
```json
{
  "openedBy": "BUYER",
  "reason": "ITEM_NOT_AS_DESCRIBED",
  "description": "Item has scratches not mentioned in listing",
  "evidence": [
    "dispute-photo-1.jpg",
    "dispute-photo-2.jpg"
  ]
}
```

**Response:**
```json
{
  "disputeId": 999,
  "status": "OPEN",
  "openedAt": "2026-01-21T10:00:00Z",
  "mediatorAssigned": true,
  "estimatedResolutionDate": "2026-01-28T10:00:00Z"
}
```

**b) Add Evidence to Dispute**
`POST /api/v1/transactions/{id}/dispute/{disputeId}/evidence`

**c) Respond to Dispute**
`POST /api/v1/transactions/{id}/dispute/{disputeId}/respond`

**d) Resolve Dispute (Admin)**
`PUT /api/v1/transactions/{id}/dispute/{disputeId}/resolve`

**What it does:**
- Admin reviews evidence
- Makes decision (refund buyer, pay seller, split)
- Executes resolution automatically
- Closes dispute

**Request Body:**
```json
{
  "resolution": "REFUND_BUYER",
  "refundPercentage": 100,
  "reason": "Evidence supports buyer claim",
  "resolvedBy": "ADMIN_USER_123"
}
```

**Priority:** 🔴 **CRITICAL**
**Business Impact:** Prevents fraud, builds trust

---

### 3. Transaction Insurance
**API:** `POST /api/v1/transactions/{id}/insurance`

**What it does:**
- Optional insurance for high-value items
- Covers damage during shipping
- Small fee added to transaction
- Claims process for damaged items

**Request Body:**
```json
{
  "itemValue": 450000,
  "coverageType": "FULL",
  "insuranceFee": 5000
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Enables high-value transactions

---

## **GAP 2: SOCIAL & TRUST FEATURES** 🟠 HIGH PRIORITY

**What Competitors Do:**
- **OfferUp:** TruYou verification badge, star ratings
- **Poshmark:** Social profiles, followers, sharing
- **Mercari:** Seller response time badges
- **eBay:** Top-rated seller badges, detailed feedback

**What FlipIt Needs:**

### 4. User Reputation System
**API:** `GET /api/v1/user/{id}/reputation`

**What it does:**
- Calculates user reputation score
- Based on: completed transactions, reviews, response time, disputes
- Assigns badges (Verified, Top Seller, Fast Responder)
- Influences search ranking

**Response:**
```json
{
  "userId": 123,
  "reputationScore": 4.8,
  "badges": [
    "VERIFIED_SELLER",
    "FAST_RESPONDER",
    "TOP_RATED"
  ],
  "stats": {
    "totalTransactions": 45,
    "completionRate": 98.5,
    "averageResponseTime": "2 hours",
    "disputeRate": 0.5,
    "averageRating": 4.8,
    "positiveReviewRate": 96
  },
  "trustLevel": "EXCELLENT"
}
```

**Priority:** 🟠 **HIGH**
**Business Impact:** Buyer confidence, seller motivation

---

### 5. Response Time Tracking
**API:** `GET /api/v1/user/{id}/response-metrics`

**What it does:**
- Tracks how fast user responds to messages
- Displays response time on profile
- "Usually responds within 2 hours" badge
- Improves in search rankings

**Response:**
```json
{
  "averageResponseTime": "2 hours",
  "responseRate": 95,
  "fastResponder": true,
  "last30DaysAverage": "1.5 hours"
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Better communication

---

### 6. Block/Report User
**APIs:**

**a) Block User**
`POST /api/v1/user/{id}/block`

**What it does:**
- Blocks user from contacting you
- Hides their listings from your feed
- Prevents them from making offers

**b) Report User**
`POST /api/v1/user/{id}/report`

**What it does:**
- Reports user for violations
- Admin reviews report
- May result in user suspension

**Request Body:**
```json
{
  "reason": "HARASSMENT",
  "description": "User sent inappropriate messages",
  "evidence": ["screenshot1.jpg"]
}
```

**Priority:** 🟠 **HIGH**
**Business Impact:** User safety

---

## **GAP 3: AUCTION ENHANCEMENTS** 🟡 MEDIUM PRIORITY

**What Competitors Do:**
- **eBay:** Proxy bidding, reserve prices, Buy It Now option
- **BringATrailer:** Bid comments, detailed inspection reports
- **LiveAuctioneers:** Live bidding events, absentee bids

**What FlipIt Needs:**

### 7. Proxy Bidding (Auto-Bid)
**Already detailed in API #30**

**Priority:** 🟡 **MEDIUM**
**Business Impact:** User convenience, higher bids

---

### 8. Reserve Price Not Met Handling
**API:** `PUT /api/v1/auction/{id}/handle-reserve-not-met`

**What it does:**
- When auction ends but reserve not met
- Seller can contact highest bidder
- Negotiate sale off-reserve
- Or relist auction

**Request Body:**
```json
{
  "action": "CONTACT_HIGHEST_BIDDER",
  "offerAmount": 180000
}
```

**Priority:** 🟢 **LOW**
**Business Impact:** Recover failed auctions

---

### 9. Auction Extensions (Anti-Snipe)
**API:** `PUT /api/v1/auction/{id}/extend`

**What it does:**
- Auto-extends auction if bid placed in last 5 minutes
- Prevents bid sniping
- Common on BringATrailer

**Automatic Logic:**
```json
{
  "autoExtendEnabled": true,
  "extendMinutes": 5,
  "maxExtensions": 3
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Fairer auctions

---

## **GAP 4: SELLER TOOLS & ANALYTICS** 🟡 MEDIUM PRIORITY

**What Competitors Do:**
- **Mercari:** Promote listings, price drop notifications
- **Poshmark:** Share to followers, closet sales
- **eBay:** Promoted listings, sell-through rate analytics

**What FlipIt Needs:**

### 10. Promote Listing (Boost)
**API:** `POST /api/v1/items/{id}/promote`

**What it does:**
- Paid promotion to boost listing visibility
- Appears at top of search results
- Highlighted badge on listing
- Pay-per-day or pay-per-click

**Request Body:**
```json
{
  "promotionType": "FEATURED",
  "duration": 7,
  "budget": 5000
}
```

**Response:**
```json
{
  "promotionId": 456,
  "itemId": 123,
  "status": "ACTIVE",
  "startsAt": "2026-01-17T12:00:00Z",
  "endsAt": "2026-01-24T12:00:00Z",
  "dailyCost": 714,
  "estimatedViews": 5000
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Revenue stream, seller success

---

### 11. Price Drop Notifications
**API:** `POST /api/v1/items/{id}/price-drop`

**What it does:**
- Notify users who liked/watched item of price drop
- Encourages sales
- Like Mercari's promote feature

**Request Body:**
```json
{
  "oldPrice": 200000,
  "newPrice": 180000,
  "dropPercentage": 10,
  "notifyWatchers": true
}
```

**Response:**
```json
{
  "priceDropped": true,
  "notificationsSent": 15,
  "estimatedInterest": "HIGH"
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Faster sales

---

### 12. Item Performance Analytics
**API:** `GET /api/v1/items/{id}/analytics`

**What it does:**
- Views over time graph
- Click-through rate
- Offer conversion rate
- Comparison to similar items

**Response:**
```json
{
  "itemId": 123,
  "totalViews": 450,
  "uniqueVisitors": 280,
  "viewsLast7Days": [45, 52, 38, 61, 48, 55, 63],
  "phoneReveals": 12,
  "chatStarts": 8,
  "offers": 5,
  "conversionRate": 2.8,
  "similarItemsAvgViews": 320,
  "performanceRating": "ABOVE_AVERAGE"
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Seller insights

---

## **GAP 5: ADVANCED SEARCH & DISCOVERY** 🟡 MEDIUM PRIORITY

**What Competitors Do:**
- **eBay:** Saved searches with alerts, "Ending soon", "Newly listed"
- **OfferUp:** Location radius search
- **Mercari:** Size filters for clothing

**What FlipIt Needs:**

### 13. Saved Searches with Alerts
**API:** `POST /api/v1/search/save`

**What it does:**
- Saves search criteria
- Notifies when new items match
- Common on eBay

**Request Body:**
```json
{
  "name": "MacBook Pro under 400k",
  "searchParams": {
    "search": "MacBook Pro",
    "category": "Electronics",
    "maxAmount": 400000,
    "condition": "FAIRLY_USED"
  },
  "notifyImmediately": true,
  "notifyFrequency": "DAILY"
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** User retention

---

### 14. "Ending Soon" / "Newly Listed" Filters
**API Enhancement:** Add to `GET /api/v1/items` and `GET /api/v1/auction`

**Additional Query Parameters:**
```
?sortBy=ENDING_SOON
?sortBy=NEWLY_LISTED
?endingWithin=24hours
?listedWithin=24hours
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Better discovery

---

### 15. Distance-Based Search
**API Enhancement:** Add to `GET /api/v1/items`

**Query Parameters:**
```
?latitude=6.5244&longitude=3.3792&radiusKm=10
```

**What it does:**
- Shows items within specified radius
- Useful for local pickups
- Common on OfferUp

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Local transactions

---

## **GAP 6: COMMUNICATION ENHANCEMENTS** 🟡 MEDIUM PRIORITY

**What Competitors Do:**
- **OfferUp:** Make offer directly in chat
- **Facebook Marketplace:** Automated responses
- **Poshmark:** Bundle offers

**What FlipIt Needs:**

### 16. Quick Replies / Templates
**API:** `POST /api/v1/user/quick-replies`

**What it does:**
- Saves common responses
- One-tap replies in chat
- "Is this still available?", "Yes, it is!"

**Request Body:**
```json
{
  "templates": [
    {
      "trigger": "IS_AVAILABLE",
      "response": "Yes, this item is still available!"
    },
    {
      "trigger": "SHIPPING",
      "response": "Shipping is available nationwide via GIG Logistics."
    }
  ]
}
```

**Priority:** 🟢 **LOW**
**Business Impact:** Faster communication

---

### 17. In-Chat Offer Making
**API:** `POST /api/v1/chats/{chatId}/offer`

**What it does:**
- Make offer directly in chat
- Inline offer card in message thread
- Accept/reject buttons in chat

**Request Body:**
```json
{
  "chatId": "chat123",
  "itemId": 456,
  "offerType": "CASH",
  "amount": 150000,
  "message": "Would you accept 150k?"
}
```

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Smoother negotiations

---

## **GAP 7: POST-TRANSACTION FEATURES** 🟢 LOW PRIORITY

### 18. Repurchase / Reorder
**API:** `POST /api/v1/transactions/{id}/repurchase`

**What it does:**
- If seller relists similar item
- Notify previous buyers
- One-click to buy again

**Priority:** 🟢 **LOW**
**Business Impact:** Repeat customers

---

### 19. Transaction Export
**API:** `GET /api/v1/transactions/export`

**What it does:**
- Export transaction history as CSV/PDF
- For accounting/tax purposes

**Priority:** 🟢 **LOW**
**Business Impact:** User convenience

---

## **GAP 8: MOBILE APP FEATURES** 🟡 MEDIUM PRIORITY

### 20. Push Notifications
**API:** `POST /api/v1/notifications/device-token`

**What it does:**
- Registers device for push notifications
- Sends real-time alerts for bids, offers, messages

**Request Body:**
```json
{
  "deviceToken": "fcm_token_abc123",
  "platform": "IOS",
  "notificationPreferences": {
    "newBids": true,
    "newOffers": true,
    "newMessages": true,
    "priceDrops": true
  }
}
```

**Priority:** 🟡 **MEDIUM** (if building mobile app)
**Business Impact:** User engagement

---

### 21. Barcode Scanner (Future)
**API:** `GET /api/v1/items/barcode/{barcode}`

**What it does:**
- Scan product barcode
- Auto-fills item details
- Common in Mercari, Poshmark

**Priority:** 🟢 **LOW**
**Business Impact:** Easier listing creation

---

## **GAP 9: ADMIN & MODERATION TOOLS** 🟠 HIGH PRIORITY

### 22. Content Moderation
**API:** `POST /api/v1/admin/items/{id}/flag`

**What it does:**
- Flag listings for review
- Auto-detect prohibited items
- Suspend violating listings

**Priority:** 🟠 **HIGH**
**Business Impact:** Platform safety

---

### 23. User Suspension
**API:** `PUT /api/v1/admin/users/{id}/suspend`

**What it does:**
- Suspend user for violations
- Temporary or permanent
- Notify user of suspension

**Request Body:**
```json
{
  "reason": "Repeated policy violations",
  "duration": "PERMANENT",
  "suspendedBy": "ADMIN_123"
}
```

**Priority:** 🟠 **HIGH**
**Business Impact:** Platform integrity

---

### 24. Transaction Monitoring Dashboard
**API:** `GET /api/v1/admin/transactions/monitor`

**What it does:**
- Real-time transaction monitoring
- Flag suspicious activity
- Dispute trends

**Priority:** 🟡 **MEDIUM**
**Business Impact:** Fraud prevention

---

---

## 🗺️ IMPLEMENTATION ROADMAP

### **PHASE 1: Critical Transaction Flow** (Weeks 1-3)
**Goal:** Enable users to complete transactions

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🔴 P0 | Accept Offer | 2 days | BLOCKS transactions |
| 🔴 P0 | Reject Offer | 1 day | BLOCKS offer management |
| 🔴 P0 | Get Offers Sent/Received (fix) | 1 day | BLOCKS offer viewing |
| 🔴 P0 | Create Transaction | 3 days | BLOCKS transaction flow |
| 🔴 P0 | Get Transaction by ID | 2 days | BLOCKS transaction page |
| 🔴 P0 | Update Transaction Status | 2 days | BLOCKS flow progression |
| 🔴 P0 | Mark Item as Sold | 1 day | Items stay active |

**Total: 12 days** - Essential for business operations

---

### **PHASE 2: Payment & Escrow** (Weeks 4-5)
**Goal:** Enable secure payments

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🔴 P0 | Initialize Payment | 3 days | No payments possible |
| 🔴 P0 | Verify Payment | 2 days | Can't confirm payments |
| 🔴 P0 | Release Escrow | 2 days | Sellers don't get paid |
| 🔴 P0 | Request Refund | 2 days | No buyer protection |
| 🟠 P1 | Get Payment Details | 1 day | Payment transparency |

**Total: 10 days** - Critical for trust

---

### **PHASE 3: Shipping & Logistics** (Weeks 6-7)
**Goal:** Enable item delivery

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🔴 P0 | Create Shipment (GIG) | 4 days | Can't ship items |
| 🔴 P0 | Track Shipment | 2 days | No visibility |
| 🔴 P0 | Confirm Delivery | 2 days | Can't complete transactions |
| 🟠 P1 | Get Shipping Quote | 2 days | No cost estimates |
| 🟠 P1 | Schedule Pickup | 2 days | Manual coordination |

**Total: 12 days** - Essential for fulfillment

---

### **PHASE 4: User Verification & Trust** (Weeks 8-9)
**Goal:** Build user trust

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🔴 P0 | User Performance Metrics | 2 days | No analytics |
| 🟠 P1 | Email Verification | 1 day | Trust building |
| 🟠 P1 | Phone Verification (fix) | 1 day | Account security |
| 🟠 P1 | Profile Verification (KYC) | 3 days | Seller trust |
| 🟠 P1 | User Reputation System | 3 days | Trust signals |

**Total: 10 days** - Builds credibility

---

### **PHASE 5: Notifications & Communication** (Week 10)
**Goal:** Fix broken features

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🟠 P1 | Get Notifications (fix) | 1 day | Notifications broken |
| 🟠 P1 | Mark as Read (fix) | 0.5 day | Can't clear notifications |
| 🟡 P2 | Mark Messages as Read | 1 day | Unread counts wrong |
| 🟡 P2 | Unread Message Count | 1 day | Badge accuracy |
| 🟠 P1 | Start Chat (fix endpoint) | 0.5 day | Chat creation issues |

**Total: 4 days** - Quality of life

---

### **PHASE 6: File Uploads & Location** (Week 11)
**Goal:** Fix endpoint mismatches

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🟠 P1 | File Upload (fix endpoint) | 1 day | Upload reliability |
| 🟡 P2 | Presigned Upload URL (fix) | 1 day | Performance |
| 🟠 P1 | Get States/LGAs (fix) | 1 day | Location broken |

**Total: 3 days** - Fix existing issues

---

### **PHASE 7: Buyer Protection** (Weeks 12-13)
**Goal:** Build trust and safety

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🔴 P0 | Inspection Period | 2 days | Buyer confidence |
| 🔴 P0 | Open Dispute | 3 days | Conflict resolution |
| 🔴 P0 | Resolve Dispute | 2 days | Admin tools |
| 🟡 P2 | Transaction Insurance | 3 days | High-value items |

**Total: 10 days** - Essential for growth

---

### **PHASE 8: Advanced Features** (Weeks 14-16)
**Goal:** Competitive differentiation

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🟡 P2 | Proxy Bidding | 4 days | Better auctions |
| 🟡 P2 | Counter Offers | 3 days | Better negotiations |
| 🟡 P2 | Watchlist | 2 days | User engagement |
| 🟡 P2 | Promote Listing | 3 days | Revenue stream |
| 🟡 P2 | Price Drop Notifications | 2 days | Sales velocity |
| 🟡 P2 | Saved Searches | 3 days | User retention |

**Total: 17 days** - Growth features

---

### **PHASE 9: Analytics & Tools** (Weeks 17-18)
**Goal:** Seller success

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🟡 P2 | Item Analytics | 3 days | Seller insights |
| 🟡 P2 | Response Time Tracking | 2 days | Trust signals |
| 🟢 P3 | Transaction Export | 1 day | User convenience |

**Total: 6 days** - Seller tools

---

### **PHASE 10: Safety & Moderation** (Weeks 19-20)
**Goal:** Platform integrity

| Priority | API | Estimated Effort | Business Impact |
|----------|-----|-----------------|-----------------|
| 🟠 P1 | Block/Report User | 2 days | User safety |
| 🟠 P1 | Content Moderation | 3 days | Platform safety |
| 🟠 P1 | User Suspension | 2 days | Enforcement |
| 🟡 P2 | Transaction Monitoring | 3 days | Fraud prevention |

**Total: 10 days** - Safety critical

---

## 📊 SUMMARY STATISTICS

### By Priority
- 🔴 **Critical (P0):** 24 APIs - **BLOCKS core business**
- 🟠 **High (P1):** 15 APIs - **Quality & trust issues**
- 🟡 **Medium (P2):** 20 APIs - **Competitive features**
- 🟢 **Low (P3):** 4 APIs - **Nice to have**

### By Category
- **Transaction System:** 15 APIs (11 critical)
- **Payment & Escrow:** 6 APIs (5 critical)
- **Shipping & Logistics:** 6 APIs (4 critical)
- **User Management:** 8 APIs (3 critical)
- **Offers:** 6 APIs (4 critical)
- **Notifications:** 5 APIs (2 high)
- **Trust & Safety:** 8 APIs (4 high)
- **Advanced Features:** 9 APIs (0 critical)

### Estimated Total Effort
- **Phase 1-6 (Essential):** 51 days (10 weeks with team)
- **Phase 7-10 (Growth):** 43 days (9 weeks with team)
- **Total:** 94 development days (19 weeks with 1 backend dev, ~5 weeks with team of 4)

---

## 🎯 RECOMMENDATIONS

### Immediate Actions (This Week)
1. **Fix endpoint inconsistencies** - 2 days
   - Notifications: `/api/v1/notifications`
   - File upload: `/api/v1/files/upload`
   - Location: `/api/v1/state`
   - Start chat: `POST /api/v1/chats`

2. **Implement offer accept/reject** - 3 days
   - CRITICAL - Blocks all transactions

3. **Document transaction APIs** - 1 day
   - Already built in frontend, just need docs

### Week 2-4: Transaction Flow
- Create/get/update transaction
- Initialize/verify payment
- Release escrow
- Basic shipping

### Week 5-8: Complete Core Features
- GIG Logistics integration
- User verification
- Performance metrics
- Dispute system

### Week 9-12: Growth Features
- Proxy bidding
- Watchlist
- Promote listings
- Advanced analytics

---

## 📝 NOTES FOR BACKEND TEAM

### API Design Principles
1. **Consistent endpoint structure:** `/api/v1/{resource}/{id}/{action}`
2. **Standard response format:**
```json
{
  "data": { /* response data */ },
  "message": "Success",
  "timestamp": "2026-01-17T12:00:00Z"
}
```

3. **Error handling:**
```json
{
  "error": {
    "code": "OFFER_NOT_FOUND",
    "message": "Offer with ID 123 not found",
    "details": {}
  },
  "timestamp": "2026-01-17T12:00:00Z"
}
```

4. **Authentication:** All endpoints require JWT Bearer token
5. **Pagination:** Standard `?page=0&size=10` for list endpoints
6. **Filtering:** Use query parameters for filters
7. **Sorting:** Use `?sort=createdAt,desc`

### Database Considerations
- **Transactions table** needs status history tracking
- **Escrow payments** need separate table with lifecycle
- **Notifications** need indexing for performance
- **Disputes** need evidence storage (S3)

### External Integrations
1. **Paystack/Flutterwave** - Payment gateway
2. **GIG Logistics** - Shipping API
3. **AWS S3** - File storage
4. **SendGrid/Mailgun** - Email notifications
5. **Twilio** - SMS for verification

### Testing Priorities
1. Transaction flow end-to-end
2. Escrow release scenarios
3. Dispute resolution workflows
4. Payment webhook handling
5. GIG Logistics integration

---

## ✅ CONCLUSION

FlipIt has **60% of APIs implemented** but is missing **40% of critical business logic APIs**, particularly:

### Must Have (BLOCKERS):
- ✅ Offer accept/reject
- ✅ Transaction creation & management
- ✅ Payment & escrow system
- ✅ Shipping & delivery tracking
- ✅ Dispute resolution

### Should Have (TRUST):
- ✅ User verification (email, phone, KYC)
- ✅ Reputation system
- ✅ Inspection period
- ✅ Performance analytics

### Nice to Have (GROWTH):
- ⏳ Proxy bidding
- ⏳ Watchlist
- ⏳ Promote listings
- ⏳ Advanced search

**Recommended Timeline:** 5-6 months with a team of 4 backend developers to reach feature parity with competitors.

---

**Document prepared by:** Claude Code Analysis Agent
**Date:** January 17, 2026
**Version:** 1.0

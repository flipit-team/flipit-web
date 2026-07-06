# Flipit — Flow, API & Design Gap Analysis

> Generated: 2026-05-01
> Purpose: Roadmap for implementing the 3 core transaction flows against the Figma redesign and backend APIs.

---

## Overview

Flipit has **3 core transaction flows**:

1. **Swap Only** — Two users exchange items (no cash)
2. **Cash Only** — Buyer pays cash (Buy Now or Auction Win)
3. **Cash + Swap (Mixed Trade)** — Item A + Cash for Item B

Each flow involves: **Offers → Transaction Creation → Payment/Escrow → Shipping via GIG → Verification → Delivery → Completion**

---

## Backend API (Swagger) — What Exists

**Base URL:** `https://api.flipit.ng/api/v1`

### Available Controllers:
| Controller | Endpoints | Status |
|---|---|---|
| Authentication | login, logout, signup, Google OAuth, password reset | Complete |
| User | CRUD, profile, verification, performance | Complete |
| Items | CRUD, search, categories, conditions, markAsSold | Complete |
| Auction | CRUD, activate/deactivate | Complete |
| Bidding | place bid, get bids by auction | Complete |
| Offer | create, accept, reject, get sent/received | Complete |
| Chat | create, messages, send message, delete | Complete |
| Review | create, get by user | Complete |
| Likes | add, remove, get liked items | Complete |
| Notifications | get, mark as read | Complete |
| Support | report abuse, request callback | Complete |
| Files | upload, presigned URLs | Complete |
| State/Location | get states | Complete |
| Home | top_nav counts | Complete |
| Admin | dashboard, listings, customers, bids summaries | Complete |

### MISSING Controllers (not in Swagger):
| Controller | Purpose | Needed For |
|---|---|---|
| **Transaction** | Create, get, update status, cancel, complete transactions | All 3 flows |
| **Payment/Escrow** | Credo integration — initialize, verify, release, refund | Cash Only, Mixed Trade |
| **Shipping/GIG** | Create shipment, quote, track, confirm delivery, cancel | All 3 flows |
| **Dispute** | Open, submit evidence, admin decision, resolve | All 3 flows |
| **Swap** | Swap-specific logic — dual shipments, cross-delivery, verification | Swap Only, Mixed Trade |

---

## Flow 1: Swap Only

**Trigger:** Two users agree to swap items (no cash involved)

### Steps:

| # | Step | Figma Screen | API Endpoint | Status |
|---|---|---|---|---|
| 1 | User makes swap offer | Swap only offer | `POST /offer` (offeredItemId, withCash=false) | EXISTS |
| 2 | Other user accepts offer | Accept offer overlay | `POST /offer/{id}/accept` | EXISTS |
| 3 | Flipit creates swap transaction | — | `POST /transactions` | MISSING |
| 4 | Both users pay shipping fees | item swap + cash screens | `POST /transactions/payment/initialize` | MISSING |
| 5 | Check: Have BOTH users paid? | — | `GET /transactions/{id}/payment-status` | MISSING |
| 6 | Timeout → Cancel swap | — | `PUT /transactions/{id}/cancel` | MISSING |
| 7 | Generate Swap ID + Shipment IDs | — | Backend auto-generates on creation | MISSING |
| 8 | Notify both users to ship | Notification for buyer/seller | `POST /notifications` (trigger) | MISSING (GET exists) |
| 9 | User A ships via GIG | Seller shipping screens | `POST /shipping/gig/create` | MISSING |
| 10 | User B ships via GIG | Seller shipping screens | `POST /shipping/gig/create` | MISSING |
| 11 | GIG logs items (photos, weight) | — | GIG webhook/callback | MISSING |
| 12 | Check: Have BOTH items arrived? | item swap tracking | `GET /shipping/gig/track/{waybill}` | MISSING |
| 13 | Wait + countdown → Timeout → Return & cancel | — | Backend timeout job | MISSING |
| 14 | Flipit verifies items | item swap verification | `POST /transactions/{id}/verify` | MISSING |
| 15 | Items valid → Release swap | item swap completed | `PUT /transactions/{id}/release-swap` | MISSING |
| 16 | Items invalid → Dispute & return | — | `POST /disputes` | MISSING |
| 17 | GIG cross delivers items | item swap confirm delivery | GIG API integration | MISSING |
| 18 | Users receive items | — | `PUT /transactions/{id}/confirm-delivery` | MISSING |
| 19 | Swap completed | item swap completed | `PUT /transactions/{id}/complete` | MISSING |

### Figma Screens Available:
- Swap only offer ✅
- Swap only listing ✅
- Preview swap listing ✅
- item swap Order Review ✅
- item swap User A ✅
- item swap User A / Complete ✅
- item swap User B ✅
- item swap User B / Complete ✅
- item swap verification ✅
- item swap tracking (x2) ✅
- item swap confirm delivery ✅
- item swap completed ✅

### Figma Screens MISSING:
- Payment timeout / cancel state
- Waiting for other user's payment
- Both items in transit tracking (dual view)
- Dispute flow (open, evidence, decision)
- Return shipped items UI

---

## Flow 2: Cash Only (Buy Now / Auction Win)

**Trigger:** Buyer clicks Buy Now OR wins auction

### Steps:

| # | Step | Figma Screen | API Endpoint | Status |
|---|---|---|---|---|
| 1 | Buyer clicks Buy Now / wins auction | Item detail, Auction winner | `POST /offer` or bidding result | EXISTS |
| 2 | Flipit creates transaction | Cash only transaction/buyer view | `POST /transactions` | MISSING |
| 3 | Create escrow via Credo | E tranzact payment | `POST /transactions/payment/initialize` | MISSING |
| 4 | Buyer pays total amount (item + shipping) | E tranzact payment | Credo payment gateway redirect | MISSING |
| 5 | Payment confirmed | Payment successful overlay | `POST /transactions/payment/verify` | MISSING |
| 6 | Flipit records: item price (seller), shipping fee (GIG) | — | Backend internal logic | MISSING |
| 7 | Generate shipment ID | — | `POST /shipping/gig/create` | MISSING |
| 8 | Notify seller to ship | Notification for seller | Notification trigger | MISSING |
| 9 | Check: Seller ships on time? | Seller shipping (cash only) | `GET /transactions/{id}` status check | MISSING |
| 10 | No → Cancel transaction + Refund buyer | — | `PUT /transactions/{id}/cancel` + refund | MISSING |
| 11 | Yes → Seller ships via GIG | Seller shipping (cash only) 2 | `POST /shipping/gig/create` | MISSING |
| 12 | GIG scans shipment ID and logs item | — | GIG webhook | MISSING |
| 13 | Tracking sent to Flipit | buyer shipping view | `GET /shipping/gig/track/{waybill}` | MISSING |
| 14 | Item in transit | buyer shipping view | Status updates via tracking | MISSING |
| 15 | Item delivered to buyer | buyer shipping confirmation | Delivery confirmation | MISSING |
| 16a | Buyer confirms delivery | — | `PUT /transactions/{id}/confirm-delivery` | MISSING |
| 16b | Buyer opens dispute | — | `POST /disputes` | MISSING |
| 16c | No response → Auto confirm after time | — | Backend timeout job | MISSING |
| 17 | Dispute: Collect evidence → Decision | — | `PUT /disputes/{id}/resolve` | MISSING |
| 17a | Seller right → Release payment | — | `PUT /transactions/{id}/release-escrow` | MISSING |
| 17b | Buyer right → Return item + refund | — | `POST /transactions/{id}/refund` | MISSING |
| 17c | Partial → Partial refund + release | — | `POST /transactions/{id}/partial-refund` | MISSING |
| 18 | Release payment to seller | — | Credo payout | MISSING |
| 19 | Credo pays seller / Flipit pays GIG | — | Backend settlement logic | MISSING |
| 20 | Transaction completed | cash transaction completed | `PUT /transactions/{id}/complete` | MISSING |

### Figma Screens Available:
- cash only offer ✅
- resubmit cash offer ✅
- Cash only listing ✅
- Preview cash only listing ✅
- preview cash only listing overlay ✅
- Cash only transaction/buyer view ✅
- E tranzact payment (x2) ✅
- Payment successful overlay (x2) ✅
- Seller shipping (cash only) (x2) ✅
- buyer shipping confirmation (cash only) ✅
- buyer shipping view (cash only) (x2) ✅
- Notification for buyer ✅
- Notification for seller ✅
- cash transaction completed ✅
- Rating and Review transaction (x3) ✅
- Auction winner ✅
- Transaction Progress ✅

### Figma Screens MISSING:
- Dispute flow UI (open, submit evidence, admin review, outcomes)
- Partial refund screen
- Auto-confirm countdown
- Refund confirmation screen
- Seller timeout / cancel state

---

## Flow 3: Cash + Swap (Mixed Trade)

**Trigger:** Users agree to swap Item A + Cash for Item B

### Steps:

| # | Step | Figma Screen | API Endpoint | Status |
|---|---|---|---|---|
| 1 | Users agree: Item + Cash for Item | cash + swap offer | `POST /offer` (offeredItemId + withCash + cashAmount) | EXISTS |
| 2 | Other user accepts | Accept offer | `POST /offer/{id}/accept` | EXISTS |
| 3 | Create transaction | — | `POST /transactions` | MISSING |
| 4 | Cash payer pays via escrow | E tranzact payment | `POST /transactions/payment/initialize` | MISSING |
| 5 | Both users pay shipping fees | — | Payment endpoints | MISSING |
| 6 | Check: All payments completed? | — | `GET /transactions/{id}/payment-status` | MISSING |
| 7 | Timeout → Cancel → Refund escrow + shipping | — | Cancel + refund endpoints | MISSING |
| 8 | Generate Swap ID + Shipment ID A + Shipment ID B | — | Backend auto-generates | MISSING |
| 9 | Notify users to ship | — | Notification trigger | MISSING |
| 10 | User A ships with Shipment ID A | item swap + cash (User A) | `POST /shipping/gig/create` | MISSING |
| 11 | User B ships with Shipment ID B | item swap + cash (User B) | `POST /shipping/gig/create` | MISSING |
| 12 | GIG logs both items | — | GIG webhook | MISSING |
| 13 | Check: Both items arrived? | — | Tracking endpoints | MISSING |
| 14 | Wait + countdown → Timeout → Refund + cancel | — | Backend timeout | MISSING |
| 15 | Flipit verifies items | — | `POST /transactions/{id}/verify` | MISSING |
| 16a | Items valid → Trigger release | item swap + cash Complete | Release endpoints | MISSING |
| 16b | GIG cross delivers items | — | GIG API | MISSING |
| 16c | Escrow releases cash | — | Credo payout | MISSING |
| 17a | Items invalid → Open dispute | — | `POST /disputes` | MISSING |
| 17b | Review evidence: GIG data, listings, user proof | — | Dispute endpoints | MISSING |
| 17c | Decision: Return → Refund escrow + shipping | — | Refund endpoints | MISSING |
| 17d | Decision: Adjust → Adjust cash outcome | — | `PUT /disputes/{id}/adjust` | MISSING |
| 18 | Users receive items + cash settled | — | Completion endpoints | MISSING |
| 19 | Transaction completed | — | `PUT /transactions/{id}/complete` | MISSING |

### Figma Screens Available:
- cash + swap offer ✅
- resubmit cash + swap offer ✅
- Cash + Swap listing ✅
- item swap + cash (User A) ✅
- item swap + cash (User A) / Complete ✅
- item swap + cash (User B) ✅
- item swap + cash (User B) / Complete ✅
- item swap + cash confirm delivery ✅

### Figma Screens MISSING:
- Escrow payment screen specific to mixed trade
- Dispute flow (open, evidence, decision, adjust cash outcome)
- Refund escrow + shipping confirmation
- Timeout / cancel states
- Dual tracking view

---

## API Method Mismatches (Frontend vs Swagger)

| Endpoint | Frontend Uses | Swagger Says |
|---|---|---|
| Accept offer | `PUT /offer/{id}/accept` | `POST /offer/{id}/accept` |
| Reject offer | `PUT /offer/{id}/reject` | `POST /offer/{id}/reject` |

---

## APIs Frontend Calls But NOT in Swagger

These endpoints exist in frontend service files but have no Swagger documentation:

### Chat:
- `PUT /chats/{chatId}/read`
- `GET /chats/unread-count`
- `GET /chats/search`

### Notifications:
- `PUT /notifications/mark-all-seen`
- `PUT /notifications/mark-all-read`
- `GET /notifications/unread-count`
- `DELETE /notifications/{id}`
- `DELETE /notifications/all`

### Likes:
- `POST /likes/items/check` (batch check)

### Reviews:
- `GET /reviews/user/{userId}/rating`
- `GET /reviews/{reviewId}`
- `PUT /reviews/{reviewId}`
- `DELETE /reviews/{reviewId}`

### Bidding:
- `GET /bidding/auction/{id}/highest`
- `GET /bidding/auction/{id}/history`
- `GET /bids/get-user-bids`

---

## APIs in Swagger But NOT Used by Frontend

| Endpoint | Notes |
|---|---|
| `GET /api/v1/user/findAll` | Only used in admin context |
| `GET /api/v1/auth/roles` | Role management — not surfaced in UI |
| `GET /api/v1/files/presign-upload-url` | Frontend may use direct upload instead |
| `GET /api/v1/files/presign-download-url` | Frontend may use direct URLs |

---

## Priority Order for Implementation

### Phase 1: Core Transaction Infrastructure (Backend Required)
1. Transaction Controller — CRUD, status management
2. Payment/Escrow Controller — Credo integration
3. Shipping/GIG Controller — shipment creation, tracking
4. Notification triggers — push notifications for transaction events

### Phase 2: Flow-Specific Logic
5. Cash Only flow — simplest, single direction
6. Swap Only flow — dual shipment, verification
7. Mixed Trade flow — most complex, combines escrow + swap

### Phase 3: Dispute & Edge Cases
8. Dispute Controller — open, evidence, resolution
9. Timeout/auto-cancel mechanisms
10. Partial refund logic
11. Return shipment handling

### Phase 4: Frontend Implementation (Figma Redesign)
12. Update existing screens to match new Figma designs
13. Build new transaction flow screens
14. Build dispute flow screens
15. Build missing state/error screens

---

## Key Third-Party Integrations Required

| Service | Purpose | Status |
|---|---|---|
| **Credo** | Payment escrow — hold buyer funds, release to seller | NOT INTEGRATED |
| **GIG Logistics** | Shipping — create shipments, track, confirm delivery | NOT INTEGRATED |
| **Push Notifications** | Real-time alerts for transaction events | PARTIAL (display exists, triggers don't) |

---

## Data Models Needed (Not in Swagger)

### TransactionDTO
- id, type (CASH_ONLY, SWAP_ONLY, MIXED_TRADE), status
- buyerId, sellerId
- itemId, offeredItemId (for swaps)
- cashAmount, shippingFee
- escrowId, paymentStatus
- shipmentIds (array for dual shipments)
- createdAt, updatedAt, completedAt

### ShipmentDTO
- id, transactionId, waybillNumber
- senderId, receiverId
- status (PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, RETURNED)
- trackingUrl, photos, weight
- estimatedDelivery, actualDelivery

### PaymentDTO
- id, transactionId, amount, type (ESCROW, SHIPPING_FEE)
- status (PENDING, COMPLETED, REFUNDED, PARTIAL_REFUND)
- provider (CREDO), providerReference
- paidAt, refundedAt

### DisputeDTO
- id, transactionId, raisedById
- reason, description, evidence (array)
- status (OPEN, UNDER_REVIEW, RESOLVED)
- resolution (SELLER_RIGHT, BUYER_RIGHT, PARTIAL, RETURN)
- resolvedAt, resolvedBy

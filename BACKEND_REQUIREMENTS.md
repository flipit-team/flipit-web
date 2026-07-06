# Backend Requirements for Flipit Frontend — Production Readiness

**From:** Frontend Team
**Date:** 2026-06-21
**Context:** We completed a full audit of every frontend page against the Swagger spec at `api.flipit.ng`. All frontend code has been fixed to correctly use existing endpoints. Below are the remaining backend gaps — things the frontend needs but the backend doesn't currently provide.

**Priority Legend:** P0 = Blocks core user flows, P1 = Degrades UX significantly, P2 = Nice to have for production polish

---

## 1. TransactionDTO Needs Item Data [P0]

**Problem:** The transaction page (`/transaction/{id}`) displays item images, titles, conditions, and brands — but `TransactionDTO` only contains `buyer`, `seller`, `amount`, `status`, `type`, and `description`. There is no item data.

**Current impact:** The transaction page shows a generic placeholder "Item" with no image, no title, no details. Users cannot see what they're actually transacting.

**What we need — Option A (preferred):**
Add item fields to `TransactionDTO`:
```json
{
  "id": 1,
  "buyer": { ... },
  "seller": { ... },
  "amount": 50000,
  "status": "PENDING",
  "type": "SWAP",
  "item": {                    // NEW — the item being sold/swapped
    "id": 101,
    "title": "Canon EOS RP Camera",
    "imageUrls": ["https://..."],
    "condition": "FAIRLY_USED",
    "brand": "Canon"
  },
  "offeredItem": {             // NEW — the item offered in exchange (for SWAP/MIXED)
    "id": 202,
    "title": "Sony A7III",
    "imageUrls": ["https://..."],
    "condition": "NEW",
    "brand": "Sony"
  },
  "offerId": 55                // NEW — link back to the original offer
}
```

**What we need — Option B:**
Add just an `offerId` to `TransactionDTO` so the frontend can fetch the offer (which contains both items via `OfferDTO.item` and `OfferDTO.offeredItem`).

---

## 2. Payment Gateway Integration (Paystack) [P0]

**Problem:** The "Proceed to Checkout" button on the transaction page calls `POST /api/v1/transactions/{id}/verify` directly — but no actual payment happens first. There is no Paystack (or any payment provider) integration.

**What we need:**
1. **Payment initiation endpoint:**
   ```
   POST /api/v1/transactions/{id}/initialize-payment
   Request: { paymentMethod: "paystack" | "bank_transfer" }
   Response: {
     authorizationUrl: "https://checkout.paystack.com/...",  // redirect user here
     reference: "FLP_12345",
     accessCode: "abc123"
   }
   ```
2. **Payment webhook handler** on the backend to receive Paystack callbacks and update transaction status automatically.
3. The existing `POST /api/v1/transactions/{id}/verify` should verify a Paystack reference, not just blindly advance the status.

**How the frontend flow should work:**
1. User clicks "Pay Now" → frontend calls `initialize-payment`
2. Frontend redirects user to `authorizationUrl`
3. Paystack redirects back to our callback URL after payment
4. Backend webhook confirms payment → transaction status moves to `SUCCESS`
5. Frontend calls `verify` to confirm on the frontend side

---

## 3. Item Swap Detection — `acceptSwap` Field [P0]

**Problem:** The frontend cannot determine whether an item accepts swaps. The old `flipForImgUrls` field is deprecated and always empty. The only field available is `acceptCash: boolean`, which tells us if cash is accepted — but not if swaps are accepted.

**Current impact:**
- Item cards always show "Cash" badge, never "Swap" or "Mixed"
- The "Make an Offer" form cannot determine which offer types are valid
- The trade type on My Items page is always "cash"

**What we need:**
Add to `ItemDTO`:
```json
{
  "acceptSwap": true    // Whether the seller accepts item swaps
}
```

Also add to `ItemRequest` (for creating/editing items):
```json
{
  "acceptSwap": true
}
```

With this, the frontend can determine:
- `acceptCash && acceptSwap` → "Mixed" (cash + swap)
- `acceptCash && !acceptSwap` → "Cash only"
- `!acceptCash && acceptSwap` → "Swap only"

---

## 4. Shipping & Logistics Endpoints [P0]

**Problem:** The entire shipping section on the transaction page is non-functional. After payment is confirmed, the seller needs to ship items and the buyer needs to track delivery — but there are no shipping endpoints.

**What we need:**

### 4a. Generate Shipping Code
```
POST /api/v1/transactions/{id}/shipping
Request: {
  logisticsProvider: "GIG" | "GUO",
  senderAddress: "...",
  receiverAddress: "..."
}
Response: {
  shippingCode: "8892-4930",
  trackingNumber: "GIG123456",
  estimatedDelivery: "2026-06-25T00:00:00",
  deadline: "2026-06-23T00:00:00"    // shipping deadline for seller
}
```

### 4b. Get Shipping Status
```
GET /api/v1/transactions/{id}/shipping
Response: {
  status: "PENDING" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED",
  logisticsProvider: "GIG",
  trackingNumber: "GIG123456",
  shippingCode: "8892-4930",
  shippedAt: "2026-06-22T10:00:00",
  estimatedDelivery: "2026-06-25T00:00:00"
}
```

### 4c. Add Shipping Info to TransactionDTO
```json
{
  "shipping": {
    "status": "IN_TRANSIT",
    "trackingNumber": "GIG123456",
    "logisticsProvider": "GIG",
    "shippedAt": "2026-06-22T10:00:00",
    "estimatedDelivery": "2026-06-25T00:00:00"
  }
}
```

---

## 5. Transaction Timeline/History [P1]

**Problem:** The transaction page has a status timeline component that should show when each step happened (e.g., "Payment confirmed at 2:30 PM", "Shipped on June 22"). Currently it's empty because `TransactionDTO` has no event history.

**What we need — Option A (preferred):**
```
GET /api/v1/transactions/{id}/timeline
Response: [
  { "event": "CREATED", "timestamp": "2026-06-20T10:00:00", "description": "Transaction created" },
  { "event": "PAYMENT_CONFIRMED", "timestamp": "2026-06-20T10:05:00", "description": "Payment of ₦50,000 confirmed" },
  { "event": "SHIPPED", "timestamp": "2026-06-21T14:00:00", "description": "Item shipped via GIG Logistics" },
  { "event": "DELIVERED", "timestamp": "2026-06-23T09:00:00", "description": "Delivery confirmed by buyer" }
]
```

**Option B:** Add a `timeline` array field directly to `TransactionDTO`.

---

## 6. Review Duplicate Prevention — `hasReviewed` Field [P1]

**Problem:** After a transaction is completed, both parties can leave reviews. But there's no way to check if a user has already reviewed a specific transaction. The frontend currently allows unlimited duplicate reviews.

**What we need — Option A:**
Add to `TransactionDTO`:
```json
{
  "buyerReviewed": true,
  "sellerReviewed": false
}
```

**Option B:**
```
GET /api/v1/reviews/transaction/{transactionId}
Response: {
  "buyerReview": { ... } | null,
  "sellerReview": { ... } | null
}
```

---

## 7. Review `itemId` — TransactionDTO Needs Item Reference [P1]

**Problem:** When submitting a review via `POST /api/v1/reviews`, the `ReviewRequest` requires an `itemId`. But `TransactionDTO` doesn't include any item ID. The frontend currently sends `transaction.orderId` as a fallback, which is wrong — `orderId` is not an item ID.

**What we need:**
This is solved by item #1 above (adding item data to `TransactionDTO`). Once `TransactionDTO.item.id` exists, the frontend will use it.

---

## 8. User Verification Triggers [P1]

### 8a. Send Email Verification Code
**Problem:** The Settings → Email Verification step has a "Send Verification Code" button, but there's no backend endpoint to trigger sending a verification email.

**What we need:**
```
POST /api/v1/user/{id}/send-verification-email
Response: { "message": "Verification email sent" }
```

### 8b. Resend Phone OTP
**Problem:** The Settings → Phone Verification step has a "Resend Code" button, but there's no endpoint to re-trigger sending an OTP.

**What we need:**
```
POST /api/v1/user/{id}/send-phone-otp
Request: { "phoneNumber": "+234..." }
Response: { "message": "OTP sent" }
```

---

## 9. User Bids Endpoint [P1]

**Problem:** The Offers page has a "My Bids" tab showing all bids the current user has placed across all auctions. There's no endpoint for this — `GET /api/v1/bidding/auction/{auctionId}` only returns bids for a single auction.

**What we need:**
```
GET /api/v1/bidding/user/me
Response: [
  {
    "auctionId": 5,
    "amount": 150000,
    "bidTime": "2026-06-20T10:00:00",
    "auction": {
      "id": 5,
      "item": { "title": "Canon Camera", "imageUrls": [...] },
      "status": "ACTIVE",
      "endDate": "2026-06-25T00:00:00",
      "startingBid": 100000,
      "currentBid": 180000
    }
  }
]
```

---

## 10. Chat Mark-as-Read [P1]

**Problem:** When a user opens a chat, the frontend needs to mark all messages in that chat as read. There's no endpoint for this.

**What we need:**
```
PUT /api/v1/chats/{chatId}/read
Response: { "message": "Messages marked as read" }
```

This should:
- Set `readByReceiver = true` on all messages in the chat where `sentBy != currentUser`
- Decrement the unread count for this chat

---

## 11. Chat Last Message in List Response [P1]

**Problem:** The chat list page needs to show a preview of the last message in each chat. Currently `ChatWithUnreadCountDTO` only has `chat` (metadata) and `unreadCount`. To get the last message, the frontend fetches the FULL message history for EVERY chat — extremely wasteful (happens every 3 seconds via polling).

**What we need:**
Add to `ChatWithUnreadCountDTO`:
```json
{
  "chat": { ... },
  "unreadCount": 3,
  "lastMessage": {              // NEW
    "message": "Hey, is this still available?",
    "sentBy": 42,
    "dateCreated": "2026-06-21T14:30:00"
  }
}
```

---

## 12. Abuse Report — Target Identification [P1]

**Problem:** When a user reports abuse (against a user or an item), the current `AbuseRequest` only accepts `reason` and `description`. There's no way to identify WHO or WHAT is being reported.

**What we need:**
Extend `AbuseRequest`:
```json
{
  "reason": "Spam or scam",
  "description": "This user is sending scam links...",
  "targetType": "USER" | "ITEM" | "OTHER",    // NEW
  "targetId": 42                                // NEW — user ID or item ID
}
```

---

## 13. Item Views Count [P2]

**Problem:** Item detail pages and management pages want to show view counts, but `ItemDTO` has no `views` field.

**What we need:**
Add to `ItemDTO`:
```json
{
  "views": 1250
}
```

Increment views when `GET /api/v1/items/{id}` is called (or via a separate tracking mechanism).

---

## 14. Admin Action Endpoints [P2]

**Problem:** The admin panel has action buttons (Blacklist User, Update Listing Status, Accept/Reject Bid) but no backend endpoints to support them.

**What we need:**

### 14a. User Management
```
PUT /api/v1/admin/customers/{userId}/blacklist
PUT /api/v1/admin/customers/{userId}/unblacklist
```

### 14b. Listing Management
```
PUT /api/v1/admin/listings/{listingId}/status
Request: { "status": "ACTIVE" | "SUSPENDED" | "REMOVED" }
```

### 14c. Bid Management
```
PUT /api/v1/admin/bids/{bidId}/accept
PUT /api/v1/admin/bids/{bidId}/reject
```

---

## 15. Admin Chat — View & Moderate User Chats [P2]

**Problem:** The admin panel has a Chats page for viewing/moderating user conversations, but there are no admin-specific chat endpoints.

**What we need:**
```
GET /api/v1/admin/chats                          — List all chats
GET /api/v1/admin/chats/{chatId}/messages         — View messages in a chat
POST /api/v1/admin/chats/{chatId}/message          — Send admin message
DELETE /api/v1/admin/chats/{chatId}                — Delete a chat
```

---

## 16. Offer Auto-Creates Transaction? [P0 — Clarification Needed]

**Question for backend team:** When `POST /api/v1/offer/{offerId}/accept` is called, does the backend automatically create a `Transaction` record?

**Current frontend behavior:** After accepting an offer, the frontend manually calls `POST /api/v1/transactions` to create the transaction with `buyerId`, `sellerId`, `amount`, `type`, and `description` extracted from the offer.

**If the backend already auto-creates transactions on offer acceptance:**
- The `accept` endpoint response should include the created `TransactionDTO` (or at least the `transactionId`)
- The frontend can then navigate directly to `/transaction/{transactionId}`

**If it doesn't auto-create:**
- The current frontend approach is correct, but the `accept` response should ideally return the offer with updated status so the frontend can extract the necessary data

**Preferred response from `POST /api/v1/offer/{offerId}/accept`:**
```json
{
  "id": 55,
  "status": "ACCEPTED",
  "item": { ... },
  "offeredItem": { ... },
  "sentBy": { ... },
  "transactionId": 101       // NEW — if auto-created
}
```

---

## 17. Auction Winner & Post-Auction Flow [P1]

**Problem:** When an auction ends, the frontend has no way to determine who won or trigger the post-auction transaction flow.

**What we need:**

### 17a. Auction End/Winner Detection
The current `AuctionDTO` in the Swagger spec does NOT have a `winner` field. We need:
- Add `winner: UserDTO` to `AuctionDTO` — populated when the auction status is `ENDED` with the highest bidder
- Confirm: Is `status` automatically set to `ENDED` when `endDate` passes, or does this need a manual trigger/cron?
- Add `currentBid: number` to `AuctionDTO` — the current highest bid amount (frontend currently has to calculate this from the `biddings` array)

### 17b. Create Transaction from Auction
After an auction ends, a transaction should be created between the seller and winner:
```
POST /api/v1/auction/{id}/complete
Response: {
  "auction": { ... },
  "transaction": {              // auto-created transaction
    "id": 150,
    "buyer": { ... },           // the winner
    "seller": { ... },
    "amount": 500000,           // winning bid amount
    "status": "PENDING",
    "type": "CASH_ONLY"
  }
}
```

---

## 18. Password Change — Verify Current Password [P2]

**Problem:** The current `ChangePasswordRequest` only has `newPassword` and `confirmPassword`. There's no way to verify the user's current password before allowing a change. This is a security gap — anyone with access to an active session can change the password without knowing the current one.

**What we need:**
Add `currentPassword` to `ChangePasswordRequest`:
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456",
  "confirmPassword": "newpass456"
}
```

The backend should verify `currentPassword` matches before allowing the change.

---

## 19. UserDTO Missing Fields [P2]

**Problem:** The frontend displays user bio text and an "ID Verified" badge, but the Swagger `UserDTO` doesn't include these fields.

**What we need:**
Add to `UserDTO`:
```json
{
  "bio": "I buy and sell electronics in Lagos",   // user bio/about text
  "idVerified": true                                // whether ID verification is complete
}
```

Also add `bio` to `ProfileRequest` so users can update their bio:
```json
{
  "phoneNumber": "+234...",
  "avatar": "https://...",
  "bio": "Updated bio text"       // NEW
}
```

---

## 20. Waitlist / Landing Page Endpoint [P2]

**Problem:** The landing page at `/landing` has a waitlist email signup form but there's no backend endpoint to receive the email.

**What we need:**
```
POST /api/v1/waitlist
Request: { "email": "user@example.com" }
Response: { "message": "Added to waitlist" }
```

---

## Summary Table

| # | Requirement | Priority | Type |
|---|-------------|----------|------|
| 1 | Item data in TransactionDTO | P0 | Schema change |
| 2 | Paystack payment integration | P0 | New endpoints + webhook |
| 3 | `acceptSwap` field in ItemDTO/ItemRequest | P0 | Schema change |
| 4 | Shipping/logistics endpoints | P0 | New endpoints |
| 5 | Transaction timeline/history | P1 | New endpoint or schema |
| 6 | `hasReviewed` / review prevention | P1 | Schema change |
| 7 | Review `itemId` (solved by #1) | P1 | Depends on #1 |
| 8 | Email/phone verification triggers | P1 | New endpoints |
| 9 | User bids endpoint | P1 | New endpoint |
| 10 | Chat mark-as-read | P1 | New endpoint |
| 11 | Chat lastMessage in list response | P1 | Schema change |
| 12 | Abuse report target identification | P1 | Schema change |
| 13 | Item views count | P2 | Schema change |
| 14 | Admin action endpoints | P2 | New endpoints |
| 15 | Admin chat endpoints | P2 | New endpoints |
| 16 | Offer accept → transaction creation (clarify) | P0 | Clarification |
| 17 | Auction winner & post-auction flow | P1 | Clarification + endpoint |
| 18 | Current password verification | P2 | Schema change |
| 19 | UserDTO: `bio` and `idVerified` fields | P2 | Schema change |
| 20 | Waitlist signup endpoint | P2 | New endpoint |

---

**Frontend is ready to integrate all of the above as soon as the endpoints are available.** For each item, we'll need:
1. Confirmation of the endpoint URL and method
2. Request/response schema
3. Any auth requirements beyond the standard JWT Bearer token

Please reach out if you need any clarification on how the frontend uses these endpoints.

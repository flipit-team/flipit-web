# Flipit — Missing Backend APIs

Organized by each transaction flow, step by step. Each step shows the API needed and whether it exists.

---

## Flow 1: Cash Only (Buyer clicks Buy Now or wins Auction)

| Step | What Happens | API Needed | Exists? |
|------|-------------|------------|---------|
| 1 | Buyer clicks Buy Now or wins auction | `POST /api/v1/offer` | YES |
| 2 | Seller accepts offer | `POST /api/v1/offer/{id}/accept` | YES |
| 3 | Flipit creates a transaction | `POST /api/v1/transactions` | NO |
| 4 | Create escrow via Credo | `POST /api/v1/payments/initialize` | NO |
| 5 | Buyer pays total amount (item price + shipping fee) | Credo payment gateway redirect | NO |
| 6 | Payment confirmed | `POST /api/v1/payments/verify` | NO |
| 7 | Flipit records item price for seller and shipping fee for GIG | Backend internal logic on transaction | NO |
| 8 | Generate shipment ID | `POST /api/v1/shipping/create` | NO |
| 9 | Notify seller to ship item | `POST /api/v1/notifications` (trigger) | NO (GET exists, but no trigger) |
| 10 | Check: Did seller ship on time? | `GET /api/v1/transactions/{id}` (status check) | NO |
| 11 | If NO → Cancel transaction | `PUT /api/v1/transactions/{id}/cancel` | NO |
| 12 | If NO → Refund buyer | `POST /api/v1/payments/{id}/refund` | NO |
| 13 | If YES → Seller ships via GIG | `POST /api/v1/shipping/schedule-pickup` | NO |
| 14 | GIG scans shipment ID and logs item (photos, weight) | GIG webhook/callback to Flipit backend | NO |
| 15 | Tracking info sent to Flipit | `GET /api/v1/shipping/track/{waybillNumber}` | NO |
| 16 | Item in transit | Status updated via GIG tracking webhook | NO |
| 17 | Item delivered to buyer | `POST /api/v1/shipping/confirm-delivery` | NO |
| 18a | Buyer confirms delivery | `PUT /api/v1/transactions/{id}/confirm-delivery` | NO |
| 18b | Buyer opens dispute | `POST /api/v1/disputes` | NO |
| 18c | No response from buyer → Auto confirm after timeout | Backend scheduled job | NO |
| 19 | If dispute → Collect evidence | `POST /api/v1/disputes/{id}/evidence` | NO |
| 20 | If dispute → Admin makes decision | `PUT /api/v1/disputes/{id}/resolve` | NO |
| 20a | Decision: Seller right → Release payment to seller | `PUT /api/v1/payments/{id}/release` | NO |
| 20b | Decision: Buyer right → Return item and refund buyer | `POST /api/v1/payments/{id}/refund` | NO |
| 20c | Decision: Partial → Partial refund and partial release | `POST /api/v1/payments/{id}/refund` (with partial amount) | NO |
| 21 | Credo pays seller | Credo payout API | NO |
| 22 | Flipit pays GIG | GIG settlement API | NO |
| 23 | Transaction completed | `PUT /api/v1/transactions/{id}/complete` | NO |

---

## Flow 2: Swap Only (Two users exchange items, no cash)

| Step | What Happens | API Needed | Exists? |
|------|-------------|------------|---------|
| 1 | User makes swap offer (with their item) | `POST /api/v1/offer` (with offeredItemId, withCash=false) | YES |
| 2 | Other user accepts offer | `POST /api/v1/offer/{id}/accept` | YES |
| 3 | Flipit creates swap transaction | `POST /api/v1/transactions` (type: SWAP_ONLY) | NO |
| 4 | Both users pay shipping fees | `POST /api/v1/payments/initialize` (shipping fee only, per user) | NO |
| 5 | Check: Have BOTH users paid? | `GET /api/v1/transactions/{id}/payment-status` | NO |
| 6 | If one hasn't paid → Wait for payment | Backend waits with timeout | NO |
| 7 | If timeout reached → Cancel swap | `PUT /api/v1/transactions/{id}/cancel` | NO |
| 8 | Both paid → Generate Swap ID + 2 Shipment IDs | `POST /api/v1/shipping/create` (called twice, one per user) | NO |
| 9 | Notify both users to ship their items | Notification trigger for both users | NO |
| 10 | User A ships via GIG | `POST /api/v1/shipping/schedule-pickup` (shipment A) | NO |
| 11 | User B ships via GIG | `POST /api/v1/shipping/schedule-pickup` (shipment B) | NO |
| 12 | GIG logs item A (photos, weight) | GIG webhook | NO |
| 13 | GIG logs item B (photos, weight) | GIG webhook | NO |
| 14 | Check: Have BOTH items arrived at GIG? | `GET /api/v1/shipping/track/{waybillNumber}` (both) | NO |
| 15 | If not both arrived → Wait + countdown | Backend timeout logic | NO |
| 16 | If timeout → Return shipped item(s) and cancel swap | `POST /api/v1/shipping/cancel` + `PUT /api/v1/transactions/{id}/cancel` | NO |
| 17 | Both arrived → Flipit verifies items match listings | `POST /api/v1/transactions/{id}/verify` | NO |
| 18a | Items valid → Release swap | `PUT /api/v1/transactions/{id}/release` | NO |
| 18b | Items invalid → Dispute and return items | `POST /api/v1/disputes` | NO |
| 19 | GIG cross-delivers items (A→B, B→A) | GIG cross-delivery API | NO |
| 20 | Users receive items | `PUT /api/v1/transactions/{id}/confirm-delivery` (both users) | NO |
| 21 | Swap completed | `PUT /api/v1/transactions/{id}/complete` | NO |

---

## Flow 3: Cash + Swap / Mixed Trade (Item A + Cash for Item B)

| Step | What Happens | API Needed | Exists? |
|------|-------------|------------|---------|
| 1 | User makes offer (item + cash) | `POST /api/v1/offer` (offeredItemId + withCash=true + cashAmount) | YES |
| 2 | Other user accepts offer | `POST /api/v1/offer/{id}/accept` | YES |
| 3 | Flipit creates transaction | `POST /api/v1/transactions` (type: MIXED_TRADE) | NO |
| 4 | Cash payer pays into escrow via Credo | `POST /api/v1/payments/initialize` (escrow for cash amount) | NO |
| 5 | Both users pay shipping fees | `POST /api/v1/payments/initialize` (shipping fee, per user) | NO |
| 6 | Check: All payments completed? | `GET /api/v1/transactions/{id}/payment-status` | NO |
| 7 | If not all paid → Wait for payments | Backend waits with timeout | NO |
| 8 | If timeout → Cancel transaction + Refund escrow and shipping | `PUT /api/v1/transactions/{id}/cancel` + `POST /api/v1/payments/{id}/refund` | NO |
| 9 | All paid → Generate Swap ID + Shipment ID A + Shipment ID B | `POST /api/v1/shipping/create` (called twice) | NO |
| 10 | Notify both users to ship | Notification trigger | NO |
| 11 | User A ships with Shipment ID A | `POST /api/v1/shipping/schedule-pickup` | NO |
| 12 | User B ships with Shipment ID B | `POST /api/v1/shipping/schedule-pickup` | NO |
| 13 | GIG logs item A (photos, weight) | GIG webhook | NO |
| 14 | GIG logs item B (photos, weight) | GIG webhook | NO |
| 15 | Check: Both items arrived? | `GET /api/v1/shipping/track/{waybillNumber}` (both) | NO |
| 16 | If timeout → Refund escrow + shipping, cancel transaction | `PUT /api/v1/transactions/{id}/cancel` + refund | NO |
| 17 | Both arrived → Flipit verifies items | `POST /api/v1/transactions/{id}/verify` | NO |
| 18a | Items valid → Trigger release | `PUT /api/v1/transactions/{id}/release` | NO |
| 18b | GIG cross-delivers items | GIG API | NO |
| 18c | Escrow releases cash to seller | `PUT /api/v1/payments/{id}/release` | NO |
| 19a | Items invalid → Open dispute | `POST /api/v1/disputes` | NO |
| 19b | Review evidence (GIG data, listings, user proof) | `POST /api/v1/disputes/{id}/evidence` + `PUT /api/v1/disputes/{id}/resolve` | NO |
| 19c | Decision: Return → Return items + Refund escrow + shipping | `POST /api/v1/payments/{id}/refund` | NO |
| 19d | Decision: Adjust → Adjust cash outcome | `PUT /api/v1/disputes/{id}/resolve` (with adjusted amount) | NO |
| 20 | Users receive items + cash settled | Confirmation from both users | NO |
| 21 | Transaction completed | `PUT /api/v1/transactions/{id}/complete` | NO |

---

## Summary of All New Endpoints Needed

### Transaction Controller (NEW)
- `POST /api/v1/transactions` — Create transaction
- `GET /api/v1/transactions/{id}` — Get transaction
- `GET /api/v1/transactions/me` — Get my transactions
- `GET /api/v1/transactions/{id}/payment-status` — Check if all payments done
- `PUT /api/v1/transactions/{id}/status` — Update status
- `PUT /api/v1/transactions/{id}/cancel` — Cancel
- `PUT /api/v1/transactions/{id}/confirm-delivery` — Buyer/seller confirms receipt
- `PUT /api/v1/transactions/{id}/complete` — Mark complete
- `POST /api/v1/transactions/{id}/verify` — Flipit verifies items match
- `PUT /api/v1/transactions/{id}/release` — Release items/payment

### Payment Controller (NEW — Credo integration)
- `POST /api/v1/payments/initialize` — Create escrow, return payment link
- `POST /api/v1/payments/verify` — Verify payment success
- `GET /api/v1/payments/{id}` — Get payment details
- `PUT /api/v1/payments/{id}/release` — Release escrow to seller
- `POST /api/v1/payments/{id}/refund` — Refund (full or partial)

### Shipping Controller (NEW — GIG Logistics integration)
- `POST /api/v1/shipping/quote` — Get shipping cost
- `POST /api/v1/shipping/create` — Create shipment, get waybill
- `GET /api/v1/shipping/track/{waybillNumber}` — Track shipment
- `POST /api/v1/shipping/schedule-pickup` — Schedule GIG pickup
- `POST /api/v1/shipping/confirm-delivery` — Confirm delivery
- `POST /api/v1/shipping/cancel` — Cancel shipment

### Dispute Controller (NEW)
- `POST /api/v1/disputes` — Open dispute
- `GET /api/v1/disputes/{id}` — Get dispute
- `GET /api/v1/disputes/transaction/{transactionId}` — Get dispute by transaction
- `POST /api/v1/disputes/{id}/evidence` — Submit evidence
- `PUT /api/v1/disputes/{id}/resolve` — Admin resolves dispute

### Missing on Existing Controllers

**Items Controller:**
- `ItemDTO` needs `acceptSwap: boolean` field — currently there is no way to know if a seller accepts item trades. The frontend uses `flipForImgUrls` from an older API which is always `[]`. Without this field, all items appear as "Cash only" even if the seller listed them for swap or mixed trade.
- `ItemRequest` needs `acceptSwap: boolean` field — so sellers can indicate they accept swaps when creating/editing a listing.
- Alternative: replace `acceptCash: boolean` with `tradeType: enum (CASH_ONLY, SWAP_ONLY, MIXED)` on both `ItemDTO` and `ItemRequest`.

**Chat Controller:**
- `PUT /api/v1/chats/{chatId}/read` — Mark messages as read
- `GET /api/v1/chats/unread-count` — Unread message count

**Notification Controller:**
- `PUT /api/v1/notifications/mark-all-read` — Mark all read
- `GET /api/v1/notifications/unread-count` — Unread count
- `DELETE /api/v1/notifications/{id}` — Delete notification

**Support Controller:**
- `POST /api/v1/support/request_callback` — Exists but used as general contact form on the Support page. Consider adding a dedicated `POST /api/v1/support/contact` endpoint that accepts firstName, lastName, email, phone, and message separately.
- `POST /api/v1/support/live_chat` — **NEW** — Needed for "Start Chat" action on Support page. No live chat integration exists.

**Bidding Controller:**
- `GET /api/v1/bidding/user/me` — Get my bids

**Auction Controller:**
- `GET /api/v1/auction/user/{userId}` — Exists in Swagger but `AuctionDTO` needs `status` field to distinguish active vs closed, and a `result` field for successful/failed outcome. Currently no way to tell if a closed auction was successful (reserve met, winner exists) or failed.
- `AuctionDTO` needs: `viewCount: number` — to show views on the My Items auction cards.

**Items Controller (My Items page):**
- `GET /api/v1/items/user/{userId}` — Exists but `ItemDTO` needs `viewCount: number` to display views on My Items cards. Currently hardcoded to 0.
- Items returned don't indicate auction association — no way to know if an item is part of an active/closed auction without cross-referencing auction endpoints.

**Offer Controller:**
- `GET /api/v1/offer/user/{userId}/sent` — Exists in Swagger but frontend needs it to populate "My Offers" tab
- `GET /api/v1/offer/user/{userId}/received` — Exists in Swagger but frontend needs it to populate "Offers on My Items" tab
- `GET /api/v1/offer/stats` — **NEW** — Returns offer statistics for the current user: accepted count, rejected count, completed swaps count, current auctions count. Needed for the 4 stat cards at the top of "Offers on My Items" tab.

---

## Offers Dashboard — API Requirements

The Offers page has two tabs. Here's what each needs:

### "My Offers" Tab
Shows offers the current user has sent to other sellers.

| What's Displayed | API Needed | Exists? |
|-----------------|------------|---------|
| List of offers I sent | `GET /api/v1/offer/user/{userId}/sent` | YES |
| Item image, title | Included in OfferDTO.item | YES |
| What I offered (cash amount, offered item name) | Included in OfferDTO (cashAmount, offeredItem) | YES |
| Trade type (Cash/Swap/Mixed) | Depends on `acceptSwap` field on ItemDTO | NO — needs `acceptSwap` on ItemDTO |
| Offer status (Accepted/Pending/Rejected) | Included in OfferDTO.status | YES |
| "Proceed to checkout" action (on accepted offers) | `POST /api/v1/transactions` | NO |
| "Cancel Transaction" action | `PUT /api/v1/transactions/{id}/cancel` | NO |
| "Resubmit Offer" action (on rejected offers) | `POST /api/v1/offer` (new offer) | YES |
| "Delete Offer" action | `DELETE /api/v1/offer/{offerId}` | YES |

### "Offers on My Items" Tab
Shows offers other users have sent on items I own.

| What's Displayed | API Needed | Exists? |
|-----------------|------------|---------|
| Stats: Accepted offers count | `GET /api/v1/offer/stats` | NO |
| Stats: Rejected offers count | `GET /api/v1/offer/stats` | NO |
| Stats: Completed swaps count | `GET /api/v1/offer/stats` | NO |
| Stats: Current auctions count | `GET /api/v1/offer/stats` | NO |
| List of offers received on my items | `GET /api/v1/offer/user/{userId}/received` | YES |
| Offerer name, avatar, rating | Included in OfferDTO.sentBy | YES |
| Offerer verified status | Needs `idVerified` or `phoneNumberVerified` on UserDTO in sentBy | PARTIAL — UserDTO has it but may not be included in OfferDTO.sentBy |
| What they offered (item name, cash amount) | Included in OfferDTO (cashAmount, offeredItem) | YES |
| Trade type badge | Depends on `acceptSwap` field | NO |
| "Accept" action | `POST /api/v1/offer/{offerId}/accept` | YES (method mismatch — Swagger says POST, frontend uses PUT) |
| "Decline" action | `POST /api/v1/offer/{offerId}/reject` | YES (method mismatch — Swagger says POST, frontend uses PUT) |

---

## Transaction Page — API Requirements

The transaction page (Order Review / Checkout) needs these APIs:

| What's Displayed | API Needed | Exists? |
|-----------------|------------|---------|
| Transaction details (ID, status, type) | `GET /api/v1/transactions/{id}` | NO |
| Item details (title, image, condition) | Included in TransactionDTO.sellerItem | NO — TransactionDTO doesn't exist |
| Payment breakdown (agreed price, shipping fee, platform fee) | `GET /api/v1/transactions/{id}` or `GET /api/v1/payments/{id}` | NO |
| "Proceed to Checkout" — initialize payment | `POST /api/v1/payments/initialize` | NO |
| "Cancel" — cancel transaction | `PUT /api/v1/transactions/{id}/cancel` | NO |
| Transaction status updates (for progress tracker) | `GET /api/v1/transactions/{id}` (polling or websocket) | NO |
| Confirm delivery | `PUT /api/v1/transactions/{id}/confirm-delivery` | NO |
| Submit review | `POST /api/v1/reviews` | YES |

**Data needed in TransactionDTO:**
- `id`, `transactionType`, `status`
- `sellerItem` (ItemDTO), `buyerItem` (ItemDTO for swaps)
- `seller` (UserDTO), `buyer` (UserDTO)
- `cashAmount`, `shippingFee`, `platformFee`, `totalAmount`
- `orderId` (display order number)
- `sellerShipping`, `buyerShipping` (ShipmentDTO)
- `dateCreated`, `dateCompleted`

---

## Third-Party Services to Integrate

| Service | What It Does | Website |
|---------|-------------|---------|
| **Credo** | Payment escrow — holds buyer money, releases to seller after confirmation | https://credocentral.com |
| **GIG Logistics** | Shipping — pickup, tracking, delivery across Nigeria | https://giglogistics.com |

# Transaction API — Missing Data for Frontend

> **Context:** The transaction endpoints (`/api/v1/transactions/*`) are live and working. The status lifecycle, create/cancel/complete/verify/release/confirm-delivery actions are all good. This document covers **data gaps in the TransactionDTO** that block the frontend UI from rendering the full transaction experience.
>
> **Note:** Escrow (Credo) and Shipping (GIG Logistics) endpoints are known to be pending and are NOT included here.

---

## Key Question: Is `orderId` the Offer ID?

The `TransactionDTO` has an `orderId` field, but there is no `/api/v1/orders` endpoint in the Swagger docs. **If `orderId` is actually the offer ID**, then several of the gaps below may already be solvable — the frontend can call `GET /api/v1/offer/{orderId}` to get item data from the `OfferDTO` (which includes `item` and `offeredItem`).

**Please confirm:** Does `orderId` on the `TransactionDTO` map to the offer that created the transaction? If so, the frontend will use it to fetch item details via the offers endpoint. If not, what does it reference?

---

## 1. No Item Data in TransactionDTO

**Problem:** The `TransactionDTO` returns `buyer`, `seller`, `amount`, `type`, `status`, `reference`, `description` — but does NOT include which items are involved in the transaction.

**Impact:** The transaction page cannot show:
- Item names, images, or condition
- "iPhone 13 Pro Max for MacBook Air M1" — it can only show "User A ↔ User B"
- Item details in the order review, shipping, and delivery confirmation steps

**If `orderId` = offer ID:** Frontend can work around this by calling `GET /api/v1/offer/{orderId}` to get `item` + `offeredItem`. This adds an extra API call per transaction page load but is workable.

**If `orderId` ≠ offer ID, suggested fix — pick one:**

### Option A: Add item fields to TransactionDTO (Recommended)
```json
{
  "id": 1,
  "buyer": { ... },
  "seller": { ... },
  "amount": 850000,
  "type": "SWAP",
  "status": "PENDING",
  "sellerItem": { "id": 1, "title": "iPhone 13 Pro", "imageUrls": [...], ... },
  "buyerItem": { "id": 2, "title": "MacBook Air M1", "imageUrls": [...], ... }
}
```

### Option B: Add an offerId field to TransactionDTO
```json
{
  "id": 1,
  "offerId": 42,
  ...
}
```

---

## 2. No Way to Navigate from Accepted Offer → Transaction

**Problem:** When an offer is accepted via `POST /api/v1/offer/{offerId}/accept`, the response is an `OfferDTO`. The frontend has no way to know which transaction was created, so it can't redirect the user to `/transaction/{id}`.

**If `orderId` = offer ID:** Frontend can call `GET /api/v1/transactions/me` after accepting and find the transaction where `orderId` matches the accepted offer's ID. This works but is indirect.

**Cleaner fix — pick one:**

### Option A: Return transactionId in the accept response (Recommended)
```json
// POST /api/v1/offer/{offerId}/accept response:
{
  "id": 42,
  "status": "ACCEPTED",
  "transactionId": 7,
  ...
}
```

### Option B: Have accept return the TransactionDTO directly
`POST /api/v1/offer/{offerId}/accept` returns the created `TransactionDTO` instead of (or alongside) the `OfferDTO`.

---

## 3. No itemId Available for Posting Reviews

**Problem:** `POST /api/v1/reviews` requires `itemId`, but the `TransactionDTO` has no item references. The frontend cannot submit a review at the end of a transaction without knowing the item ID.

**If `orderId` = offer ID:** Solved — frontend fetches the offer, gets `item.id` from the `OfferDTO`, and passes it to the reviews endpoint.

**If `orderId` ≠ offer ID:** Add `itemId` or `sellerItemId`/`buyerItemId` to the `TransactionDTO`.

---

## Summary

| # | Gap | If `orderId` = offer ID | If not |
|---|-----|------------------------|--------|
| 1 | No item data in TransactionDTO | Solvable via `GET /offer/{orderId}` (extra call) | Need items added to DTO |
| 2 | No offer → transaction navigation | Solvable by searching `transactions/me` | Need `transactionId` in accept response |
| 3 | No itemId for reviews | Solvable via offer lookup | Need itemId added to DTO |

**Bottom line:** If `orderId` is the offer ID, all three gaps have workarounds. If not, we need changes to the DTO. Either way, adding a `transactionId` to the offer accept response would make the flow much cleaner.

---

*Generated on 2026-06-07 from frontend integration analysis against Swagger spec at https://api.flipit.ng/swagger-ui/index.html*

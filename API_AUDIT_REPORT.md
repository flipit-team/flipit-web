# Flipit Web App — Full API Integration Audit Report

**Date:** 2026-06-21
**Scope:** Every page, component, service, and API route vs backend Swagger spec at `api.flipit.ng`

---

## Table of Contents

1. [Critical Issues (Broken Flows)](#1-critical-issues)
2. [Auth & User Management](#2-auth--user-management)
3. [Items & Homepage](#3-items--homepage)
4. [Offers](#4-offers)
5. [Transactions & Payments](#5-transactions--payments)
6. [Reviews](#6-reviews)
7. [Support](#7-support)
8. [Auctions & Bidding](#8-auctions--bidding)
9. [Chats & Messaging](#9-chats--messaging)
10. [Notifications](#10-notifications)
11. [Admin Panel](#11-admin-panel)
12. [Type/Schema Mismatches](#12-typeschema-mismatches)
13. [Duplicate/Legacy Routes to Remove](#13-duplicatelegacy-routes)
14. [Hardcoded Mock Data in Production](#14-hardcoded-mock-data)
15. [Missing Backend Endpoints (Report to Backend Team)](#15-missing-backend-endpoints)

---

## 1. Critical Issues

These are broken flows that will cause failures in production.

| # | Area | File | Issue |
|---|------|------|-------|
| C1 | Auth | `api/auth/callback/route.ts` | **Google OAuth callback is POST but Google sends GET** — OAuth flow always returns 405. Also stores `user` cookie instead of `token` cookie, so auth checks fail for Google users. |
| C2 | Auth | `api/auth/google-login/route.ts` | **Redirect URI points to backend path**, not frontend callback — Google redirects user to backend URL, bypassing frontend cookie flow. |
| C3 | Auth | `(pages)/reset-password/page.tsx` | **No password reset form exists** — page stores token in cookie and redirects to `/`. The entire "set new password" UI is missing. `POST /auth/reset-password` is never called. |
| C4 | Offers | `ui/wrappers/Offers.tsx` | **Accepting an offer does NOT create a transaction** — `handleAcceptOffer` only updates UI status. `TransactionService.createTransaction()` is never called anywhere. Accepted offers never produce transactions. |
| C5 | Offers | `ui/wrappers/Offers.tsx` | **"Proceed to checkout" uses offer ID as transaction ID** — navigates to `/transaction/{offer.id}` but transactions are separate entities with their own IDs. Will load a non-existent transaction. |
| C6 | Transactions | `ui/wrappers/TransactionHubV2.tsx` | **Payment gateway not integrated** — "Proceed to Checkout" directly calls `verifyTransaction()` without initiating any actual payment (Paystack, etc.). Payment is completely skipped. |
| C7 | Transactions | `ui/wrappers/TransactionHubV2.tsx` | **SWAP transactions incorrectly call `verifyTransaction`** — "Confirm & Proceed to Shipping" calls the payment verify endpoint. Pure swaps have no payment to verify. |
| C8 | Admin | All admin API routes | **Token read from wrong cookie name** — admin routes look for `auth_token`/`jwt` cookies but the app stores token as `token`. All admin API calls will 401. |
| C9 | Admin | `ui/admin/AdminLogin.tsx` | **Admin login is completely fake** — any email+password succeeds. Uses `localStorage` flag only, no JWT, no API call. |
| C10 | User Service | `services/user.service.ts:90,97` | **Double `/v1` in URL paths** — `getPerformanceMetrics` and `verifyEmail` call `/v1/user/...` but base URL already includes `/api/v1`, producing `/api/v1/v1/user/...`. Will 404. |
| C11 | User Service | `services/user.service.ts:37` | **`getUsers` calls `/users/findAll`** (plural) but backend path is `/user/findAll` (singular). Will 404. |

---

## 2. Auth & User Management

### Signup

| # | File | Issue | Details |
|---|------|-------|---------|
| A1 | `ui/common/auth/form.tsx` | `username` field sent on signup | Backend `UserRequest` has no `username` field. Sent as `username: email`. |
| A2 | `api/auth/register/route.ts` | `username` and `dateOfBirth` forwarded | Neither field exists in `UserRequest` schema. |
| A3 | `api/auth/register/route.ts` | `roleIds` never forwarded | Backend may create role-less accounts. |
| A4 | `ui/common/auth/form.tsx` | `title`, `middleName` never collected | Backend supports these fields but the form doesn't ask for them. |
| A5 | `ui/common/auth/form.tsx` | Full name naive split | "John Michael Doe" → `firstName: "John"`, `lastName: "Michael Doe"`. No `middleName` support. |
| A6 | `ui/common/auth/form.tsx` | Facebook OAuth button links to `/` | No Facebook endpoint exists in the backend. Dead button. |

### Password Reset

| # | File | Issue | Details |
|---|------|-------|---------|
| A7 | `ui/common/auth/ResetPassword.tsx` | Error check commented out | Failed forgot-password requests always show success. |
| A8 | `types/api.ts` | `ResetPasswordRequest` missing `confirmPassword` | Swagger requires `token`, `newPassword`, `confirmPassword`. Type only has `token` and `newPassword`. |
| A9 | `ui/wrappers/ResetPassword.tsx` | Misnamed component | Named "ResetPassword" but actually handles email verification redirects. Creates routing confusion. |

### Profile & Settings

| # | File | Issue | Details |
|---|------|-------|---------|
| A10 | `ui/wrappers/Profile.tsx` | `profileImgKey` sent instead of `avatar` | Backend `ProfileRequest` accepts `phoneNumber` and `avatar` only. Avatar changes never save. |
| A11 | `ui/wrappers/Profile.tsx` | `firstName`, `lastName`, `email` editable but never sent | UI lets user edit these fields but they aren't in the update payload or backend `ProfileRequest`. Should be read-only. |
| A12 | `types/api.ts` | `UpdateProfileRequest` has extra fields | Includes `firstName`, `lastName`, `bio` but backend only accepts `phoneNumber` and `avatar`. |
| A13 | `settings/ChangePasswordContent.tsx` | `currentPassword` collected but discarded | UI asks for it (security theater) but backend `ChangePasswordRequest` only has `newPassword`+`confirmPassword`. |
| A14 | `settings/ChangePasswordContent.tsx` | Password min length inconsistency | Settings page enforces 6 chars, signup form enforces 8 chars. |
| A15 | `services/auth.service.ts` | Duplicate `changePassword` method | Exists in both `AuthService` and `UserService`. Three separate code paths for the same operation. |

### Verification

| # | File | Issue | Details |
|---|------|-------|---------|
| A16 | `settings/EmailVerificationStep.tsx` | Send verification code is a mock | `setTimeout` simulation only. No API call. **Backend dependency: No "send email verification code" endpoint in Swagger.** |
| A17 | `settings/PhoneVerificationStep.tsx` | Resend code is a stub | Clears UI state only, no API call. |
| A18 | `settings/PhoneVerificationStep.tsx` | Code sent as JSON body | Backend expects `code` as a query parameter, not request body. Will fail. |
| A19 | `settings/ProfileVerificationStep.tsx` | Document file never uploaded | `idFilePath` is set to `documentFile?.name` (just the filename). File never uploaded to storage. |
| A20 | `ui/common/auth/VerifyProfile.tsx` | Entire verification UI has zero API calls | BVN input has no state variable. No backend calls wired at all. Purely decorative. |
| A21 | `(pages)/settings/page.tsx` | Hardcoded `username="John"` on Sidebar | Should use authenticated user's name. |
| A22 | `(pages)/performance/page.tsx` | Hardcoded `username="John"` on Sidebar | Same issue. |

### API Client

| # | File | Issue | Details |
|---|------|-------|---------|
| A23 | `lib/api-client.ts` | `requireAuth` token lookup always returns null | Looks in `localStorage`/`sessionStorage` but token is in `httpOnly` cookie (inaccessible to JS). All client-side auth headers are empty. Works only because calls go through Next.js API route proxies. |

---

## 3. Items & Homepage

### Item Display

| # | File | Issue | Details |
|---|------|-------|---------|
| I1 | `ui/wrappers/ItemDetail.tsx:209` | "250 views" hardcoded | No `views` field in `ItemDTO`. Should show real count or be omitted. |
| I2 | `ui/wrappers/ItemDetail.tsx:251-263` | Specs table hardcoded | Always shows "Camera", "Canon", "Fairly used" regardless of actual item data. Should use `item.condition`, `item.brand`. |
| I3 | `ui/wrappers/ItemDetail.tsx:352` | Seller location hardcoded "Lagos, Nigeria" | Should use `item.location`. |
| I4 | `ui/wrappers/ItemDetail.tsx:407` | Report modal title hardcoded | Always "Report Canon EOS RP Camera...". Should use `item.title`. |
| I5 | `ui/wrappers/ItemDetail.tsx:215-238` | Share buttons call wrong handler | Facebook/WhatsApp/X share buttons all call `handleCreate` (the chat handler). Should open share URLs. |
| I6 | `ui/common/item-card/ItemCard.tsx:147` | Swap detection always false | `flipForImgUrls` is always `[]`. `TransactionTypeBadge` can never show "Swap" mode. |
| I7 | `ui/wrappers/ItemDetail.tsx` | All swap trade type detection unreachable | Same root cause — `flipForImgUrls` always empty. "Swap only" and "Barter" branches never execute. |

### My Items

| # | File | Issue | Details |
|---|------|-------|---------|
| I8 | `(pages)/my-items/page.tsx:87-92` | Mock items fallback in production | When API returns no items for a category, dummy Canon camera listings are shown. |
| I9 | `(pages)/my-items/page.tsx:31` | `tradeType` always 'cash' | `item.acceptCash ? 'cash' : 'cash'` — both branches are `'cash'`. Swap/mixed never detected. |
| I10 | `my-items/components/ItemCard.tsx` | Deactivate/Reactivate/Post as Auction — no handlers | Buttons rendered with no `onClick`. |
| I11 | `my-items/components/ItemCard.tsx:89` | Auction toggle is a `setTimeout` simulation | `TODO` comment acknowledges this. |

### Manage Item

| # | File | Issue | Details |
|---|------|-------|---------|
| I12 | `ui/wrappers/ManageItemDetail.tsx:211` | Offers section uses `dummyOffers` | Real API offers (`propOffers`) are passed in but ignored. `useState` initializes with hardcoded dummy data. |
| I13 | `ui/wrappers/ManageItemDetail.tsx:238` | Accept offer uses `setTimeout` simulation | Redirects to `/transaction/1` (hardcoded ID). No API call. |
| I14 | `ui/wrappers/ManageItemDetail.tsx:471` | Trade type hardcoded "Swap only" | Should be based on `item.acceptCash`. |
| I15 | `ui/wrappers/ManageItemDetail.tsx:432` | Auction countdown hardcoded "2 days 14 hours" | Static string, not calculated from real data. |
| I16 | `ui/wrappers/ManageItemDetail.tsx:451,455` | `item.category` doesn't exist | Should be `item.itemCategory?.name`. |

### Post/Edit Item

| # | File | Issue | Details |
|---|------|-------|---------|
| I17 | `ui/post-an-item/Form.tsx` | `published` field sent on update but not in Swagger `ItemRequest` | Unknown field, backend may ignore it. |
| I18 | `ui/post-an-item/Form.tsx:88-94` | Condition `USED` maps to `FAIRLY_USED` on save | Items with `USED` condition silently change to `FAIRLY_USED` on every edit. Backend's `GET /items/itemConditions` endpoint never used. |

### Location & Filtering

| # | File | Issue | Details |
|---|------|-------|---------|
| I19 | `FilterSidebar.tsx`, `LocationFilter.tsx` | Static hardcoded location data | Imports from `~/data/nigerianLocations.ts` instead of calling `GET /api/v1/state`. |
| I20 | `services/location.service.ts` | `getStateByCode`, `getAllLGAs`, `getLGAsByState` call non-existent endpoints | Swagger only defines `GET /state?countryCode=`. LGAs are inline within `StateDTO.lgas[]`. |
| I21 | `ui/homepage/MobileCategoriesModal.tsx` | Uses `categories` (plural) URL param | Backend expects `category` (singular). Mobile category selections never applied. |
| I22 | `api/items/route.ts` | `categories[]` array param forwarded | Backend only accepts `category` (singular string). Dead code. |

### Server API

| # | File | Issue | Details |
|---|------|-------|---------|
| I23 | `lib/server-api.ts:4` | Hardcoded production URL | Uses `'https://api.flipit.ng'` instead of `import { API_BASE_PATH } from '~/lib/config'`. |
| I24 | `api/v1/home/top_nav/route.ts:43-49` | Returns fake counts on empty response | Hardcoded `auctionsCount: 5, messagesCount: 12, biddingCount: 3, notificationsCount: 8`. |

### Services

| # | File | Issue | Details |
|---|------|-------|---------|
| I25 | `services/items.service.ts:79` | `markAsSold` has doubled `/v1` prefix | Calls `/v1/items/${itemId}/markAsSold` but base already has `/v1`. |
| I26 | `services/likes.service.ts:27-33` | `checkLikedStatus` calls non-existent endpoint | `POST /v1/likes/items/check` not in Swagger. |
| I27 | `services/files.service.ts:62-65` | `deleteFile` calls non-existent endpoint | `DELETE /files/{key}` not in Swagger. |

---

## 4. Offers

| # | File | Issue | Details |
|---|------|-------|---------|
| O1 | `ui/homepage/make-an-offer/index.tsx` | Posts to `/api/bids/create` instead of `/api/v1/offer` | Uses a legacy alias route with copy-paste errors in comments. |
| O2 | `ui/homepage/make-an-offer/index.tsx` | `userId` sent in payload | Not in `OfferRequest` schema. Extra field. |
| O3 | `ui/homepage/make-an-offer/index.tsx` | `offerValid` never set | Backend field never populated. May cause issues with offer expiry. |
| O4 | `ui/homepage/make-an-offer/index.tsx` | `onSubmit` prop accepted but never called | Vestigial prop. |
| O5 | `ui/homepage/make-an-offer/index.tsx` | Hardcoded mock `options` array | Dead code — real `myItems` from API is used correctly, but the mock array creates confusion. |
| O6 | `services/offers.service.ts:27` | Deprecated `getUserOffers` calls non-existent endpoint | `GET /offer/user/{userId}/offers` not in Swagger. Should be deleted. |
| O7 | `ui/wrappers/Offers.tsx` | My Bids tab has no backend integration | `MyBid` is a local-only type. No endpoint for user bids exists. Tab always empty. |

---

## 5. Transactions & Payments

| # | File | Issue | Details |
|---|------|-------|---------|
| T1 | `services/transaction.service.ts` | `createTransaction()` defined but never called | No component ever creates a transaction. The offer→transaction bridge is missing. |
| T2 | `ui/wrappers/TransactionHubV2.tsx:281-291` | `confirmDelivery` error not properly handled | UI transitions to `VERIFIED` and shows review modal even if `confirmDelivery` fails. State updates should be inside the `if (!error)` block. |
| T3 | `ui/wrappers/TransactionHubV2.tsx:301` | Review `itemId` uses `transaction.orderId || transaction.id` | Neither is an item ID. `TransactionDTO` doesn't expose the traded item's ID. |
| T4 | `ui/transaction/TransactionItems.tsx:17-18` | Item details are fabricated stubs | Hardcoded `{title: 'Item', imageUrls: [], ...}`. `TransactionDTO` doesn't include item data. |
| T5 | `ui/transaction/TransactionStatusTimeline.tsx:64` | Timeline events hardcoded to `null` | No event history is ever shown. |
| T6 | `ui/transaction/PaymentSection.tsx` | Selected payment method never sent | `selectedMethod` state is cosmetic. `verifyTransaction` sends empty body. |
| T7 | `ui/transaction/ShippingSection.tsx:33-34` | Shipping data permanently `null` | `userShipping` and `otherShipping` are `null as any`. Entire display is dead. |
| T8 | `ui/transaction/ShippingSection.tsx:67-74` | `senderEmail`/`receiverEmail` sent as empty strings | GIG API will receive empty email fields. |
| T9 | `ui/wrappers/TransactionHubV2.tsx` (SellerShippingView) | Shipping code and deadline are hardcoded | "8892 – 4930" and "45 : 59 :44" are static strings. No API call made. |
| T10 | `ui/transaction/SwapTransactionSteps.tsx` | Entire component is a static mockup | Hardcoded dates, IDs, locations. "I have received my Item" only updates local state, no API call. |
| T11 | `ui/wrappers/TransactionHub.tsx` | V1 is unused — dead code | `TransactionPage` imports `TransactionHubV2` only. V1 should be deleted. |
| T12 | `ui/transaction/ReviewModal.tsx:46` | `itemId` set to `transaction.orderId || 0` | Same issue as T3. Will submit reviews against wrong records. |
| T13 | `ui/transaction/ReviewModal.tsx:24` | `hasReviewed` hardcoded to `false` | Duplicate review prevention is bypassed. Users can submit unlimited reviews. |

---

## 6. Reviews

| # | File | Issue | Details |
|---|------|-------|---------|
| R1 | `ui/homepage/leave-review/index.tsx:47-63` | Review API call is commented out | Entire submission is mocked with `alert()`. Cannot submit real reviews from this component. |
| R2 | `ui/transaction/ReviewModal.tsx:105` | Uses `profileImageUrl` instead of `avatar` | `UserDTO` canonical field is `avatar`. May show broken images. |

---

## 7. Support

| # | File | Issue | Details |
|---|------|-------|---------|
| S1 | `(pages)/support/page.tsx:172-199` | Live Chat / Email / Call buttons are dead | No `onClick` handlers, no `href`. Purely decorative. |
| S2 | `ui/homepage/callback-request/index.tsx` | `preferredCallTime` collected but never sent | Backend `CallbackRequest` has no such field. UX defect — collects data that's silently discarded. |
| S3 | `ui/common/modals/ReportAbuseModal.tsx` | `targetId` collected but never sent | Backend `AbuseRequest` only has `reason` + `description`. **No way to tell backend WHO/WHAT is being reported.** |

---

## 8. Auctions & Bidding

| # | File | Issue | Details |
|---|------|-------|---------|
| AU1 | `ui/wrappers/LiveAuctionDetails.tsx:130` | `bidderId` sent in bid request | Swagger `BiddingRequest` only has `auctionId` + `amount`. Backend infers bidder from JWT. |
| AU2 | `ui/wrappers/LiveAuctionDetails.tsx:197` | "250 views" hardcoded | Same as I1. |
| AU3 | `ui/wrappers/LiveAuctionDetails.tsx:202-222` | Share buttons have no `onClick` handlers | Non-functional. |
| AU4 | `ui/wrappers/LiveAuctionDetails.tsx:167-175` | Auction win/end flow is a `TODO` | Only logs to console. No winner detection, no transaction creation. `AuctionDTO.winner` field never read. |
| AU5 | `ui/wrappers/ManageAuctionDetail.tsx:73-197` | Falls back to hardcoded dummy data | `dummyOwnerAuction`, `dummyBidderAuction`, `dummyBids` used if props are undefined. |
| AU6 | `ui/wrappers/ManageAuctionDetail.tsx:248-271` | `handlePlaceBid` is a `setTimeout` simulation | Never calls `BiddingService.placeBid()`. |
| AU7 | `ui/wrappers/ManageAuctionDetail.tsx:275-283` | `handleCancelAuction` is a `setTimeout` simulation | Never calls any API. |
| AU8 | `ui/wrappers/ManageAuctionDetail.tsx` | Local `Bid` interface doesn't match `BiddingDTO` | Uses `bidder.name` which is `undefined` — backend has `firstName`/`lastName`. |
| AU9 | `ui/wrappers/ManageAuctionDetail.tsx` | `auction.views`, `totalBids`, `uniqueBidders` don't exist | Not in `AuctionDTO`. Only `biddingsCount` is available. |
| AU10 | `ui/wrappers/ManageAuctionDetail.tsx:537,543` | `auction.category`/`subcategory` wrong path | Should be `auction.item.itemCategory.name` and `auction.item.subcategory`. |
| AU11 | `services/auctions.service.ts` | `getUserAuctions` calls undocumented endpoint | `GET /auction/user/{userId}` not in Swagger. |
| AU12 | `services/bidding.service.ts:34-45` | `getHighestBid` and `getBidHistory` call non-existent endpoints | `/bidding/auction/{id}/highest` and `/history` not in Swagger. |
| AU13 | `services/bidding.service.ts:21-31` | `getUserBids` and `getCurrentUserBids` call non-existent endpoints | `/bids/get-user-bids` not in Swagger. |
| AU14 | `ui/wrappers/LiveAuctionClient.tsx` | Three duplicate `transformAuctionToItem` functions | Divergent implementations across files. Should be unified. |

---

## 9. Chats & Messaging

| # | File | Issue | Details |
|---|------|-------|---------|
| CH1 | `services/chat.service.ts:15` | `createChat` calls `/chats/create` | Swagger endpoint is `POST /api/v1/chats`. Wrong URL. |
| CH2 | `api/v1/chats/route.ts` | No POST handler for creating chats | Only GET is implemented. Starting a new chat through the proxy layer is impossible. |
| CH3 | `services/chat.service.ts:8` | `getUserChats` typed as `ChatDTO[]` | Backend returns `ChatsResponse: { seller: [], buyer: [] }`, not a flat array. |
| CH4 | `types/api.ts:388` | `SendMessageRequest.content` vs backend `CreateMessageRequest.message` | Mismatch patched by proxy route (`body.content || body.message`), but type is wrong. |
| CH5 | `types/api.ts:376` | `MessageDTO.senderId` vs backend `sentBy` | Type says `senderId`, UI code reads `sentBy`. Type is wrong. |
| CH6 | `ui/wrappers/MainChats.tsx:130` | Chat list polled every 3 seconds | No WebSocket/SSE. Full HTTP request per poll per user. Performance concern at scale. |
| CH7 | `ui/wrappers/MainChats.tsx:32-54` | Full message history fetched for every chat every 3 seconds | Only to get the last message preview. Massively wasteful. Backend should include `lastMessage` in `ChatsResponse`. |
| CH8 | `ui/wrappers/MainChats.tsx:169` | `markMessagesAsRead` calls non-existent endpoint | `PUT /chats/{chatId}/read` not in Swagger. |
| CH9 | `ui/wrappers/MainChats.tsx:492` | Delete modal always shows `initiatorName` | Should show the "other person's" name, not always the initiator. |
| CH10 | `ui/wrappers/MobileChat.tsx:74` | Chat title hardcoded "iPhone 12 promax" | Should use `ChatDTO.title`. |
| CH11 | `ui/wrappers/MobileChat.tsx:88` | Message alignment is inverted | Current user's messages show on the left (opposite of convention and opposite of desktop chat). |

---

## 10. Notifications

| # | File | Issue | Details |
|---|------|-------|---------|
| N1 | `services/notifications.service.ts` | 7 methods call non-existent endpoints | `markAsSeen`, `markAllAsSeen`, `markAllAsRead`, `getUnreadCount`, `deleteNotification`, `deleteAllNotifications`, `getNotificationById` — none in Swagger. Only `GET /notifications` and `PUT /notifications/{id}/markAsRead` exist. |
| N2 | `ui/wrappers/Notifications.tsx:82-88` | `avatar` field never displayed | Always shows generic speaker icon. `NotificationDTO.avatar` exists but is unused. |
| N3 | `api/notifications/get-notifications/route.ts` | Route path not under `/api/v1/` | Should be `/api/v1/notifications` for consistency. |
| N4 | `api/notifications/[id]/markAsRead/route.ts` | Route path not under `/api/v1/` | Same inconsistency. |
| N5 | `ui/common/layout/bottom-nav-bar/index.tsx` | No unread count badges on mobile nav | Desktop header shows badges; mobile bottom nav shows none. |

---

## 11. Admin Panel

| # | File | Issue | Details |
|---|------|-------|---------|
| AD1 | All admin API routes | Hardcoded `API_BASE_URL` | Should use `import { API_BASE_PATH } from '~/lib/config'`. |
| AD2 | `admin.service.ts:14` | `getRecentActivities` typed as `string[]` | Backend returns `AdminActivityDTO[]`. Transform hardcodes all fields as `'-'`. |
| AD3 | `admin.service.ts:37` | `getAllCustomers` typed as `string[]` | Backend returns `AdminCustomerDTO[]`. Transform hardcodes all fields. |
| AD4 | `admin.service.ts:46` | `getAllBids` typed as `string[]` | Backend returns `AdminBidDTO[]`. Transform hardcodes all fields. |
| AD5 | `ui/admin/pages/AdminListings.tsx:122-143` | "Update Status" / "Blacklist" use `alert()` | No API calls. No backend endpoints for this either. |
| AD6 | `ui/admin/pages/AdminCustomers.tsx:112-138` | "View" / "Blacklist" / "Chat" use `alert()` | No API calls. |
| AD7 | `ui/admin/pages/AdminBids.tsx:122-141` | "Accept" / "Reject" use `alert()` | No API calls. |
| AD8 | `ui/admin/pages/AdminChats.tsx` | Entire page is hardcoded mock data | Static `chatsList` and `messages` arrays. No API calls at all. |
| AD9 | `ui/admin/layout/AdminLayout.tsx:17-22` | Admin user data hardcoded | Always shows "John Admin". Never fetched from backend. |
| AD10 | `ui/admin/layout/AdminHeader.tsx:51-57` | Notification bell has no handler | Not wired to any API. |
| AD11 | All admin list pages | Client-side pagination only | Full list fetched then sliced. Backend supports `page`/`size` params but they're never used. |
| AD12 | `ui/admin/pages/AdminSettings.tsx` | "Settings Coming Soon" placeholder | No implementation. |

---

## 12. Type/Schema Mismatches

| # | Type | Field | Issue |
|---|------|-------|-------|
| TS1 | `BidDTO` vs `BiddingDTO` | `bidAmount` vs `amount` | Two conflicting bid types. Frontend `BidDTO.bidAmount`, backend `BiddingDTO.amount`. |
| TS2 | `CreateAuctionRequest` | `itemId` | Frontend type has `itemId` but Swagger `AuctionRequest` doesn't. Backend creates item+auction together. |
| TS3 | `UpdateAuctionRequest` | `location`, `itemCategories` | Uses old field names. Should be `stateCode`/`lgaCode` and `itemCategory` (singular). |
| TS4 | `CreateChatRequest` | `title` | Marked optional (`title?`) but Swagger `StartChatRequest` requires it. |
| TS5 | `MessageDTO` | `senderId` | Backend field is `sentBy`. |
| TS6 | `SendMessageRequest` | `content` | Backend field is `message`. |
| TS7 | `ListingDTO` | `createdAt` | May be `dateCreated` on backend (all other DTOs use `dateCreated`). |
| TS8 | `CreateBidRequest` | `bidderId` | Not in Swagger `BiddingRequest`. Backend infers from JWT. |

---

## 13. Duplicate/Legacy Routes

These should be removed — canonical routes already exist.

| Legacy Route | Canonical Route | Notes |
|---|---|---|
| `POST /api/items/create` | `POST /api/items` | Identical logic + unused verify fetch |
| `GET /api/items/get-items` | `GET /api/items` | Wrong param name (`q` vs `search`), invalid `location` param |
| `GET /api/items/get-categories` | `GET /api/items/categories` | Exact duplicate |
| `POST /api/bids/create` | `POST /api/v1/offer` | Copy-paste errors, wrong error messages |
| `GET /api/items/get-item` | `GET /api/items/[id]` | Legacy route |
| `GET /api/items/get-user-items` | `GET /api/items/user/[userId]` | Legacy route |
| `GET /api/chats/get-user-chats` | `GET /api/v1/chats` | Legacy route |
| `GET /api/chats/get-chat` | `GET /api/v1/chats/[chatId]/messages` | Legacy route |
| `POST /api/chats/send-chat` | `POST /api/v1/chats/message` | Legacy route |
| `POST /api/chats/create` | `POST /api/v1/chats` (missing) | Legacy + canonical missing |

---

## 14. Hardcoded Mock Data

Data shown to real users in production that should be dynamic or removed.

| File | What's Hardcoded | Should Be |
|---|---|---|
| `ItemDetail.tsx:209` | "250 views" | Real count or omit |
| `ItemDetail.tsx:251-263` | "Camera", "Canon", "Fairly used" | `item.brand`, `item.condition` |
| `ItemDetail.tsx:352` | "Lagos, Nigeria" | `item.location` |
| `ItemDetail.tsx:407` | "Report Canon EOS RP Camera..." | `item.title` |
| `ManageItemDetail.tsx:211` | `dummyOffers` | Real API data |
| `ManageItemDetail.tsx:432` | "2 days 14 hours" | Calculate from `endDate` |
| `ManageItemDetail.tsx:471` | "Swap only" | Based on `acceptCash` |
| `ManageAuctionDetail.tsx` | `dummyOwnerAuction`, `dummyBids` | Real API data |
| `top_nav/route.ts` | `{auctionsCount:5, messagesCount:12, ...}` | Real data or zeros |
| `my-items/page.tsx` | `mockItems` fallback | Empty state UI |
| `MobileChat.tsx:74` | "iPhone 12 promax" | `chat.title` |
| `SwapTransactionSteps.tsx` | All dates, IDs, locations | Real transaction data |
| `TransactionItems.tsx` | `{title: 'Item', ...}` | Real item data |
| `AdminLayout.tsx` | "John Admin" | Real admin user data |

---

## 15. Missing Backend Endpoints

These are features the UI needs but the backend doesn't currently provide (per Swagger). **Report to backend team.**

| # | Needed Endpoint | Why |
|---|---|---|
| BE1 | `POST /api/v1/user/{id}/send-verification-email` | Email verification step needs to trigger sending a code |
| BE2 | `POST /api/v1/user/{id}/send-phone-otp` | Phone verification "Resend Code" needs a trigger endpoint |
| BE3 | Item views count field in `ItemDTO` | Multiple pages display view counts but `ItemDTO` has no `views` field |
| BE4 | `GET /api/v1/bidding/user/me` or similar | "My Bids" tab needs a user-bids endpoint |
| BE5 | `PUT /api/v1/chats/{chatId}/read` | Chat "mark as read" — frontend calls it but it doesn't exist |
| BE6 | `lastMessage` field in `ChatWithUnreadCountDTO` | To avoid fetching full message history for every chat |
| BE7 | Item data in `TransactionDTO` (or linked offer data) | Transaction page cannot show item images/titles without this |
| BE8 | `targetId`/`targetType` in `AbuseRequest` | Currently no way to identify who/what is being reported |
| BE9 | `acceptSwap` field in `ItemDTO` or equivalent | Cannot determine if an item accepts swaps — `flipForImgUrls` is deprecated |
| BE10 | Admin action endpoints (blacklist, update status) | Admin panel has buttons but no backend endpoints |
| BE11 | Admin chat endpoints | Admin chat page exists but no endpoints for admin to view/send messages |
| BE12 | Shipping/logistics integration endpoints | Shipping section has no real backend to generate codes, track shipments |
| BE13 | Payment gateway integration (Paystack) | Transaction verify is called without actual payment initiation |
| BE14 | `hasReviewed` field on `TransactionDTO` | To prevent duplicate reviews |
| BE15 | Timeline/history events endpoint for transactions | Transaction status timeline has no event data source |

---

*End of audit report.*

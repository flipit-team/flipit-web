# Flipit — Figma-to-App Screen Map

**Figma File:** [Flipit Design](https://www.figma.com/design/AhvpZESneQdMw0FfMQdoL1/Flipit)
**File Key:** `AhvpZESneQdMw0FfMQdoL1`

This document maps every Figma screen to its corresponding app route/component, for both desktop and mobile. Use this as the single source of truth when referencing designs.

**How to open a specific Figma screen:** Replace colons with dashes in the node ID:
`https://www.figma.com/design/AhvpZESneQdMw0FfMQdoL1/Flipit?node-id={nodeId}`

---

## Authentication

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Sign In | `/login` | `1829:3639` — SIGN IN | `3010:22697` — Sign In |
| Sign In (alternate) | `/login` | `2469:8145` — Alternate sign in | — |
| Sign Up | `/login` (tab) | `1832:3667` — SIGN UP | `3515:11373` — Sign Up |
| Sign Up (alternate) | `/login` (tab) | `2469:8374` — Alternate sign up | — |
| Reset Password | `/reset-password` | `1832:3735` — RESET PASSWORD | `3515:11545` — Reset password |
| Reset Password (alternate) | `/reset-password` | `2472:8465` — Alternate reset password | — |
| Verify Code | `/verify` | — | `3515:11462` — Verify code |
| Google OAuth Callback | `/auth/callback` | — | — |
| Auth Success | `/auth-success` | — | — |

---

## Home & Browse

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Homepage | `/` | `1977:4739` — Home | `3714:16245` — Home |
| New User Homepage | `/` | — | `4294:19717` — new sign up home |
| Search Results | `/` (with search query) | `3667:13407` — Search | — |
| Search Results 2 | `/` (with search query) | `2175:11144` — Search | — |
| Filter Results | `/` (with filters) | `1901:6853` — Filter results | — |
| Category View | `/` (with category filter) | — | `3798:12719` — Category / Gadgets |
| See All Categories | `/` (categories modal) | — | `3798:13145` — See All categories |
| Live Auction List | `/live-auction` | `2519:6693` — live auction | — |
| Unauthenticated View | `/` (logged out) | `2439:4967` — Unauthenticated view | — |

---

## Item Details

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Item Detail — Cash Only | `/[slug]` | `2176:8974` — Item detail / cash only | `3798:13004` — Item details/cash |
| Item Detail — Swap Only | `/[slug]` | `2177:8198` — Item detail / swap only | `3910:12319` — Item details/swap |
| Item Detail — Mixed | `/[slug]` | `2177:8587` — Item detail / mixed trade | `3910:12437` — Item details/mixed |
| Auction Item Detail | `/live-auction/[slug]` | `2154:8898` — Auction Details | `4287:17262` — Auction item details |
| Swap Partner Details | `/[slug]` | `3207:12762` — Swap partner details | — |
| Image Expansion 1 | `/[slug]` (overlay) | `2474:5846` — Image expansion 1 | — |
| Image Expansion 2 | `/[slug]` (overlay) | `2474:5847` — Image expansion 2 | — |
| Image Expansion 3 | `/[slug]` (overlay) | `2474:5845` — Image expansion 3 | — |
| Report Abuse | `/[slug]` (overlay) | `2177:9056` — Report abuse overlay | `3936:16566` — Report Abuse |
| Send a Message | `/[slug]` (overlay) | `2185:9064` — send a message overlay | `3936:16649` — Send a message |
| Feedback | `/[slug]` or `/feedback` | `2186:5744` — Feedback overlay | `3936:12938` — feedback |
| Seller Info | `/[slug]` (overlay) | `2187:6041` — seller info overlay | — |

---

## Make an Offer

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Cash Only Offer | `/[slug]` (offer modal) | `2122:7701` — cash only offer | `3936:18232` — mobile cash only offer |
| Swap Only Offer | `/[slug]` (offer modal) | `2122:8732` — Swap only offer | `3936:18249` — Swap only offer |
| Cash + Swap Offer | `/[slug]` (offer modal) | `2122:8771` — cash + swap | `3936:18291` — cash + swap |
| Resubmit Cash Offer | `/[slug]` (offer modal) | `2989:17236` — resubmit cash offer | `3990:18559` — resubmit cash only offer |
| Resubmit Swap Offer | `/[slug]` (offer modal) | `2989:17259` — resubmit swap offer | `3990:18593` — resubmit swap only offer |
| Resubmit Cash+Swap | `/[slug]` (offer modal) | `2989:17339` — resubmit cash + swap | `3990:18632` — resubmit cash + swap |

---

## Auction Bidding

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Place Bid | `/live-auction/[slug]` (overlay) | `2524:9026` — Place bid overlay | `4506:20667` — Place bid overlay |
| Resubmit Bid | `/live-auction/[slug]` (overlay) | `2975:16526` — Resubmit auction bid | `4506:20683` — Resubmit auction bid |
| Bid Placed Confirmation | `/live-auction/[slug]` (overlay) | — | `4506:20749` — Bid placed |
| Auction Winner | `/live-auction/[slug]` | `2524:9031` — Auction winner | — |

---

## Post & Edit Item

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Post an Item (entry) | `/post-an-item/entry` | `2060:7229` — Post an item | `4025:14063` — Post an Item |
| Post a Listed Item | `/post-an-item/form` | `2064:7362` — Post a listed item | `4027:14234` — Post a listed item |
| Cash Only Listing | `/post-an-item/form` | `2070:8506` — Cash only listing | `4029:14417` — Cash only listing |
| Cash + Swap Listing | `/post-an-item/form` | `2091:5774` — Cash + Swap listing | `4030:14670` — Cash + swap listing |
| Swap Only Listing | `/post-an-item/form` | `2093:5782` — Swap only listing | `4025:12995` — Swap only listing |
| Post Auction Item | `/post-an-item/form` | `2097:7647` — Post auction item | `4034:16736` — Post auction item |
| Edit Post | `/edit-item/[slug]` | `2207:8014` — Edit Post | `4030:14922` — Edit Post |
| Edit Item Listing | `/edit-item/[slug]` | — | `4034:16499` — Edit item listing |
| Preview Cash Only | (preview state) | `2203:7348` — Preview cash only listing | `4024:12702` — Preview cash only listing |
| Preview Swap | (preview state) | `2203:7455` — Preview swap listing | `4316:16796` — Preview swap only listing |
| Preview Swap + Cash | (preview state) | `2203:7607` — Preview swap + cash listing | `4034:16409` — Preview swap + cash listing |
| Preview Overlay | (preview state) | `2209:8199` — preview cash only listing overlay | — |

---

## Offers Dashboard

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| My Offers (sent) | `/offers` | `2214:6355` — My Offers | `4068:24864` — Offers dashboard 1 |
| Offers on My Items | `/offers` (tab) | `2674:9010` — Offers on my Item | `4079:15640` — Offers Dashboard 2 |
| My Bids | `/offers` (tab) | `3352:11951` — My Bids | `4079:15764` — Offers Dashboard 3 |

---

## My Items

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| My Items — Listed | `/my-items` | `3343:15746` — My items 1 | `4287:17380` — My items 1 |
| My Items — Auctions | `/my-items` (tab) | `3352:11264` — My items 2 | `4294:19275` — My items 2 |
| My Items — Deactivated | `/my-items` (tab) | `3352:11651` — My item 3 | `4294:19549` — My items 3 |
| Manage Listed Item | `/manage-item/[id]` | `2246:6252` — Manage your Listed Item | `4106:20143` — manage your listed items |
| Manage Cash Listed Item | `/manage-item/[id]` | `3797:12447` — Manage Cash Listed Item | `4117:15069` — manage your cash items |
| Manage Auction (Owner) | `/manage-auction/[id]` | `2269:7250` — Manage auction / owner view | `4118:17318` — manage your auction items |
| Manage Auction Details | `/manage-auction/[id]` | `2722:17436` — Manage auction details | — |
| Manage Auction End | `/manage-auction/[id]` | `2282:9195` — Manage auction end | — |

### My Items Overlays
| Overlay | Desktop Figma | Mobile Figma |
|---------|---------------|--------------|
| List Item Confirmation | `3399:12867` — List item overlay | `4287:17844` — List item overlay |
| Post as Auction Confirm | `3741:11792` — Post as auction overlay | `4287:17848` — Post as auction overlay |
| Deactivate Item | `3401:12887` — Deactivate | `4287:17852` — Deactivate |
| Activate Item | `3796:12387` — Activate | `4287:17857` — Activate |
| Delete Confirmation | `2980:16868` — Delete confirmation | `4064:19557` — Delete confirmation overlay |
| Mark as Sold | (component `2956:14175`) | — |
| Toast: Deactivated | `3822:11872` — Toast Notification | `4287:17889` — deactivated Notification |
| Toast: Reactivated | `3824:12208` — Toast Notification 2 | `4287:17895` — reactivated Notification |

---

## Messages / Chat

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| All Messages | `/messages` | `2103:6225` — Messages | `4034:17066` — Messages / all |
| Messages — Purchases | `/messages` (tab) | `2776:8406` — Messages / purchase | `4055:17409` — Messages / my purchases |
| Messages — Purchases (open) | `/messages/[slug]` | `2782:8337` — Messages / purchase 2 | `4063:18294` — open message purchases |
| Messages — Sales | `/messages` (tab) | `2787:8643` — Messages / sales | `4055:17475` — Messages / my sales |
| Messages — Sales (open) | `/messages/[slug]` | `2787:8790` — Messages / sales 2 | `4064:18375` — open message purchases |
| Messages — Error | `/messages` | `2497:6077` — Messages / error | — |

---

## Notifications

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Notifications Page | `/notifications` | `2134:6689` — Notifications | `4065:24269` — Notification |
| Notification for Seller | `/notifications` | — | `4084:16202` — Notification for Seller |
| Notification for Buyer | `/notifications` | — | `4519:20923` — Notification for Buyer |
| Notification Overlay | (header dropdown) | `2820:8951` — notification overlay | — |

---

## Saved Items

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Saved — Listed Items | `/saved-items` | `2211:8656` — Saved Items / listed item | `4066:24599` — Saved Pages |
| Saved — Live Auction | `/saved-items` | `2214:6178` — Saved Items / live auction | `4066:24754` — Saved Pages |
| Saved — Items Removed | `/saved-items` | `3117:10423` — Saved Items removed | `4324:16803` — Saved Pages cleared |
| Remove Saved Item | `/saved-items` (overlay) | `3055:9861` — Remove saved item | `4064:19563` — Remove saved item |
| Cancel Offer | (overlay) | `2980:17097` — Cancel offer | `4064:19569` — Cancel offer |

---

## Transactions — Cash Only

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Order Review (Buyer) | `/transaction/[id]` | `2524:9036` — Cash only transaction/buyer view | `4324:17144` — Cash only transaction |
| Payment | `/transaction/[id]` | `2727:18685` — E tranzact payment | `4332:6129` — E tranzact payment |
| Payment Success | `/transaction/[id]` (overlay) | `2727:19042` — Payment successful overlay 1 | `4336:6012` — payment success overlay |
| Seller Shipping | `/transaction/[id]` | `2548:4662` — Seller shipping (cash only) | `4343:6379` — seller shipping cash only |
| Seller Shipping 2 | `/transaction/[id]` | `3060:10002` — Seller shipping (cash only) 2 | `4355:15525` — seller shipping cash only 2 |
| Buyer Shipping Confirm | `/transaction/[id]` | `2922:11379` — buyer shipping confirmation | `4336:5950` — buyer shipping confirmation |
| Buyer Item Tracking | `/transaction/[id]` | `2564:5341` — buyer shipping view (cash only) | `4355:15616` — buyer item tracking (cash only) |
| Buyer Tracking 2 | `/transaction/[id]` | `2566:5461` — buyer shipping view (cash only) | — |
| Delivery Confirmation | `/transaction/[id]` | — | `4359:15721` — buyer delivery confirmation |
| Shipping Detail Overlay | `/transaction/[id]` (overlay) | — | `4355:15388` — shipping detail overlay |
| Completed | `/transaction/[id]` | `3177:15888` — cash transaction completed | `4362:15892` — cash transaction completed |
| Rating & Review | `/transaction/[id]` | `2605:6446` — Rating and Review | `4359:15807` — Rating and review (cash only) |
| Notification for Buyer | `/transaction/[id]` | `2922:11481` — Notification for buyer | — |
| Notification for Seller | `/transaction/[id]` | `2969:16096` — Notification for seller | — |

---

## Transactions — Swap Only

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Order Review | `/transaction/[id]` | `2727:20649` — item swap Order Review | `4366:23581` — swap only order review |
| User A Shipping | `/transaction/[id]` | `2652:8072` — item swap User A | `4399:23744` — swap only shipping User A |
| User A Shipping Complete | `/transaction/[id]` | `3066:10335` — item swap User A / Complete | `4420:24671` — swap only shipping User A |
| User B Shipping | `/transaction/[id]` | `2652:8217` — item swap User B | `4420:24790` — swap only shipping User B |
| User B Shipping Complete | `/transaction/[id]` | `3076:10317` — item swap User B / Complete | `4420:24910` — swap only shipping User B 2 |
| User A Tracking | `/transaction/[id]` | `2646:6313` — item swap tracking | `4420:25259` — Swap only User A tracking |
| Verification | `/transaction/[id]` | `2646:6155` — item swap verification | `4420:25131` — Swap verification |
| Confirm Receipt | `/transaction/[id]` | `2647:6742` — item swap confirm delivery | `4430:25408` — Swap only confirm receipt |
| Completed | `/transaction/[id]` | `2646:6453` — item swap completed | `4432:6913` — Swap completed |
| Swap Completed (alt) | `/transaction/[id]` | `2727:21775` — item swap completed | `4438:15554` — Swap completed |
| Rating & Review | `/transaction/[id]` | `2922:11975` — Rating and Review | `4432:6808` — Rating and review (swap only) |

---

## Transactions — Mixed Trade (Cash + Swap)

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Order Review | `/transaction/[id]` | `2647:6913` — item swap + cash | `4437:7388` — mixed trade order review |
| Payment | `/transaction/[id]` | `2922:12125` — E tranzact payment 2 | `4438:7490` — E tranzact mixed trade payment |
| Payment Success | `/transaction/[id]` (overlay) | `2922:12224` — Payment successful overlay 2 | — |
| User A Shipping | `/transaction/[id]` | `2652:8365` — item swap + cash (User A) | `4438:7556` — mixed trade swap (user A) |
| User A Complete | `/transaction/[id]` | `2652:7619` — item swap + cash (User A) / Complete | `4438:7677` — mixed trade shipping (User A) 2 |
| User B Shipping | `/transaction/[id]` | `2652:7245` — item swap + cash (user B) | `4438:14788` — mixed trade shipping User B |
| User B Complete | `/transaction/[id]` | `2652:8500` — item swap + cash (user B) / Complete | `4438:14918` — mixed trade shipping User B 3 |
| User A Tracking | `/transaction/[id]` | `2727:21246` — item swap tracking | `4438:15110` — mixed trade User A tracking |
| Verification | `/transaction/[id]` | — | `4438:15070` — mixed trade swap verification |
| Confirm Receipt | `/transaction/[id]` | `2956:12848` — item swap + cash confirm delivery | `4438:15301` — mixed trade confirm receipt |
| Rating & Review | `/transaction/[id]` | `2956:12961` — Rating and Review | `4438:15458` — Rating and review (mixed trade) |

---

## Profile & Settings

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Profile | `/profile` | — | `4124:17645` — Profile |
| Performance | `/performance` | `2137:7146` — Performance | — |
| Personal Details | `/settings` (tab) | `2137:7336` — Personal Details | `4270:15641` — Personal details |
| Personal Details 2 | `/settings` (tab) | `2808:8564` — Personal Details 2 | — |
| Personal Details 3 | `/settings` (tab) | `2808:8821` — Personal Details 3 | — |
| Settings | `/settings` | `2137:7451` — Settings | — |
| Settings Options | `/settings` | `2804:9884` — Settings option | — |
| Change Password 1 | `/settings` (tab) | `2809:9345` — Change Password 1 | `4324:16611` — Change Password |
| Change Password 2 | `/settings` (tab) | `2809:9482` — Change Password 2 | — |
| Change Language 1 | `/settings` (tab) | `2809:9620` — Change language 1 | `4270:15758` — Change Language |
| Change Language 2 | `/settings` (tab) | `2809:9784` — Change language 2 | — |
| Manage Notifications | `/settings` (tab) | `2809:10103` — Manage notifications | `4271:15862` — Manage Notifications |
| Delete Account | `/settings` (tab) | `2809:10425` — Delete account | `4271:16783` — Delete Account |
| Delete Account Overlay | `/settings` (overlay) | `2154:7741` — Delete account overlay | — |
| Verify Profile 3 | `/settings` (verify) | `2804:10057` — verify profile 3 | `4268:15465` — Verification 1 |
| Verify Profile 3.1 | `/settings` (verify) | `2137:7598` — verify profile 3.1 | `4270:15531` — Verification 2 |
| Verify Phone | `/settings` (verify) | `2137:7754` — verify phone number | `4324:16731` — phone number verification |
| Code Verification | `/settings` (verify) | — | `4324:16742` — code verification |
| Profile Verify Overlay | (overlay) | Component `2801:8971` | — |
| Log Out Overlay | (overlay) | — | `4324:16753` — Log out overlay |
| Changes Saved | (overlay) | — | `4324:16872` — changes saved overlay |

---

## Support & FAQ

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Contact Support | `/support` | `3122:10568` — Contact Support | `4271:16911` — Support |
| FAQ Page | `/faq` | `1246:5302` — Frequently Asked Questions | `4271:16871` — FAQs |
| FAQ Overlay 1 | `/faq` (expanded) | `2192:6897` — Faq overlay | — |
| FAQ Overlay 2 | `/faq` (expanded) | `2820:9679` — Faq overlay 2 | — |
| FAQ Overlay 3 | `/faq` (expanded) | `2820:9698` — Faq overlay 3 | — |
| Feedback Page | `/feedback` | `2180:9594` — Feedback | — |

---

## Admin Panel

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Admin Login | `/admin/login` | `2154:10996` — Log In | — |
| Overview / Dashboard | `/admin/overview` | `2154:9549` — Overview | — |
| Dashboard List | `/admin/overview` | `2811:11386` — dashboard list | — |
| Listings | `/admin/listings` | `2154:9714` — Listings | — |
| Customers | `/admin/customers` | `2154:9962` — Customers | — |
| Customer Action Overlay | `/admin/customers` (overlay) | `2154:10156` — customeraction overlay | — |
| Remove Customer Overlay | `/admin/customers` (overlay) | `2811:11561` — Remove customer overlay | — |
| Customer Details | `/admin/customers` | `2154:10902` — Customer Details | — |
| Customer Removed | `/admin/customers` | `2154:11012` — Customer removed successfully | — |
| Bids | `/admin/bids` | `2154:10498` — Bids | — |
| Customer Chat | `/admin/chats` | `2154:10757` — Customer chat | — |
| Admin Settings | `/admin/settings` | — | — |

---

## Landing Page

| Flow | App Route | Desktop Figma | Mobile Figma |
|------|-----------|---------------|--------------|
| Landing / Waitlist | `/landing` | `2619:5618` — Landing page | — |

---

## Screens in Figma but NOT in App (Missing Pages)

These Figma screens exist but have no corresponding app route yet:

| Figma Screen | Desktop Node | Mobile Node | Notes |
|--------------|-------------|-------------|-------|
| Tooltip 1 | `3544:11750` | `4324:16868` | Help tooltips — not implemented |
| Tooltip 2 | `3544:11738` | `4324:16869` | Help tooltips — not implemented |
| Tooltip 3 | `3798:12680` | — | Help tooltips — not implemented |

---

## App Routes with NO Figma Design

These app pages exist but have no corresponding Figma screen:

| App Route | Purpose | Notes |
|-----------|---------|-------|
| `/auth-success` | Post-auth redirect | Utility page, may not need design |
| `/auth/callback` | Google OAuth callback | Utility page, shows "Logging in..." |
| `/error-page` | Generic error | Needs design |
| `/my-adverts` | User's adverts | May be duplicate of `/my-items` |
| `/manage-item-demo` | Demo page | Development only — remove for production |
| `/manage-auction-demo` | Demo page | Development only — remove for production |
| `/test-images` | Image testing | Development only — remove for production |
| `/admin/settings` | Admin settings | Shows "Coming Soon" — no Figma design |

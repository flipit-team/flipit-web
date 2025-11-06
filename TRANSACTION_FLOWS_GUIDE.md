# Transaction Flows - Testing Guide

## Overview

This application supports **three distinct transaction flows**, each tailored to different purchasing scenarios. All flows use comprehensive dummy data for testing until backend APIs are ready.

---

## How to Test Each Flow

### 1. **Cash Purchase (Direct Buy)**
**Scenario**: Buyer purchases item with cash only

**URL to test**: `/transaction/1` (default) or `/transaction/1?type=cash`

**Flow Features**:
- ✅ Simple 5-step progress tracker
- ✅ Single item display
- ✅ Escrow payment protection
- ✅ 3-day inspection period after delivery
- ✅ Auto-release if buyer doesn't act

**Progress Steps**:
1. Offer Accepted → Transaction created
2. Payment → Buyer pays (escrow holds funds)
3. Shipping → Seller ships item
4. Delivery → Item delivered to buyer
5. Complete → Buyer confirms, payment releases

**User Experience**:
- Buyer sees: "Complete Payment" action card
- Seller sees: "Waiting for Payment" info card
- After payment: Seller gets "Ship Item Now" action
- After delivery: Buyer gets "3-Day Inspection Period" with confirm button

---

### 2. **Item Exchange (Barter Trade)**
**Scenario**: User trades their item for another item (no cash involved)

**URL to test**: `/transaction/1?type=exchange`

**Flow Features**:
- ✅ Dual item display (side-by-side)
- ✅ Both parties must ship
- ✅ Simultaneous tracking
- ✅ Dual inspection periods
- ✅ Exchange only completes if both parties accept

**Progress Steps**:
1. Offer Accepted → Exchange agreed
2. Both Ship → Both parties coordinate shipping
3. In Transit → Track both shipments
4. Both Inspect → 3-day window for each party
5. Complete → Exchange successful

**User Experience**:
- Both parties see: "Both Parties Must Ship" warning
- Your item labeled "Your Item" (highlighted in yellow)
- Their item labeled "Their Item" (neutral)
- Dual shipping section shows both tracking
- Both must confirm receipt within 3 days

---

### 3. **Item + Cash Exchange**
**Scenario**: User trades item + cash difference for a higher-value item

**URL to test**: `/transaction/1?type=exchange-cash`

**Flow Features**:
- ✅ Dual item display
- ✅ Cash portion highlighted
- ✅ Payment tab for cash transaction
- ✅ Both ship after cash payment
- ✅ Dual inspection + escrow protection

**Progress Steps**:
1. Offer Accepted → Exchange + cash agreed
2. Payment → Cash portion paid (held in escrow)
3. Both Ship → Coordinate shipping after payment
4. In Transit → Track both shipments
5. Both Inspect → 3-day window each
6. Complete → Exchange done, escrow releases

**User Experience**:
- Cash amount shown in yellow badge on buyer's item card
- Payment tab shows: "₦250,000 - Cash portion of exchange"
- After payment: Both can ship
- Both must confirm receipt
- Escrow holds cash until both confirm

---

### 4. **Auction Win**
**Scenario**: User wins an auction and must pay within deadline

**URL to test**: `/transaction/1?type=auction`

**Flow Features**:
- ✅ **4-day payment deadline** (industry standard)
- ✅ Countdown and urgency messaging
- ✅ Non-payment penalties explained
- ✅ Auction-specific timeline display
- ✅ Winner celebration UI

**Progress Steps**:
1. Auction Won → You won! Celebrate 🎉
2. Payment Deadline → 4 days to pay (urgent)
3. Shipping → Seller ships after payment
4. Delivery → Item delivered
5. Complete → Leave review

**User Experience**:
- Winner sees: "Payment Required" warning card
- Message: "You have 4 days from auction end to complete payment"
- Non-payment consequences clearly stated
- Seller sees: "Waiting for Payment - Buyer has 4 days"
- Timeline shows auction metadata (winning bid, total bids)

---

## Component Architecture

### Core Components Built

1. **TransactionHubV2** (`app/ui/wrappers/TransactionHubV2.tsx`)
   - Main container component
   - Handles all three transaction types
   - Dynamic flow configuration
   - Smart action recommendations

2. **ProgressTracker** (`app/ui/transaction/ProgressTracker.tsx`)
   - Responsive progress bar
   - Desktop: Horizontal with icons
   - Mobile: Vertical list
   - Animated current step indicator

3. **DualItemDisplay** (`app/ui/transaction/DualItemDisplay.tsx`)
   - Side-by-side item cards for exchanges
   - Single item + cash display for purchases
   - User role-based highlighting
   - Swap icon between items

4. **InfoCard** (`app/ui/transaction/InfoCard.tsx`)
   - Contextual action cards
   - 5 variants: info, success, warning, error, neutral
   - Optional action buttons
   - Accessible icons

5. **PaymentSection** (`app/ui/transaction/PaymentSection.tsx`)
   - Payment method selection
   - Escrow information
   - Security badges
   - Status tracking

6. **ShippingSection** (`app/ui/transaction/ShippingSection.tsx`)
   - Tracking number display
   - Dual tracking for exchanges
   - Carrier information
   - Delivery confirmation

---

## Design Principles Applied

### 1. **Progressive Disclosure**
- Show only relevant information for current stage
- Action cards guide users to next step
- Collapsible sections for advanced details

### 2. **Trust Building**
- Escrow protection clearly explained
- Security badges prominent
- Timeline transparency
- Protection guarantees highlighted

### 3. **Role-Based UX**
- Buyer vs Seller perspectives
- "Your Item" vs "Their Item" labeling
- Role-specific action cards
- Appropriate urgency levels

### 4. **Responsive Design**
- Desktop: 2-column layout (main content + sidebar)
- Mobile: Stacked single column
- Progress tracker adapts (horizontal → vertical)
- Touch-friendly buttons

### 5. **State Management**
- Real-time status updates
- Optimistic UI updates
- Loading states
- Error handling

---

## Testing Different Stati

You can manually change the `status` field in the dummy data to test different stages:

### Cash Purchase Stati:
- `OFFER_ACCEPTED` - Just created
- `PAYMENT_PENDING` - Waiting for buyer payment
- `PAYMENT_RECEIVED` - Payment in escrow
- `SHIPPING_PENDING` - Seller needs to ship
- `SELLER_SHIPPED` - In transit
- `IN_TRANSIT` - Tracking active
- `DELIVERED` - Awaiting buyer confirmation
- `REVIEW_PENDING` - Leave review
- `COMPLETED` - Done ✅
- `CANCELLED` - Canceled ❌

### Exchange Stati (Additional):
- `BUYER_SHIPPED` - Buyer's item shipped
- Both `SELLER_SHIPPED` and `BUYER_SHIPPED` must occur

---

## Color System

- **Primary (Blue)**: `#0066CC` - Main actions, progress indicators
- **Secondary (Yellow)**: `#FFC300` - Badges, highlights, cash amounts
- **Success (Green)**: Completed steps, confirmations
- **Warning (Yellow/Orange)**: Pending actions, deadlines
- **Error (Red)**: Cancellations, disputes, errors
- **Neutral (Gray)**: Inactive states, awaiting

---

## Next Steps for Backend Integration

When backend APIs are ready:

1. **Replace dummy data** in `/app/(user)/(pages)/transaction/[id]/page.tsx`
2. **Enable real API calls** in:
   - `TransactionService.createTransaction()`
   - `TransactionService.getTransactionById()`
   - `PaymentSection` payment initialization
   - `ShippingSection` tracking updates

3. **Add real-time updates**:
   - WebSocket for status changes
   - Polling for tracking updates
   - Push notifications

4. **Enable actual payment processing**:
   - Paystack/Flutterwave integration
   - Payment verification callbacks
   - Escrow management

5. **Connect shipping APIs**:
   - GIG Logistics integration
   - Real tracking numbers
   - Carrier webhooks

---

## UI/UX Highlights

✨ **Modern Design**:
- Card-based layouts
- Smooth animations
- Micro-interactions
- Loading states

🎯 **User-Centric**:
- Clear next actions
- Progress visibility
- Role-specific views
- Mobile-optimized

🔒 **Trust & Safety**:
- Escrow explained
- Protection badges
- Dispute options
- Cancellation policies

⚡ **Performance**:
- Optimized images
- Lazy loading
- Minimal re-renders
- Fast page loads

---

## Testing Checklist

### Cash Purchase Flow
- [ ] View transaction details
- [ ] See payment action card
- [ ] Navigate to payment tab
- [ ] View escrow protection info
- [ ] Progress through all 5 steps
- [ ] Test delivery confirmation
- [ ] Complete transaction

### Item Exchange Flow
- [ ] View both items side-by-side
- [ ] Identify "Your Item" highlight
- [ ] See "Both Ship" requirement
- [ ] Navigate to shipping tab
- [ ] View dual tracking
- [ ] Test inspection period
- [ ] Both parties must confirm

### Item + Cash Flow
- [ ] View both items
- [ ] See cash badge on item
- [ ] Navigate to payment tab
- [ ] Pay cash portion
- [ ] Both ship after payment
- [ ] Dual inspection
- [ ] Complete exchange

### Auction Flow
- [ ] See "Auction Won" celebration
- [ ] View 4-day deadline warning
- [ ] See urgency in action card
- [ ] Test payment flow
- [ ] Seller waits for payment
- [ ] Standard shipping after pay
- [ ] Complete with review

---

## Support & Questions

For questions or issues:
- Check component props in TypeScript files
- Review dummy data structure
- Test with different `?type=` parameters
- Verify responsive behavior on mobile

Built with ❤️ using Next.js 15, TypeScript, Tailwind CSS, and industry best practices from eBay, Mercari, Poshmark, and Bring a Trailer.

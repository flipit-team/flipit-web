# Flipit Mobile Redesign — Figma Reference

**Figma File:** [Flipit Design](https://www.figma.com/design/AhvpZESneQdMw0FfMQdoL1/Flipit?node-id=1701-3203)
**File Key:** `AhvpZESneQdMw0FfMQdoL1`
**Page:** Mobile Redesign (node `1701:3203`)

---

## Screen Inventory

### Authentication
| Screen | Node ID | Notes |
|--------|---------|-------|
| Sign In | `3010:22697` | Login form |
| Sign Up | `3515:11373` | Registration form |
| Verify Code | `3515:11462` | OTP/code verification |
| Reset Password | `3515:11545` | Password reset form |

### Home & Browse
| Screen | Node ID | Notes |
|--------|---------|-------|
| Home | `3714:16245` | Main homepage feed |
| New Sign Up Home | `4294:19717` | Homepage for new users |
| Category / Gadgets | `3798:12719` | Category filtered view |
| See All Categories | `3798:13145` | Full category grid |
| Auction Item | `3936:16879` | Auction listing in feed |

### Item Details
| Screen | Node ID | Notes |
|--------|---------|-------|
| Item Details / Cash | `3798:13004` | Cash-only item detail |
| Item Details / Swap | `3910:12319` | Swap-only item detail |
| Item Details / Mixed | `3910:12437` | Cash + swap item detail |
| Auction Item Details | `4287:17262` | Auction item detail |

### Item Listings (Preview)
| Screen | Node ID | Notes |
|--------|---------|-------|
| Preview Cash Only Listing | `4024:12702` | |
| Preview Swap + Cash Listing | `4034:16409` | |
| Preview Swap Only Listing | `4316:16796` | |
| Swap Only Listing | `4025:12995` | |
| Cash Only Listing | `4029:14417` | |
| Cash + Swap Listing | `4030:14670` | |

### Post & Edit Item
| Screen | Node ID | Notes |
|--------|---------|-------|
| Post an Item | `4025:14063` | Item creation form |
| Post a Listed Item | `4027:14234` | |
| Post Auction Item | `4034:16736` | Auction creation form |
| Edit Item Listing | `4034:16499` | |
| Edit Post | `4030:14922` | |

### Make an Offer
| Screen | Node ID | Notes |
|--------|---------|-------|
| Mobile Cash Only Offer | `3936:18232` | |
| Swap Only Offer | `3936:18249` | |
| Cash + Swap Offer | `3936:18291` | |
| Resubmit Cash Only Offer | `3990:18559` | |
| Resubmit Swap Only Offer | `3990:18593` | |
| Resubmit Cash + Swap Offer | `3990:18632` | |

### Offers Dashboard
| Screen | Node ID | Notes |
|--------|---------|-------|
| Offers Dashboard 1 | `4068:24864` | My Offers tab |
| Offers Dashboard 2 | `4079:15640` | Offers on My Items tab |
| Offers Dashboard 3 | `4079:15764` | My Bids tab |

### My Items
| Screen | Node ID | Notes |
|--------|---------|-------|
| My Items 1 | `4287:17380` | Listed items tab |
| My Items 2 | `4294:19275` | Auction items tab |
| My Items 3 | `4294:19549` | Deactivated items tab |
| Manage Listed Items | `4106:20143` | |
| Manage Cash Items | `4117:15069` | |
| Manage Auction Items | `4118:17318` | |

### Messages / Chat
| Screen | Node ID | Notes |
|--------|---------|-------|
| Messages / All | `4034:17066` | All conversations |
| Messages / My Purchases | `4055:17409` | Purchase chats |
| Messages / My Sales | `4055:17475` | Sales chats |
| Open Message (Purchases) | `4063:18294` | Chat view 1 |
| Open Message (Purchases) 2 | `4064:18375` | Chat view 2 |
| Send a Message | `3936:16649` | New message compose |

### Notifications
| Screen | Node ID | Notes |
|--------|---------|-------|
| Notification | `4065:24269` | General notifications |
| Notification for Seller | `4084:16202` | Seller-specific |
| Notification for Buyer | `4519:20923` | Buyer-specific |

### Saved Items
| Screen | Node ID | Notes |
|--------|---------|-------|
| Saved Pages | `4066:24599` | Saved items list |
| Saved Pages (alt) | `4066:24754` | Alternative view |
| Saved Pages Cleared | `4324:16803` | Empty state |

### Transactions — Cash Only
| Screen | Node ID | Notes |
|--------|---------|-------|
| Cash Only Transaction | `4324:17144` | Order review |
| E-Tranzact Payment | `4332:6129` | Payment step |
| Payment Success Overlay | `4336:6012` | Success modal |
| Seller Shipping (Cash) | `4343:6379` | Seller ships item |
| Seller Shipping (Cash) 2 | `4355:15525` | Shipping details |
| Buyer Shipping Confirmation | `4336:5950` | Buyer confirms |
| Buyer Item Tracking (Cash) | `4355:15616` | Tracking view |
| Buyer Delivery Confirmation (Cash) | `4359:15721` | Confirm receipt |
| Shipping Detail Overlay | `4355:15388` | Shipping info modal |
| Cash Transaction Completed | `4362:15892` | Completed state |
| Rating and Review (Cash) | `4359:15807` | Post-transaction review |

### Transactions — Swap Only
| Screen | Node ID | Notes |
|--------|---------|-------|
| Swap Only Order Review | `4366:23581` | Order review |
| Swap Only Shipping User A | `4399:23744` | User A ships |
| Swap Only Shipping User A (2) | `4420:24671` | User A shipping details |
| Swap Only Shipping User B | `4420:24790` | User B ships |
| Swap Only Shipping User B 2 | `4420:24910` | User B shipping details |
| Swap Only User A Tracking | `4420:25259` | Tracking view |
| Swap Only Confirm Receipt | `4430:25408` | Confirm receipt |
| Swap Verification | `4420:25131` | Verification step |
| Swap Completed | `4432:6913` | Completed state |
| Rating and Review (Swap) | `4432:6808` | Post-transaction review |

### Transactions — Mixed Trade
| Screen | Node ID | Notes |
|--------|---------|-------|
| Mixed Trade Order Review | `4437:7388` | Order review |
| E-Tranzact Mixed Payment | `4438:7490` | Payment step |
| Mixed Trade Swap (User A) | `4438:7556` | User A ships |
| Mixed Trade Shipping (User A) 2 | `4438:7677` | User A details |
| Mixed Trade Shipping User B | `4438:14788` | User B ships |
| Mixed Trade Shipping User B 3 | `4438:14918` | User B details |
| Mixed Trade User A Tracking | `4438:15110` | Tracking view |
| Mixed Trade Swap Verification | `4438:15070` | Verification step |
| Mixed Trade Confirm Receipt | `4438:15301` | Confirm receipt |
| Mixed Trade Completed | `4438:15554` | Completed state (swap) |
| Rating and Review (Mixed) | `4438:15458` | Post-transaction review |

### Auction Bidding
| Screen | Node ID | Notes |
|--------|---------|-------|
| Place Bid Overlay | `4506:20667` | Bid placement modal |
| Resubmit Auction Bid | `4506:20683` | Resubmit bid |
| Bid Placed | `4506:20749` | Bid confirmation |

### Profile & Settings
| Screen | Node ID | Notes |
|--------|---------|-------|
| Profile | `4124:17645` | User profile page |
| Verification 1 | `4268:15465` | ID verification step 1 |
| Verification 2 | `4270:15531` | ID verification step 2 |
| Phone Number Verification | `4324:16731` | Phone OTP |
| Code Verification | `4324:16742` | Code entry |
| Personal Details | `4270:15641` | Edit personal info |
| Change Language | `4270:15758` | Language settings |
| Manage Notifications | `4271:15862` | Notification prefs |
| Change Password | `4324:16611` | Password change |
| Delete Account | `4271:16783` | Account deletion |
| FAQs | `4271:16871` | Help / FAQ |
| Support | `4271:16911` | Contact support |
| Log Out Overlay | `4324:16753` | Logout confirmation |

### Overlays & Modals
| Screen | Node ID | Notes |
|--------|---------|-------|
| List Item Overlay | `4287:17844` | List item confirmation |
| Post as Auction Overlay | `4287:17848` | Auction conversion confirm |
| Deactivate | `4287:17852` | Deactivate item confirm |
| Activate | `4287:17857` | Reactivate item confirm |
| Delete Confirmation | `4064:19557` | Delete item confirm |
| Remove Saved Item | `4064:19563` | Remove from saved |
| Cancel Offer | `4064:19569` | Cancel offer confirm |
| Changes Saved Overlay | `4324:16872` | Success confirmation |
| Tool Tip Overlay 1 | `4324:16868` | Tooltip |
| Tool Tip Overlay 2 | `4324:16869` | Tooltip |
| Deactivated Notification | `4287:17889` | Item deactivated toast |
| Reactivated Notification | `4287:17895` | Item reactivated toast |
| Report Abuse | `3936:16566` | Report modal |
| Feedback | `3936:12938` | Feedback form |

### Reusable Components
| Component | Node ID | Notes |
|-----------|---------|-------|
| Mobile List Card | `3684:15915` | Item card for lists |
| Mobile Auction List Card | `3711:16023` | Auction card |
| Mobile Item Detail | `3900:12125` | Item detail template |
| Mobile Safety Tip | `3900:12143` | Safety tips section |
| Slide Mobile (Description Overlay) | `3913:12568` | Image slider overlay |
| Specification | `3913:12614` | Specs table component |
| Seller Details | `3913:12702` | Seller info section |
| Profile Component | `3936:16724` | Profile card |
| Mobile Input Field | `3010:22903` | Input field set |
| Nav Icon | `3713:16168` | Navigation icon set |
| Message Text Component | `4054:17276` | Chat bubble |
| Message Head | `4059:18142` | Chat header |
| Message Chats | `4059:18159` | Chat list item set |
| Offer Status | `4076:15524` | Offer status badges |
| Bid Status | `4076:15602` | Bid status badges |
| Offers Details | `4326:17248` | Offer detail card |
| Customer Detail | `4091:16334` | User profile card |
| My Items Image | `4289:18293` | Item thumbnail |
| My Items Set | `4294:19104` | Item card set |
| Swap Order Summary | `4366:23706` | Swap summary card |
| Mobile Progress Component | `4464:26344` | Transaction progress bar |
| Mobile Transaction Timeline | `4470:26523` | Status timeline |
| Stock Status | `4519:21313` | Stock badge set |
| Offers Dashboard Cards | `4542:7913` | Dashboard stat cards |
| My Item Cards | `4566:8182` | Item management cards |
| Nav Item | `4443:15674` | Bottom nav item set |
| Nav Bar | `4443:15709` | Bottom nav bar set |
| Category Icons | `4570:9559-9566` | Category icon components |

---

## How to Use

### Fetching Figma Data Programmatically
```
File Key: AhvpZESneQdMw0FfMQdoL1
Page Node: 1701:3203 (Mobile Redesign)
```

### Viewing a Specific Screen
Replace `{nodeId}` with the node ID from the tables above (use `-` instead of `:`):
```
https://www.figma.com/design/AhvpZESneQdMw0FfMQdoL1/Flipit?node-id={nodeId}
```

Example — Home screen:
```
https://www.figma.com/design/AhvpZESneQdMw0FfMQdoL1/Flipit?node-id=3714-16245
```

### Total Screens: 85+ unique mobile screens covering all user flows

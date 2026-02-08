# Endpoint Path Fixes - Review Required

This document details 8 endpoint path corrections needed to align the codebase with the live API. Each fix includes current usage analysis, impact assessment, and implementation steps.

---

## Fix #1: Notifications Endpoint ⚠️ HIGH PRIORITY

### Current State
- **File**: `app/services/notifications.service.ts:9`
- **Current Path**: `/notifications/get-notifications`
- **Correct Path**: `/api/v1/notifications`

### Impact Analysis
**Features Affected:**
- Notifications page/component
- Notification bell counter
- Real-time notification updates

**Current Usage:**
```typescript
// Line 9 in notifications.service.ts
apiClient.get<PaginatedResponse<NotificationDTO>>(
  `/notifications/get-notifications${queryString}`,
  { requireAuth: true }
)
```

**Files Using This Service:**
- Need to search for `NotificationsService.getNotifications()` calls
- Notification components/pages
- Top navigation counter

### Recommended Fix
```typescript
// Change line 9 to:
apiClient.get<PaginatedResponse<NotificationDTO>>(
  `/api/v1/notifications${queryString}`,
  { requireAuth: true }
)
```

### Testing Requirements
1. ✅ Test notifications page loads correctly
2. ✅ Test pagination works
3. ✅ Test notification counter updates
4. ✅ Test mark as read functionality still works

---

## Fix #2: Mark Notification as Read ⚠️ MEDIUM PRIORITY

### Current State
- **File**: `app/services/notifications.service.ts:16`
- **Current Path**: `/notifications/{id}/markAsRead`
- **Correct Path**: `/api/v1/notifications/{id}/markAsRead`

### Impact Analysis
**Features Affected:**
- Mark notification as read action
- Notification state management

**Current Usage:**
```typescript
// Line 16 in notifications.service.ts
apiClient.put<{ message: string }>(
  `/notifications/${notificationId}/markAsRead`,
  {},
  { requireAuth: true }
)
```

### Recommended Fix
```typescript
// Change line 16 to:
apiClient.put<{ message: string }>(
  `/api/v1/notifications/${notificationId}/markAsRead`,
  {},
  { requireAuth: true }
)
```

### Testing Requirements
1. ✅ Test clicking a notification marks it as read
2. ✅ Test UI updates correctly after marking as read
3. ✅ Test unread counter decrements

---

## Fix #3: File Upload Endpoint ⚠️ HIGH PRIORITY

### Current State
- **File**: `app/services/files.service.ts:28`
- **Current Path**: `/upload`
- **Correct Path**: `/api/v1/files/upload`

### Impact Analysis
**Features Affected:**
- Profile picture uploads
- Item image uploads
- Verification document uploads
- Any file upload functionality

**Current Usage:**
```typescript
// Line 28 in files.service.ts
apiClient.postFormData<UploadFileResponse>(
  '/upload',
  formData,
  { requireAuth: true }
)
```

**Critical Note:** This is used in:
- Post item flow
- Edit item flow
- Profile editing
- KYC verification

### Recommended Fix
```typescript
// Change line 28 to:
apiClient.postFormData<UploadFileResponse>(
  '/api/v1/files/upload',
  formData,
  { requireAuth: true }
)
```

### Testing Requirements
1. ✅ Test profile picture upload
2. ✅ Test item image upload (single)
3. ✅ Test item image upload (multiple)
4. ✅ Test KYC document upload
5. ✅ Test file size validation
6. ✅ Test file type validation
7. ✅ Verify uploaded files are accessible

---

## Fix #4: Presigned Upload URL ⚠️ MEDIUM PRIORITY

### Current State
- **File**: `app/services/files.service.ts:8`
- **Current Path**: `/files/presign-upload-url`
- **Correct Path**: `/api/v1/files/presign-upload-url`

### Impact Analysis
**Features Affected:**
- Direct S3/Cloud uploads
- Large file uploads
- Presigned URL generation

**Current Usage:**
```typescript
// Line 8 in files.service.ts
apiClient.get<PresignUploadUrlResponse>(
  `/files/presign-upload-url?key=${encodeURIComponent(key)}`,
  { requireAuth: true }
)
```

**Note:** Check if this is actively used vs the direct upload endpoint.

### Recommended Fix
```typescript
// Change line 8 to:
apiClient.get<PresignUploadUrlResponse>(
  `/api/v1/files/presign-upload-url?key=${encodeURIComponent(key)}`,
  { requireAuth: true }
)
```

### Testing Requirements
1. ✅ Test presigned URL generation
2. ✅ Test file upload using presigned URL
3. ✅ Test URL expiration handling

---

## Fix #5: Location States Endpoint ⚠️ MEDIUM PRIORITY

### Current State
- **File**: `app/services/location.service.ts:8` and `:15`
- **Current Path**: `/states` and `/states/{code}`
- **Correct Path**: `/api/v1/state` (note: singular "state")

### Impact Analysis
**Features Affected:**
- Location selection dropdowns
- State/region filters
- Address forms

**Current Usage:**
```typescript
// Line 8 - Get all states
apiClient.get<StateDTO[]>('/states')

// Line 15 - Get state by code
apiClient.get<StateDTO>(`/states/${code}`)
```

### Recommended Fix
```typescript
// Change line 8 to:
apiClient.get<StateDTO[]>('/api/v1/state')

// Change line 15 to:
apiClient.get<StateDTO>(`/api/v1/state/${code}`)
```

**⚠️ Important Note:** The API path uses singular "state" not plural "states"!

### Testing Requirements
1. ✅ Test state dropdown populates
2. ✅ Test state selection works
3. ✅ Test get state by code
4. ✅ Test in post-item flow
5. ✅ Test in profile editing

---

## Fix #6: Start Chat Endpoint ⚠️ MEDIUM PRIORITY

### Current State
- **File**: `app/services/chat.service.ts:15`
- **Current Path**: `/chats/create`
- **Correct Path**: `POST /api/v1/chats` (note: no "/create")

### Impact Analysis
**Features Affected:**
- Starting new chats with sellers
- Chat initiation from item pages
- Chat functionality

**Current Usage:**
```typescript
// Line 15 in chat.service.ts
apiClient.post<ChatDTO>(
  '/chats/create',
  chatData,
  { requireAuth: true }
)
```

### Recommended Fix
```typescript
// Change line 15 to:
apiClient.post<ChatDTO>(
  '/api/v1/chats',
  chatData,
  { requireAuth: true }
)
```

**⚠️ Important Note:** Remove "/create" suffix - just use `/api/v1/chats`

### Testing Requirements
1. ✅ Test starting new chat from item page
2. ✅ Test chat appears in chat list
3. ✅ Test can send messages in new chat
4. ✅ Test duplicate chat handling

---

## Fix #7: Offers Sent Endpoint ⚠️ MEDIUM PRIORITY

### Current State
- **File**: `app/services/offers.service.ts:29`
- **Current Path**: `/v1/offer/user/{userId}/offers`
- **Correct Path**: `/api/v1/offer/user/{userId}/sent`

### Impact Analysis
**Features Affected:**
- My Offers page (sent offers)
- Offer management
- User's sent offers list

**Current Usage:**
```typescript
// Line 29 in offers.service.ts
// getUserOffers method - needs to be split
apiClient.get<OfferDTO[]>(
  `/v1/offer/user/${userId}/offers`,
  { requireAuth: true }
)
```

**⚠️ Important:** This needs to be split into TWO methods:
1. `getUserOffersSent()` → `/api/v1/offer/user/{userId}/sent`
2. `getUserOffersReceived()` → `/api/v1/offer/user/{userId}/received`

### Recommended Fix
```typescript
// Add NEW method for sent offers
static async getUserOffersSent(userId: number) {
  return handleApiCall(() =>
    apiClient.get<OfferDTO[]>(
      `/api/v1/offer/user/${userId}/sent`,
      { requireAuth: true }
    )
  );
}

// Add NEW method for received offers
static async getUserOffersReceived(userId: number) {
  return handleApiCall(() =>
    apiClient.get<OfferDTO[]>(
      `/api/v1/offer/user/${userId}/received`,
      { requireAuth: true }
    )
  );
}

// DEPRECATE or UPDATE the existing getUserOffers method
// Option 1: Keep for backwards compat but fetch both
// Option 2: Remove and update all callers to use new methods
```

### Testing Requirements
1. ✅ Test sent offers display correctly
2. ✅ Test received offers display correctly
3. ✅ Test offer counts are accurate
4. ✅ Test filtering by offer type
5. ✅ Update UI to use separate methods

---

## Fix #8: Offers Received Endpoint ⚠️ MEDIUM PRIORITY

### Current State
- **File**: Same as Fix #7 - needs new method
- **Current Path**: No dedicated endpoint
- **Correct Path**: `/api/v1/offer/user/{userId}/received`

### Impact Analysis
**Features Affected:**
- My Offers page (received offers)
- Item owner's offer management
- Accepting/declining offers

**Implementation:**
See Fix #7 above - these should be implemented together.

### Testing Requirements
Same as Fix #7 - test both sent and received together.

---

## Implementation Priority Order

### Phase 1: Critical Path Fixes (Do First)
1. **Fix #3**: File Upload - Blocks item posting and profile updates
2. **Fix #1**: Notifications - Breaks notifications feature

### Phase 2: User-Facing Features
3. **Fix #6**: Start Chat - Affects user communication
4. **Fix #7 & #8**: Offers Sent/Received - Affects offer management

### Phase 3: Supporting Features
5. **Fix #2**: Mark as Read - Enhancement to notifications
6. **Fix #5**: Location States - Affects location selection
7. **Fix #4**: Presigned URLs - Check if actively used

---

## Testing Checklist Template

For each fix, complete this checklist:

```markdown
### Fix #{number}: {name}

- [ ] Code changed in service file
- [ ] All callers identified and reviewed
- [ ] Local testing completed
- [ ] API endpoint verified in live environment
- [ ] Error handling tested
- [ ] Loading states verified
- [ ] Mobile responsive tested
- [ ] No console errors
- [ ] Backward compatibility considered
- [ ] Documentation updated
```

---

## Risk Mitigation

### Recommended Approach
1. **Don't change all at once** - Fix one at a time
2. **Test immediately** after each fix
3. **Keep backup** of original code
4. **Monitor logs** after deployment
5. **Have rollback plan** ready

### Safety Checks
- [ ] Verify API is actually using new paths in live environment
- [ ] Check if old paths return 404 or still work
- [ ] Test with real user accounts
- [ ] Verify authentication still works
- [ ] Check response data structure matches expectations

---

## Notes for Implementation

1. **Search Before Changing**: Always search for method usage before changing:
   ```bash
   # Example:
   grep -r "getNotifications" app/
   grep -r "uploadFile" app/
   ```

2. **Check React Query Keys**: If using React Query, update query keys
3. **Check Route Handlers**: Some might have Next.js API routes that need updating
4. **Update Types**: Verify TypeScript types still match

---

## Questions to Answer

Before implementing each fix, answer:
1. ✅ Is this endpoint currently working or broken?
2. ✅ How many components use this service method?
3. ✅ Are there any cached responses to invalidate?
4. ✅ Will this break any in-progress work?
5. ✅ Is there a feature flag we can use?

---

**Document Status**: Ready for Review
**Last Updated**: 2026-01-20
**Reviewed By**: [Pending]
**Approved By**: [Pending]

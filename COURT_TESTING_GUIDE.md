# Court Component - Testing & Usage Guide

## Quick Start Guide

### Access the Court Management Page
Navigate to: `http://localhost:4200/manage-masters/court`

### Initial Load
- **Table View** shows all existing courts with pagination
- **Add Button** opens form to add new courts
- **Actions**: Edit, Delete, View for each court

---

## Testing Scenarios

### 🏛️ Scenario 1: Supreme Court (Minimal Form)

**Steps:**
1. Click "Add" button
2. Select **"Supreme Court"** from Court Type dropdown
3. Observe:
   - State field should NOT appear ✓
   - District field should NOT appear ✓
   - Only "Court Details" section visible

**Add Courts:**
1. Enter Court Name: "Supreme Court of India"
2. Enter Code: "SCI"
3. Check/uncheck "Is Virtual Court" (optional)
4. Click "Create Courts"

**Expected Result:**
- Court saved with only name, code, courtTypeId
- stateId and courtDistrictId NOT in payload
- Success message appears after API response ✓

---

### 🏢 Scenario 2: High Court (State Required)

**Steps:**
1. Click "Add" button
2. Select **"High Court"** from Court Type dropdown
3. Observe:
   - State field appears ✓
   - District field should NOT appear ✓
   - State marked as required (red asterisk)

**Add Court:**
1. Select State: "Delhi" (or any state)
2. Enter Court Name: "Delhi High Court"
3. Enter Code: "DHC"
4. Leave or check "Is Virtual Court"
5. Click "Create Courts"

**Expected Result:**
- Court saved with stateId included
- courtDistrictId NOT in payload
- Success message appears after API response ✓

---

### 🏤 Scenario 3: District Court (Full Form)

**Steps:**
1. Click "Add" button
2. Select **"District Court"** from Court Type dropdown (or any court type other than Supreme/High)
3. Observe:
   - State field appears and is required ✓
   - District field appears and is required ✓
   - Both marked as required (red asterisk)

**Add Court:**
1. Select State: "Delhi"
2. Observe: District dropdown filters to show only Delhi districts ✓
3. Select Court District: "Central"
4. Enter Court Name: "Central District Court"
5. Enter Code: "CDC-DELHI"
6. Leave or check "Is Virtual Court"
7. Click "Create Courts"

**Expected Result:**
- Court saved with stateId AND courtDistrictId included
- Payload complete with all required fields
- Success message appears after API response ✓

---

### 📋 Scenario 4: Multiple Courts in One Submission

**Steps:**
1. Click "Add" button
2. Select **"District Court"** court type
3. Select State and District
4. Add Court 1 details
5. Click "Add More Courts" button
6. Add Court 2 details
7. Click "Create Courts"

**Expected Result:**
- Both courts appear in grid with badges (Court 1, Court 2)
- Both courts saved in one submission
- Success message mentions "Courts saved successfully" (plural)
- List view refreshes with both new courts ✓

---

### ✏️ Scenario 5: Edit Existing Court

**Steps:**
1. In table view, click "Edit" button on a court row
2. Form opens with:
   - Pre-filled court type ✓
   - Pre-filled state ✓
   - Pre-filled district (if applicable) ✓
   - Pre-filled court name and code
   - "Edit Court" title instead of "Add Courts" ✓
   - Single row showing (edit mode, not batch) ✓

**Edit Details:**
1. Modify court name or code
2. Modify virtual checkbox status
3. Click "Update Courts" button

**Expected Result:**
- Court updated with new values
- Returns to list view
- Updates reflected in table ✓

---

### 🗑️ Scenario 6: Delete Court

**Steps:**
1. In table view, click "Delete" button on a court row
2. Confirmation dialog appears: "Are you sure you want to delete this court?"
3. Click "Yes, delete it!"

**Expected Result:**
- Court deleted from database
- Success message appears
- List view refreshes
- Court no longer in table ✓

---

### 👁️ Scenario 7: View Court Details

**Steps:**
1. In table view, click "View" button on a court row
2. Modal popup appears showing:
   - ID
   - Court Type
   - State
   - District
   - Court Name
   - Code
   - Virtual status

**Expected Result:**
- All details displayed correctly ✓
- Modal closes on "Close" button ✓

---

## Form Validation Testing

### ❌ Validation Errors

**Test 1: Submit without Court Type**
- Expected: Error message "Court Type is required"

**Test 2: High Court without State**
- Select High Court, try submit without state
- Expected: Error message "State is required"

**Test 3: District Court without District**
- Select District Court, select state, submit without district
- Expected: Error message "Court District is required"

**Test 4: Missing Court Name**
- Add court row, leave name empty, try to submit
- Expected: Error message "Court name is required"

**Test 5: Short Court Code**
- Add court row, enter very short code, try to add another
- Expected: Warning "Please complete the current court before adding another"

---

## UI/UX Features to Verify

### ✨ Visual Elements
- [ ] Gradient background in container
- [ ] Blue gradient headers on court cards
- [ ] Smooth hover effects on cards
- [ ] Proper shadows on buttons and cards
- [ ] "Add More Courts" button appears only when current row is valid
- [ ] Remove button appears only in create mode (not edit mode)
- [ ] Danger styling on Delete buttons
- [ ] Primary color (#667eea) consistency

### 🎯 Interactions
- [ ] Smooth transitions between list/form view
- [ ] Form fields focus properly
- [ ] Dropdown opens/closes smoothly
- [ ] State selection updates district dropdown
- [ ] Field visibility toggles correctly with court type

### 📱 Responsive Design
- [ ] Page works on mobile (375px width)
- [ ] Page works on tablet (768px width)
- [ ] Page works on desktop (1920px width)
- [ ] Buttons stack properly on small screens
- [ ] Form columns adjust for small screens

---

## Success Indicators ✅

### Timing Tests
1. **Success Message Delay**
   - Add a new court
   - Observe that success message appears AFTER loading spinner stops
   - NOT immediately (this would be the bug)

2. **Error Handling**
   - Try to create court with invalid data (if API validates)
   - Error message appears instead of success
   - Form stays open for correction

### Memory & Performance
1. **No Memory Leaks**
   - Open form multiple times
   - Close form without submitting
   - No browser warnings in console
   - Dev tools should show no unmanaged subscriptions

2. **Smooth Interactions**
   - Adding/removing court rows is responsive
   - No lag when selecting dropdowns
   - Form validation is instant

---

## Browser Console Checks

Open DevTools (F12) and check **Console** tab:

### ✓ Good State
```
✓ No warnings
✓ No memory warnings
✓ Network calls show proper payloads
✓ Only expected warnings (if any)
```

### ✗ Issues to Look For
```
✗ Unhandled promise rejections
✗ Memory warnings
✗ Subscription memory leaks
✗ Form value errors in console
```

---

## API Payload Verification

### Network Tab Inspection

**Supreme Court Payload:**
```json
{
  "name": "Supreme Court",
  "code": "SC",
  "courtTypeId": "supreme-123",
  "isVirtualCourt": false
}
// Note: No stateId or courtDistrictId
```

**High Court Payload:**
```json
{
  "name": "High Court",
  "code": "HC",
  "courtTypeId": "high-456",
  "stateId": 8,
  "isVirtualCourt": false
}
// Note: No courtDistrictId
```

**District Court Payload:**
```json
{
  "name": "District Court",
  "code": "DC",
  "courtTypeId": "other-789",
  "stateId": 8,
  "courtDistrictId": "district-001",
  "isVirtualCourt": false
}
// Note: All fields present
```

---

## Checklist for Acceptance

- [ ] Supreme Court: State and District hidden
- [ ] High Court: State required, District hidden
- [ ] Other Courts: State and District required
- [ ] District dropdown filters by selected state
- [ ] Can add multiple courts in one submission
- [ ] Edit mode shows only one court row
- [ ] Success message appears after API response
- [ ] No memory leaks (inspect with DevTools)
- [ ] Form validation prevents invalid submissions
- [ ] UI is attractive with modern styling
- [ ] Responsive on all screen sizes
- [ ] All CRUD operations work correctly
- [ ] Error messages are clear and helpful

---

## Troubleshooting

### Issue: State dropdown empty
- **Cause:** State data not loaded
- **Fix:** Check if state facade loads states in ngOnInit

### Issue: Success message shows immediately
- **Cause:** Success message not waiting for API
- **Fix:** Check if loading$ filter is properly implemented

### Issue: District not filtering by state
- **Cause:** Effect not triggering properly
- **Fix:** Check selectedState() signal update in onStateSelected

### Issue: Cannot add another court
- **Cause:** Current court row validation failing
- **Fix:** Check form validation on court name and code

### Issue: Form fields showing/hiding incorrectly
- **Cause:** isSupremeCourt() or isHighCourt() logic failing
- **Fix:** Check court type name comparison (should be case-insensitive)

---

## Performance Notes

- **Batch Create:** All courts created in parallel for efficiency
- **District Filtering:** Uses client-side filtering with signals
- **Pagination:** Server-side pagination for large datasets
- **Memory:** OnDestroy properly cleans up subscriptions

**Expected Load Times:**
- Page load: < 1 second
- Form render: < 500ms
- API create: 1-3 seconds
- Success message appears: After API response + 500ms

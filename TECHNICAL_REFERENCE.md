# Soil Test PWA - Technical Reference

**Version**: 1.0-beta
**Last Updated**: 2025-11-14

This document provides a comprehensive technical reference for the Rammed Earth Soil Test PWA, including file structure, key functions, data flows, and common editing scenarios.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [File Structure](#file-structure)
3. [Core Modules Reference](#core-modules-reference)
4. [Data Structures](#data-structures)
5. [Key Functions Index](#key-functions-index)
6. [Component Interactions](#component-interactions)
7. [Configuration Points](#configuration-points)
8. [Common Editing Scenarios](#common-editing-scenarios)
9. [Testing and Debugging](#testing-and-debugging)

---

## Project Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Storage**: IndexedDB (via custom wrapper)
- **Backend**: Cloudinary (image storage + metadata)
- **PWA**: Service Worker, Web App Manifest
- **APIs Used**: Camera API, Geolocation API, Web Storage API

### Application Flow
```
Landing Page (index.html)
    ↓
Test Wizard (test.html)
    ↓ [4 test steps]
    ↓ [After step 3: preliminary results option]
    ↓
Results Page (results.html)
    ↓ [Submit data]
    ↓
Cloudinary Upload
```

### Module Architecture
```
app.js (main controller)
├── storage.js (IndexedDB wrapper)
├── camera.js (photo capture)
├── geolocation.js (GPS)
├── test-logic.js (scoring algorithms)
├── cloudinary-upload.js (data submission)
│   └── cloudinary-config.js (configuration)
└── test-protocols.json (test definitions)
```

---

## File Structure

### Root Directory
```
/soil-test/
├── index.html              # Landing page
├── test.html               # Test wizard interface
├── results.html            # Results display
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   ├── main.css           # Global styles & design system
│   ├── test-flow.css      # Test wizard styles
│   └── results.css        # Results page styles
├── js/
│   ├── app.js             # Main application logic
│   ├── storage.js         # IndexedDB wrapper
│   ├── camera.js          # Camera API integration
│   ├── geolocation.js     # GPS integration
│   ├── test-logic.js      # Scoring algorithms
│   ├── cloudinary-config.js    # Cloudinary settings
│   └── cloudinary-upload.js    # Upload functionality
├── data/
│   ├── test-protocols.json     # Test definitions
│   └── guides.json             # Educational content
└── assets/
    └── icons/             # PWA icons
```

### Documentation
```
/
├── SOIL_TEST_PWA_SPEC.md          # Original specification
├── BETA_TESTING_REQUIREMENTS.md   # Beta testing plan
├── FIREBASE_BACKEND_PLAN.md       # Firebase reference (not used)
├── CLOUDINARY_SETUP.md            # Cloudinary setup guide
└── TECHNICAL_REFERENCE.md         # This file
```

---

## Core Modules Reference

### 1. app.js (Main Controller)
**Location**: `soil-test/js/app.js`
**Size**: ~1120 lines
**Purpose**: Main application logic, page routing, event handling

#### Page Sections:
- **Lines 1-73**: Landing page logic
- **Lines 74-766**: Test flow logic
- **Lines 767-1120**: Results page logic

#### Key Global Variables:
```javascript
const currentPage              // Current HTML page name
let testProtocols = null       // Loaded test definitions
let testGuides = null          // Loaded guide content
let currentTestData = null     // Active test data object
let currentStepIndex = 0       // Current test step (0-3)
let currentTestPhotos = []     // Photos for current test step
let activeTestId = null        // Test ID for camera modal
```

---

### 2. storage.js (IndexedDB Wrapper)
**Location**: `soil-test/js/storage.js`
**Purpose**: Offline data persistence

#### Exported Functions:
```javascript
storage.init()
// Initialize IndexedDB
// Returns: Promise<void>

storage.saveTest(testData)
// Save test object
// Params: testData (Object) - Complete test data
// Returns: Promise<void>

storage.getTest(testId)
// Retrieve test by ID
// Params: testId (String) - Test UUID
// Returns: Promise<Object|null>

storage.getAllTests()
// Get all stored tests
// Returns: Promise<Array<Object>>

storage.deleteTest(testId)
// Delete test by ID
// Params: testId (String)
// Returns: Promise<void>
```

#### Database Schema:
```javascript
Database: "SoilTestDB"
Store: "tests"
Key: testData.id (UUID)
```

---

### 3. camera.js (Photo Capture)
**Location**: `soil-test/js/camera.js`
**Purpose**: Camera access and photo compression

#### Exported Functions:
```javascript
camera.init(videoElement)
// Initialize camera stream
// Params: videoElement (HTMLVideoElement)
// Returns: Promise<MediaStream>

camera.capture(videoElement, quality = 0.8)
// Capture photo from video
// Params:
//   - videoElement (HTMLVideoElement)
//   - quality (Number) 0-1, default 0.8
// Returns: Promise<Object> { data, type, timestamp }

camera.stop(videoElement)
// Stop camera stream
// Params: videoElement (HTMLVideoElement)
// Returns: void
```

#### Photo Object Format:
```javascript
{
  data: "data:image/jpeg;base64,...",  // Base64 encoded
  type: "image/jpeg",
  timestamp: "2025-11-14T10:30:00.000Z"
}
```

---

### 4. geolocation.js (GPS)
**Location**: `soil-test/js/geolocation.js`
**Purpose**: Location capture with privacy

#### Exported Functions:
```javascript
geolocation.getCurrentLocation()
// Get current GPS coordinates
// Returns: Promise<Object> { latitude, longitude, accuracy }

geolocation.fuzzyLocation(lat, lng, radiusMeters = 1000)
// Add random offset for privacy
// Params:
//   - lat (Number) - Latitude
//   - lng (Number) - Longitude
//   - radiusMeters (Number) - Offset radius, default 1000m
// Returns: Object { latitude, longitude }
```

#### Location Object Format:
```javascript
{
  latitude: 37.7749,     // Decimal degrees
  longitude: -122.4194,  // Decimal degrees
  accuracy: 10,          // Meters
  timestamp: "2025-11-14T10:30:00.000Z"
}
```

---

### 5. test-logic.js (Scoring Algorithms)
**Location**: `soil-test/js/test-logic.js`
**Purpose**: Calculate soil suitability scores

#### Exported Functions:
```javascript
testLogic.calculateSuitability(testData)
// Calculate final suitability (requires jar test)
// Params: testData (Object) - Complete test with all 4 tests
// Returns: Object - Full results with score, composition, recommendations

testLogic.calculatePreliminarySuitability(testData)
// Calculate preliminary results (without jar test)
// Params: testData (Object) - Test with first 3 tests only
// Returns: Object - Results with isPreliminary: true

testLogic.formatResults(testData)
// Format results for display
// Params: testData (Object)
// Returns: Object - Formatted results with UI-ready data

testLogic.generateSummary(testData, results)
// Generate text summary for sharing
// Params:
//   - testData (Object)
//   - results (Object)
// Returns: String - Plain text summary
```

#### Results Object Structure:
```javascript
{
  score: 75,                    // 0-100
  category: "good",             // excellent|good|marginal|unsuitable
  categoryInfo: {
    title: "Good for Rammed Earth",
    description: "...",
    color: "#4CAF50"
  },
  composition: {
    sand: 65,
    silt: 20,
    clay: 15
  },
  confidenceLevel: 100,         // 65 or 100
  isPreliminary: false,
  recommendations: [String],
  warnings: [String]
}
```

---

### 6. cloudinary-upload.js (Data Submission)
**Location**: `soil-test/js/cloudinary-upload.js`
**Purpose**: Upload photos and metadata to Cloudinary

#### Exported Functions:
```javascript
cloudinaryUpload.uploadPhoto(photoBlob, metadata)
// Upload single photo
// Params:
//   - photoBlob (Blob) - Image blob
//   - metadata (Object) - Key-value pairs
// Returns: Promise<Object> { success, url, publicId, ... }

cloudinaryUpload.uploadTestData(testData)
// Upload all test photos and data
// Params: testData (Object) - Complete test object
// Returns: Promise<Object> {
//   testId,
//   uploadedPhotos: Array,
//   errors: Array
// }

cloudinaryUpload.checkConfiguration()
// Validate Cloudinary config
// Returns: Object { configured: Boolean, issues: Array }
```

---

### 7. cloudinary-config.js (Configuration)
**Location**: `soil-test/js/cloudinary-config.js`
**Purpose**: Cloudinary settings

#### Configuration Object:
```javascript
const CloudinaryConfig = {
  CLOUD_NAME: 'dio2vkyla',
  UPLOAD_PRESET: 'soil_test_unsigned',
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/dio2vkyla/image/upload',
  FOLDER: 'soil-tests',
  TAGS: ['soil-test', 'beta', 'v1']
}
```

**⚠️ EDIT THIS FILE** to change Cloudinary settings.

---

## Data Structures

### Test Data Object
**Primary data structure** passed throughout the application.

```javascript
{
  id: "uuid-v4-string",
  timestamp: "2025-11-14T10:30:00.000Z",
  version: "1.0",

  location: {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 10,
    timestamp: "2025-11-14T10:30:00.000Z"
  },

  tests: {
    visualTest: {
      photos: [
        {
          data: "data:image/jpeg;base64,...",
          type: "image/jpeg",
          timestamp: "2025-11-14T10:30:00.000Z"
        }
      ],
      color: "red-brown",      // Form field
      texture: "coarse",        // Form field
      organicMatter: "minimal", // Form field
      notes: "..."              // Form field
    },

    ribbonTest: {
      photos: [...],
      ribbonLength: 75,         // mm
      strength: "moderate"      // Form field
    },

    ballDropTest: {
      photos: [...],
      result: "cracks-intact"   // Form field
    },

    jarTest: {
      photos: [...],
      measurements: {
        sandHeight: 65,         // mm
        siltHeight: 20,         // mm
        clayHeight: 15,         // mm
        totalHeight: 100        // mm
      }
    }
  },

  result: {
    // Results object (see test-logic.js section)
  },

  user: {
    anonymous: true
  },

  submitted: false,
  submissionTimestamp: null,
  cloudinaryResults: null
}
```

---

## Key Functions Index

### Landing Page Functions (index.html)
**File**: `soil-test/js/app.js:12-73`

```javascript
initLandingPage()              // Line 16 - Initialize landing page
startNewTest()                 // Line 65 - Navigate to test wizard
```

---

### Test Flow Functions (test.html)
**File**: `soil-test/js/app.js:78-766`

#### Initialization
```javascript
initTestPage()                 // Line 88 - Initialize test page
initializeNewTest()            // Line 122 - Create new test object
generateId()                   // Line 140 - Generate UUID
```

#### Test Navigation
```javascript
renderTestStep(stepIndex)      // Line 148 - Render test step UI
updateProgressBar(stepIndex)   // Line 209 - Update progress indicators
nextStep()                     // Line 235 - Move to next test
previousStep()                 // Line 262 - Move to previous test
completeTest()                 // Line 278 - Finish test and go to results
```

#### Form Handling
```javascript
renderFormFields(fields, testId)  // Line 302 - Build form HTML
saveFormData()                    // Line 343 - Save current form data
validateFormData()                // Line 372 - Validate required fields
```

#### Photo Management
```javascript
openCamera(testId)             // Line 623 - Open camera modal
capturePhoto()                 // Line 643 - Capture from video stream
retakePhoto()                  // Line 678 - Clear and retry photo
usePhoto()                     // Line 690 - Save photo to test
closeCamera()                  // Line 710 - Close camera modal
renderPhotoPreview(testId)     // Line 725 - Render photo thumbnails
deletePhoto(testId, photoIndex) // Line 750 - Remove photo
```

#### Guide System
```javascript
setupGuideModal()              // Line 552 - Setup guide modal events
showGuide(testId)              // Line 575 - Display guide for test
closeGuide()                   // Line 614 - Hide guide modal
```

#### Preliminary Results Flow
```javascript
showPreliminaryResultsChoice() // Line 450 - Show dialog after test 3
goToPreliminaryResults()       // Line 475 - Calculate & go to results
continueToJarTest()            // Line 495 - Skip to jar test
```

---

### Results Page Functions (results.html)
**File**: `soil-test/js/app.js:770-1120`

#### Initialization
```javascript
initResultsPage()              // Line 774 - Initialize results page
displayResults(testData, results) // Line 818 - Render all results
```

#### Event Handlers
```javascript
setupResultsHandlers(testData, results) // Line 936 - Setup all buttons
submitTestData(testData)       // Line 1018 - Upload to Cloudinary
```

#### Result Display
```javascript
// Called within displayResults():
// - Lines 820-829: Preliminary banner
// - Lines 831-841: Header & score
// - Lines 843-860: Composition bars
// - Lines 862-893: Test summaries
// - Lines 895-916: Recommendations & warnings
// - Lines 918-934: Photo gallery
```

---

## Component Interactions

### Test Flow Interaction Diagram

```
User Action              →  Function Called           →  Data Modified
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Start Test              →  startNewTest()            →  sessionStorage cleared
                        →  initializeNewTest()       →  currentTestData created
                                                      →  testData saved to sessionStorage

Take Photo              →  openCamera()              →  activeTestId set
                        →  camera.init()             →  Video stream started
                        →  capturePhoto()            →  Photo blob created
                        →  usePhoto()                →  Photo added to currentTestData.tests[testId].photos

Fill Form               →  User types                →  Form values in DOM
Next Step               →  nextStep()                →  saveFormData() called
                        →  validateFormData()        →  Form data saved to currentTestData
                        →  currentStepIndex++        →  sessionStorage updated
                        →  renderTestStep()          →  New test rendered

After Test 3            →  showPreliminaryResultsChoice() → Dialog shown
Choose Preliminary      →  goToPreliminaryResults() →  test-logic.calculatePreliminarySuitability()
                        →  storage.saveTest()        →  IndexedDB updated
                        →  Navigate to results.html  →  Results displayed

Submit Data             →  submitTestData()          →  cloudinary-upload.uploadTestData()
                        →  uploadPhoto() (multiple)  →  Photos uploaded to Cloudinary
                        →  testData.submitted = true →  storage.saveTest()
```

---

## Configuration Points

### 1. Test Order & Definitions
**File**: `soil-test/data/test-protocols.json`

**Current order**: Visual → Ribbon → Ball → Jar

**To change test order**: Reorder the `tests` array in the JSON file.

**To modify a test**:
```json
{
  "id": "visualTest",           // Must match testData.tests keys
  "name": "Visual Assessment",
  "description": "...",
  "duration": "5 minutes",
  "instructions": ["Step 1", "Step 2"],
  "photoGuidelines": ["Guideline 1", "Guideline 2"],
  "fields": [
    {
      "id": "color",
      "label": "Soil Color",
      "type": "select",         // text|select|number|textarea
      "required": true,
      "options": ["red-brown", "yellow", "gray", "black"]
    }
  ]
}
```

---

### 2. Educational Guides
**File**: `soil-test/data/guides.json`

**Structure**:
```json
{
  "guides": {
    "visualTest": {
      "title": "Visual Assessment Guide",
      "purpose": "One-line purpose statement",
      "sections": [
        {
          "heading": "Section Title",
          "content": "HTML content (supports <strong>, <ul>, <li>)"
        }
      ]
    }
  }
}
```

**To add/edit guides**: Edit the JSON, content supports basic HTML.

---

### 3. Cloudinary Configuration
**File**: `soil-test/js/cloudinary-config.js`

```javascript
// EDIT THESE VALUES:
CLOUD_NAME: 'dio2vkyla',              // Your Cloudinary account
UPLOAD_PRESET: 'soil_test_unsigned',   // Your upload preset name
FOLDER: 'soil-tests',                  // Cloudinary folder
TAGS: ['soil-test', 'beta', 'v1']     // Tags for filtering
```

---

### 4. Scoring Algorithm
**File**: `soil-test/js/test-logic.js`

**Key scoring parameters** (search for these in the file):

```javascript
// Ideal composition ranges (Line ~50)
const IDEAL_SAND = { min: 50, max: 75 }
const IDEAL_SILT = { min: 10, max: 30 }
const IDEAL_CLAY = { min: 10, max: 20 }

// Score thresholds (Line ~150)
score >= 80  → "excellent"
score >= 65  → "good"
score >= 50  → "marginal"
score < 50   → "unsuitable"

// Preliminary confidence (Line ~400)
confidenceLevel: 65  // Preliminary results
confidenceLevel: 100 // Final results with jar test
```

**To adjust scoring**: Modify these thresholds in `test-logic.js`.

---

### 5. PWA Configuration
**File**: `soil-test/manifest.json`

```json
{
  "name": "Rammed Earth Soil Test",
  "short_name": "Soil Test",
  "start_url": "./index.html",
  "display": "standalone",
  "theme_color": "#8B4513",
  "background_color": "#F5E6D3"
}
```

**Service Worker**: `soil-test/sw.js` (caches static assets)

---

### 6. Design System
**File**: `soil-test/css/main.css:1-60`

```css
:root {
  /* Colors - EDIT THESE */
  --primary: #8B4513;      /* Saddle Brown */
  --secondary: #D2691E;    /* Chocolate */
  --success: #4CAF50;
  --error: #f44336;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;

  /* Typography */
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-base: 16px;
}
```

---

## Common Editing Scenarios

### Scenario 1: Add a New Test
**Goal**: Add a 5th test to the wizard

1. **Edit test-protocols.json**:
   ```json
   {
     "id": "newTest",
     "name": "New Test Name",
     "description": "Test description",
     "duration": "5 minutes",
     "instructions": ["Step 1", "Step 2"],
     "photoGuidelines": ["Photo guideline 1"],
     "fields": [...]
   }
   ```

2. **Update testData structure** in `initializeNewTest()` (app.js:122):
   ```javascript
   tests: {
     // ... existing tests
     newTest: { photos: [], measurements: {} }
   }
   ```

3. **Update progress bar** in `test.html:19-36`:
   ```html
   <div class="progress-step" data-step="5">
     <div class="step-number">5</div>
     <div class="step-label">New</div>
   </div>
   ```

4. **Add guide** to `guides.json` (optional):
   ```json
   "newTest": {
     "title": "New Test Guide",
     "purpose": "...",
     "sections": [...]
   }
   ```

5. **Update scoring** in `test-logic.js` if needed.

---

### Scenario 2: Change Test Order
**Goal**: Move jar test to first position

1. **Edit test-protocols.json**: Move jarTest object to first position in array

2. **Update progress labels** in `test.html:19-36`: Change labels to match new order

3. **Update preliminary logic** in `app.js:450`: Change step index check:
   ```javascript
   // Current: After step 3 (index 2)
   if (currentStepIndex === 2) {

   // New: After step 3 (now at different index)
   if (currentStepIndex === [new-index]) {
   ```

---

### Scenario 3: Modify Scoring Algorithm
**Goal**: Make clay content more important

**File**: `soil-test/js/test-logic.js`

**Find the scoring section** (around line 100-200):
```javascript
// Current weighting (equal):
let score = 0;
score += sandScore;
score += siltScore;
score += clayScore;
score /= 3;

// New weighting (clay 2x):
let score = 0;
score += sandScore;
score += siltScore;
score += (clayScore * 2);  // Double clay weight
score /= 4;  // Divide by new total weight
```

---

### Scenario 4: Change Cloudinary Folder/Tags
**Goal**: Organize uploads by user or date

**File**: `soil-test/js/cloudinary-config.js`

```javascript
// Option 1: Dynamic folder by date
FOLDER: 'soil-tests/' + new Date().toISOString().split('T')[0],
// Result: soil-tests/2025-11-14

// Option 2: Add user identifier tag
TAGS: ['soil-test', 'beta', 'v1', 'user-123']

// Option 3: Use context for custom metadata
```

**File**: `soil-test/js/cloudinary-upload.js:95`
```javascript
// Add custom context
const commonMetadata = {
  test_id: testData.id,
  // ADD YOUR CUSTOM FIELDS HERE:
  user_id: 'user-123',
  session: 'beta-group-1',
  soil_source: 'property-A'
};
```

---

### Scenario 5: Add New Form Field
**Goal**: Add "Odor" field to visual test

1. **Edit test-protocols.json**, find visualTest, add field:
   ```json
   {
     "id": "odor",
     "label": "Soil Odor",
     "type": "select",
     "required": false,
     "options": ["none", "earthy", "musty", "chemical"]
   }
   ```

2. **Form rendering is automatic** - field will appear based on JSON

3. **Access data** in scoring:
   ```javascript
   // In test-logic.js
   const odor = testData.tests.visualTest.odor;
   if (odor === 'chemical') {
     warnings.push('Chemical odor detected - soil may be contaminated');
     score -= 10;
   }
   ```

---

### Scenario 6: Customize Submission Confirmation
**Goal**: Change the submission dialog text

**File**: `soil-test/js/app.js:1032-1041`

```javascript
const confirmed = confirm(
  'Submit Test Results?\n\n' +
  // EDIT THIS TEXT:
  'This will upload:\n' +
  '• All test photos\n' +
  '• Soil composition data\n' +
  // ... rest of message
);
```

---

### Scenario 7: Add Loading State
**Goal**: Show loading spinner during long operation

**Functions available**:
```javascript
// In app.js (already defined)
showLoading('Custom loading message...')
hideLoading()
```

**Usage example**:
```javascript
async function longOperation() {
  showLoading('Processing data...');
  try {
    await someLongTask();
  } finally {
    hideLoading();
  }
}
```

---

## Testing and Debugging

### Browser Console Debugging

**Enable verbose logging**:
```javascript
// Add to app.js top:
window.DEBUG = true;

// Then use throughout code:
if (window.DEBUG) {
  console.log('Test data:', testData);
}
```

---

### Common Issues

#### 1. Photos Not Saving
**Check**: Browser console for errors
**Look for**: Camera permissions denied
**Debug**: `console.log(currentTestData.tests[testId].photos)`

#### 2. IndexedDB Errors
**Check**: Browser supports IndexedDB
**Debug**: Open DevTools → Application → IndexedDB → SoilTestDB
**Clear**: `indexedDB.deleteDatabase('SoilTestDB')`

#### 3. Cloudinary Upload Fails
**Check**:
- Upload preset exists and is "Unsigned"
- Network tab shows 403 → preset issue
- Network tab shows 500 → server error
- Console shows exact error message

**Debug**: `cloudinaryUpload.checkConfiguration()`

#### 4. Service Worker Cache Issues
**Clear cache**:
- DevTools → Application → Service Workers → Unregister
- DevTools → Application → Cache Storage → Delete all
- Hard refresh (Ctrl+Shift+R)

---

### Testing Checklist

#### Unit Testing (Manual)
- [ ] Each test step renders correctly
- [ ] Forms validate required fields
- [ ] Photos capture and display
- [ ] Navigation (next/previous) works
- [ ] Data persists in sessionStorage
- [ ] Data saves to IndexedDB

#### Integration Testing
- [ ] Complete full test flow
- [ ] Preliminary results calculate correctly
- [ ] Final results calculate correctly
- [ ] Upload to Cloudinary succeeds
- [ ] Submission prevents duplicates

#### PWA Testing
- [ ] App installs on mobile
- [ ] Works offline (after first load)
- [ ] Service worker caches assets
- [ ] Manifest displays correct name/icons

#### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Safari (iOS)
- [ ] Firefox
- [ ] Mobile browsers

---

## Module Dependencies

### Import Graph
```
app.js
├─ imports → storage.js
├─ imports → camera.js
├─ imports → geolocation.js
├─ imports → test-logic.js
└─ imports → cloudinary-upload.js
              └─ imports → cloudinary-config.js

test.html
├─ loads → app.js
├─ loads → camera.js (redundant, already in app.js)
└─ loads → storage.js (redundant, already in app.js)

results.html
├─ loads → app.js
├─ loads → storage.js (redundant)
└─ loads → test-logic.js (redundant)
```

**Note**: Some redundant imports exist for safety but aren't strictly necessary due to module caching.

---

## Session Storage Keys

```javascript
sessionStorage.setItem('currentTest', JSON.stringify(testData))
sessionStorage.setItem('currentStep', String(stepIndex))
sessionStorage.setItem('currentTestId', testData.id)
```

**Clear session**: `sessionStorage.clear()`

---

## IndexedDB Structure

```
Database: "SoilTestDB"
Version: 1

Object Store: "tests"
├─ keyPath: "id"
├─ Indexes: none
└─ Records: testData objects

Methods:
- storage.saveTest(testData)     → put()
- storage.getTest(id)             → get()
- storage.getAllTests()           → getAll()
- storage.deleteTest(id)          → delete()
```

---

## Quick Reference Commands

### Developer Console Shortcuts

```javascript
// View current test data
JSON.parse(sessionStorage.getItem('currentTest'))

// View all stored tests
storage.getAllTests().then(tests => console.table(tests))

// Clear all data
sessionStorage.clear()
indexedDB.deleteDatabase('SoilTestDB')

// Check Cloudinary config
import('./js/cloudinary-upload.js').then(m =>
  console.log(m.default.checkConfiguration())
)

// Force service worker update
navigator.serviceWorker.getRegistrations().then(regs =>
  regs.forEach(reg => reg.unregister())
)
```

---

## Version History

**v1.0-beta** (2025-11-14)
- Initial PWA implementation
- 4 field tests (Visual, Ribbon, Ball, Jar)
- Two-stage results (preliminary + final)
- Educational guide system
- Cloudinary backend integration
- Offline-first architecture

---

## Contact & Support

**Repository**: gsalvadi/rammedearth
**Branch**: claude/read-soil-test-spec-011CV6E37PESTyCMKVjGkwWe

**Key Documentation Files**:
- `SOIL_TEST_PWA_SPEC.md` - Original requirements
- `CLOUDINARY_SETUP.md` - Backend setup
- `BETA_TESTING_REQUIREMENTS.md` - Testing plan
- `TECHNICAL_REFERENCE.md` - This file

---

**Last Updated**: 2025-11-14
**Document Version**: 1.0

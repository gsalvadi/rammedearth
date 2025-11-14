# Firebase Backend Implementation Plan

## Goal

Build minimal backend to support **"Submit Test Results"** button for beta testing.

**Scope:** Photo upload + test data submission only (no user accounts, no advanced features)

---

## Architecture Overview

```
User completes test
       ↓
Clicks "Submit Test Results"
       ↓
[Firebase Auth] → Sign in anonymously
       ↓
[Firebase Storage] → Upload photos (1-4 per test)
       ↓
[Firestore] → Save test data + photo URLs
       ↓
Success confirmation to user
```

**Total implementation time:** 4-6 hours for experienced dev, 8-12 hours if learning Firebase

---

## Firebase Project Setup

### Step 1: Create Firebase Project

```bash
# Go to console.firebase.google.com
1. Click "Add Project"
2. Name: "rammed-earth-soil-test"
3. Disable Google Analytics (not needed for beta)
4. Create project
```

### Step 2: Enable Services

**Authentication:**
- Go to: Build → Authentication
- Click "Get Started"
- Enable: Anonymous sign-in
- Save

**Firestore Database:**
- Go to: Build → Firestore Database
- Click "Create Database"
- Start in: **Test mode** (for beta)
- Location: Choose closest to your users (e.g., asia-south1 for India)
- Create

**Storage:**
- Go to: Build → Storage
- Click "Get Started"
- Start in: **Test mode** (for beta)
- Done

### Step 3: Get Configuration

```bash
# Go to: Project Settings → General
# Scroll to "Your apps" → Web app (</> icon)
# Register app: "soil-test-web"
# Copy firebaseConfig object
```

---

## Implementation Tasks

### Task 1: Firebase Configuration File

Create: `/soil-test/js/firebase-config.js`

```javascript
// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "rammed-earth-soil-test.firebaseapp.com",
  projectId: "rammed-earth-soil-test",
  storageBucket: "rammed-earth-soil-test.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

**Time:** 10 minutes

---

### Task 2: Photo Upload Module

Create: `/soil-test/js/firebase-photos.js`

```javascript
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { storage } from './firebase-config.js';

/**
 * Upload a single photo to Firebase Storage
 * @param {string} testId - Unique test ID
 * @param {string} testType - 'visualTest', 'ribbonTest', etc.
 * @param {string} photoDataURL - Base64 data URL
 * @returns {Promise<string>} Download URL
 */
export async function uploadPhoto(testId, testType, photoDataURL) {
  try {
    // Convert data URL to Blob
    const blob = dataURLtoBlob(photoDataURL);

    // Create storage reference
    const timestamp = Date.now();
    const fileName = `${testType}-${timestamp}.jpg`;
    const storagePath = `soil-tests/${testId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // Upload
    console.log(`Uploading photo: ${storagePath}`);
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
      url: downloadURL,
      path: storagePath,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Photo upload failed:', error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
}

/**
 * Upload all photos from a test
 * @param {string} testId - Test ID
 * @param {Object} testData - Test data with photos
 * @returns {Promise<Object>} Map of test types to photo URLs
 */
export async function uploadAllPhotos(testId, testData) {
  const photoURLs = {};

  for (const [testType, testInfo] of Object.entries(testData.tests)) {
    if (testInfo.photos && testInfo.photos.length > 0) {
      photoURLs[testType] = [];

      for (let i = 0; i < testInfo.photos.length; i++) {
        const photoDataURL = testInfo.photos[i];

        try {
          const result = await uploadPhoto(testId, testType, photoDataURL);
          photoURLs[testType].push(result);

          console.log(`Uploaded ${testType} photo ${i + 1}/${testInfo.photos.length}`);
        } catch (error) {
          console.error(`Failed to upload ${testType} photo ${i + 1}:`, error);
          // Continue with other photos even if one fails
        }
      }
    }
  }

  return photoURLs;
}

/**
 * Convert data URL to Blob
 */
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
```

**Time:** 30 minutes

---

### Task 3: Data Submission Module

Create: `/soil-test/js/firebase-submit.js`

```javascript
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { db, auth } from './firebase-config.js';
import { uploadAllPhotos } from './firebase-photos.js';

/**
 * Submit test results to Firebase
 * @param {Object} testData - Complete test data
 * @returns {Promise<Object>} Submission result
 */
export async function submitTestResults(testData) {
  try {
    // Step 1: Authenticate anonymously
    if (!auth.currentUser) {
      console.log('Signing in anonymously...');
      await signInAnonymously(auth);
    }

    // Step 2: Upload photos
    console.log('Uploading photos...');
    const photoURLs = await uploadAllPhotos(testData.id, testData);

    // Step 3: Prepare Firestore document
    const firestoreData = {
      // Test identification
      testId: testData.id,
      submittedAt: serverTimestamp(),
      version: testData.version || '1.0',
      isPreliminary: testData.isPreliminary || false,

      // Test results
      tests: {
        visualTest: sanitizeTestData(testData.tests.visualTest),
        ribbonTest: sanitizeTestData(testData.tests.ribbonTest),
        ballDropTest: sanitizeTestData(testData.tests.ballDropTest),
        jarTest: sanitizeTestData(testData.tests.jarTest)
      },

      // Calculated results
      result: testData.result || null,

      // Photos (URLs only, not data URLs)
      photos: photoURLs,

      // Location (fuzzy for privacy)
      location: sanitizeLocation(testData.location),

      // User info
      user: {
        uid: auth.currentUser.uid,
        anonymous: true,
        submittedVia: 'web'
      },

      // Metadata
      metadata: {
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timestamp: testData.timestamp
      }
    };

    // Step 4: Save to Firestore
    console.log('Saving to Firestore...');
    const docRef = doc(db, 'soilTests', testData.id);
    await setDoc(docRef, firestoreData);

    console.log('✅ Submission successful!');

    return {
      success: true,
      testId: testData.id,
      message: 'Test results submitted successfully!'
    };

  } catch (error) {
    console.error('❌ Submission failed:', error);

    return {
      success: false,
      error: error.message,
      message: 'Failed to submit test results. Please try again.'
    };
  }
}

/**
 * Remove photo data URLs from test data (keep metadata only)
 */
function sanitizeTestData(testData) {
  if (!testData) return null;

  const sanitized = { ...testData };

  // Remove photo data URLs (we have them in Storage)
  delete sanitized.photos;

  return sanitized;
}

/**
 * Fuzzy location for privacy
 */
function sanitizeLocation(location) {
  if (!location) return null;

  return {
    lat: Math.round(location.lat * 100) / 100, // 2 decimals ~1km accuracy
    lng: Math.round(location.lng * 100) / 100,
    accuracy: location.accuracy || null,
    timestamp: location.timestamp || null
  };
}
```

**Time:** 45 minutes

---

### Task 4: Update Results Page UI

Modify: `/soil-test/js/app.js` (in setupResultsHandlers function)

```javascript
// Find the submitDataBtn handler and replace with:

document.getElementById('submitDataBtn')?.addEventListener('click', async () => {
  // Confirm with user
  const confirmed = confirm(
    '📤 Submit Your Test Results?\n\n' +
    'This will upload:\n' +
    '• Test results and scores\n' +
    '• Photos from all tests\n' +
    '• Approximate location (optional)\n\n' +
    'Your data helps improve this tool.\n\n' +
    'Submit now?'
  );

  if (!confirmed) return;

  // Show loading
  showLoading('Uploading test results...');

  try {
    // Import submission module
    const { submitTestResults } = await import('./firebase-submit.js');

    // Submit
    const result = await submitTestResults(testData);

    hideLoading();

    if (result.success) {
      // Success
      alert(
        '✅ Success!\n\n' +
        'Your test has been submitted.\n' +
        'Thank you for contributing!\n\n' +
        `Test ID: ${result.testId.substring(0, 8)}...`
      );

      // Disable button after successful submission
      const submitBtn = document.getElementById('submitDataBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '✓ Submitted';
        submitBtn.style.opacity = '0.5';
      }
    } else {
      // Error
      alert(
        '❌ Submission Failed\n\n' +
        result.message + '\n\n' +
        'Your data is still saved on your device.\n' +
        'You can try submitting again later.'
      );
    }

  } catch (error) {
    hideLoading();
    console.error('Submit error:', error);

    alert(
      '❌ Error\n\n' +
      'Could not submit results.\n' +
      'Please check your internet connection.'
    );
  }
});
```

**Time:** 15 minutes

---

### Task 5: Security Rules (Important!)

Set up basic security rules to prevent abuse.

**Firestore Rules:**

Go to: Firestore → Rules tab

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /soilTests/{testId} {
      // Anyone can create (submit test)
      allow create: if request.auth != null
                    && request.auth.token.firebase.sign_in_provider == 'anonymous';

      // Only admins can read (set up admin later)
      allow read: if false; // Beta: no public reading

      // No updates or deletes
      allow update, delete: if false;
    }
  }
}
```

**Storage Rules:**

Go to: Storage → Rules tab

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /soil-tests/{testId}/{fileName} {
      // Only authenticated users can upload
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024 // Max 5MB per photo
                   && request.resource.contentType.matches('image/.*');

      // No public reading during beta
      allow read: if false;
    }
  }
}
```

**Time:** 10 minutes

---

## Testing Checklist

### Local Testing (Before Beta)

```bash
# Test 1: Photo upload
1. Complete a test with photos
2. Click "Submit Test Results"
3. Check Firebase Console → Storage
   ✓ Photos appear in /soil-tests/{testId}/
   ✓ All photos uploaded successfully

# Test 2: Data submission
1. Check Firebase Console → Firestore
   ✓ Document appears in /soilTests/
   ✓ All fields populated correctly
   ✓ Photo URLs are valid

# Test 3: Error handling
1. Turn off WiFi
2. Try to submit
   ✓ Error message appears
   ✓ App doesn't crash
   ✓ Can retry after turning WiFi back on

# Test 4: Double submission
1. Submit once
2. Try to submit same test again
   ✓ Button disabled after first submission
   OR
   ✓ Second submission updates existing doc
```

---

## Monitoring During Beta

### Daily Checks

```bash
# Firebase Console → Firestore
- Count: How many tests submitted?
- Quality: Are all fields populated?
- Photos: Check a few photo URLs work

# Firebase Console → Storage
- Size: How much storage used?
- Count: Number of photos uploaded
- Errors: Any failed uploads?

# Firebase Console → Authentication
- Users: Number of anonymous users
- Recent: When was last submission?
```

### Set Up Alerts

```bash
# Go to: Project Settings → Integrations → Cloud Messaging
1. Enable daily email digest
2. Set quota alerts:
   - Storage: Alert at 1GB (free tier = 5GB)
   - Firestore reads: Alert at 40K/day (free = 50K)
   - Firestore writes: Alert at 15K/day (free = 20K)
```

---

## Cost Estimation

**Beta Testing (10 tests, 40 photos):**
```
Storage:
- 40 photos × 1.5MB = 60MB
- Cost: $0 (free tier = 5GB)

Firestore:
- 10 documents × 10KB = 100KB
- 10 writes = 10 writes
- 50 reads (you checking) = 50 reads
- Cost: $0 (free tier = 50K reads, 20K writes/day)

Total: $0
```

**Estimated at scale (1000 tests):**
```
Storage: 6GB × $0.026/GB = $0.16/month
Firestore: ~$0.50/month
Total: < $1/month
```

---

## Rollback Plan

**If Firebase fails during beta:**

1. **Immediate:** Disable submit button in code
2. **Fallback:** Ask testers to email screenshots
3. **Fix:** Debug Firebase issues offline
4. **Resume:** Re-enable when fixed

**Data is never lost** - it's always saved locally in IndexedDB first.

---

## Implementation Timeline

```
Day 1 (2 hours):
- Create Firebase project
- Set up Auth, Firestore, Storage
- Copy configuration to code

Day 2 (3 hours):
- Write firebase-config.js
- Write firebase-photos.js
- Test photo upload

Day 3 (3 hours):
- Write firebase-submit.js
- Update results page
- Test end-to-end

Day 4 (1 hour):
- Set security rules
- Test error cases
- Deploy to staging

Day 5 (1 hour):
- Final testing
- Document for testers
- Ready for beta!
```

**Total: ~10 hours**

---

## Files to Create/Modify

### New Files:
```
/soil-test/js/firebase-config.js       (Firebase initialization)
/soil-test/js/firebase-photos.js       (Photo upload)
/soil-test/js/firebase-submit.js       (Data submission)
```

### Modified Files:
```
/soil-test/js/app.js                   (Update submit button handler)
```

### Configuration Files:
```
Firebase Console → Firestore Rules
Firebase Console → Storage Rules
```

---

## Common Issues & Solutions

### Issue: "Permission denied" error
**Solution:** Check Security Rules are in "test mode" for beta

### Issue: Photo upload fails
**Solution:** Check file size < 5MB, check internet connection

### Issue: CORS errors
**Solution:** Ensure using Firebase SDK from CDN (not local install)

### Issue: Anonymous auth not working
**Solution:** Verify Anonymous sign-in is enabled in Firebase Console

---

## After Beta: Next Steps

Once beta is successful:

1. **Tighten security rules** (switch from test mode to production)
2. **Add email authentication** (optional user accounts)
3. **Build admin dashboard** (view submitted tests)
4. **Add data export** (CSV download for analysis)
5. **Set up Cloud Functions** (auto-processing, notifications)

But for beta: **Keep it simple!**

---

## Questions During Implementation?

### Firestore structure questions?
- Check: FIREBASE_BACKEND_PLAN.md (this file)
- Or ask in implementation

### Firebase errors?
- Check: Firebase Console → Usage & Billing
- Check: Browser console for detailed errors

### Need help?
- Firebase docs: firebase.google.com/docs
- Community: stackoverflow.com/questions/tagged/firebase

---

## Ready to Build?

Start with Day 1:
1. Create Firebase project
2. Enable services
3. Copy configuration

Then let me know when you have the Firebase config - I'll help you create the actual JS files!

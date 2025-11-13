# Soil Testing PWA - Project Specification

## Project Overview

**Name:** Rammed Earth Soil Tester (working title)

**Type:** Progressive Web App (PWA)

**Purpose:** Guide users through field soil tests to determine rammed earth suitability, collect geotagged photos and test results for future AI-assisted analysis.

**Deployment:** GitHub Pages (rammedearth.in/soil-test/)

---

## MVP Scope (Phase 1 - 3 Weeks)

### Core Features

1. **Guided Test Flow**
   - Step-by-step instructions for 4 field tests
   - Photo capture at each step with protocol guidance
   - Form inputs for observations/measurements
   - GPS location capture (with permission)

2. **Field Tests to Include**
   - Jar Test (sedimentation - sand/silt/clay ratios)
   - Ribbon Test (clay content assessment)
   - Ball Drop Test (moisture/binding)
   - Visual Color/Texture Assessment

3. **Data Collection**
   - Photos (standardized angles/protocol)
   - GPS coordinates
   - Test measurements
   - User observations
   - Date/time metadata

4. **Results Screen**
   - Basic suitability score (rule-based algorithm)
   - Recommendations (stabilization, ratios, cautions)
   - Option to submit data to database
   - Shareable results (PDF or link)

5. **Offline Capability**
   - Cache test instructions
   - Store photos/data locally
   - Sync when online

---

## Technical Architecture

### Frontend Stack

**Core Technologies:**
- HTML5
- CSS3 (mobile-first responsive)
- Vanilla JavaScript (ES6+)
- No framework needed for MVP (keeps it simple)

**PWA Requirements:**
- `manifest.json` (app metadata, icons)
- Service Worker (offline caching, background sync)
- HTTPS (GitHub Pages provides this)

**Key APIs:**
- Camera API (`navigator.mediaDevices.getUserMedia()`)
- Geolocation API (`navigator.geolocation`)
- IndexedDB (offline storage)
- localStorage (user preferences)

### Backend/Storage

**Option A: Firebase (Recommended)**
- Firebase Firestore (data storage)
- Firebase Storage (photo storage)
- Firebase Authentication (optional, can be anonymous)
- Free tier: 1GB storage, 10GB bandwidth/month
- Good for future AI integration

**Option B: Existing Google Sheets**
- Use existing Google Sheets setup
- Photos to Cloudinary or ImgBB
- Simpler integration
- May hit limits as data grows

**Recommendation:** Start with Firebase for scalability

### Photo Storage

**Cloudinary (Recommended):**
- Free tier: 25GB storage, 25GB bandwidth/month
- Automatic image optimization
- API for upload from browser
- CDN delivery
- Image transformations

**Setup:**
```javascript
// Upload to Cloudinary from browser
const formData = new FormData();
formData.append('file', photoBlob);
formData.append('upload_preset', 'YOUR_PRESET');
fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload', {
  method: 'POST',
  body: formData
});
```

---

## Data Model

### SoilTest Document Structure

```javascript
{
  // Metadata
  id: "uuid-v4",
  timestamp: "2025-01-17T10:30:00Z",
  version: "1.0",

  // Location
  location: {
    lat: 12.9716,
    lng: 77.5946,
    accuracy: 10.5, // meters
    address: "Bangalore, Karnataka, India" // reverse geocoded
  },

  // Test Results
  tests: {
    jarTest: {
      photos: ["cloudinary_url_1", "cloudinary_url_2"],
      measurements: {
        totalHeight: 100, // mm
        sandHeight: 65,
        siltHeight: 20,
        clayHeight: 15
      },
      sandPct: 65,
      siltPct: 20,
      clayPct: 15,
      notes: "Clear separation visible after 24hrs"
    },

    ribbonTest: {
      photos: ["cloudinary_url_3"],
      ribbonLength: 75, // mm
      strength: "medium", // weak/medium/strong
      notes: "Ribbon breaks at 7cm"
    },

    ballDropTest: {
      photos: ["cloudinary_url_4"],
      dropHeight: 1000, // mm (1 meter)
      result: "cracked_not_shattered",
      moisture: "optimal",
      notes: "Ball holds shape with visible cracks"
    },

    visualTest: {
      photos: ["cloudinary_url_5"],
      color: "#8B4513",
      texture: "smooth",
      organicMatter: "low",
      notes: "Reddish-brown, minimal vegetation"
    }
  },

  // Computed Results
  result: {
    suitabilityScore: 75, // 0-100
    category: "suitable", // excellent/suitable/marginal/unsuitable
    recommendations: [
      "Add 5-8% cement for stabilization",
      "Optimal moisture around 10-12%",
      "Test compaction at different moisture levels"
    ],
    warnings: [
      "Clay content slightly low - may need stabilization"
    ]
  },

  // Optional User Info
  user: {
    anonymous: true,
    email: null, // optional if they want results emailed
    experience: "beginner"
  },

  // Submission
  submitted: true,
  submittedAt: "2025-01-17T11:00:00Z"
}
```

---

## File Structure

```
/soil-test/
├── index.html              # Landing page / test selector
├── test.html               # Main test flow
├── results.html            # Results display
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   ├── main.css           # Global styles
│   ├── test-flow.css      # Test-specific styles
│   └── results.css        # Results page styles
├── js/
│   ├── app.js             # Main app logic
│   ├── camera.js          # Camera handling
│   ├── geolocation.js     # GPS handling
│   ├── storage.js         # IndexedDB wrapper
│   ├── firebase-config.js # Firebase initialization
│   ├── cloudinary.js      # Photo upload
│   ├── test-logic.js      # Suitability algorithm
│   └── offline-sync.js    # Background sync
├── data/
│   └── test-protocols.json # Test instructions/protocols
└── assets/
    ├── icons/             # PWA icons (various sizes)
    ├── images/            # Instructional diagrams
    └── fonts/             # If needed
```

---

## User Flow

### 1. Landing Page (`index.html`)

```
┌─────────────────────────────────┐
│  Rammed Earth Soil Tester       │
├─────────────────────────────────┤
│  Test your soil in 4 steps      │
│  No lab required                │
│                                  │
│  [Start Soil Test]               │
│                                  │
│  What you'll need:               │
│  • Clear jar with lid            │
│  • Water                         │
│  • Soil sample                   │
│  • Tape measure                  │
│                                  │
│  Time: 20 min active             │
│  (+ 24hr settling)               │
└─────────────────────────────────┘
```

### 2. Test Flow (`test.html`)

**Step-by-step wizard:**
```
Step 1/4: Jar Test
┌─────────────────────────────────┐
│  Fill jar 1/3 with soil         │
│  Add water to 2/3                │
│  Shake for 1 minute              │
│  Let settle for 24 hours         │
│                                  │
│  [📷 Take Photo of Settled Jar] │
│                                  │
│  Measure layers:                 │
│  Sand: [___] mm                  │
│  Silt: [___] mm                  │
│  Clay: [___] mm                  │
│  Total: [___] mm                 │
│                                  │
│  [Next: Ribbon Test →]           │
└─────────────────────────────────┘
```

**Progressive disclosure:**
- Show one test at a time
- Clear instructions with diagrams
- Photo requirement for each step
- Optional: timer for settling period

### 3. Camera Capture

**Photo Protocol Overlay:**
```
┌─────────────────────────────────┐
│  📷 CAMERA                      │
├─────────────────────────────────┤
│                                  │
│    [Live camera preview]         │
│                                  │
│    Guidelines:                   │
│    • Hold jar upright            │
│    • Align with grid             │
│    • Good lighting               │
│    • Show full jar               │
│                                  │
│  [Capture]  [Retake]             │
└─────────────────────────────────┘
```

### 4. Results Page (`results.html`)

```
┌─────────────────────────────────┐
│  Your Soil: SUITABLE             │
│  Score: 75/100                   │
├─────────────────────────────────┤
│  Composition:                    │
│  ████████ 65% Sand               │
│  ████     20% Silt               │
│  ███      15% Clay               │
│                                  │
│  Recommendations:                │
│  ✓ Good for rammed earth         │
│  • Add 5-8% cement               │
│  • Optimal moisture 10-12%       │
│                                  │
│  [Submit Data]  [Share Results]  │
│  [Start New Test]                │
└─────────────────────────────────┘
```

---

## Suitability Algorithm (Rule-Based)

### Input Data
- Sand: 0-100%
- Silt: 0-100%
- Clay: 0-100%
- Ribbon length: mm
- Ball drop result: enum
- Visual assessment: enum

### Scoring Logic

```javascript
function calculateSuitability(testData) {
  let score = 0;
  let warnings = [];
  let recommendations = [];

  // SAND (ideal: 50-75%)
  const sand = testData.jarTest.sandPct;
  if (sand >= 50 && sand <= 75) {
    score += 35; // Excellent
  } else if (sand >= 40 && sand < 50) {
    score += 25;
    warnings.push("Sand content slightly low");
  } else if (sand > 75 && sand <= 85) {
    score += 25;
    warnings.push("High sand - may need more clay");
  } else {
    score += 10;
    warnings.push("Sand content out of optimal range");
  }

  // CLAY (ideal: 10-20%)
  const clay = testData.jarTest.clayPct;
  if (clay >= 10 && clay <= 20) {
    score += 35; // Excellent
  } else if (clay >= 8 && clay < 10) {
    score += 25;
    recommendations.push("Consider adding clay or stabilizer");
  } else if (clay > 20 && clay <= 30) {
    score += 20;
    recommendations.push("High clay - add sand or stabilizer");
  } else {
    score += 10;
    warnings.push("Clay content needs adjustment");
  }

  // RIBBON TEST (ideal: 5-10cm)
  const ribbon = testData.ribbonTest.ribbonLength;
  if (ribbon >= 50 && ribbon <= 100) {
    score += 15;
  } else if (ribbon < 50) {
    score += 10;
    recommendations.push("Low clay - may need stabilization");
  } else {
    score += 5;
    warnings.push("High clay - test with additives");
  }

  // BALL DROP (ideal: cracked but holds)
  const ballDrop = testData.ballDropTest.result;
  if (ballDrop === "cracked_not_shattered") {
    score += 15; // Perfect
  } else if (ballDrop === "intact") {
    score += 10;
    recommendations.push("Moisture might be high - test drier mix");
  } else {
    score += 5;
    warnings.push("Low binding - needs stabilizer");
  }

  // Determine category
  let category;
  if (score >= 85) category = "excellent";
  else if (score >= 70) category = "suitable";
  else if (score >= 50) category = "marginal";
  else category = "unsuitable";

  return {
    score,
    category,
    recommendations,
    warnings
  };
}
```

### Score Categories

- **85-100: Excellent** - Ideal for rammed earth, minimal intervention
- **70-84: Suitable** - Good for rammed earth with minor adjustments
- **50-69: Marginal** - Requires stabilization or significant modification
- **0-49: Unsuitable** - Not recommended without major intervention

---

## PWA Configuration

### manifest.json

```json
{
  "name": "Rammed Earth Soil Tester",
  "short_name": "Soil Test",
  "description": "Field soil testing for rammed earth construction",
  "start_url": "/soil-test/",
  "display": "standalone",
  "background_color": "#F5F2E8",
  "theme_color": "#8B4513",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/soil-test/assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/soil-test/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/soil-test/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/soil-test/assets/screenshots/test-flow.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Strategy

**Cache-First for Static Assets:**
- HTML, CSS, JS, images, icons
- Test protocols JSON

**Network-First for API Calls:**
- Photo uploads
- Data submission
- Geolocation services

**Background Sync:**
- Queue failed submissions
- Retry when online

---

## Firebase Configuration

### Firestore Structure

```
soilTests/
  ├── {testId}/
  │     ├── metadata: {...}
  │     ├── location: {...}
  │     ├── tests: {...}
  │     ├── result: {...}
  │     └── user: {...}

users/ (optional)
  └── {userId}/
        └── tests: [testId1, testId2, ...]
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can create soil tests (anonymous submissions)
    match /soilTests/{testId} {
      allow create: if true;
      allow read: if true; // Public data
      allow update, delete: if false; // No modifications
    }
  }
}
```

### Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /soil-test-photos/{allPaths=**} {
      // Allow uploads up to 5MB
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow read: if true; // Public read
    }
  }
}
```

---

## Implementation Phases

### Phase 1: Core Test Flow (Week 1)
- [ ] Set up file structure
- [ ] Create landing page
- [ ] Build test flow wizard (4 tests)
- [ ] Implement camera capture
- [ ] Basic form inputs
- [ ] Local storage (IndexedDB)
- [ ] Results calculation
- [ ] Results display

### Phase 2: PWA Features (Week 2)
- [ ] Add manifest.json
- [ ] Create service worker
- [ ] Offline caching
- [ ] Install prompt
- [ ] GPS location capture
- [ ] Photo protocol overlays
- [ ] Progress persistence

### Phase 3: Backend Integration (Week 3)
- [ ] Set up Firebase/Cloudinary
- [ ] Photo upload functionality
- [ ] Data submission
- [ ] Background sync
- [ ] Error handling
- [ ] Success confirmation
- [ ] Test on real devices

### Phase 4: Polish (Optional)
- [ ] Loading states
- [ ] Error messages
- [ ] Instructional diagrams
- [ ] Share functionality
- [ ] PDF export
- [ ] Analytics (privacy-friendly)

---

## Design System (Match Existing Site)

### Colors
```css
:root {
  --primary: #8B4513;      /* Saddle brown */
  --secondary: #D2691E;    /* Chocolate */
  --accent: #CD853F;       /* Peru */
  --background: #F5F2E8;   /* Linen */
  --surface: #FEFCF7;      /* Off-white */
  --text: #3E2723;         /* Dark brown */
  --text-light: #666;      /* Gray */
  --success: #4CAF50;      /* Green */
  --warning: #FFB300;      /* Amber */
  --error: #D32F2F;        /* Red */
}
```

### Typography
```css
body {
  font-family: Georgia, serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
}

h1 { font-size: 1.9em; font-weight: normal; }
h2 { font-size: 1.5em; font-weight: normal; }
h3 { font-size: 1.2em; font-weight: normal; }
```

### Components
- Buttons: Rounded corners, earth tones
- Cards: White surface with subtle shadows
- Inputs: 2px borders, focus states
- Camera: Full viewport with overlay
- Progress: Step indicators at top

---

## API Keys Needed

### Cloudinary
1. Sign up: https://cloudinary.com
2. Get cloud name and upload preset
3. Create unsigned upload preset
4. Add to config

### Firebase (if chosen)
1. Create project: https://console.firebase.google.com
2. Enable Firestore
3. Enable Storage
4. Get config object
5. Add to firebase-config.js

### Google Maps (optional - for reverse geocoding)
1. Get API key
2. Enable Geocoding API
3. Restrict to domain

---

## Testing Checklist

### Browser Compatibility
- [ ] Chrome Android (primary)
- [ ] Safari iOS (primary)
- [ ] Chrome Desktop
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Device Testing
- [ ] Android phone (various screen sizes)
- [ ] iPhone (various screen sizes)
- [ ] Tablet (landscape mode)

### Network Conditions
- [ ] Online (fast)
- [ ] Online (slow 3G)
- [ ] Offline → online (sync)
- [ ] Interrupted upload

### Permission Handling
- [ ] Camera granted
- [ ] Camera denied
- [ ] Location granted
- [ ] Location denied

### Edge Cases
- [ ] Multiple photos per test
- [ ] Retake photo
- [ ] Exit mid-test (resume later)
- [ ] Invalid measurements
- [ ] Photo too large

---

## Success Metrics

### Week 1-4 (MVP Launch)
- [ ] App loads on mobile
- [ ] Can complete all 4 tests
- [ ] Photos upload successfully
- [ ] Data saves to database
- [ ] Works offline

### Month 2-3 (Validation)
- 50+ completed tests
- 20+ different locations
- < 5% error rate
- Positive user feedback

### Month 6 (AI Readiness)
- 200+ tests with photos
- Geographic diversity
- Clean, labeled data
- Pattern analysis possible

---

## Future Enhancements (Post-MVP)

### Phase 2 Features
- User accounts (optional)
- Test history
- Compare with nearby soils
- Export to PDF
- Share results link
- Multi-language support

### Phase 3: AI Integration
- Image classification (identify soil from photo)
- Composition prediction (AI + photo → ratios)
- Location-based suggestions
- Similar soil matching
- Confidence scoring

### Phase 4: Community
- Public soil map
- User comments/validations
- Professional verification
- Best practices wiki
- Success stories

---

## Resources & Documentation

### Learn PWA Development
- https://web.dev/progressive-web-apps/
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

### Camera API
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

### IndexedDB
- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

### Firebase Docs
- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/firestore
- https://firebase.google.com/docs/storage

### Cloudinary
- https://cloudinary.com/documentation/upload_images

---

## Deployment Steps

### 1. Create `/soil-test/` folder in rammedearth repo

```bash
cd /home/user/rammedearth
mkdir soil-test
cd soil-test
```

### 2. Build PWA files

Create all HTML/CSS/JS files as specified above.

### 3. Add to Git

```bash
git add soil-test/
git commit -m "Add soil testing PWA"
git push
```

### 4. Access at

```
https://rammedearth.in/soil-test/
```

### 5. Link from main site

Add link on index.html (optional):
```html
<a href="soil-test/">Test Your Soil</a>
```

---

## Questions to Resolve Before Starting

1. **Backend Choice:**
   - Firebase (better for scale) OR
   - Google Sheets + Cloudinary (simpler integration)

2. **User Authentication:**
   - Anonymous only (faster) OR
   - Optional email (for sending results)

3. **Photo Requirements:**
   - Minimum photos per test?
   - Max photo size?
   - Required vs optional?

4. **Data Privacy:**
   - Exact GPS or approximate (city-level)?
   - Allow opting out of data sharing?

5. **Scope:**
   - MVP with 4 tests OR
   - Extended version with more tests?

---

## Contact/Handoff Notes

**For the developer (Claude in new session):**

This PWA will integrate with the existing Rammed Earth Chronicles website at rammedearth.in. The site currently uses:
- Static HTML/CSS/JS
- GitHub Pages hosting
- Google Sheets backend (for forms)
- Earth-tone design system

The goal is to create a mobile-first Progressive Web App that guides users through field soil tests, collects standardized photos and measurements, and stores the data for future AI-assisted soil analysis.

**Key Constraints:**
- Must work on GitHub Pages (static hosting)
- Must handle photos (5MB+ size)
- Must work offline (rural testing locations)
- Must be mobile-optimized (primary use case)

**Starting Point:**
1. Review this spec
2. Set up Firebase or Cloudinary account
3. Create `/soil-test/` folder in repo
4. Build MVP features (Phase 1)
5. Test on real mobile devices

**Context:** The site owner is a rammed earth practitioner who wants to make soil testing more accessible to beginners while collecting data for future AI analysis. The app should be simple, clear, and actually useful for someone in the field with limited connectivity.

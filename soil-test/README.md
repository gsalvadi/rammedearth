# Rammed Earth Soil Tester PWA

A Progressive Web App for field soil testing to determine rammed earth suitability.

## Features

- **4 Guided Field Tests**: Jar test, ribbon test, ball drop test, and visual assessment
- **Photo Documentation**: Capture geotagged photos at each test step
- **Offline Support**: Works without internet connection, syncs when online
- **Instant Results**: Rule-based suitability scoring with recommendations
- **Mobile-First**: Optimized for smartphones and tablets

## Installation

### For Users

Visit [https://rammedearth.in/soil-test/](https://rammedearth.in/soil-test/) on your mobile device and follow the install prompt.

### For Developers

1. Clone the repository
2. Navigate to the soil-test directory
3. Serve the files with a local web server (HTTPS required for PWA features)

```bash
cd rammedearth/soil-test
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Project Structure

```
/soil-test/
├── index.html              # Landing page
├── test.html               # Test flow wizard
├── results.html            # Results display
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   ├── main.css           # Global styles
│   ├── test-flow.css      # Test wizard styles
│   └── results.css        # Results page styles
├── js/
│   ├── app.js             # Main application logic
│   ├── camera.js          # Camera handling
│   ├── geolocation.js     # GPS functionality
│   ├── storage.js         # IndexedDB wrapper
│   ├── test-logic.js      # Suitability algorithm
│   └── offline-sync.js    # Background sync (future)
├── data/
│   └── test-protocols.json # Test instructions
└── assets/
    ├── icons/             # PWA icons
    └── images/            # Instructional diagrams
```

## Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES6+)
- **Storage**: IndexedDB for offline data
- **PWA**: Service Worker, Web App Manifest
- **APIs**: Camera API, Geolocation API

## The 4 Field Tests

### 1. Jar Test (Sedimentation)
Measures sand, silt, and clay ratios by settling soil in water for 24 hours.

**Ideal Composition for Rammed Earth:**
- Sand: 50-75%
- Silt: 10-30%
- Clay: 10-20%

### 2. Ribbon Test
Assesses clay content by forming soil ribbons. Ideal ribbon length: 50-100mm.

### 3. Ball Drop Test
Tests moisture content and binding by dropping a soil ball from 1 meter. Ideal: cracked but holds together.

### 4. Visual Assessment
Evaluates color, texture, and organic matter content.

## Suitability Scoring

The app calculates a score from 0-100 based on test results:

- **85-100: Excellent** - Ideal for rammed earth, minimal intervention
- **70-84: Suitable** - Good with minor adjustments
- **50-69: Marginal** - Requires stabilization
- **0-49: Unsuitable** - Not recommended without major changes

## Future Enhancements

### Phase 2 (Planned)
- User accounts (optional)
- Test history
- Compare with nearby soils
- PDF export
- Multi-language support

### Phase 3 (AI Integration)
- Image classification for soil type
- Composition prediction from photos
- Location-based recommendations
- Confidence scoring

### Phase 4 (Community)
- Public soil map
- User validations
- Professional verification
- Best practices wiki

## Data Collection

With user permission, the app collects:
- Soil test results
- Photos (geotagged)
- GPS coordinates
- Test metadata

This data will be used to train AI models for automated soil analysis.

## Browser Compatibility

- Chrome/Edge (recommended)
- Safari iOS
- Firefox
- Samsung Internet

**Note**: Camera and location features require HTTPS.

## Development

### TODO: Icon Generation

The app requires PWA icons in multiple sizes. Use the provided `icon.svg` to generate:

```bash
# Using ImageMagick or similar tool
convert assets/icons/icon.svg -resize 72x72 assets/icons/icon-72x72.png
convert assets/icons/icon.svg -resize 96x96 assets/icons/icon-96x96.png
convert assets/icons/icon.svg -resize 128x128 assets/icons/icon-128x128.png
convert assets/icons/icon.svg -resize 144x144 assets/icons/icon-144x144.png
convert assets/icons/icon.svg -resize 152x152 assets/icons/icon-152x152.png
convert assets/icons/icon.svg -resize 192x192 assets/icons/icon-192x192.png
convert assets/icons/icon.svg -resize 384x384 assets/icons/icon-384x384.png
convert assets/icons/icon.svg -resize 512x512 assets/icons/icon-512x512.png
```

Or use an online tool like [RealFaviconGenerator](https://realfavicongenerator.net/).

### Testing

1. Test on real mobile devices
2. Test offline functionality
3. Test camera permissions
4. Test location permissions
5. Test with poor network conditions

## License

Part of the Rammed Earth Chronicles project.

## Contact

For questions or contributions, visit [rammedearth.in](https://rammedearth.in)

---

**Version**: 1.0.0
**Last Updated**: 2025-01-13

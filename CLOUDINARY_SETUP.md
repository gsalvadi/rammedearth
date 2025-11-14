# Cloudinary Setup Guide

This guide walks you through setting up Cloudinary for the Soil Test PWA to enable photo uploads and data collection during beta testing.

## Why Cloudinary?

- **Simpler than Firebase**: No authentication complexity, easier to set up
- **Perfect for images**: Automatic optimization, transformations, CDN delivery
- **Generous free tier**: 25GB storage, 25GB bandwidth/month
- **Metadata support**: Can attach test data to images via context/tags
- **Beta-friendly**: Quick setup, ideal for 5-10 testers

## Step 1: Create Upload Preset (Required)

The app uses **unsigned uploads** (no authentication needed) which requires an upload preset.

### Instructions:

1. **Go to Cloudinary Dashboard**
   - Visit: https://console.cloudinary.com/
   - Login with your account (dio2vkyla)

2. **Navigate to Upload Settings**
   - Click the gear icon (Settings) in top-right
   - Go to: **Upload** tab
   - Scroll to: **Upload presets** section

3. **Create New Upload Preset**
   - Click **"Add upload preset"** button

4. **Configure the Preset**
   ```
   Preset name: soil_test_unsigned
   Signing mode: Unsigned ⚠️ IMPORTANT - Must be Unsigned!
   Folder: soil-tests (optional but recommended for organization)
   ```

5. **Optional Settings** (Recommended)
   ```
   Allowed formats: jpg, png, webp
   Unique filename: Yes (prevents collisions)
   Overwrite: No
   ```

6. **Transformation** (Optional but good for optimization)
   ```
   Quality: Auto
   Format: Auto
   Max dimensions: 2000x2000 (reduces file size while maintaining quality)
   ```

7. **Save the Preset**
   - Click **"Save"**
   - Verify the preset name is exactly: `soil_test_unsigned`

## Step 2: Verify Configuration

The app is already configured with your cloud name: **dio2vkyla**

Check the configuration in:
- `soil-test/js/cloudinary-config.js`

```javascript
const CloudinaryConfig = {
  CLOUD_NAME: 'dio2vkyla',        // ✓ Already set
  UPLOAD_PRESET: 'soil_test_unsigned', // Must match your preset name
  FOLDER: 'soil-tests',
  TAGS: ['soil-test', 'beta', 'v1']
};
```

## Step 3: Test the Upload

1. **Deploy the app** (or test locally)

2. **Complete a soil test**
   - Take at least one photo per test
   - Complete through to results page

3. **Click "Submit Data to Database"**
   - Should show confirmation dialog
   - After confirming, button changes to "⏳ Uploading..."
   - Success: "✓ Success! Uploaded X photos..."
   - Error: Shows error message with details

4. **Verify in Cloudinary Dashboard**
   - Go to: **Media Library**
   - Filter by folder: `soil-tests`
   - Check that photos uploaded with metadata

## What Data Gets Uploaded?

Each photo includes metadata (visible in Cloudinary dashboard):

### Common Metadata (all photos)
- `test_id`: Unique test identifier
- `test_timestamp`: When test was performed
- `test_version`: App version
- `latitude/longitude`: Approximate location (if enabled)

### Result Data
- `suitability_score`: Overall score (0-100)
- `confidence`: Confidence level (65% or 100%)
- `sand_pct`, `silt_pct`, `clay_pct`: Composition percentages

### Test-Specific Data
- `test_type`: visualTest, ribbonTest, ballDropTest, jarTest
- `photo_index`: Which photo number in that test
- Test measurements (e.g., `ribbonTest_ribbonLength`, `ballDropTest_result`)

## Viewing Submitted Data

### In Cloudinary Dashboard:

1. **Media Library** - See all uploaded photos
2. **Context** tab on each image - View metadata
3. **Search/Filter** - Use tags: `soil-test`, `beta`, `v1`

### Exporting Data:

Cloudinary doesn't have a built-in database viewer, but you can:

1. **Use Admin API** to fetch image metadata programmatically
2. **Export via Cloudinary CLI**
3. **Build a simple viewer** (Node.js script to fetch and display)

Would you like me to create a simple data viewer script?

## Troubleshooting

### Error: "Upload failed: Invalid upload preset"

**Problem**: Upload preset not configured or named incorrectly

**Solution**:
1. Verify preset exists in Cloudinary dashboard
2. Check preset name is exactly: `soil_test_unsigned`
3. Ensure "Signing mode" is set to "Unsigned"

### Error: "Upload failed: Unsigned uploads are not allowed"

**Problem**: Account doesn't allow unsigned uploads

**Solution**:
1. Go to Settings > Security
2. Enable "Allow unsigned uploads"
3. Save settings

### Error: "Upload failed: Network error"

**Problem**: Network/connectivity issue

**Solution**:
1. Check internet connection
2. Try again
3. Check browser console for CORS errors

### Photos upload but no metadata visible

**Problem**: Context metadata not being attached

**Solution**:
1. Check browser console for errors
2. Verify upload is using correct module (cloudinary-upload.js)
3. Check Cloudinary plan supports context metadata (all plans do)

## Cost Considerations

### Free Tier Limits:
- **Storage**: 25GB (plenty for beta)
- **Bandwidth**: 25GB/month
- **Transformations**: 25 credits/month

### Estimated Usage (10 beta testers):
- Photos per test: 4-12 (1-3 per test type)
- Photo size: ~500KB each (after compression)
- Tests per tester: 2-5 during beta

**Total**: ~200MB storage, ~1GB bandwidth
**Conclusion**: Free tier is more than sufficient for beta

## Security Notes

### Unsigned Uploads:
- Anyone with the URL can upload to your account
- Mitigated by:
  - Preset restrictions (folder, formats, size limits)
  - Not exposing upload URL publicly (only in PWA)
  - Can disable preset after beta if needed

### Data Privacy:
- No personal information is collected
- Location is approximate (fuzzy coordinates)
- All submissions are anonymous
- Users are informed before upload

## Next Steps After Beta

1. **Review submitted data** in Cloudinary dashboard
2. **Analyze composition patterns** across submissions
3. **Export data** for ML training if needed
4. **Consider switching to signed uploads** for production
5. **May need to upgrade plan** if scaling beyond 10-50 users

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify Cloudinary dashboard shows preset
3. Test upload preset manually with Cloudinary's upload widget
4. Check network tab for failed requests

---

**Ready to test?** Complete the setup above, then run through a full test to verify uploads work!

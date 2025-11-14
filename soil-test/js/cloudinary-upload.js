/**
 * Cloudinary Upload Handler
 * Handles uploading photos and test data to Cloudinary
 */

import CloudinaryConfig from './cloudinary-config.js';

/**
 * Upload a single photo to Cloudinary with metadata
 * @param {Blob} photoBlob - The photo blob to upload
 * @param {Object} metadata - Metadata to attach to the photo
 * @returns {Promise<Object>} Upload response with URL and public_id
 */
async function uploadPhoto(photoBlob, metadata = {}) {
  const formData = new FormData();

  // Required fields
  formData.append('file', photoBlob);
  formData.append('upload_preset', CloudinaryConfig.UPLOAD_PRESET);

  // Optional: Add folder organization
  if (CloudinaryConfig.FOLDER) {
    formData.append('folder', CloudinaryConfig.FOLDER);
  }

  // Add tags for filtering
  if (CloudinaryConfig.TAGS && CloudinaryConfig.TAGS.length > 0) {
    formData.append('tags', CloudinaryConfig.TAGS.join(','));
  }

  // Add metadata as context (key-value pairs visible in Cloudinary dashboard)
  if (metadata && Object.keys(metadata).length > 0) {
    const contextString = Object.entries(metadata)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('|');
    formData.append('context', contextString);
  }

  try {
    const response = await fetch(CloudinaryConfig.UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const result = await response.json();
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
}

/**
 * Upload all test photos and data to Cloudinary
 * @param {Object} testData - Complete test data object
 * @returns {Promise<Object>} Upload results
 */
async function uploadTestData(testData) {
  const uploadResults = {
    testId: testData.id,
    timestamp: new Date().toISOString(),
    uploadedPhotos: [],
    errors: []
  };

  // Prepare metadata common to all photos from this test
  const commonMetadata = {
    test_id: testData.id,
    test_timestamp: testData.timestamp,
    test_version: testData.version,
    app_version: '1.0-beta'
  };

  // Add location if available
  if (testData.location) {
    commonMetadata.latitude = testData.location.latitude?.toFixed(6) || '';
    commonMetadata.longitude = testData.location.longitude?.toFixed(6) || '';
  }

  // Add result data if available
  if (testData.result) {
    commonMetadata.suitability_score = testData.result.score || '';
    commonMetadata.confidence = testData.result.confidenceLevel || '';

    if (testData.result.composition) {
      commonMetadata.sand_pct = testData.result.composition.sand || '';
      commonMetadata.silt_pct = testData.result.composition.silt || '';
      commonMetadata.clay_pct = testData.result.composition.clay || '';
    }
  }

  // Upload photos from each test
  const tests = ['visualTest', 'ribbonTest', 'ballDropTest', 'jarTest'];

  for (const testName of tests) {
    const test = testData.tests[testName];
    if (!test || !test.photos || test.photos.length === 0) {
      continue;
    }

    for (let i = 0; i < test.photos.length; i++) {
      const photo = test.photos[i];

      try {
        // Convert base64 to blob if needed
        const photoBlob = base64ToBlob(photo.data, photo.type || 'image/jpeg');

        // Create photo-specific metadata
        const photoMetadata = {
          ...commonMetadata,
          test_type: testName,
          photo_index: i,
          photo_timestamp: photo.timestamp || ''
        };

        // Add test-specific data
        if (test.measurements) {
          Object.entries(test.measurements).forEach(([key, value]) => {
            photoMetadata[`${testName}_${key}`] = String(value);
          });
        }

        // Upload photo
        const result = await uploadPhoto(photoBlob, photoMetadata);

        uploadResults.uploadedPhotos.push({
          testType: testName,
          photoIndex: i,
          url: result.url,
          publicId: result.publicId
        });

      } catch (error) {
        console.error(`Failed to upload ${testName} photo ${i}:`, error);
        uploadResults.errors.push({
          testType: testName,
          photoIndex: i,
          error: error.message
        });
      }
    }
  }

  return uploadResults;
}

/**
 * Convert base64 data URL to Blob
 * @param {string} base64Data - Base64 data URL (data:image/jpeg;base64,...)
 * @param {string} contentType - MIME type
 * @returns {Blob}
 */
function base64ToBlob(base64Data, contentType = 'image/jpeg') {
  // Remove data URL prefix if present
  const base64String = base64Data.split(',')[1] || base64Data;

  // Decode base64
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/**
 * Check if Cloudinary is properly configured
 * @returns {Object} Configuration status
 */
function checkConfiguration() {
  const issues = [];

  if (!CloudinaryConfig.CLOUD_NAME) {
    issues.push('Cloud name is not set');
  }

  if (!CloudinaryConfig.UPLOAD_PRESET) {
    issues.push('Upload preset is not set');
  }

  return {
    configured: issues.length === 0,
    issues,
    cloudName: CloudinaryConfig.CLOUD_NAME,
    uploadPreset: CloudinaryConfig.UPLOAD_PRESET
  };
}

export default {
  uploadPhoto,
  uploadTestData,
  checkConfiguration
};

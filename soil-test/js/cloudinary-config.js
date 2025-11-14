/**
 * Cloudinary Configuration
 *
 * Setup Instructions:
 * 1. Go to Cloudinary Dashboard: https://console.cloudinary.com/
 * 2. Navigate to Settings > Upload > Upload presets
 * 3. Click "Add upload preset"
 * 4. Set:
 *    - Preset name: "soil_test_unsigned"
 *    - Signing mode: "Unsigned"
 *    - Folder: "soil-tests" (optional but recommended)
 *    - Allowed formats: jpg, png, webp
 *    - Transformation: Optional - can add auto quality/format optimization
 * 5. Save the preset
 * 6. Update UPLOAD_PRESET below with your preset name
 */

const CloudinaryConfig = {
  // Your Cloudinary cloud name
  CLOUD_NAME: 'dio2vkyla',

  // Upload preset name (must be created in Cloudinary dashboard)
  // Default: 'soil_test_unsigned' - UPDATE THIS if you use a different name
  UPLOAD_PRESET: 'soil_test_unsigned',

  // API endpoint for unsigned uploads
  get UPLOAD_URL() {
    return `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;
  },

  // Folder structure
  FOLDER: 'soil-tests',

  // Tag all uploads for easy filtering
  TAGS: ['soil-test', 'beta', 'v1']
};

export default CloudinaryConfig;

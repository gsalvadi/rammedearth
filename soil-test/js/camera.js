/**
 * Camera Module - Handle photo capture
 */

class CameraManager {
  constructor() {
    this.stream = null;
    this.capturedPhoto = null;
    this.videoElement = null;
    this.canvasElement = null;
  }

  /**
   * Check if camera is supported
   */
  isSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }

  /**
   * Initialize camera stream
   */
  async init(videoElement) {
    if (!this.isSupported()) {
      throw new Error('Camera is not supported by this browser');
    }

    this.videoElement = videoElement;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      return true;
    } catch (error) {
      console.error('Camera initialization error:', error);

      let errorMessage = 'Unable to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use';
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Capture photo from video stream
   */
  capturePhoto(canvasElement) {
    if (!this.stream || !this.videoElement) {
      throw new Error('Camera not initialized');
    }

    this.canvasElement = canvasElement;
    const context = this.canvasElement.getContext('2d');

    // Set canvas size to match video
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    // Draw video frame to canvas
    context.drawImage(
      this.videoElement,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    // Get data URL
    this.capturedPhoto = this.canvasElement.toDataURL('image/jpeg', 0.85);

    return this.capturedPhoto;
  }

  /**
   * Get photo as Blob
   */
  async getPhotoBlob() {
    if (!this.capturedPhoto) {
      throw new Error('No photo captured');
    }

    return new Promise((resolve, reject) => {
      this.canvasElement.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        0.85
      );
    });
  }

  /**
   * Stop camera stream
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  /**
   * Reset captured photo
   */
  reset() {
    this.capturedPhoto = null;
  }

  /**
   * Get captured photo data URL
   */
  getCapturedPhoto() {
    return this.capturedPhoto;
  }

  /**
   * Convert data URL to blob
   */
  dataURLtoBlob(dataURL) {
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

  /**
   * Compress and resize image
   */
  async compressImage(dataURL, maxWidth = 1920, maxHeight = 1080, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataURL;
    });
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(dataURL) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = dataURL;
    });
  }
}

// Export singleton instance
const camera = new CameraManager();

export default camera;

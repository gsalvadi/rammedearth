/**
 * Geolocation Module - Handle GPS location capture
 */

class GeolocationManager {
  constructor() {
    this.supported = 'geolocation' in navigator;
  }

  /**
   * Check if geolocation is supported
   */
  isSupported() {
    return this.supported;
  }

  /**
   * Get current position
   */
  async getCurrentPosition() {
    if (!this.supported) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });
        },
        (error) => {
          let errorMessage = 'Unable to get location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Request location permission
   */
  async requestPermission() {
    try {
      // Try to get position - this will trigger permission prompt
      await this.getCurrentPosition();
      return true;
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  /**
   * Get location with user-friendly error handling
   */
  async getLocationSafe() {
    try {
      const location = await this.getCurrentPosition();
      return {
        success: true,
        location
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat, lng) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    const latAbs = Math.abs(lat).toFixed(6);
    const lngAbs = Math.abs(lng).toFixed(6);

    return `${latAbs}°${latDir}, ${lngAbs}°${lngDir}`;
  }

  /**
   * Calculate distance between two coordinates (in meters)
   * Using Haversine formula
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}

// Export singleton instance
const geolocation = new GeolocationManager();

export default geolocation;

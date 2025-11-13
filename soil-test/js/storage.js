/**
 * Storage Module - IndexedDB wrapper for offline storage
 */

const DB_NAME = 'SoilTestDB';
const DB_VERSION = 1;
const STORE_TESTS = 'soilTests';
const STORE_PHOTOS = 'photos';

class StorageManager {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize the database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create soil tests store
        if (!db.objectStoreNames.contains(STORE_TESTS)) {
          const testsStore = db.createObjectStore(STORE_TESTS, {
            keyPath: 'id'
          });
          testsStore.createIndex('timestamp', 'timestamp', { unique: false });
          testsStore.createIndex('submitted', 'submitted', { unique: false });
        }

        // Create photos store
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          const photosStore = db.createObjectStore(STORE_PHOTOS, {
            keyPath: 'id'
          });
          photosStore.createIndex('testId', 'testId', { unique: false });
        }
      };
    });
  }

  /**
   * Generate a unique ID
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Save a soil test
   */
  async saveTest(testData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_TESTS], 'readwrite');
      const store = transaction.objectStore(STORE_TESTS);

      // Ensure test has an ID
      if (!testData.id) {
        testData.id = this.generateId();
      }

      // Add timestamp if not present
      if (!testData.timestamp) {
        testData.timestamp = new Date().toISOString();
      }

      const request = store.put(testData);

      request.onsuccess = () => resolve(testData.id);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a soil test by ID
   */
  async getTest(testId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_TESTS], 'readonly');
      const store = transaction.objectStore(STORE_TESTS);
      const request = store.get(testId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all soil tests
   */
  async getAllTests() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_TESTS], 'readonly');
      const store = transaction.objectStore(STORE_TESTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a soil test
   */
  async deleteTest(testId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_TESTS], 'readwrite');
      const store = transaction.objectStore(STORE_TESTS);
      const request = store.delete(testId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a photo blob
   */
  async savePhoto(photoData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_PHOTOS], 'readwrite');
      const store = transaction.objectStore(STORE_PHOTOS);

      if (!photoData.id) {
        photoData.id = this.generateId();
      }

      const request = store.put(photoData);

      request.onsuccess = () => resolve(photoData.id);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a photo by ID
   */
  async getPhoto(photoId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_PHOTOS], 'readonly');
      const store = transaction.objectStore(STORE_PHOTOS);
      const request = store.get(photoId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all photos for a test
   */
  async getPhotosByTestId(testId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_PHOTOS], 'readonly');
      const store = transaction.objectStore(STORE_PHOTOS);
      const index = store.index('testId');
      const request = index.getAll(testId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a photo
   */
  async deletePhoto(photoId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_PHOTOS], 'readwrite');
      const store = transaction.objectStore(STORE_PHOTOS);
      const request = store.delete(photoId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get current test from sessionStorage
   */
  getCurrentTest() {
    const data = sessionStorage.getItem('currentTest');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Save current test to sessionStorage
   */
  setCurrentTest(testData) {
    sessionStorage.setItem('currentTest', JSON.stringify(testData));
  }

  /**
   * Clear current test from sessionStorage
   */
  clearCurrentTest() {
    sessionStorage.removeItem('currentTest');
  }

  /**
   * Get current test ID
   */
  getCurrentTestId() {
    const data = this.getCurrentTest();
    return data ? data.id : null;
  }
}

// Export singleton instance
const storage = new StorageManager();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  storage.init().catch(console.error);
}

export default storage;

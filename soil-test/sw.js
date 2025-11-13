/**
 * Service Worker for Soil Test PWA
 * Handles offline caching and background sync
 */

const CACHE_NAME = 'soil-test-v1';
const CACHE_VERSION = '1.0.0';

// Files to cache for offline use
const STATIC_CACHE_FILES = [
  '/soil-test/',
  '/soil-test/index.html',
  '/soil-test/test.html',
  '/soil-test/results.html',
  '/soil-test/manifest.json',
  '/soil-test/css/main.css',
  '/soil-test/css/test-flow.css',
  '/soil-test/css/results.css',
  '/soil-test/js/app.js',
  '/soil-test/js/camera.js',
  '/soil-test/js/geolocation.js',
  '/soil-test/js/storage.js',
  '/soil-test/js/test-logic.js',
  '/soil-test/data/test-protocols.json'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_CACHE_FILES);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (request.url.includes('chrome-extension://')) {
    return;
  }

  // Strategy: Cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Update cache in background
          updateCache(request);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              cacheResponse(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);

            // Return offline page if available
            if (request.destination === 'document') {
              return caches.match('/soil-test/index.html');
            }

            // For other resources, throw error
            throw error;
          });
      })
  );
});

/**
 * Update cache in background
 */
function updateCache(request) {
  fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cacheResponse(request, response);
      }
    })
    .catch((error) => {
      console.log('[SW] Background update failed:', error);
    });
}

/**
 * Cache a response
 */
function cacheResponse(request, response) {
  // Only cache same-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Don't cache API calls or large resources
  const url = new URL(request.url);
  if (url.pathname.includes('/api/') || url.pathname.includes('cloudinary')) {
    return;
  }

  caches.open(CACHE_NAME)
    .then((cache) => {
      cache.put(request, response);
    })
    .catch((error) => {
      console.error('[SW] Failed to cache response:', error);
    });
}

/**
 * Message handler
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});

/**
 * Background sync for data submission
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-test-data') {
    event.waitUntil(syncTestData());
  }
});

/**
 * Sync test data when connection is restored
 */
async function syncTestData() {
  console.log('[SW] Syncing test data...');

  try {
    // Open IndexedDB and get unsubmitted tests
    // This would integrate with the storage module
    // For now, just log
    console.log('[SW] Sync complete');
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    return Promise.reject(error);
  }
}

/**
 * Push notification handler (future feature)
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const title = data.title || 'Soil Test Update';
  const options = {
    body: data.body || 'New information available',
    icon: '/soil-test/assets/icons/icon-192x192.png',
    badge: '/soil-test/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/soil-test/')
  );
});

console.log('[SW] Service worker loaded, version:', CACHE_VERSION);

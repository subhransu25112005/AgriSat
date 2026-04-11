const CACHE_VERSION = 'agrisat-v3.0.0'; // Bumped: forces all browsers to drop stale caches
const CACHE_NAME = `agrisat-cache-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/logo.svg',
  '/logo.png',
  '/agrisat_icon.png',
  '/manifest.json'
];

// Install: Cache core UI shell and immediate skipWaiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 PWA: Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // ✅ ENSURES NEW SERVICE WORKER TAKES OVER IMMEDIATELY
});

// Activate: Purge old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('agrisat-cache-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('🗑️ PWA: Purging old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // ✅ ENSURES SERVICE WORKER CONTROLS ALL PAGES WITHOUT REFRESH
  self.clients.claim();
});

// Fetch: Production Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass all API calls - Network-Only (Protect against stale news/weather)
  // We explicitly skip caching for any response from Render or News/Weather platforms
  if (
    url.hostname.includes('onrender.com') || 
    url.hostname.includes('googleapis') || 
    url.hostname.includes('gnews.io') ||
    url.hostname.includes('openweathermap') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/auth')
  ) {
    return;
  }

  // 2. index.html - Network-First (Crucial for preventing White Screen Mismatch)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Static Assets (JS/CSS/Images) - Cache-First for Performance
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        // ✅ DO NOT cache failed API responses or opaque requests
        if (
          !networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type !== 'basic' ||
          event.request.method !== 'GET'
        ) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});

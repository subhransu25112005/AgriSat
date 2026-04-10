const CACHE_VERSION = 'agrisat-v1.0.0';
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
  self.skipWaiting();
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
  self.clients.claim();
});

// Fetch: Optimized Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass all API calls - Always fresh from network
  if (
    url.hostname.includes('onrender.com') || 
    url.hostname.includes('googleapis') || 
    url.hostname.includes('gnews.io') ||
    url.hostname.includes('openweathermap') ||
    url.pathname.startsWith('/api')
  ) {
    return;
  }

  // 2. index.html - Network-First (Crucial to prevent white screen issues)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Static Assets (JS/CSS/Images) - Cache-First, then Network
  // Vite uses hashes for JS/CSS, so they are safe to cache forever until a new version
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        // Only cache valid successful GET responses
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

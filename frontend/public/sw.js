const CACHE_NAME = 'agrisat-pwa-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo.svg'
];

// Install Event: Cache essential static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clear out old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Serve static files from cache, bypass APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. DO NOT cache external API requests to avoid stale data
  if (
    url.pathname.startsWith('/api') || 
    url.hostname.includes('googleapis') || 
    url.hostname.includes('gnews.io') ||
    url.hostname.includes('openweathermap')
  ) {
    return; // Let the browser handle these normally
  }

  // 2. Cache First, Fallback to Network strategy for UI/Static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback for navigation requests when totally offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

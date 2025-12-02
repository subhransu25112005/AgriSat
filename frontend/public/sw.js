// simple service worker registration file for PWA offline caching (minimal)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // let network handle for now; caching can be added later
});

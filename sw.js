const CACHE_NAME = 'zeus-iot-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/shared-styles.css',
  '/wow-styles.css',
  '/zeus.png',
  '/light-zeus.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      self.registration.unregister();
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Pass through all requests to network
  event.respondWith(fetch(event.request));
});

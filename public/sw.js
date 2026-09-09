// Service Worker GenZi Code - Offline Support & Asset Cache
const CACHE_NAME = 'genzi-code-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn('[SW] Offline assets pre-caching non-fatal warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension, API calls, and external iframes (like YouTube, Google Drive)
  const url = new URL(event.request.url);
  if (
    url.protocol.startsWith('chrome-extension') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('drive.google.com') ||
    url.pathname.startsWith('/api')
  ) {
    return;
  }

  // Network-first with Cache fallback for navigation & static assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline content available in local storage.', {
            status: 503,
            statusText: 'Service Unavailable (Offline)'
          });
        });
      })
  );
});

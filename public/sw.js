// BHUMITRA Offline-First Agricultural Service Worker
// Caches Essential Crop Data, APMC Price Trends, Government Schemes, and Saved Plans for low-connectivity rural areas.

const STATIC_CACHE_NAME = 'bhumitra-static-shell-v2';
const DATA_CACHE_NAME = 'bhumitra-essential-agri-data-v2';

const CORE_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
];

const ESSENTIAL_DATA_ENDPOINTS = [
  '/api/offline-bundle',
  '/api/crops',
  '/api/apmc-prices',
  '/api/schemes',
  '/api/agri-news',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        await Promise.allSettled(CORE_SHELL_URLS.map((url) => staticCache.add(url)));
      } catch (e) {
        // Ignore shell prefetch errors during install
      }

      try {
        const dataCache = await caches.open(DATA_CACHE_NAME);
        await Promise.allSettled(
          ESSENTIAL_DATA_ENDPOINTS.map(async (endpoint) => {
            const res = await fetch(endpoint);
            if (res && res.ok) {
              await dataCache.put(endpoint, res.clone());
            }
          })
        );
      } catch (e) {
        // Ignore API prefetch errors during install
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME && !key.includes('workbox')) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
      await self.clients.claim();
    })()
  );
});

// Listen for client messages to sync offline bundle or cache saved crop plans
self.addEventListener('message', (event) => {
  const data = event.data || {};

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (data.type === 'SYNC_ESSENTIAL_DATA') {
    event.waitUntil(
      (async () => {
        const dataCache = await caches.open(DATA_CACHE_NAME);
        await Promise.allSettled(
          ESSENTIAL_DATA_ENDPOINTS.map(async (endpoint) => {
            const res = await fetch(endpoint);
            if (res && res.ok) {
              await dataCache.put(endpoint, res.clone());
            }
          })
        );
        if (data.payload) {
          const snapshotResponse = new Response(JSON.stringify(data.payload), {
            headers: {
              'Content-Type': 'application/json',
              'X-Bhumitra-Cache-Timestamp': new Date().toISOString(),
            },
          });
          await dataCache.put('/api/offline-client-snapshot', snapshotResponse);
        }
        const clientsList = await self.clients.matchAll();
        clientsList.forEach((client) => {
          client.postMessage({
            type: 'OFFLINE_SYNC_COMPLETE',
            timestamp: new Date().toISOString(),
          });
        });
      })()
    );
  }

  if (data.type === 'CACHE_SAVED_PLANS' && data.plans) {
    event.waitUntil(
      (async () => {
        const dataCache = await caches.open(DATA_CACHE_NAME);
        const plansResponse = new Response(
          JSON.stringify({
            success: true,
            savedPlans: data.plans,
            cachedAt: new Date().toISOString(),
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        await dataCache.put('/api/offline-saved-plans', plansResponse);
      })()
    );
  }
});

// Fetch interceptor: Stale-While-Revalidate / Network-First with Offline Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests or Google fonts
  if (url.origin !== self.location.origin && !url.origin.includes('fonts.g')) {
    return;
  }

  // Handle GET requests for essential agricultural APIs (Crops, APMC Prices, Schemes, News, Offline Bundle)
  if (
    request.method === 'GET' &&
    (url.pathname.startsWith('/api/crops') ||
      url.pathname.startsWith('/api/apmc-prices') ||
      url.pathname.startsWith('/api/schemes') ||
      url.pathname.startsWith('/api/agri-news') ||
      url.pathname.startsWith('/api/offline-bundle') ||
      url.pathname.startsWith('/api/offline-saved-plans') ||
      url.pathname.startsWith('/api/offline-client-snapshot'))
  ) {
    event.respondWith(
      (async () => {
        const dataCache = await caches.open(DATA_CACHE_NAME);
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            await dataCache.put(url.pathname, networkResponse.clone());
            return networkResponse;
          }
        } catch (err) {
          // Network failed in low-connectivity area — serve from Service Worker cache!
        }

        const cachedResponse =
          (await dataCache.match(url.pathname)) || (await dataCache.match(request));
        if (cachedResponse) {
          return cachedResponse;
        }

        return new Response(
          JSON.stringify({
            success: true,
            offlineCached: true,
            message: 'Served from BHUMITRA low-connectivity offline fallback.',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })()
    );
    return;
  }

  // Handle navigation & static assets (Network first with cache fallback so app loads offline)
  if (request.method === 'GET') {
    event.respondWith(
      (async () => {
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        try {
          const networkResponse = await fetch(request);
          if (
            networkResponse &&
            networkResponse.ok &&
            (request.mode === 'navigate' ||
              url.pathname.match(/\.(js|css|svg|png|ico|woff2?|webmanifest)$/))
          ) {
            staticCache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cached = await staticCache.match(request);
          if (cached) return cached;
          if (request.mode === 'navigate') {
            const indexCached = await staticCache.match('/index.html');
            if (indexCached) return indexCached;
          }
          throw err;
        }
      })()
    );
  }
});

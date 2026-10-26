const CACHE_NAME = "oclima-v1.0.0";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon/favicon.ico",
  "/favicon/favicon-96x96.png",
  "/favicon/apple-touch-icon.png",
  "/favicon/web-app-manifest-192x192.png",
  "/favicon/web-app-manifest-512x512.png",
  "/favicon/web-app-manifest-maskable-512x512.png",
  "/logo.png",
  "/og-image.png",
  "/weather/sun.png",
  "/weather/rain.png",
  "/weather/cloud.png",
  "/weather/drizzle.png",
  "/weather/partly-cloudy.png",
  "/weather/thunder.png",
  "/weather/fog.png",
  "/weather/moon.png",
  "/weather/weather-3d.png"
];

// Install: Pre-cache core app shell assets & skip waiting immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("Alguns assets estáticos falharam no pre-cache:", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Purge old cache versions and claim all open clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Removendo cache antigo do SW:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 1. Weather APIs: Network-first with Cache Fallback
  if (
    url.hostname.includes("weatherapi.com") ||
    url.hostname.includes("openweathermap.org") ||
    url.hostname.includes("open-meteo.com")
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Imagens, Fontes): Cache-First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate for fast loads)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If HTML request fails, fallback to root /
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        });
    })
  );
});

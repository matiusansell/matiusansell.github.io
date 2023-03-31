// Define the cache name
const CACHE_NAME = "mdl-cache";

// Define the files to be cached
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/blog.html",
  "/portfolio-example-01.html",
  "/styles.css",
];

// Install the service worker and cache the files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate the service worker and delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch the files from the cache first, then the network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // If the file is found in the cache, return it
        return response;
      } else {
        // If the file is not found in the cache, fetch it from the network
        return fetch(event.request)
          .then((response) => {
            // Cache the fetched file
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            throw error;
          });
      }
    })
  );
});

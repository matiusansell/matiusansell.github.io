var APP_PREFIX = "MDLPortofolio"; // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = "MDLVersion_00"; // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      cache.addAll([
        "/",
        "/index.html",
        "/about.html",
        "/contact.html",
        "/blog.html",
        "/portfolio-example-01.html",
        "/styles.css",
        "/Tutorial/*.html",
        "/Tutorial/step05-individual-pages/*.html",
      ]);
    })
  );
  return self.clients.claim();
});

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

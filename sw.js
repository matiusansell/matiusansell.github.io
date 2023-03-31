var APP_PREFIX = 'mdl-cache'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
  '/',                     // If you have separate JS/CSS files,
  '/index.html',            // add path to those files here
  '/about.html',
  '/blog.html',
  '/contact.html',
  '/portfolio-example01.html',            // add path to those files here
  '/style.css',            // add path to those files here
  //'/css/app.css',            // add path to those files here
  //'/js/app.js',            // add path to those files here
]

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
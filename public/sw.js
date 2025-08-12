const CACHE_NAME = "kris-yotam-blog-cache-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/script/main.js",
  // Add other assets you want to cache
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
})


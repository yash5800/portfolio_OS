// Minimal service worker: makes pixelify.me installable without
// interfering with Vite's asset hashing or caching a stale build.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Network handles every request; the handler keeps installability intact.
});

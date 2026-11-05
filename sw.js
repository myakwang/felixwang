// Retired root service worker.
// The first release of Star Army lived at the site root and installed a service
// worker here with scope "/". Games now live in their own folders, each with its
// own service worker. This file replaces the old one on visitors' devices, clears
// its cache, and unregisters itself so it no longer intercepts any requests.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await caches.delete('star-army-v1');
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => c.navigate(c.url));
  })());
});

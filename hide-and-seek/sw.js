// Felix's Hide & Seek offline cache. The deploy workflow stamps a new VERSION on every push.
const VERSION = 'hide-and-seek-__BUILD__'; // __BUILD__ is replaced with the commit id on every deploy
const FILES = ['./', './index.html', './engine.js', './maps.js', './three.min.js', './patrick-hand.woff2', './manifest.webmanifest',
  './favicon.png', './icons/icon-192.png', './icons/icon-512.png',
  './icons/maskable-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
// Only remove this game's own older caches; other games on this site keep theirs.
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k.slice(0, k.lastIndexOf('-')) === VERSION.slice(0, VERSION.lastIndexOf('-'))).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network first for the page (so updates show up), cache first for everything else.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});

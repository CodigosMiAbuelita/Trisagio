const CACHE_NAME = 'trisagio-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './Images/trisagio.jpg',
  './Images/icon-192x192.png',
  './Images/icon-512x512.png',
  './fontawesome/css/all.min.css',
  './fontawesome/webfonts/fa-solid-900.woff2',
  './Audio/Pista_1.mp3', './Audio/Pista_2.mp3', './Audio/Pista_3.mp3', './Audio/Pista_4.mp3',
  './Audio/Pista_5.mp3', './Audio/Pista_6.mp3', './Audio/Pista_7.mp3', './Audio/Pista_8.mp3',
  './Audio/Pista_9.mp3', './Audio/Pista_10.mp3', './Audio/Pista_11.mp3', './Audio/Pista_12.mp3', './Audio/Pista_13.mp3'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Handle Safari Range Requests for Audio
  if (e.request.headers.has('range')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(e.request, { ignoreSearch: true }).then(res => {
          if (!res) return fetch(e.request);

          return res.arrayBuffer().then(arrayBuffer => {
            const rangeHeader = e.request.headers.get('range');
            const bytes = rangeHeader.match(/bytes=(\d+)-(.*)?/);
            const pos = Number(bytes[1]);
            const end = bytes[2] ? Number(bytes[2]) : arrayBuffer.byteLength - 1;
            const slice = arrayBuffer.slice(pos, end + 1);

            return new Response(slice, {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                ['Content-Type', res.headers.get('Content-Type') || 'audio/mpeg'],
                ['Content-Range', `bytes ${pos}-${end}/${arrayBuffer.byteLength}`],
                ['Content-Length', slice.byteLength],
                ['Accept-Ranges', 'bytes']
              ]
            });
          });
        });
      })
    );
  } else {
    // Handle standard requests with Android ExoPlayer bypass
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(res => res || fetch(e.request))
    );
  }
});
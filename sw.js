// sw.js
const CACHE_NAME = 'v1-editorial';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    // Si la petición es hacia nuestra API, NO usar caché
    if (e.request.url.includes('/api/')) {
        return fetch(e.request);
    }

    // Para el resto de archivos (HTML, CSS, JS), usar la estrategia Cache First
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});
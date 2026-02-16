const CACHE_NAME = 'v1-editorial';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json'];

// Instalación: Cachear archivos estáticos
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Interceptar peticiones para servir desde caché si no hay red
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});
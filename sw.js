const CACHE_ESTATICO = 'v9-editorial'; 
const CACHE_DINAMICO = 'dinamico-editorial'; 

const ASSETS = [
    './', 
    './index.html', 
    './revisor.html', 
    './autor.html', 
    './editor.html', 
    './style.css', 
    './app.js', 
    './autor.js',
    './editor.js',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); 
    e.waitUntil(caches.open(CACHE_ESTATICO).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_ESTATICO && key !== CACHE_DINAMICO).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim()) 
    );
});

// AQUÍ ESTÁ LA MAGIA DE LOS MICRÓFONOS
self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('/api/')) {
        if (e.request.method === 'GET') {
            console.log('📡 [SW] Detecté una petición a la BD:', e.request.url);
            
            e.respondWith(
                fetch(e.request)
                    .then(response => {
                        console.log('✅ [SW] El servidor Node respondió con estado:', response.status);
                        
                        // Si la respuesta no es 200 (éxito), no la guardamos
                        if (!response || response.status !== 200) {
                            console.log('⚠️ [SW] Respuesta no válida, no se guardará en caché.');
                            return response;
                        }

                        const resClone = response.clone();
                        caches.open(CACHE_DINAMICO).then(cache => {
                            cache.put(e.request, resClone);
                            console.log('📦 [SW] ¡ÉXITO! Datos guardados en la caja dinámica.');
                        });
                        return response;
                    })
                    .catch(error => {
                        console.log('🛑 [SW] Se cayó el internet o el servidor Node.', error);
                        console.log('🔍 [SW] Buscando copia de seguridad en la caja dinámica...');
                        
                        return caches.match(e.request).then(resCache => {
                            if (resCache) {
                                console.log('🎁 [SW] ¡Copia encontrada! Mostrando datos offline.');
                                return resCache;
                            } else {
                                console.log('❌ [SW] La caja dinámica estaba vacía.');
                            }
                        });
                    })
            );
        } else {
            e.respondWith(fetch(e.request));
        }
        return; 
    }

    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});
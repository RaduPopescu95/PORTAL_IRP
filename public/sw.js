// Service Worker completely disabled - No caching at all
console.log('Service Worker: Completely disabled - No caching');

// Instalarea service worker-ului - nu cache-ăm nimic
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing with NO CACHE...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activarea service worker-ului - ștergem toate cache-urile existente
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating and clearing ALL caches...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        // Șterge TOATE cache-urile, fără excepție
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('Service Worker: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        console.log('Service Worker: All caches cleared, taking control');
        return self.clients.claim();
      })
  );
});

// Interceptarea fetch requests - NU CACHE-ĂM NIMIC, totul direct de la network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip requests pentru Chrome extensions
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }

  // Pentru TOATE requests - direct network, NO CACHE
  console.log('Service Worker: Bypassing cache for:', url.href);
  
  event.respondWith(
    fetch(request, {
      cache: 'no-store', // Force no cache
      headers: {
        ...request.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .catch(error => {
      console.log('Service Worker: Network error:', error);
      
      // Minimal offline fallback doar pentru HTML
      if (request.headers.get('accept')?.includes('text/html')) {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Offline - Portal IRP</title>
            <meta charset="utf-8">
          </head>
          <body>
            <div style="text-align:center; padding:50px; font-family:Arial;">
              <h1>Conexiune întreruptă</h1>
              <p>Verifică conexiunea la internet și reîncarcă pagina.</p>
              <button onclick="location.reload()">Reîncarcă</button>
            </div>
          </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      return new Response('Network Error', { status: 503 });
    })
  );
});

// Disable toate alte evenimente de cache
self.addEventListener('sync', () => {
  console.log('Service Worker: Sync disabled');
});

self.addEventListener('push', () => {
  console.log('Service Worker: Push disabled');
}); 
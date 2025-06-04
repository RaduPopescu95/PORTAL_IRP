const CACHE_NAME = 'portal-irp-v1';
const STATIC_CACHE_NAME = 'portal-irp-static-v1';
const DYNAMIC_CACHE_NAME = 'portal-irp-dynamic-v1';

// Resurse care se cachează imediat la instalare
const STATIC_ASSETS = [
  '/',
  '/panou-principal',
  '/creaza-BICP',
  '/creaza-acreditare',
  '/lista-BICP',
  '/lista-acreditari',
  '/signin',
  '/manifest.json',
  // CSS și JS files
  '/_next/static/css/',
  '/_next/static/js/',
  // Font Awesome și alte resurse
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css?family=Nunito:400,400i,500,600,700&display=swap'
];

// Resurse dinamice care se cachează la cerere
const DYNAMIC_CACHE_PATTERNS = [
  /\/_next\/static\//,
  /\/api\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js)$/
];

// Instalarea service worker-ului
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets...');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('_next')));
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Activarea service worker-ului
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Șterge cache-urile vechi
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName.startsWith('portal-irp-')) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Interceptarea fetch requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip requests pentru Chrome extensions
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }

  // Skip Firestore requests - nu le cache-am pentru date fresh
  if (url.hostname.includes('firestore.googleapis.com') || 
      url.hostname.includes('firebase.googleapis.com') ||
      url.pathname.includes('/firestore/') ||
      url.pathname.includes('/api/generateAcreditari') ||
      url.pathname.includes('/api/generate')) {
    console.log('Service Worker: Skipping cache for Firestore request:', url.href);
    return;
  }

  // Skip requests pentru same-origin care nu sunt GET
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Returnează din cache dacă există
        if (cachedResponse) {
          return cachedResponse;
        }

        // Pentru requests network
        return fetch(request)
          .then(networkResponse => {
            // Verifică dacă response-ul este valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone response pentru cache
            const responseClone = networkResponse.clone();

            // Cache resurse dinamice (dar nu date Firestore)
            if (shouldCacheDynamically(request.url)) {
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone);
                });
            }

            return networkResponse;
          })
          .catch(error => {
            console.log('Service Worker: Fetch failed, serving offline fallback:', error);
            
            // Fallback pentru pagini HTML
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html') || 
                     caches.match('/') ||
                     new Response(getOfflineHTML(), {
                       headers: { 'Content-Type': 'text/html' }
                     });
            }

            // Fallback pentru imagini
            if (request.headers.get('accept').includes('image')) {
              return new Response(getOfflineImageSVG(), {
                headers: { 'Content-Type': 'image/svg+xml' }
              });
            }

            // Pentru alte tipuri de resurse
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Helper functions
function shouldCacheDynamically(url) {
  // Nu cache-ăm requests către Firestore sau API-uri de date
  if (url.includes('firestore.googleapis.com') || 
      url.includes('firebase.googleapis.com') ||
      url.includes('/api/generate') ||
      url.includes('/api/') ||
      url.includes('_next/static/chunks/app/')) {
    return false;
  }

  // Cache-ăm doar resurse statice
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="ro">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portal IRP - Offline</title>
      <style>
        body {
          font-family: 'Nunito', sans-serif;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .offline-container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 400px;
        }
        .offline-icon {
          font-size: 64px;
          color: #6c757d;
          margin-bottom: 20px;
        }
        h1 { color: #343a40; margin-bottom: 10px; }
        p { color: #6c757d; margin-bottom: 20px; }
        .retry-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .retry-btn:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>Portal IRP</h1>
        <p>Nu există conexiune la internet. Verifică conexiunea și încearcă din nou.</p>
        <button class="retry-btn" onclick="window.location.reload()">Încearcă din nou</button>
      </div>
    </body>
    </html>
  `;
}

function getOfflineImageSVG() {
  return `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f8f9fa"/>
      <circle cx="100" cy="100" r="30" fill="#6c757d"/>
      <text x="100" y="150" text-anchor="middle" fill="#6c757d" font-family="Arial">Offline</text>
    </svg>
  `;
}

// Background sync pentru upload-uri când revine conexiunea
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-upload') {
    event.waitUntil(
      // Aici poți adăuga logica pentru sincronizarea documentelor
      // când conexiunea revine
      console.log('Background sync triggered')
    );
  }
});

// Push notifications support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: data.actions
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/panou-principal')
  );
}); 
// Service Worker with selective caching - Allow static resources, bypass only Firestore
console.log('Service Worker: Selective cache bypass - Static resources OK, Firestore bypassed');

// Instalarea service worker-ului
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing with selective bypass...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activarea service worker-ului - ștergem doar cache-urile vechi
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating and clearing old caches...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        // Șterge doar cache-urile vechi ale aplicației noastre
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('portal-irp-')) {
              console.log('Service Worker: Deleting old app cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Old caches cleared, taking control');
        return self.clients.claim();
      })
  );
});

// Interceptarea fetch requests - BYPASS doar Firestore, permite static resources
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip requests pentru Chrome extensions
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    return;
  }

  // BYPASS doar requests către Firestore - datele vin direct de la server
  if (url.hostname.includes('firestore.googleapis.com') || 
      url.hostname.includes('firebase.googleapis.com') ||
      url.pathname.includes('/firestore') ||
      url.pathname.includes('/firebase') ||
      url.search.includes('database') ||
      request.url.includes('firestore') ||
      request.url.includes('firebase')) {
    
    console.log('Service Worker: Bypassing cache for Firestore:', url.pathname);
    
    // Pentru Firestore - direct network, NO CACHE
    event.respondWith(
      fetch(request, {
        cache: 'no-store'
      }).catch(error => {
        console.log('Service Worker: Firestore request failed:', error);
        return new Response('Firestore Error', { status: 503 });
      })
    );
    return;
  }

  // Pentru toate celelalte resurse (CSS, JS, fonts, images) - comportament normal
  // Nu intervenim, lăsăm browser-ul să se ocupe normal
  console.log('Service Worker: Allowing normal handling for:', url.pathname);
});

// Disable background sync și push notifications
self.addEventListener('sync', () => {
  console.log('Service Worker: Sync disabled');
});

self.addEventListener('push', () => {
  console.log('Service Worker: Push disabled');
}); 
// Service Worker TEMPORARILY DISABLED for testing navigation issues
console.log('Service Worker: DISABLED - Testing navigation fix');

// Instalarea service worker-ului - Skip everything
self.addEventListener('install', (event) => {
  console.log('Service Worker: DISABLED - Skipping install');
  self.skipWaiting();
});

// Activarea service worker-ului - Skip everything
self.addEventListener('activate', (event) => {
  console.log('Service Worker: DISABLED - Skipping activate');
  return self.clients.claim();
});

// Fetch event - Pass everything through normally
self.addEventListener('fetch', (event) => {
  // Don't intercept anything - let everything pass through normally
  console.log('Service Worker: DISABLED - Allowing all requests to pass through normally');
  return;
});

// Disable background sync și push notifications
self.addEventListener('sync', () => {
  console.log('Service Worker: DISABLED - Sync disabled');
});

self.addEventListener('push', () => {
  console.log('Service Worker: DISABLED - Push disabled');
}); 
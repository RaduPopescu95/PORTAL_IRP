'use client';

import { useEffect, useState } from 'react';

const CacheBuster = ({ showButton = true, alwaysShow = true }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [showClearButton, setShowClearButton] = useState(alwaysShow || showButton);

  useEffect(() => {
    // Since we want zero caching, always show the button
    setShowClearButton(true);

    // Auto-check for any cache-related issues
    const checkCacheIssues = () => {
      // Always assume there might be cache issues since we want zero cache
      setShowClearButton(true);
      
      // Log cache status
      console.log('CacheBuster: Zero-cache mode - button always available');
    };

    // Check immediately and periodically
    checkCacheIssues();
    const interval = setInterval(checkCacheIssues, 30000); // Check every 30 seconds

    // Listen for ALL error events that might indicate any cache problems
    const handleError = (event) => {
      console.log('CacheBuster: Error detected, ensuring clear button is available:', event.error);
      setShowClearButton(true);
    };

    // Listen for console errors that might indicate cache issues
    const originalConsoleError = console.error;
    console.error = function(...args) {
      if (args.some(arg => 
        typeof arg === 'string' && (
          arg.includes('cache') ||
          arg.includes('firebase') ||
          arg.includes('firestore') ||
          arg.includes('ChunkLoadError') ||
          arg.includes('Loading chunk') ||
          arg.includes('Failed to fetch')
        )
      )) {
        setShowClearButton(true);
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
      clearInterval(interval);
      console.error = originalConsoleError;
    };
  }, [alwaysShow, showButton]);

  const clearAllCache = async () => {
    setIsClearing(true);
    
    try {
      console.log('CacheBuster: Starting complete cache clear...');
      
      // Clear ALL localStorage
      try {
        localStorage.clear();
        console.log('CacheBuster: LocalStorage cleared');
      } catch (e) {
        console.log('CacheBuster: LocalStorage clear error:', e);
      }
      
      // Clear ALL sessionStorage
      try {
        sessionStorage.clear();
        console.log('CacheBuster: SessionStorage cleared');
      } catch (e) {
        console.log('CacheBuster: SessionStorage clear error:', e);
      }
      
      // Clear ALL browser caches
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          console.log('CacheBuster: Found caches:', cacheNames);
          
          await Promise.all(
            cacheNames.map(async (cacheName) => {
              try {
                await caches.delete(cacheName);
                console.log('CacheBuster: Deleted cache:', cacheName);
              } catch (e) {
                console.log('CacheBuster: Error deleting cache:', cacheName, e);
              }
            })
          );
          console.log('CacheBuster: All caches cleared');
        } catch (e) {
          console.log('CacheBuster: Cache clearing error:', e);
        }
      }
      
      // Unregister ALL service workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          console.log('CacheBuster: Found service workers:', registrations.length);
          
          await Promise.all(
            registrations.map(async (registration) => {
              try {
                await registration.unregister();
                console.log('CacheBuster: Unregistered service worker:', registration.scope);
              } catch (e) {
                console.log('CacheBuster: Error unregistering service worker:', e);
              }
            })
          );
          console.log('CacheBuster: All service workers unregistered');
        } catch (e) {
          console.log('CacheBuster: Service worker unregistration error:', e);
        }
      }
      
      // Clear IndexedDB databases
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases?.() || [];
          console.log('CacheBuster: Found IndexedDB databases:', databases.length);
          
          databases.forEach(db => {
            if (db.name) {
              try {
                indexedDB.deleteDatabase(db.name);
                console.log('CacheBuster: Deleted IndexedDB:', db.name);
              } catch (e) {
                console.log('CacheBuster: Error deleting IndexedDB:', db.name, e);
              }
            }
          });
        } catch (e) {
          console.log('CacheBuster: IndexedDB clearing error:', e);
        }
      }
      
      // Clear Firebase specific storage
      try {
        const firebaseKeys = Object.keys(localStorage).filter(key => 
          key.includes('firebase') || 
          key.includes('firestore') || 
          key.includes('google') ||
          key.includes('auth')
        );
        firebaseKeys.forEach(key => {
          try {
            localStorage.removeItem(key);
            console.log('CacheBuster: Cleared Firebase key:', key);
          } catch (e) {
            console.log('CacheBuster: Error clearing Firebase key:', key, e);
          }
        });
      } catch (e) {
        console.log('CacheBuster: Firebase storage clearing error:', e);
      }
      
      // Add aggressive cache-busting parameters to URL
      const url = new URL(window.location);
      url.searchParams.set('_t', Date.now().toString());
      url.searchParams.set('_nocache', 'true');
      url.searchParams.set('_bust', Math.random().toString(36).substring(7));
      
      console.log('CacheBuster: Redirecting with cache-busted URL:', url.toString());
      
      // Hard reload with cache bypass
      window.location.href = url.toString();
      
    } catch (error) {
      console.error('CacheBuster: Error clearing cache:', error);
      
      // Fallback - just reload with timestamp
      const url = new URL(window.location);
      url.searchParams.set('_fallback', Date.now().toString());
      window.location.href = url.toString();
    }
  };

  if (!showClearButton) {
    return null;
  }

  return (
    <div className="cache-buster-container" style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 9999,
      backgroundColor: '#fff',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '2px solid #dc3545',
      maxWidth: '200px'
    }}>
      <div className="text-sm text-danger fw-bold mb-2">
        🚫 ZERO CACHE MODE
      </div>
      <div className="text-xs text-muted mb-2">
        Toate cache-urile sunt dezactivate. Datele vin direct de la server.
      </div>
      <button
        className="btn btn-sm btn-danger w-100"
        onClick={clearAllCache}
        disabled={isClearing}
        title="Șterge complet toate cache-urile și reîncarcă"
      >
        {isClearing ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Clearing...
          </>
        ) : (
          <>
            <i className="fas fa-trash me-1"></i>
            Force Clear All
          </>
        )}
      </button>
    </div>
  );
};

export default CacheBuster; 
"use client";

import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installPromptShown, setInstallPromptShown] = useState(false);

  useEffect(() => {
    // Verifică dacă aplicația rulează în mod standalone (instalată)
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);

      // Verifică conexiunea la internet
      setIsOnline(navigator.onLine);

      // Listener pentru schimbări în conexiune
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Listener pentru prompt-ul de instalare
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      // Listener pentru instalarea aplicației
      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        console.log('PWA: App was installed');
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Înregistrează service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      }

      // Cleanup
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      // Afișează prompt-ul de instalare
      deferredPrompt.prompt();
      
      // Așteaptă răspunsul utilizatorului
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        setInstallPromptShown(true);
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      // Resetează prompt-ul deferred
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA: Error installing app:', error);
      return false;
    }
  };

  const showInstallNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Portal IRP', {
        body: 'Instalează aplicația pentru acces rapid la documentele tale!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'install-prompt'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    showInstallNotification,
    requestNotificationPermission,
    installPromptShown
  };
}; 
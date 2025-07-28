"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import ScrollToTop from "@/components/common/ScrollTop";
import PWAInstallPrompt from "@/components/common/PWAInstallPrompt";
import "../public/assets/scss/index.scss";
import { AuthProvider } from "@/context/AuthContext";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  const libraries = ["places"];
  return (
    <html lang="ro">
      <head>
        {/* Basic Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="description" content="Portal IRP - Generator de documente BICP și Acreditări. Creează și gestionează documente administrative rapid și eficient." />
        <meta name="keywords" content="portal, irp, bicp, acreditari, documente, generator, administrare" />
        <meta name="author" content="Portal IRP" />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Portal IRP" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Portal IRP" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/png" sizes="512x512" href="/app-logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/app-logo-192.png" />
        <link rel="shortcut icon" href="/app-logo.png" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/app-logo-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/app-logo.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/app-logo-192.png" />
        
        {/* Splash Screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" sizes="2048x2732" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2224.jpg" sizes="1668x2224" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" sizes="1536x2048" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" sizes="1125x2436" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2208.jpg" sizes="1242x2208" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" sizes="750x1334" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.jpg" sizes="640x1136" />
        
        {/* External Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Nunito:400,400i,500,600,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />

        <title>Portal IRP - Generator Documente</title>
      </head>
      <body>
        <AuthProvider>
          <Provider store={store}>
            {children}
            <PWAInstallPrompt />
          </Provider>
        </AuthProvider>

        <ScrollToTop />
      </body>
    </html>
  );
}

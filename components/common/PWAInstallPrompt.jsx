"use client";

import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afișează prompt-ul după 10 secunde dacă aplicația poate fi instalată
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
        setShowPrompt(true);
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsVisible(false);
    // Salvează în localStorage că utilizatorul a respins prompt-ul
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`pwa-overlay ${isVisible ? 'visible' : ''}`}
        onClick={handleClose}
      />
      
      {/* Install Prompt */}
      <div className={`pwa-install-prompt ${isVisible ? 'visible' : ''}`}>
        <div className="pwa-content">
          {/* Header */}
          <div className="pwa-header">
            <div className="pwa-icon">
              📱
            </div>
            <button className="pwa-close" onClick={handleClose}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="pwa-body">
            <h3>Instalează Portal IRP</h3>
            <p>
              Generează documente BICP și acreditări direct de pe telefonul tău! 
              
            </p>
            
            <div className="pwa-features">
              <div className="pwa-feature">
                <span className="feature-icon">⚡</span>
                <span>Acces rapid</span>
              </div>
              <div className="pwa-feature">
                <span className="feature-icon">📱</span>
                <span>Experiență nativă mobilă</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pwa-actions">
            <button 
              className="btn-install"
              onClick={handleInstall}
            >
              <span className="install-icon">⬇️</span>
              Instalează acum
            </button>
            <button 
              className="btn-dismiss"
              onClick={handleDismiss}
            >
              Nu, mulțumesc
            </button>
          </div>
        </div>

        {/* Connection Status */}
        {!isOnline && (
          <div className="connection-status offline">
            📡 Offline - Aplicația funcționează și fără internet!
          </div>
        )}
      </div>

      <style jsx>{`
        .pwa-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .pwa-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        .pwa-install-prompt {
          position: fixed;
          bottom: -100%;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          max-width: 400px;
          width: 90%;
          transition: all 0.3s ease;
        }

        .pwa-install-prompt.visible {
          bottom: 0;
        }

        .pwa-content {
          padding: 24px;
        }

        .pwa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .pwa-icon {
          font-size: 32px;
        }

        .pwa-close {
          background: none;
          border: none;
          font-size: 18px;
          color: #6c757d;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pwa-close:hover {
          background: #f8f9fa;
        }

        .pwa-body h3 {
          margin: 0 0 8px 0;
          color: #343a40;
          font-size: 20px;
          font-weight: 600;
        }

        .pwa-body p {
          margin: 0 0 16px 0;
          color: #6c757d;
          line-height: 1.5;
        }

        .pwa-features {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .pwa-feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
          padding: 12px 8px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .feature-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .pwa-feature span:last-child {
          font-size: 12px;
          color: #6c757d;
          font-weight: 500;
        }

        .pwa-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-install {
          background: #007bff;
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .btn-install:hover {
          background: #0056b3;
        }

        .btn-dismiss {
          background: none;
          color: #6c757d;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-dismiss:hover {
          background: #f8f9fa;
        }

        .connection-status {
          padding: 12px 24px;
          text-align: center;
          font-size: 14px;
          background: #d4edda;
          color: #155724;
          border-radius: 0 0 16px 16px;
        }

        .connection-status.offline {
          background: #f8d7da;
          color: #721c24;
        }

        @media (max-width: 480px) {
          .pwa-install-prompt {
            width: 100%;
            border-radius: 16px 16px 0 0;
          }

          .pwa-features {
            flex-direction: column;
            gap: 8px;
          }

          .pwa-feature {
            flex-direction: row;
            text-align: left;
            gap: 12px;
          }

          .feature-icon {
            margin-bottom: 0;
          }
        }
      `}</style>
    </>
  );
};

export default PWAInstallPrompt; 
"use client";

import { usePWA } from '@/hooks/usePWA';

const PWAStatus = () => {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();

  return (
    <div className="pwa-status">
      {/* Connection Status */}
   
      {/* Install Button - only show if installable and not installed */}
      {isInstallable && !isInstalled && (
        <button 
          className="install-btn"
          onClick={installApp}
          title="Instalează aplicația"
        >
          <span className="install-icon">📱</span>
          <span className="install-text">Instalează</span>
        </button>
      )}



      <style jsx>{`
        .pwa-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .connection-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 500;
        }

        .connection-indicator.offline {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .connection-indicator.online {
          background: rgba(40, 167, 69, 0.2);
          border: 1px solid rgba(40, 167, 69, 0.3);
        }

        .status-icon {
          font-size: 8px;
        }

        .install-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border: none;
          border-radius: 12px;
          background: rgba(0, 123, 255, 0.2);
          border: 1px solid rgba(0, 123, 255, 0.3);
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .install-btn:hover {
          background: rgba(0, 123, 255, 0.3);
        }

        .installed-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          background: rgba(40, 167, 69, 0.2);
          border: 1px solid rgba(40, 167, 69, 0.3);
          color: white;
          font-weight: 500;
        }

        .install-icon,
        .installed-icon {
          font-size: 10px;
        }

        @media (max-width: 768px) {
          .install-text,
          .installed-text,
          .status-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PWAStatus; 
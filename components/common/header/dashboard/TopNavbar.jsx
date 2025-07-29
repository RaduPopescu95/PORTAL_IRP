"use client";

import Link from "next/link";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { authentication } from "@/firebase";
import ReactDOM from "react-dom";
import React from "react";
import PWAStatus from "@/components/common/PWAStatus";
import { 
  FaHome, 
  FaPlus, 
  FaList, 
  FaUserCheck, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaFileAlt,
  FaUser
} from 'react-icons/fa';
import "./modern-navbar.css";

// Componenta de overlay care acoperă tot ecranul
const LoadingOverlay = () => {
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 2s linear infinite",
            margin: "0 auto 20px auto",
          }}
        ></div>
        <div>Se încarcă...</div>
      </div>
    </div>,
    document.body
  );
};

const TopNavbar = ({ partenerId }) => {
  const { currentUser, userData, loading, isAdmin, isPowerAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { 
      id: 1, 
      name: "Panou Principal", 
      route: "/panou-principal", 
      icon: FaHome 
    },
    { 
      id: 2, 
      name: "Creaza BICP", 
      route: "/creaza-BICP", 
      icon: FaPlus 
    },
    { 
      id: 3, 
      name: "Lista BICP", 
      route: "/lista-BICP", 
      icon: FaList 
    },
 
  ];

  const handleLogoutClick = async () => {
    try {
      await handleLogout(authentication, router);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-overlay')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="top-navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="navbar-logo">
            <img src="/app-logo.png" alt="Portal IRP" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">Portal IRP</span>
              <span className="logo-subtitle">Dashboard</span>
            </div>
          </div>

          {/* Desktop Menu Items */}
          <div className="navbar-menu desktop-menu">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.route;
              
              return (
                <Link
                  key={item.id}
                  href={item.route}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                >
                  <IconComponent className="menu-icon" />
                  <span className="menu-text">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section - Desktop */}
          <div className="navbar-actions desktop-actions">
            <PWAStatus />
         
            <button onClick={handleLogoutClick} className="logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="mobile-toggle">
            <button onClick={toggleMobileMenu} className="toggle-btn">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="bottom-navbar">
        <div className="bottom-menu">
          {menuItems.slice(0, 4).map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.route;
            
            return (
              <Link
                key={item.id}
                href={item.route}
                className={`bottom-item ${isActive ? 'active' : ''}`}
              >
                <IconComponent className="bottom-icon" />
                <span className="bottom-text">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-menu">
            <div className="mobile-header">
              <div className="mobile-logo">
                <img src="/app-logo.png" alt="Portal IRP" className="mobile-logo-image" />
                <span className="mobile-logo-text">Portal IRP</span>
              </div>
              <button onClick={closeMobileMenu} className="close-btn">
                <FaTimes />
              </button>
            </div>
            
            <div className="mobile-menu-items">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.route;
                
                return (
                  <Link
                    key={item.id}
                    href={item.route}
                    className={`mobile-menu-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <IconComponent className="mobile-menu-icon" />
                    <span className="mobile-menu-text">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mobile-footer">
              <PWAStatus />
         
              <button onClick={handleLogoutClick} className="mobile-logout-btn">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavbar; 
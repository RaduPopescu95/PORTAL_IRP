"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaPlus,
  FaList,
  FaUserCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import PWAStatus from "@/components/common/PWAStatus";
import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/utils/authUtils";
import { authentication } from "@/firebase";
import "./modern-navbar.css";

const TopNavbar = ({ partenerId }) => {
  const { currentUser, userData } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu  = () => setIsMobileMenuOpen(false);

  // Helper pentru navigare explicită (fallback dacă Link nu declanșează)
  const navigate = (route) => {
    if (pathname !== route) router.push(route);
    closeMobileMenu();
  };

  /* ───────────────────────────────────────────────
     Închidem meniul mobil la click în afara lui
  ─────────────────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest(".mobile-menu")) {
        closeMobileMenu();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  /* ───────────────────────────────────────────────
     Închidem meniul mobil la schimbarea rutei
  ─────────────────────────────────────────────── */
  useEffect(closeMobileMenu, [pathname]);

  const menuItems = [
    { id: 1, name: "Crează BICP",     route: "/creaza-BICP",     icon: FaPlus },
    { id: 2, name: "Lista BICP",      route: "/lista-BICP",      icon: FaList },
    { id: 3, name: "Lista Acreditări",route: "/lista-acreditari",icon: FaUserCheck },
  ];

  /* ───────────────────────────────────────────────
     Logout
  ─────────────────────────────────────────────── */
  const handleLogoutClick = async () => {
    if (window.confirm("Sigur doriți să vă deconectați?")) {
      try {
        await handleLogout(authentication, router);
      } catch (err) {
        console.error("Logout failed:", err);
        alert("Eroare la deconectare. Vă rugăm să încercați din nou.");
      }
    }
  };

  return (
    <>
      {/* ░░ Desktop – Top Navbar ░░ */}
      <nav className="top-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <img src="/app-logo.png" alt="Portal IRP" className="logo-image" />
            <span className="logo-text">Portal IRP</span>
          </div>

          {/* Link‑urile principale */}
          <div className="navbar-menu desktop-menu">
            {menuItems.map(({ id, name, route, icon: Icon }) => (
              <Link
                key={id}
                href={route}
                onClick={() => navigate(route)}
                className={`menu-item ${pathname === route ? "active" : ""}`}
              >
                <Icon className="menu-icon" />
                <span className="menu-text">{name}</span>
              </Link>
            ))}
          </div>

          {/* Acțiuni: PWA, user, logout, burger */}
          <div className="navbar-actions desktop-actions">
            <PWAStatus />
            {currentUser && (
              <div className="user-info">
                <FaUser className="user-icon" />
                <span className="user-name">
                  {userData?.numeUtilizator || currentUser.email || "Utilizator"}
                </span>
              </div>
            )}
            <button onClick={handleLogoutClick} className="logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
            <button onClick={toggleMobileMenu} className="mobile-toggle">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* ░░ Mobile – Bottom Navbar ░░ */}
      <nav className="bottom-navbar">
        <div className="bottom-menu">
          {menuItems.slice(0, 4).map(({ id, name, route, icon: Icon }) => (
            <Link
              key={id}
              href={route}
              onClick={() => navigate(route)}
              className={`bottom-item ${pathname === route ? "active" : ""}`}
            >
              <Icon className="bottom-icon" />
              <span className="bottom-text">{name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ░░ Mobile – Overlay Menu ░░ */}
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
              {menuItems.map(({ id, name, route, icon: Icon }) => (
                <Link
                  key={id}
                  href={route}
                  onClick={() => navigate(route)}          // închidem meniul, lăsăm Link să navigheze
                  className={`mobile-menu-item ${pathname === route ? "active" : ""}`}
                >
                  <Icon className="mobile-menu-icon" />
                  <span className="mobile-menu-text">{name}</span>
                </Link>
              ))}
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

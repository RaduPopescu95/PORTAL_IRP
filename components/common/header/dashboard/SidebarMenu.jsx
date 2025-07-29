"use client";

import Link from "next/link";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { authentication } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import React from "react";
import PWAStatus from "@/components/common/PWAStatus";


// Componenta de overlay care acoperă tot ecranul
const LoadingOverlay = () => {
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "5px",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Se încarcă...
      </div>
    </div>,
    document.body
  );
};

const SidebarMenu = ({ partenerId }) => {
  const { currentUser, userData, loading, isAdmin, isPowerAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const manageAccount = [
    { id: 3, name: "Deconectare", route: "/signin", icon: "flaticon-logout" },
  ];

  useEffect(() => {
    // Dacă userul nu e logat, îl redirecționăm la /signin
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/signin");
      }
    });
    return unsubscribe;
  }, []);

  // Dacă încă se încarcă datele, afișăm overlay-ul de loading
  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <ul className="sidebar-menu">
        <li className="sidebar_header header">
          <div className="sidebar-logo-section">
            <div className="logo-container">
              <img 
                src="/app-logo.png" 
                alt="Portal IRP Logo" 
                className="sidebar-logo"
              />
              <div className="logo-text">
                <h3>Portal IRP</h3>
                <span>ISU Dashboard</span>
              </div>
            </div>
            <div className="pwa-status-container">
            <PWAStatus />
            </div>
          </div>
        </li>
        <li className="title">
          <ul>
            {/* Meniu vizibil oricărui utilizator logat */}
   

            <li
              className={`treeview ${
                isSinglePageActive("/", pathname) ? "active" : ""
              }`}
            >
              <Link href="/panou-principal">
                <i className="flaticon-layers"></i>
                <span>Panou Principal</span>
              </Link>
            </li>

            <li
              className={`treeview ${
                isSinglePageActive("/creaza-BICP", pathname) ? "active" : ""
              }`}
            >
              <Link href="/creaza-BICP">
                <i className="flaticon-plus"></i>
                <span>Creaza BICP</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/lista-BICP", pathname) ? "active" : ""
              }`}
            >
              <Link href="/lista-BICP">
                <i className="flaticon-layers"></i>
                <span>Lista BICP</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/creaza-acreditare", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/creaza-acreditare">
                <i className="flaticon-plus"></i>
                <span>Creaza acreditare</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/lista-acreditari", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/lista-acreditari">
                <i className="flaticon-layers"></i>
                <span>Lista Acreditari</span>
              </Link>
            </li>
       

            {/* Meniu pentru cont (logout etc.) */}
            {manageAccount.map((item) => (
              <li
                className={
                  isSinglePageActive(item.route, pathname) ? "active" : ""
                }
                key={item.id}
              >
                <Link
                  href={item.route}
                  onClick={async (e) => {
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      if (window.confirm("Sigur doriți să vă deconectați?")) {
                        try {
                          await handleLogout(authentication, router);
                        } catch (error) {
                          console.error("Logout failed:", error);
                          alert("Eroare la deconectare. Vă rugăm să încercați din nou.");
                        }
                      }
                    }
                  }}
                >
                  <i className={item.icon}></i> <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
};

export default SidebarMenu;

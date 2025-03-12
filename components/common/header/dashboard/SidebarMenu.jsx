"use client";

import Link from "next/link";
import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { authentication } from "@/firebase";
import ReactDOM from "react-dom";
import React from "react";

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


  // Dacă nu există userul, redirecționăm la signin
  if (!currentUser) {
    router.push("/signin");
   
  }

  if (!isAdmin && !isPowerAdmin) {
    router.push("/harta");
   
  }
  if (loading && !isAdmin && !isPowerAdmin &&  !currentUser) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <ul className="sidebar-menu">
        <li className="sidebar_header header"></li>
        <li className="title">
          <ul>
            {/* Meniu vizibil oricărui utilizator logat */}
            <li
              className={`treeview ${
                isSinglePageActive("/harta", pathname) ? "active" : ""
              }`}
            >
              <Link href="/harta">
                <i className="flaticon-maps-and-flags"></i>
                <span>Harta</span>
              </Link>
            </li>

            {(isAdmin || isPowerAdmin) && (
              <>
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
              </>
            )}

            {/* Link-uri afișate exclusiv pentru powerAdmin */}
            {currentUser.uid === "KWrwl5GFFjc5700GNgze5ki6Jsp1" && (
              <>
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
                <li
                  className={`treeview ${
                    isSinglePageActive(
                      "/adauga-solicitare-verbala",
                      pathname
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  <Link href="/adauga-solicitare-verbala">
                    <i className="flaticon-plus"></i>
                    <span>Adauga solicitare verbala</span>
                  </Link>
                </li>
                <li
                  className={`treeview ${
                    isSinglePageActive("/lista-solicitari-verbale", pathname)
                      ? "active"
                      : ""
                  }`}
                >
                  <Link href="/lista-solicitari-verbale">
                    <i className="flaticon-layers"></i>
                    <span>Lista solicitari verbale</span>
                  </Link>
                </li>
              </>
            )}

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
                  onClick={(e) => {
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      handleLogout();
                      router.push("/signin");
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

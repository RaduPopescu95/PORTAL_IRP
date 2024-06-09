"use client";

import Link from "next/link";

import {
  isParentPageActive,
  isSinglePageActive,
} from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { handleLogout } from "@/utils/authUtils";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const SidebarMenu = ({ partenerId }) => {
  const { currentUser, userData, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const myProperties = [
    { id: 1, name: "General Elements", route: "/my-properties" },
    { id: 2, name: "Advanced Elements", route: "/my-properties" },
    { id: 3, name: "Editors", route: "/my-properties" },
  ];
  const reviews = [
    { id: 1, name: "My Reviews", route: "/my-review" },
    { id: 2, name: "Visitor Reviews", route: "/my-review" },
  ];
  const manageAccount = [
    // {
    //   id: 1,
    //   name: "My Package",
    //   route: "/my-package",
    //   icon: "flaticon-box",
    // },
    // {
    //   id: 2,
    //   name: "Profil",
    //   route: "/profil-partener",
    //   icon: "flaticon-user",
    // },
    { id: 3, name: "Deconectare", route: "/signin", icon: "flaticon-logout" },
  ];

  useEffect(() => {
    console.log(currentUser);
    if (!currentUser) {
      router.push("/signin");
    }
  }, [loading]);

  return (
    <>
      <ul className="sidebar-menu">
        <li className="sidebar_header header"></li>
        {/* End header */}

        <li className="title">
          {/* <span>Main</span> */}
          <ul>
            {/* <li
              className={`treeview ${
                isSinglePageActive("/my-dashboard", pathname) ? "active" : ""
              }`}
            >
              <Link href="/panou-principal">
                <i className="flaticon-layers"></i>
                <span>Activitatea mea</span>
              </Link>
            </li> */}
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
                isSinglePageActive("/adauga-interventie", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/adauga-interventie">
                <i className="flaticon-plus"></i>
                <span>Adauga zi de interventie</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/adauga-solicitare-verbala", pathname)
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
                    // Prevenim comportamentul default al link-ului dacă este necesar
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      console.log(userData);
                      console.log(currentUser);
                      handleLogout();
                      router.push("/");
                    } else {
                      console.log("profile...");
                    }
                  }}
                >
                  <i className={item.icon}></i> <span>{item.name}</span>
                </Link>
              </li>
            ))}
            {/* <li
              className={`treeview ${
                isSinglePageActive("/creaza-produs-serviciu", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/creaza-produs-serviciu">
                <i className="flaticon-plus"></i>
                <span>Creaza Produs/serviciu</span>
              </Link>
            </li> */}

            {/* <li
              className={`treeview ${
                isSinglePageActive("/lista-produse-servicii", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/lista-produse-servicii">
                <i className="flaticon-layers"></i>
                <span>Lista produse/servicii</span>
              </Link>
            </li> */}
            {/* <li
              className={`treeview ${
                isSinglePageActive("/my-message", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-message">
                <i className="flaticon-envelope"></i>
                <span> Message</span>
              </Link>
            </li> */}
          </ul>
        </li>
        {/* End Main */}

        {/* <li className="title">
          <span>Manage Listings</span>
          <ul>
            <li
              className={`treeview ${
                isParentPageActive(myProperties, pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#my-property">
                <i className="flaticon-home"></i> <span>My Properties</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul className="treeview-menu collapse" id="my-property">
                {myProperties.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={`treeview ${
                isParentPageActive(reviews, pathname) ? "active" : ""
              }`}
            >
              <a data-bs-toggle="collapse" href="#review">
                <i className="flaticon-chat"></i>
                <span>Reviews</span>
                <i className="fa fa-angle-down pull-right"></i>
              </a>
              <ul className="treeview-menu collapse" id="review">
                {reviews.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li
              className={`treeview ${
                isSinglePageActive("/my-favourites", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-favourites">
                <i className="flaticon-magnifying-glass"></i>
                <span> My Favorites</span>
              </Link>
            </li>
            <li
              className={`treeview ${
                isSinglePageActive("/my-saved-search", pathname)
                  ? "active"
                  : ""
              }`}
            >
              <Link href="/my-saved-search">
                <i className="flaticon-magnifying-glass"></i>
                <span> Saved Search</span>
              </Link>
            </li>
          </ul>
        </li> */}

        {/* <li className="title">
          <span>Cont</span>
          <ul>
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
                    // Prevenim comportamentul default al link-ului dacă este necesar
                    if (item.name === "Deconectare") {
                      e.preventDefault();
                      console.log(userData);
                      console.log(currentUser);
                      handleLogout();
                      router.push("/");
                    } else {
                      console.log("profile...");
                    }
                  }}
                >
                  <i className={item.icon}></i> <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li> */}
      </ul>
    </>
  );
};

export default SidebarMenu;

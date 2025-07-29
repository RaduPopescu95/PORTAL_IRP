"use client";

import Link from "next/link";
import { isSinglePageActive } from "../../../../utils/daynamicNavigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/utils/authUtils";
import { authentication } from "@/firebase";

const MyAccount = () => {
  const { userData, currentUser } = useAuth();
  const pathname = usePathname();
  const profileMenuItems = [
    { id: 1, name: "Profil", ruterPath: "/profil-partener" },
    // { id: 2, name: " My Message", ruterPath: "/my-message" },
    // { id: 3, name: " My Favourite", ruterPath: "/my-favourites" },
    { id: 3, name: " Lista BICP", ruterPath: "/lista-BICP" },
    // { id: 4, name: " Lista produse", ruterPath: "/lista-produse-servicii" },
    { id: 5, name: "Deconectare", ruterPath: "/" },
  ];

  return (
    <>
      <div className="user_set_header">
        <Image
          width={40}
          height={40}
          className="float-start"
          src="/assets/images/team/e1.png"
          alt="e1.png"
        />
        <p>
          {userData?.denumireBrand} <br />
          <span className="address">{userData?.email}</span>
        </p>
      </div>
      {/* End user_set_header */}

      <div className="user_setting_content">
        {profileMenuItems.map((item) => (
          <Link
            href={item.ruterPath}
            key={item.id}
            className="dropdown-item"
            style={
              isSinglePageActive(`${item.ruterPath}`, pathname)
                ? { color: "#0000FF" }
                : undefined
            }
            onClick={async (e) => {
              // Prevenim comportamentul default al link-ului dacă este necesar
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
              } else {
                console.log("other...");
              }
            }}
          >
            {item?.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default MyAccount;

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMenuContent from "./HeaderMenuContent";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { userData, currentUser } = useAuth();
  const [navbar, setNavbar] = useState(false);
  const router = useRouter();

  const changeBackground = () => {
    if (window.scrollY >= 95) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    if (userData?.userType !== "Partener") {
      console.log("not partener...push to main page");
      // router.push("/");
    }
  }, []);

  return (
    <header
      className={`header-nav menu_style_home_one style2 navbar-scrolltofixed stricky main-menu  ${
        navbar ? "stricky-fixed " : ""
      }`}
    ></header>
    // {/* <!-- /.theme-main-menu --> */}
  );
};

export default Header;

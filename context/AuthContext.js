"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authentication } from "../firebase";
import { handleGetUserInfo } from "../utils/handleFirebaseQuery";
import { handleGetFirestore } from "@/utils/firestoreUtils";

// Eliminăm importurile pentru array-urile de administratori
// import { admins } from "@/data/administrareGrup";
// import { powerAdmins } from "@/data/powerAdminGrup";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [judete, setJudete] = useState([]);
  const [loading, setLoading] = useState(true);

  // Noile stări pentru roluri
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPowerAdmin, setIsPowerAdmin] = useState(false);

  const [isGuestUser, setIsGuestUser] = useState(false);
  const [searchQueryParteneri, setSearchQueryPateneri] = useState("");

  // Funcția pentru setarea guest user
  const setAsGuestUser = (isGuest) => {
    try {
      localStorage.setItem("isGuestUser", isGuest ? "true" : "false");
      setIsGuestUser(isGuest);
    } catch (e) {
      console.error("Failed to update isGuestUser in localStorage:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      console.log("🔐 AUTH STATE CHANGE:", {
        user: user ? "LOGGED IN" : "LOGGED OUT",
        uid: user?.uid,
        email: user?.email
      });
      
      // Setează currentUser IMEDIAT
      setCurrentUser(user);
      
      // Setează loading = false IMEDIAT după ce avem starea de auth
      // Nu așteptăm operațiile Firestore pentru roles
      setLoading(false);
      console.log("✅ AUTH LOADING COMPLETE - User state set");
      
      if (user) {
        try {
          const userDataFromFirestore = await handleGetUserInfo();
          setUserData(userDataFromFirestore);
          console.log("📊 USER DATA LOADED from Firestore");
        } catch (error) {
          console.error("❌ Failed to fetch user data:", error);
        }
      } else {
        // Curăță userData dacă nu e user logat
        setUserData(null);
        console.log("🧹 USER DATA CLEARED - user logged out");
      }

      // Verifică rolurile în background - nu blochează loading
      if (user?.uid) {
        try {
          // Presupunem că colecția de administratori se numește "Admins"
          const adminDocs = await handleGetFirestore("Admins");
          const isUserAdmin = adminDocs.some(
            (doc) => doc.uid === user.uid || doc.id === user.uid
          );
          console.log("🔑 isAdmin...", isUserAdmin)
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error("❌ Error checking admin status:", error);
          setIsAdmin(false);
        }

        try {
          // Presupunem că colecția de power administratori se numește "PowerAdmins"
          const powerAdminDocs = await handleGetFirestore("PowerAdmins");
          const isUserPowerAdmin = powerAdminDocs.some(
            (doc) => doc.uid === user.uid || doc.id === user.uid
          );
          console.log("👑 isPowerAdmin...", isUserPowerAdmin)
          setIsPowerAdmin(isUserPowerAdmin);
        } catch (error) {
          console.error("❌ Error checking power admin status:", error);
          setIsPowerAdmin(false);
        }
      } else {
        // Dacă nu e logat sau nu are uid
        setIsAdmin(false);
        setIsPowerAdmin(false);
        console.log("🚫 ROLES CLEARED - no user or uid");
      }

      // Încarcă judete în background
      try {
        const judeteRomania = await handleGetFirestore("Judete");
        setJudete(judeteRomania);
      } catch (error) {
        console.error("❌ Failed to fetch judete data in context auth:", error);
      }

      // Verifică guest user din localStorage
      try {
        const guestUserValue = localStorage.getItem("isGuestUser");
        setIsGuestUser(guestUserValue === "true");
      } catch (e) {
        console.error("❌ Failed to fetch isGuestUser from localStorage:", e);
        setIsGuestUser(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    judete,

    // Indicatori de rol
    isAdmin,
    isPowerAdmin,

    // Restul stărilor și funcțiilor
    isGuestUser,
    setAsGuestUser,
    setUserData,
    setCurrentUser,
    searchQueryParteneri,
    setSearchQueryPateneri,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

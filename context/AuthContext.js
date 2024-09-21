"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authentication } from "../firebase";
import { handleGetUserInfo } from "../utils/handleFirebaseQuery";
import { handleGetFirestore } from "@/utils/firestoreUtils";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [judete, setJudete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuestUser, setIsGuestUser] = useState(false); // Inițializat ca false
  const [searchQueryParteneri, setSearchQueryPateneri] = useState("");

  // Funcția pentru a seta utilizatorul ca guest user
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
      console.log("start use effect from auth context", user);
      if (user) {
        try {
          const userDataFromFirestore = await handleGetUserInfo();
          console.log(
            "user data fetched at onAuthStateChanged....",
            userDataFromFirestore
          );
          setUserData(userDataFromFirestore);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      setCurrentUser(user);

      try {
        const judeteRomania = await handleGetFirestore("Judete");
        setJudete(judeteRomania);
      } catch (error) {
        console.error("Failed to fetch judete data in context auth:", error);
      }

      try {
        const guestUserValue = localStorage.getItem("isGuestUser");
        // Setează isGuestUser ca true sau false bazat pe valoarea din localStorage
        // Dacă valoarea nu există, va rămâne setat ca false
        setIsGuestUser(guestUserValue === "true");
      } catch (e) {
        console.error("Failed to fetch isGuestUser from localStorage:", e);
        setIsGuestUser(false); // Setat ca false în cazul unei erori
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isGuestUser, // Includeți isGuestUser în context
    setAsGuestUser, // Expuși funcția prin context
    setUserData,
    setCurrentUser,
    judete,
    searchQueryParteneri,
    setSearchQueryPateneri,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

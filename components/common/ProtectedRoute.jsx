"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, requiredAuth = true }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Doar dacă nu se mai încarcă și este necesară autentificarea
    if (!loading && requiredAuth && !hasRedirected) {
      if (!currentUser) {
        // Utilizatorul nu este autentificat, redirecționează către login
        console.log("Utilizator neautentificat - redirecționare către /login");
        setHasRedirected(true);
        router.push("/login");
        return;
      }
    }
  }, [currentUser, loading, requiredAuth, router, hasRedirected]);

  // Reset redirect flag when user changes
  useEffect(() => {
    if (currentUser) {
      setHasRedirected(false);
    }
  }, [currentUser]);

  // Afișează loading în timpul verificării autentificării
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Se încarcă...</span>
        </div>
      </div>
    );
  }

  // Dacă nu e necesar auth sau utilizatorul este autentificat, afișează conținutul
  if (!requiredAuth || currentUser) {
    return children;
  }

  // În timpul redirecționării, afișează loading
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecționare...</span>
      </div>
    </div>
  );
};

export default ProtectedRoute; 
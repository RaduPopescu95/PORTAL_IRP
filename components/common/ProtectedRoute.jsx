"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, requiredAuth = true }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Doar dacă nu se mai încarcă și este necesară autentificarea
    if (!loading && requiredAuth) {
      if (!currentUser) {
        // Utilizatorul nu este autentificat, redirecționează către login
        console.log("Utilizator neautentificat - redirecționare către /login");
        router.push("/login");
        return;
      }
    }
  }, [currentUser, loading, requiredAuth, router]);

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
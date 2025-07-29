"use client";
import Form from "./Form";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const index = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Dacă utilizatorul este deja autentificat, redirecționează către lista-BICP
    if (!loading && currentUser) {
      console.log("Utilizator deja autentificat - redirecționare către /lista-BICP");
      router.push("/lista-BICP");
    }
  }, [currentUser, loading, router]);

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

  // Dacă utilizatorul este autentificat, nu afișa pagina de register
  if (currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Redirecționare...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <!-- Simple Register Page - No Header/Footer --> */}
      <section 
        className="our-log bgc-fa min-vh-100 d-flex align-items-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "100vh"
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-12 col-lg-6 col-xl-5">
              <div 
                className="login_form inner_page"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  padding: "40px",
                  border: "none"
                }}
              >
                <Form />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default index;

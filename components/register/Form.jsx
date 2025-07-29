"use client";
import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authentication } from "@/firebase";
import { useRouter } from "next/navigation";

const Form = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validări
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Trebuie să accepți termenii și condițiile.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(authentication, email, password);
      // Redirecționează către lista-BICP după înregistrare
      router.push("/lista-BICP");
    } catch (error) {
      console.error("Eroare la înregistrare:", error);
      setError("Eroare la înregistrare. Verifică datele introduse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="heading text-center">
        <h3>Creează un cont nou</h3>
        <p className="text-center">
          Ai deja un cont?{" "}
          <Link href="/login" className="text-thm">
            Conectează-te
          </Link>
        </p>
      </div>
      {/* End .heading */}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-group input-group ">
        <input
          type="text"
          className="form-control"
          required
          placeholder="Nume utilizator"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={loading}
        />
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="flaticon-user"></i>
          </div>
        </div>
      </div>
      {/* End .form-group */}

      <div className="form-group input-group  ">
        <input
          type="email"
          className="form-control"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="fa fa-envelope-o"></i>
          </div>
        </div>
      </div>
      {/* End .form-group */}

      <div className="form-group input-group  ">
        <input
          type="password"
          className="form-control"
          required
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="flaticon-password"></i>
          </div>
        </div>
      </div>
      {/* End .form-group */}

      <div className="form-group input-group  ">
        <input
          type="password"
          className="form-control"
          required
          placeholder="Confirmă parola"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="flaticon-password"></i>
          </div>
        </div>
      </div>
      {/* End .form-group */}

      <div className="form-group form-check custom-checkbox mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          required
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          disabled={loading}
        />
        <label className="form-check-label form-check-label" htmlFor="terms">
          Am citit și accept Termenii și Politica de Confidențialitate
        </label>
      </div>
      {/* End .form-group */}

      <button 
        type="submit" 
        className="btn btn-log w-100 btn-thm"
        disabled={loading}
      >
        {loading ? "Se înregistrează..." : "Înregistrează-te"}
      </button>
      {/* register button */}
    </form>
  );
};

export default Form;

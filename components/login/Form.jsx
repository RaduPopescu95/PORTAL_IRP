"use client";
import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "@/firebase";
import { useRouter } from "next/navigation";

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(authentication, email, password);
      // Redirecționează către lista-BICP după login
      router.push("/lista-BICP");
    } catch (error) {
      console.error("Eroare la autentificare:", error);
      setError("Email sau parolă incorectă.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <div className="heading text-center">
        <h3>Autentificare în cont</h3>
        <p className="text-center">
          Nu ai un cont?{" "}
          <Link href="/register" className="text-thm">
            Înregistrează-te!
          </Link>
        </p>
      </div> */}
      {/* End .heading */}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="input-group mb-2 mr-sm-2">
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
            <i className="flaticon-user"></i>
          </div>
        </div>
      </div>
      {/* End .input-group */}

      <div className="input-group form-group">
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
      {/* End .input-group */}

      <div className="form-group form-check custom-checkbox mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="remeberMe"
        />
        <label
          className="form-check-label form-check-label"
          htmlFor="remeberMe"
        >
          Ține-mă minte
        </label>

        <a className="btn-fpswd float-end" href="#">
          Ai uitat parola?
        </a>
      </div>
      {/* End .form-group */}

      <button 
        type="submit" 
        className="btn btn-log w-100 btn-thm"
        disabled={loading}
      >
        {loading ? "Se conectează..." : "Conectează-te"}
      </button>
      {/* login button */}
    </form>
  );
};

export default Form;

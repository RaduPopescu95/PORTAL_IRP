"use client";

import { useAuth } from "@/context/AuthContext";
import { authentication } from "@/firebase";
import { handleSignIn } from "@/utils/authUtils";
import { useRouter } from "next/navigation"; // Aici ar trebui să fie "next/router", nu "next/navigation"
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Importăm icon-urile de la react-icons

const Form = () => {
  // Stări locale pentru email, parolă, eroare și vizibilitatea parolei
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Stare pentru a comuta tipul input-ului
  const { setCurrentUser } = useAuth();
  const router = useRouter();

  // Funcție pentru a gestiona trimiterea formularului
  const handleSubmit = (event) => {
    event.preventDefault();

    handleSignIn(email, password)
      .then((userCredentials) => {
        console.log("user credentials...", userCredentials);
        setCurrentUser(userCredentials);
        router.push("/panou-principal");
      })
      .catch((error) => {
        console.error("Error during sign in:", error.message);
        setError("Failed to log in. Error message: " + error.message);
      });
  };

  return (
    <form action="#" onSubmit={handleSubmit}>
      <div className="heading text-center">
        <h3>Autentificare</h3>
      </div>
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
        />
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="flaticon-user"></i>
          </div>
        </div>
      </div>
      <div className="input-group form-group">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="input-group-prepend">
          <div
            className="input-group-text"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-log w-100 btn-thm">
        Autentificare
      </button>
    </form>
  );
};

export default Form;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import "./loginform.css";

function LoginForm() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Vous êtes bien connecté 🎉");
        localStorage.setItem("isLoggedIn", "true");
        login();
        navigate("/", { state: { isLoggedIn: true } });
      } else {
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setMessage("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="login-container">
      <h2>Se connecter</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Se connecter
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./loginform.css";

// ✅ Vite env + fallback sécurisé
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.nataliagoja.com/api";

const BACKEND_URL = `${BASE_URL}/auth`;

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
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // ✅ sécurise la réponse (évite crash JSON)
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Réponse serveur invalide");
      }

      // ❌ gestion erreur backend
      if (!response.ok) {
        setMessage(data.error || "Erreur de connexion");
        return;
      }

      // ✅ success
      setMessage(data.message || "Vous êtes bien connecté 🎉");
      localStorage.setItem("isLoggedIn", "true");
      login();
      navigate("/", { state: { isLoggedIn: true } });
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setMessage(err.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <div className="login-container">
      <h2>Se connecter</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            required
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
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

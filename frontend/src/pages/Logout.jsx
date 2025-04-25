import { useNavigate } from "react-router-dom";
import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  }, [logout, navigate]);

  return <div>Vous êtes déconnecté, redirection en cours...</div>;
}

export default Logout;

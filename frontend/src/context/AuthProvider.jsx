import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };
  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

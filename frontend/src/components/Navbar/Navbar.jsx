import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="menu-link">
          Accueil
        </Link>
        <Link to="/portfolio" className="menu-link">
          Portfolio
        </Link>
      </div>

      <Link to="/">
        <h1 className="logo">Natalia Godon Jamiolowska</h1>
        <p className="logo-subtitle">Photographe</p>
      </Link>

      <div className="nav-right">
        <Link to="/About" className="menu-link">
          À propos
        </Link>
        <Link to="/Contact" className="menu-link">
          Contact
        </Link>

        {isLoggedIn ? (
          <Link to="/logout" className="menu-link">
            Logout
          </Link>
        ) : (
          <Link to="/login" className="menu-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

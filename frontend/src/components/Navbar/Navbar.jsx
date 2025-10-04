import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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

      <Link to="/" className="logo-container">
        <h1 className="logo">Natalia Goja</h1>
      </Link>

      <div className="nav-right">
        <Link to="/MyOffers" className="menu-link">
          Tarifs
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

      {/* Mobile menu */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <Link to="/" className="menu-link" onClick={() => setIsOpen(false)}>
          Accueil
        </Link>
        <Link
          to="/portfolio"
          className="menu-link"
          onClick={() => setIsOpen(false)}
        >
          Portfolio
        </Link>
        <Link
          to="/About"
          className="menu-link"
          onClick={() => setIsOpen(false)}
        >
          À propos
        </Link>
        <Link
          to="/Contact"
          className="menu-link"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>
        {isLoggedIn ? (
          <Link
            to="/logout"
            className="menu-link"
            onClick={() => setIsOpen(false)}
          >
            Logout
          </Link>
        ) : (
          <Link
            to="/login"
            className="menu-link"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        )}
      </div>

      <div className="burger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </nav>
  );
}

export default Navbar;

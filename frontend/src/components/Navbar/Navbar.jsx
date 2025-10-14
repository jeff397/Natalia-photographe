import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.css";

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // menu mobile
  const [offersOpen, setOffersOpen] = useState(false); // dropdown mobile

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleOffers = () => setOffersOpen(!offersOpen);

  return (
    <nav className="nav">
      {/* Menu gauche desktop */}
      <div className="nav-left">
        <Link to="/" className="menu-link">
          Accueil
        </Link>
        <Link to="/portfolio" className="menu-link">
          Portfolio
        </Link>
      </div>

      {/* Logo */}
      <Link to="/" className="logo-container">
        <h1 className="logo">Natalia GoJa</h1>
      </Link>

      {/* Menu droit desktop */}
      <div className="nav-right">
        {/* Offres desktop */}
        <div
          className={`offers-container ${offersOpen ? "active" : ""}`}
          onMouseEnter={() => setOffersOpen(true)}
          onMouseLeave={() => setOffersOpen(false)}
        >
          <div className="menu-link offers-link" onClick={toggleOffers}>
            Offres
          </div>
          <div className="dropdown">
            <Link to="/photo-events" className="dropdown-link">
              Célébrations familiales & amicales
            </Link>
            <Link to="/portraits" className="dropdown-link">
              Portraits & sessions privées
            </Link>
            <Link to="/reporting" className="dropdown-link">
              Reportages
            </Link>
          </div>
        </div>

        <Link to="/Contact" className="menu-link">
          Contact
        </Link>

        {isLoggedIn ? (
          <span className="menu-link" onClick={logout}>
            Logout
          </span>
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

        {/* Offres mobile */}
        <div className="menu-link offers-link" onClick={toggleOffers}>
          Offres
          {offersOpen && (
            <div className="dropdown">
              <Link
                to="/photo-events"
                className="dropdown-link"
                onClick={() => setIsOpen(false)}
              >
                Célébrations familiales & amicales
              </Link>
              <Link
                to="/portraits"
                className="dropdown-link"
                onClick={() => setIsOpen(false)}
              >
                Portraits & sessions privées
              </Link>
              <Link
                to="/reporting"
                className="dropdown-link"
                onClick={() => setIsOpen(false)}
              >
                Reportages
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/Contact"
          className="menu-link"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>

        {isLoggedIn ? (
          <span
            className="menu-link"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            Logout
          </span>
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

      {/* Burger */}
      <div className="burger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </nav>
  );
}

export default Navbar;

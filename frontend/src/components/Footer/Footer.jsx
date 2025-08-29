import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <a href="#">Accueil</a>
          <a href="#">À propos</a>
          <a href="#">Contact</a>
        </div>

        <div className="social-icons">
          <a href="#" aria-label="Facebook">
            F
          </a>
          <a href="#" aria-label="Instagram">
            I
          </a>
          <a href="#" aria-label="LinkedIn">
            L
          </a>
        </div>

        <div className="footer-bottom">
          &copy; 2025 MonSite. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

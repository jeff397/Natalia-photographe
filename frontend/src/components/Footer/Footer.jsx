import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebookF } from "react-icons/fa"; // import icônes
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/">Accueil</Link>
          <Link to="/offers">Offres</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="social-icons">
          <a
            href="https://www.instagram.com/natalia.goja.photo/ "
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/natalia-godon-jamio%C5%82kowska/ "
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>

        <div className="footer-bottom">
          &copy; 2025 -{" "}
          <a
            href="https://portfolio-8awh.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            site créé par Delmotte Jean-François
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

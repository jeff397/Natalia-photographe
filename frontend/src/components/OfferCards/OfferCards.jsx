import React, { useState } from "react";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import "./offerCards.css";

const BACKEND_URL = "http://localhost:5000";

function OfferCards() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const offers = [
    {
      title: (
        <>
          Célébrations familiales
          <br />
          <span className="amp">&</span> amicales
        </>
      ),
      path: "/photo-events",
    },
    {
      title: (
        <>
          Portraits <span className="amp">&</span> sessions privées
        </>
      ),
      path: "/portraits",
    },
    {
      title: "Reportages",
      path: "/reporting",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const res = await axios.post(`${BACKEND_URL}/api/private-users/login`, {
        username,
        password,
      });
      const galleryId = res.data.galleryId;
      navigate(`/galerie-privee/${galleryId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur connexion");
    }
  };

  return (
    <div className="offer-cards">
      <h2 className="offer-cards-title">Mon offre</h2>

      <div className="cards-container">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="offer-card-header">
              <h3>{offer.title}</h3>
            </div>
            <Link to={offer.path} className="modern-button">
              En savoir plus
            </Link>
          </div>
        ))}

        {/* ---- Nouvelle carte Galerie privée ---- */}
        <div className="offer-card">
          <div className="offer-card-header">
            <h3>Galerie privée</h3>
          </div>

          {!showForm ? (
            <button className="modern-button" onClick={() => setShowForm(true)}>
              Accéder
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="private-gallery-form">
              <input
                type="text"
                placeholder="Identifiant client"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="modern-button">
                Valider
              </button>
              <button
                type="button"
                className="modern-button"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfferCards;

import React from "react";
import { Link } from "react-router-dom";
import "./offerCards.css";

function OfferCards() {
  const offers = [
    {
      title: "Célébrations familiales et amicales ",
      description: "Célébrons ce moment avec des photos inoubliables.",
      path: "/photo-events",
    },
    {
      title: "Portraits & sessions privées",
      description: "Capturons la joie et les sourires de vos proches.",
      path: "/portraits",
    },
    {
      title: "Reportage",
      description: "Derrière chaque cliché, une histoire vraie qui murmure.",
      path: "/reporting",
    },
  ];

  return (
    <div className="offer-cards">
      <h2 className="offer-cards-title">Mon offre</h2>
      <div className="cards-container">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <div className="offer-card-header">
              <h3>{offer.title}</h3>
            </div>
            <p className="offer-card-description">{offer.description}</p>
            <Link to={offer.path} className="modern-button">
              En savoir plus
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfferCards;

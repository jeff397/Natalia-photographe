import React from "react";
import { Link } from "react-router-dom";
import "./offerCards.css";

function OfferCards() {
  const offers = [
    {
      title: "Célébrations familiales et amicales ",
      path: "/photo-events",
    },
    {
      title: "Portraits & sessions privées",
      path: "/portraits",
    },
    {
      title: "Reportage",
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

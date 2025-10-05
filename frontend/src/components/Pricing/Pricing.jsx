import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pricing.css";

const Card = ({ title, image, backContent, price }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`card ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="card-inner">
        {/* Face avant */}
        <div className="card-front">
          <img src={image} alt={title} className="card-image" />
          <h2>{title}</h2>
        </div>

        {/* Face arrière */}
        <div className="card-back">
          {/* 🟢 Remplacer <p> par <div> ici */}
          <div className="card-content">{backContent}</div>

          <p className="price">{price}</p>

          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/contact");
            }}
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Pricing() {
  return (
    <div className="pricing-container">
      <Card
        title="Célébrations familiales et amicales"
        image="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&auto=format&fit=crop&w=400&q=80"
        backContent={
          <>
            <p>2h de présence</p>
            <p>80 à 120 photos soigneusement éditées</p>
            <p>Galerie privée en ligne</p>
          </>
        }
        price="180€"
      />

      <Card
        title="Portraits & sessions privées"
        image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?crop=entropy&auto=format&fit=crop&w=400&q=80"
        backContent={
          <>
            <p>1h30 de présence</p>
            <p>Minimum 50 photos soigneusement éditées</p>
            <p>Galerie privée en ligne</p>
          </>
        }
        price="À partir de 150€"
      />

      <Card
        title="Reportage"
        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
        backContent="Événements, entreprises, projets… Nous racontons votre histoire en images."
        price="Sur devis"
      />
    </div>
  );
}

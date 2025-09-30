import React from "react";
import "./introducing.css";

function Introducing() {
  return (
    <section className="presentation" aria-labelledby="presentation-title">
      <div className="presentation-content">
        <div className="presentation-image-container">
          <img
            src="/assets/images/Natalia.webp"
            alt="Portrait de Natalia Godon-Jamiołkowska, photographe freelance à Lille"
            className="presentation-image"
          />
        </div>

        <div className="presentation-text">
          <h1 id="presentation-title">
            Natalia Godon-Jamiołkowska – Photographe freelance à Lille
          </h1>

          <p>
            Bonjour ! Je m'appelle Natalia, photographe professionnelle vivant à
            Lille. Je capture vos portraits, vos événements familiaux et réalise
            des reportages pour mettre en valeur les histoires qui vous tiennent
            à cœur. Mon approche mêle sensibilité et spontanéité afin de
            préserver la lumière, les émotions et l’authenticité de chaque
            instant. Installée dans le Nord depuis 9 ans, je travaille avec des
            particuliers comme avec des associations et des entreprises, en
            français, polonais, anglais ou espagnol. Toujours à vélo, je me
            déplace dans Lille et ses environs pour immortaliser vos moments les
            plus précieux. Envie de créer ensemble vos souvenirs en images ?
            Contactez-moi pour réserver votre séance ou discuter de votre
            projet.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Introducing;

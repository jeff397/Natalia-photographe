import React from "react";
import "./introducing.css";

function Introducing() {
  return (
    <section className="presentation" aria-labelledby="presentation-title">
      <div className="presentation-content">
        <div className="presentation-image-container">
          <img
            src="/assets/images/Natalia.webp"
            alt="Portrait de Natalia Godon-Jamiolowska, photographe freelance à Lille"
            className="presentation-image"
          />
        </div>

        <div className="presentation-text">
          <h1 id="presentation-title">
            Natalia Godon-Jamiolowska – Photographe freelance à Lille
          </h1>

          <p>
            Bonjour ! Je m'appelle Natalia et je suis photographe
            professionnelle basée à Lille. Je capture des portraits, des
            événements et des moments uniques pour vous offrir des souvenirs
            inoubliables.
          </p>

          <h2>Ma passion pour la photographie</h2>
          <p>
            La photographie est pour moi bien plus qu’un métier : c’est une
            passion que je nourris depuis toujours. Mon appareil est mon fidèle
            compagnon pour immortaliser la lumière, les émotions et les instants
            précieux autour de moi.
          </p>

          <h2>À propos de moi</h2>
          <p>
            💬 Je suis polonaise et installée dans le Nord depuis 8 ans. Je
            parle polonais, français, anglais et espagnol, et j’adore partager
            ma passion de la photographie avec un public international. 🍲📚 En
            dehors de mon appareil photo, j’aime découvrir les cultures, les
            cuisines, faire des balades, des puzzles et jouer à des jeux de
            société. Je me déplace partout à vélo dans Lille et ses environs,
            prête à capturer vos moments les plus précieux.
          </p>

          <h3>Contactez-moi</h3>
          <p>
            Prêt à créer ensemble vos souvenirs en images ? N’hésitez pas à me
            contacter pour réserver votre séance ou pour en savoir plus sur mes
            prestations.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Introducing;

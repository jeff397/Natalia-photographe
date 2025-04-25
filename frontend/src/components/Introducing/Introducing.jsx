import React from "react";
import "./introducing.css";
import presentationImage from "../../assets/images/Natalia.webp";

function Introducing() {
  return (
    <section className="presentation">
      <div className="presentation-content">
        <div className="presentation-image-container">
          <img
            src={presentationImage}
            alt="Photo de présentation"
            className="presentation-image"
          />
        </div>

        <div className="presentation-text">
          <h2>Natalia Godon-Jamiolowska, photographe freelance à Lille</h2>
          <p>
            Je suis photographe autodidacte et polyvalent avec une passion pour
            le photoreportage. Ces dernières années, j’ai eu la chance de
            collaborer avec des personnes exceptionnelles grâce auxquelles j’ai
            pu devenir l’homme et le photographe que je suis aujourd’hui. J’ai
            depuis développé une vision de la photographie qui privilégie
            l’aspect humain et l'authenticité, conscient de l’importance
            d’encapsuler une émotion ou un instant éphémère. Ma polyvalence et
            mon goût du challenge me permettent d’avoir un champ de compétence
            assez large couvrant la photographie d’entreprise - corporate,
            packshot et reportage - mais aussi un aspect plus intimiste
            notamment pour les mariages, portraits ou sessions privées.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Introducing;

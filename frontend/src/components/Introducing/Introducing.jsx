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
            Bonjour ! Je m'appelle Natalia et je suis photographe. Ce mot, ce
            métier, cette passion… je crois qu’ils me décrivent depuis toujours.
            Mais je n’ai pas toujours osé le dire. J’ai toujours les yeux grands
            ouverts — à la recherche de jolis reflets de lumière, d’une belle
            composition. Mon appareil photo m’accompagne comme un fidèle ami.
            Depuis longtemps, je photographie ma famille, mes amis, les
            événements autour de moi… pour le plaisir, pour soutenir, pour
            capturer. C’est dans mon ADN. Et vous savez quoi ? Aujourd’hui, j’ai
            envie de partager cette passion du regard avec vous. De vous offrir
            de belles sessions pour immortaliser vos proches, ou vous-mêmes —
            pour garder en image des instants précieux. Quand je repense aux
            souvenirs que j’ai pu créer pour d’autres, je n’ai qu’une envie :
            vous rencontrer à votre tour !
          </p>
          <p>
            💬 Un peu plus sur moi ? Je suis polonaise, installée dans le Nord
            depuis 8 ans. Je parle polonais, mais aussi français, anglais et
            espagnol — et je suis passionnée par l’interculturalité. C’est avec
            grand plaisir que je propose des séances pour un public
            international, dans la langue qui vous met à l’aise. 🍲📚 J’aime
            découvrir les gens et les cuisines du monde, lire, faire des
            balades, des puzzles, et jouer à des jeux de société (en ce moment
            je suis à fond sur Wingspan 🐦). Et bien sûr, je me déplace partout
            à vélo dans Lille et ses environs — appareil à l’épaule, prête à
            capter vos moments. À très bientôt pour écrire ensemble vos
            histoires en images ❤️
          </p>
        </div>
      </div>
    </section>
  );
}

export default Introducing;

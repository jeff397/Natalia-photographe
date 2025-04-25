import AboutMeImage from "../../assets/images/aboutMeImage.webp";
import "./aboutMe.css";

function AboutMe() {
  return (
    <section className="aboutme">
      <div className="aboutme-content">
        <div className="aboutme-image">
          <img
            src={AboutMeImage}
            alt="Photo de présentation"
            className="about-image"
          />
        </div>
        <div className="aboutme-text">
          <p>
            Depuis toujours, j’ai le regard attiré par la lumière, les détails,
            les émotions. Après plusieurs années à explorer la photo en
            autodidacte, j’ai décidé d’en faire mon métier. Aujourd’hui, je
            capture des instants vrais, des regards complices, des lieux chargés
            d’histoires. Je travaille principalement dans les domaines du
            portrait / reportage / paysage / mariage, avec une approche
            naturelle et sensible. Mon but : raconter des histoires à travers
            l’image, sans artifices, avec sincérité. Ce que j’aime par-dessus
            tout, c’est créer une connexion avec les personnes que je
            photographie. Mettre à l’aise, observer, attendre le bon moment…
            C’est dans la spontanéité que naissent les plus belles images. Basée
            à Lille, je me déplace avec plaisir partout en France (et ailleurs
            !) pour vos projets. Quand je ne suis pas derrière l’objectif, tu me
            trouveras probablement en train d’explorer la nature, de chiner de
            vieux appareils photo ou de boire un café en terrasse, carnet à la
            main. Vous avez un projet en tête ? Envie de me parler de votre idée
            ? N’hésitez pas à me contacter, je serais ravie d’en discuter avec
            vous !
          </p>
          <div className="quote">"Voir l’extraordinaire dans l’ordinaire."</div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;

import OfferCards from "../OfferCards/OfferCards";
import photoServiceBackground from "../../assets/images/photoServiceBackground.webp";
import "./photoService.css";

function PhotoService() {
  return (
    <section
      className="Photoservice"
      style={{
        backgroundImage: `url(${photoServiceBackground})`,
      }}
    >
      <h2 className="Photoservice-title">
        Les histoires écrites avec la lumière
      </h2>
      <p className="Photoservice-txt">
        Ce qui compte pour moi, c’est de m’immerger dans le moment présent à vos
        côtés. Plus photographe de terrain que de studio, je privilégie la
        spontanéité aux poses figées pour transformer vos instants uniques en
        souvenirs intemporels ou en images porteuses de sens. Mariage, baptême,
        anniversaire, événement familial ou reportage de vos activités : chaque
        photo devient un langage visuel qui raconte votre histoire avec
        authenticité.
      </p>
      <OfferCards />
    </section>
  );
}

export default PhotoService;

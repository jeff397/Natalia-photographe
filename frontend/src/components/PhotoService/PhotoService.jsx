import backgroundImage from "../../assets/images/photoservicebackground.webp";
import OfferCards from "../OfferCards/OfferCards";

import "./PhotoService.css";

function PhotoService() {
  return (
    <section
      className="Photoservice"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h2 className="Photoservice-title">Vos moments précieux</h2>
      <p className="Photoservice-txt">
        Chaque instant mérite d’être raconté. Qu’il s’agisse d’un mariage rempli
        d’émotions, d’un baptême tout en douceur, d’un anniversaire haut en
        couleurs ou d’un événement familial soigné, je suis là pour capturer ces
        moments uniques et en faire des souvenirs éternels. Mon objectif :
        saisir l’authenticité de vos histoires, là où elles se vivent.
      </p>
      <OfferCards />
    </section>
  );
}

export default PhotoService;

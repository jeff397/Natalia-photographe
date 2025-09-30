import { Link } from "react-router-dom";
import { ReportingList } from "../../Data/ReportingList";
import "./reportingMenu.css";

const ReportingMenu = () => {
  return (
    <section className="reporting-menu">
      <div className="reporting-intro">
        <p>
          Au-delà des sessions privées et des célébrations, je réalise des
          reportages pour des événements, des associations, des projets
          commerciaux, mais aussi pour raconter des histoires qui me tiennent à
          cœur. La photographie est un langage visuel : elle permet de traduire
          ce que les mots ne peuvent pas toujours exprimer, de nous faire
          voyager, rencontrer des personnes et ressentir des émotions, même à
          distance. Je vous présente ici mes reportages réalisés lors de
          prestations, de voyages ou de projets personnels : des instants, des
          regards, des gestes et des sentiments capturés pour vous faire vivre
          ces moments et rencontrer ces univers. Je suis également disponible
          pour couvrir votre événement ou raconter votre histoire à travers ce
          langage visuel unique. N’hésitez pas à me contacter pour en discuter !
        </p>
      </div>

      <div className="reporting-list">
        {ReportingList.map((item) => (
          <Link
            to={`/reporting/${item.id}`}
            key={item.id}
            className="reporting-card"
          >
            <img src={item.cover} alt={item.title} />
            <div className="title-overlay">
              <h2>{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReportingMenu;

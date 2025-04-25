import { Link } from "react-router-dom";
import { ReportingList } from "../../Data/ReportingList";
import "./reportingMenu.css";

const ReportingMenu = () => {
  return (
    <section className="reporting-menu">
      <div className="reporting-intro">
        <h1>Regards du monde</h1>
        <p>
          Le photo-reportage, c’est un battement de cœur capturé. C’est le chaos
          rendu beau, le quotidien élevé à l’état d’art. Là où le regard
          s’arrête, l’objectif continue. Il documente, il révèle, il raconte —
          sans bruit, mais avec force.
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

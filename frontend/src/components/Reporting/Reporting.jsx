import React from "react";
import { useParams } from "react-router-dom";
import { slugify } from "../../utils/slugify";

const Reporting = ({ reportings }) => {
  const { slug } = useParams();

  if (!reportings || reportings.length === 0) {
    return <p>Chargement du reportage...</p>;
  }

  const reporting = reportings.find((r) => slugify(r.title) === slug);

  if (!reporting) return <p>Reportage non trouvé</p>;

  return (
    <div>
      <h1>{reporting.title}</h1>
      <img src={reporting.cover} alt={reporting.title} />
      <p>{reporting.description}</p>
    </div>
  );
};

export default Reporting;

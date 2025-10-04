// ReportingDetail.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import ReportingEditor from "../components/ReportingEditor/ReportingEditor";

const ReportingDetail = ({ reportings, isLoggedIn }) => {
  const location = useLocation();

  // On récupère le titre depuis la vignette ou fallback
  const initialTitle = location.state?.title || "Nouveau reportage";

  // On récupère le reporting existant si déjà créé
  const reporting = reportings?.find(
    (r) => r._id === location.state?.id || r.title === initialTitle
  );

  return (
    <div className="reporting-details-page">
      <ReportingEditor
        initialReporting={reporting}
        title={initialTitle}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default ReportingDetail;

import { useParams } from "react-router-dom";
import { ReportingList } from "../Data/ReportingList";
import ReportingGallery from "../components/ReportingGallery/ReportingGallery";

const ReportingDetail = () => {
  const { id } = useParams();
  const reporting = ReportingList.find((r) => r.id === id);

  if (!reporting) return <p>Reportage introuvable</p>;

  return (
    <div className="reporting-detail">
      <h1>{reporting.title}</h1>
      <ReportingGallery images={reporting.images} />
    </div>
  );
};

export default ReportingDetail;

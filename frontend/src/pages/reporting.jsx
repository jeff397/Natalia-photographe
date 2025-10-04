import ReportingHeader from "../components/ReportingHeader/ReportingHeader";
import ReportingMenu from "../components/ReportingMenu/ReportingMenu";

const Reporting = ({ isLoggedIn }) => {
  return (
    <>
      <ReportingHeader />
      <ReportingMenu isLoggedIn={isLoggedIn} />;
    </>
  );
};

export default Reporting;

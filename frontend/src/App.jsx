import React, { useContext, useState, useEffect } from "react";
import { fetchReportings } from "./services/api";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import PhotoEvents from "./pages/PhotoEvents";
import Portraits from "./pages/Portraits";
import Reporting from "./pages/reporting";
import Portfolio from "./pages/Portfolio";
import ReportingDetail from "./pages/ReportingDetail";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import PrivateGallery from "./components/PrivateGallery/PrivateGallery";
import PrivateGalleryAdmin from "./pages/PrivateGalleryAdmin";
import PrivateGalleryAdminDetail from "./pages/PrivateGalleryAdminDetail";
import Footer from "./components/Footer/Footer";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const [reportings, setReportings] = useState([]);

  useEffect(() => {
    const loadReportings = async () => {
      const data = await fetchReportings();
      setReportings(data);
    };
    loadReportings();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home isLoggedIn={isLoggedIn} />
            </>
          }
        />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/logout" element={<Logout onLogout={logout} />} />
        <Route
          path="/photo-events"
          element={<PhotoEvents isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/portraits"
          element={<Portraits isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/Reporting"
          element={<Reporting isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/reporting/:id"
          element={
            <ReportingDetail reportings={reportings} isLoggedIn={isLoggedIn} />
          }
        />
        <Route path="/Contact" element={<Contact isLoggedIn={isLoggedIn} />} />

        <Route
          path="/Portfolio"
          element={<Portfolio isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/admin/private-gallery"
          element={
            isLoggedIn ? <PrivateGalleryAdmin /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/admin/private-gallery/:galleryId"
          element={
            isLoggedIn ? (
              <PrivateGalleryAdminDetail />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route path="/galerie-privee/:galleryId" element={<PrivateGallery />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

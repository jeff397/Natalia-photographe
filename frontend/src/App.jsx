import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PhotoEvents from "./pages/PhotoEvents";
import Portraits from "./pages/Portraits";
import Reporting from "./pages/reporting";
import Portfolio from "./pages/Portfolio";
import ReportingDetail from "./pages/ReportingDetail";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { isLoggedIn, login, logout } = useContext(AuthContext);

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
        <Route path="/reporting/:id" element={<ReportingDetail />} />
        <Route path="/Contact" element={<Contact isLoggedIn={isLoggedIn} />} />
        <Route path="/About" element={<About isLoggedIn={isLoggedIn} />} />
        <Route
          path="/Portfolio"
          element={<Portfolio isLoggedIn={isLoggedIn} />}
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

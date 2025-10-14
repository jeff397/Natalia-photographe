import React, { useContext } from "react";
import Introducing from "../components/Introducing/Introducing";
import Testimonials from "../components/Testimonials/Testimonials";
import PhotoService from "../components/PhotoService/PhotoService";

import { AuthContext } from "../context/AuthContext";

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  console.log("Le composant Home est rendu");
  console.log("Utilisateur connecté ? ", isLoggedIn);

  return (
    <div>
      {isLoggedIn && <h1>Mode Admin activé</h1>}
      <Introducing />
      <PhotoService isLoggedIn={isLoggedIn} />
      <Testimonials isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default Home;

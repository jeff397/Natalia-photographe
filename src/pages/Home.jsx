import React from "react"; // Assure-toi d'importer React
import Introducing from "../components/Introducing/Introducing";

function Home() {
  console.log("Le composant Home est rendu");
  return (
    <div>
      <Introducing />;
    </div>
  );
}

export default Home;

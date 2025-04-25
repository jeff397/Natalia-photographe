import React from "react";
import "./headerAbout.css";

function HeaderAbout() {
  return (
    <header className="header-about">
      <div className="header-about-content">
        <h1 className="header-about-title">A propos de moi</h1>
        <p className="header-about-subtitle">
          "Chaque photo est une escale dans le temps, un souvenir figé à
          jamais."
        </p>
      </div>
    </header>
  );
}

export default HeaderAbout;

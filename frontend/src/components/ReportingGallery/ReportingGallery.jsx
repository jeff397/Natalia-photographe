import React, { useState } from "react";
import "./reportingGallery.css";

const ReportingGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const closeLightbox = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedIndex(null);
    }
  };

  return (
    <div className="reporting-gallery">
      <div className="image-grid">
        {images.map((img, index) => (
          <img
            src={img}
            alt={`photo-${index}`}
            key={index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close" onClick={closeLightbox}>
            &times;
          </span>
          <span className="arrow prev" onClick={handlePrev}>
            &#10094;
          </span>
          <img src={images[selectedIndex]} alt="zoom" />
          <span className="arrow next" onClick={handleNext}>
            &#10095;
          </span>
        </div>
      )}
    </div>
  );
};

export default ReportingGallery;

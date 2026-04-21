import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./privateGallery.css";

const PrivateGallery = () => {
  const { galleryId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGallery = async () => {
      const res = await fetch(`${BACKEND_URL}/galleries/${galleryId}`);
      const data = await res.json();
      setPhotos(data.photos);
    };
    fetchGallery();
  }, [galleryId, BACKEND_URL]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const nextPhoto = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () =>
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  // 🟢 Téléchargement du ZIP (chemin complet vers la route backend)
  const handleDownloadZip = () => {
    window.open(`${BACKEND_URL}/private-users/${galleryId}/download`, "_blank");
  };

  return (
    <div className="private-gallery">
      <div className="gallery-header">
        <h2>Galerie privée</h2>
        <button onClick={handleDownloadZip} className="download-zip-btn">
          📦 Télécharger la galerie (ZIP)
        </button>
      </div>

      <div className="gallery-grid">
        {photos.map((p, i) => (
          <div key={i} className="private-photo-wrapper">
            <img
              src={p.imageUrl}
              alt={p.title || `Photo ${i + 1}`}
              onClick={() => openLightbox(i)}
            />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img className="lightbox-image" src={photos[currentIndex].imageUrl} />

          <button
            className="lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
          >
            &#10094;
          </button>
          <button
            className="lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
};

export default PrivateGallery;

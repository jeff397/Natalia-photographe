import { useEffect, useState } from "react";
import { fetchPhotos, deleteImage } from "../../services/api";
import GalleryModal from "../GalleryModal/GalleryModal";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./portfolioGallery.css";

const PortfolioGallery = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const allPhotos = await fetchPhotos();
        const eventPhotos = allPhotos.filter(
          (photo) => photo.category === "portfolio"
        );

        const sortedPhotos = eventPhotos.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setPhotos(sortedPhotos);
      } catch (error) {
        console.error("Erreur lors du chargement des photos:", error);
      }
    };

    loadPhotos();
  }, [refreshKey]);

  const handleAddPhoto = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setIsModalOpen(false);
  };

  const handleDeletePhoto = async (id, publicId) => {
    try {
      if (!publicId) {
        console.error("Le publicId est manquant !");
        return;
      }

      const response = await deleteImage(id, publicId);

      if (response.status === 200) {
        setPhotos((prevPhotos) =>
          prevPhotos.filter((photo) => photo._id !== id)
        );
      } else {
        console.error("Erreur lors de la suppression :", response);
        alert("Erreur lors de la suppression de l'image.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo :", error);
      alert("Erreur lors de la suppression de l'image. Veuillez réessayer.");
    }
  };

  const handlePhotoClick = (photo) => setSelectedPhoto(photo);
  const closeModal = () => setSelectedPhoto(null);

  const handleNextPhoto = () => {
    const currentIndex = photos.findIndex(
      (photo) => photo._id === selectedPhoto._id
    );
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    const currentIndex = photos.findIndex(
      (photo) => photo._id === selectedPhoto._id
    );
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  const selectedIndex = selectedPhoto
    ? photos.findIndex((photo) => photo._id === selectedPhoto._id) + 1
    : 0;

  return (
    <div className="portfolio-container">
      <div className="portfolio-button-wrapper">
        {isLoggedIn && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="modern-button"
          >
            Ajouter une photo
          </button>
        )}
      </div>

      <div className="portfolio-gallery-column">
        <div className="portfolio-photo-gallery">
          {photos.map((photo) => (
            <div key={photo._id} className="portfolio-photo-card">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                onClick={() => handlePhotoClick(photo)}
              />

              {isLoggedIn && (
                <div
                  className="delete-icon"
                  onClick={() => handleDeletePhoto(photo._id, photo.public_id)}
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" />
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div className="photo-modal" onClick={closeModal}>
            <div
              className="photo-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal-btn" onClick={closeModal}>
                X
              </button>

              <FontAwesomeIcon
                icon={faChevronLeft}
                className="nav-arrow left-arrow"
                onClick={handlePrevPhoto}
              />
              <div className="photo-display-wrapper">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="large-photo"
                />
                <div className="photo-counter">
                  Photo {selectedIndex} sur {photos.length}
                </div>
              </div>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="nav-arrow right-arrow"
                onClick={handleNextPhoto}
              />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <GalleryModal
          onClose={() => setIsModalOpen(false)}
          onAddPhoto={handleAddPhoto}
          forceCategory="portfolio"
        />
      )}
    </div>
  );
};

export default PortfolioGallery;

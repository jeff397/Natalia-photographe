import { useState, useEffect } from "react";
import GalleryModal from "../GalleryModal/GalleryModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { deleteImage, fetchPhotos } from "../../services/api";
import "./mywork.css";

function Mywork({ isLoggedIn }) {
  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        console.log("Chargement des photos depuis l'API...");
        const data = await fetchPhotos();

        const excludedCategories = [
          "photo-events",
          "photo-portrait",
          "portfolio",
        ];

        // Filtrer en excluant aussi toutes les catégories qui commencent par "reportage-"
        const filteredPhotos = data.filter(
          (photo) =>
            !excludedCategories.includes(photo.category.toLowerCase()) &&
            !photo.category.toLowerCase().startsWith("reportage-")
        );

        const sorted = filteredPhotos.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        console.log("Photos triées :", sorted);
        setPhotos(sorted);
      } catch (error) {
        console.error("Erreur lors du chargement des photos:", error);
      }
    };

    loadPhotos();
  }, [refreshKey]);

  const handleAddPhoto = (newPhoto) => {
    console.log("Nouvelle photo ajoutée :", newPhoto);
    setIsModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
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
    <section className="gallery">
      <h2 className="gallery-title">Fragments de vie</h2>
      <p className="gallery-txt">
        Petits ou grands moments, tous méritent d’être racontés avec justesse et
        sensibilité. Ces images sont des fragments de vie, capturés au détour
        d’un sourire, d’une larme, d’une lumière. Une invitation à entrer dans
        les histoires que j’ai eu le privilège de figer dans le temps.
      </p>

      {isLoggedIn && (
        <div className="gallery-button-wrapper">
          <button
            className="modern-button"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter une photo
          </button>
        </div>
      )}

      <div className="gallery-items">
        {photos.length === 0 ? (
          <p>Aucune photo disponible</p>
        ) : (
          photos.map((photo) => (
            <div key={photo._id} className="gallery-item">
              <img
                src={photo.imageUrl}
                alt={photo.title || `photo-${photo._id}`}
                className="gallery-item-image"
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
              {photo.description && (
                <div className="description">{photo.description}</div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <GalleryModal
          onClose={() => setIsModalOpen(false)}
          onAddPhoto={handleAddPhoto}
          forceCategory="présentation"
        />
      )}

      {selectedPhoto && (
        <div className="photo-modal" onClick={closeModal}>
          <div
            className="photo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
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
    </section>
  );
}

export default Mywork;

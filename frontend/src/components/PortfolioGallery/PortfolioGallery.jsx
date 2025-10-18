// src/components/PortfolioGallery/PortfolioGallery.jsx
import { useEffect, useState, useContext } from "react";
import { fetchPhotos, deleteImage } from "../../services/api";
import GalleryModal from "../GalleryModal/GalleryModal";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./portfolioGallery.css";

// ✅ Composant d’alerte réutilisable
const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">
        ✕
      </button>
    </div>
  );
};

// ✅ Composant de confirmation
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Confirmation</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Oui, confirmer
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

const PortfolioGallery = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // ✅ États pour alertes et confirmation
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({
    message: "",
    onConfirm: null,
  });

  // Charger les photos de la catégorie "portfolio"
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const allPhotos = await fetchPhotos();
        const eventPhotos = allPhotos.filter(
          (photo) => photo.category === "portfolio"
        );
        const sortedPhotos = eventPhotos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPhotos(sortedPhotos);
      } catch (error) {
        console.error("Erreur lors du chargement des photos:", error);
        setAlert({
          type: "error",
          message: "Impossible de charger les photos.",
        });
      }
    };
    loadPhotos();
  }, [refreshKey]);

  // Rafraîchir après ajout
  const handleAddPhoto = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setIsModalOpen(false);
  };

  // ✅ Confirmation avant suppression
  const confirmDeletePhoto = (id, publicId) => {
    setConfirmModal({
      message: "Voulez-vous vraiment supprimer cette photo ?",
      onConfirm: async () => {
        try {
          const response = await deleteImage(id, publicId);
          if (response.status === 200) {
            setPhotos((prev) => prev.filter((p) => p._id !== id));
            setAlert({
              type: "success",
              message: "Photo supprimée avec succès.",
            });
          } else {
            setAlert({
              type: "error",
              message: "Erreur lors de la suppression.",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          setAlert({
            type: "error",
            message: "Erreur lors de la suppression de l'image.",
          });
        } finally {
          setConfirmModal({ message: "", onConfirm: null });
        }
      },
    });
  };

  // Gestion de la lightbox
  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const showNext = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };
  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="portfolio-container">
      {/* ✅ Alertes en haut de la page */}
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />

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
          {photos.map((photo, i) => (
            <div key={photo._id} className="portfolio-photo-wrapper">
              <div className="portfolio-photo-card">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  onClick={() => openLightbox(i)}
                />
                {isLoggedIn && (
                  <div
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDeletePhoto(photo._id, photo.public_id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Lightbox */}
        {lightboxOpen && photos[currentPhotoIndex] && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-wrapper">
              <img
                className="lightbox-image"
                src={photos[currentPhotoIndex].imageUrl}
                alt={
                  photos[currentPhotoIndex].title ||
                  `Photo ${currentPhotoIndex + 1}`
                }
              />
              <button
                className="lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev(e);
                }}
              >
                &#10094;
              </button>
              <button
                className="lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext(e);
                }}
              >
                &#10095;
              </button>
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

      {/* ✅ Modale de confirmation */}
      <ConfirmModal
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ message: "", onConfirm: null })}
      />
    </div>
  );
};

export default PortfolioGallery;

import { useEffect, useState, useContext } from "react";
import { fetchPhotos, deleteImage } from "../../services/api";
import GalleryModal from "../GalleryModal/GalleryModal";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./eventGallery.css";

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

const EventGallery = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({
    message: "",
    onConfirm: null,
  });

  // Chargement des photos
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const allPhotos = await fetchPhotos();
        const eventPhotos = allPhotos.filter(
          (photo) => photo.category?.trim().toLowerCase() === "photo-events"
        );

        const sortedPhotos = eventPhotos.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setPhotos(sortedPhotos);
      } catch (error) {
        console.error("Erreur lors du chargement des photos :", error);
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

  return (
    <div className="photo-events-container">
      {/* ✅ Alertes en haut */}
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />

      <div className="photo-events-layout">
        <div className="text-column">
          {isLoggedIn && (
            <div className="button-wrapper">
              <button
                onClick={() => setIsModalOpen(true)}
                className="modern-button"
              >
                Ajouter une photo
              </button>
            </div>
          )}

          <p>
            Mariage, baptême, anniversaire, EVJF… je serai honorée de vous
            accompagner lors de ces moments uniques pour capturer rires, gestes
            d’amour et émotions fortes. Ces instants de partage avec vos proches
            méritent d’être préservés pour toujours. Mon approche est discrète
            et naturelle : je m’intègre facilement, je guide un peu si
            nécessaire, mais surtout j’observe et photographie vos moments tels
            qu’ils se vivent.
          </p>

          <a href="/contact" className="modern-button">
            Confiez moi votre histoire
          </a>

          <div className="offer-container">
            <h1 className="offer-title">Mon offre</h1>
            <ul className="offer-list">
              <li>2h de présence</li>
              <li>80 à 120 photos soigneusement éditées</li>
              <li>Galerie privée en ligne</li>
              <li>
                <strong>180 euros</strong>
              </li>
            </ul>
          </div>

          <p>
            Si vous souhaitez une couverture plus longue, la prestation peut
            être adaptée : le budget et le nombre de clichés livrés évoluent
            selon vos besoins.
          </p>
        </div>

        <div className="gallery-column">
          <div className="photo-gallery">
            {photos.map((photo) => (
              <div key={photo._id} className="photo-card">
                <img src={photo.imageUrl} alt={photo.title} />
                {isLoggedIn && (
                  <div
                    className="delete-icon"
                    onClick={() =>
                      confirmDeletePhoto(photo._id, photo.public_id)
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <GalleryModal
          onClose={() => setIsModalOpen(false)}
          onAddPhoto={handleAddPhoto}
          forceCategory="photo-events"
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

export default EventGallery;

import { useEffect, useState } from "react";
import { fetchPhotos, deleteImage } from "../../services/api";
import GalleryModal from "../GalleryModal/GalleryModal";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import "./eventGallery.css";

const EventGallery = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <div className="photo-events-container">
      <div className="photo-events-layout">
        <div className="text-column">
          {isLoggedIn && (
            <div className="button-wrapper">
              {isLoggedIn && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="modern-button"
                >
                  Ajouter une photo
                </button>
              )}
            </div>
          )}
          <p>
            Les instants en famille sont des éclats d’éternité. Un anniversaire
            qui éclate de rires, Un rite religieux empli de lumière, Une réunion
            où les souvenirs se tissent entre les générations… Ces moments
            précieux méritent d’être capturés avec tendresse. Chaque photo
            devient un trésor, Un fragment de bonheur à transmettre, à revivre,
            à aimer.
          </p>
          <a href="/contact" className="modern-button">
            Confiez moi votre histoire
          </a>
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
                      handleDeletePhoto(photo._id, photo.public_id)
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
    </div>
  );
};

export default EventGallery;

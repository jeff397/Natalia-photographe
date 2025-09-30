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
            Mariage, baptême, anniversaire, EVJF… je serai honorée de vous
            accompagner lors de ces moments uniques pour capturer rires, gestes
            d’amour et émotions fortes. Ces instants de partage avec vos proches
            méritent d’être préservés pour toujours. Mon approche est discrète
            et naturelle : je m’intègre facilement, je guide un peu si
            nécessaire, mais surtout j’observe et photographie vos moments tels
            qu’ils se vivent. Vous pouvez aussi me confier les instants clés ou
            les portraits que vous souhaitez absolument garder en souvenir.
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

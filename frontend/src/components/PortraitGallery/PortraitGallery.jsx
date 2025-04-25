import { useEffect, useState } from "react";
import { fetchPhotos, deleteImage } from "../../services/api";
import GalleryModal from "../GalleryModal/GalleryModal";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./portraitGallery.css";

const PortraitGallery = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const allPhotos = await fetchPhotos();
        console.log(
          "Toutes les photos :",
          allPhotos.map((p) => ({ title: p.title, category: p.category }))
        );

        const portraitPhotos = allPhotos.filter((photo) => {
          return photo.category?.toLowerCase().includes("portrait");
        });

        const sortedPhotos = portraitPhotos.sort(
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
    <div className="portrait-events-container">
      <div className="portrait-events-layout">
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
            Chaque portrait est une fenêtre ouverte sur une âme, un instant figé
            dans le temps, un murmure silencieux qui raconte des histoires sans
            mots. Dans chaque regard se cache un univers de souvenirs, de rêves
            et de secrets, comme un écho d’émotions suspendues. Chaque ligne,
            chaque sourire, chaque trace sur la peau est un reflet de l’histoire
            vécue, un témoignage de moments qui s’envolent mais restent à jamais
            capturés dans l’intemporalité de l’image. À travers le portrait,
            nous plongeons dans l’intimité de l’être, là où se mêlent beauté et
            vulnérabilité.
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
          forceCategory="photo-portrait"
        />
      )}
    </div>
  );
};

export default PortraitGallery;

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
            Il y a des personnes, des relations, des instants que l’on souhaite
            graver, pas forcément liés à un événement précis, mais simplement
            pour garder une trace d’un moment, d’un sentiment, d’un lien.
            Comment ça se passe ? Nous partons en balade — près de chez vous, à
            la maison ou dans un lieu choisi ensemble selon l’ambiance
            recherchée. L’idée est de créer un moment privilégié où je capture
            vos émotions avec authenticité. Je vous guide si besoin, mais c’est
            avant tout un temps pour vous, pour célébrer vos proches… ou
            vous-même lors d’une séance portrait individuelle. Ces sessions sont
            idéales pour garder le souvenir d’une grossesse, d’un âge
            particulier avant que vos enfants grandissent, ou encore d’un couple
            amoureux — sans qu’il faille forcément attendre des fiançailles ou
            un anniversaire pour immortaliser ces liens. Et pourquoi pas en
            faire un cadeau ? Je vous propose des bons cadeaux imprimables : la
            personne qui le reçoit pourra ensuite me contacter pour fixer la
            date de la séance.
          </p>
          <a href="/contact" className="modern-button">
            Confiez moi votre histoire
          </a>
          <div className="offer-container">
            <h1 className="offer-title">Mon offre</h1>
            <ul className="offer-list">
              <li>1h30 de séance</li>
              <li>Minimum 50 photos éditées</li>
              <li>Galerie privée en ligne</li>
              <li>
                <strong>150 euros</strong>
              </li>
            </ul>
          </div>
          <p>
            Possibilité d’adapter la durée et le nombre de photos selon vos
            besoins.
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
          forceCategory="photo-portrait"
        />
      )}
    </div>
  );
};

export default PortraitGallery;

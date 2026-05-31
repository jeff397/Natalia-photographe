import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./galleryManager.css";

const BACKEND_URL = process.env.VITE_API_URL;

const GalleryManager = ({ galleryId }) => {
  // Sécurité : Initialisé avec un tableau vide pour éviter le crash au premier rendu
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // États de progression de l'upload de masse
  const [uploading, setUploading] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);

  const [confirmModal, setConfirmModal] = useState({
    message: "",
    onConfirm: null,
  });

  const fetchGallery = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/private-users/galleries/${galleryId}`,
      );

      // Double sécurité : On s'adapte automatiquement à la structure de votre réponse API
      if (res.data && Array.isArray(res.data.photos)) {
        setPhotos(res.data.photos);
      } else if (Array.isArray(res.data)) {
        setPhotos(res.data);
      } else {
        setPhotos([]); // Fallback si le format est inconnu
      }
    } catch (err) {
      console.error("Erreur fetch gallery:", err);
      setPhotos([]);
    }
  }, [galleryId]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Gérer la sélection de plusieurs fichiers à la fois
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    } else {
      setPreviews([]);
    }
  };

  // Upload séquentiel (une par une automatique, sans limite de surcharge)
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setAlert({
      type: "info",
      message: `Préparation de l'upload de ${files.length} photos...`,
    });

    for (let i = 0; i < files.length; i++) {
      setCurrentUploadIndex(i + 1);

      const formData = new FormData();
      formData.append("image", files[i]); // Réutilise votre route SINGLE actuelle
      formData.append("title", "");

      try {
        await axios.post(
          `${BACKEND_URL}/private-users/${galleryId}/photos`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      } catch (err) {
        console.error(`Erreur upload photo index ${i}:`, err);
        setAlert({
          type: "error",
          message: `Erreur sur la photo numéro ${i + 1}.`,
        });
      }
    }

    setUploading(false);
    setFiles([]);
    setPreviews([]);
    fetchGallery(); // Rafraîchit la grille avec toutes les nouvelles photos
    setAlert({
      type: "success",
      message: "Toutes les photos ont été uploadées ! 🎉",
    });
  };

  const confirmDeletePhoto = (photoId) => {
    setConfirmModal({
      message: "Voulez-vous vraiment supprimer cette photo ?",
      onConfirm: async () => {
        try {
          await axios.delete(`${BACKEND_URL}/private-users/photos/${photoId}`);
          setPhotos((prev) => prev.filter((photo) => photo._id !== photoId));
          setAlert({
            type: "success",
            message: "Photo supprimée avec succès !",
          });
        } catch (err) {
          console.error("Erreur suppression:", err);
          setAlert({
            type: "error",
            message: "Erreur lors de la suppression de la photo.",
          });
        } finally {
          setConfirmModal({ message: "", onConfirm: null });
        }
      },
    });
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const nextPhoto = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () =>
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="gallery-manager">
      {/* Messages d'alerte */}
      {alert.message && (
        <div
          className={`alert-message ${alert.type}`}
          style={{
            margin: "10px 0",
            padding: "10px",
            borderRadius: "4px",
            background: alert.type === "error" ? "#ffcccc" : "#e5f4e3",
          }}
        >
          {alert.message}
        </div>
      )}

      {/* Formulaire d'upload de masse */}
      <div className="gallery-manager-upload">
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput" className="custom-file-button">
          {files.length > 0
            ? `${files.length} fichiers sélectionnés`
            : "Choisir des fichiers"}
        </label>

        {/* Aperçu des miniatures sélectionnées avant envoi */}
        {previews.length > 0 && !uploading && (
          <div
            className="previews-grid"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              margin: "15px 0",
            }}
          >
            {previews.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Preview"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
        )}

        {/* Compteur d'envoi de la file d'attente */}
        {uploading && (
          <div
            className="upload-progress"
            style={{ margin: "15px 0", color: "#3498db", fontWeight: "bold" }}
          >
            🚀 Envoi en cours : {currentUploadIndex} / {files.length} photos...
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
        >
          {uploading
            ? "Upload en cours..."
            : `Uploader le paquet (${files.length})`}
        </button>
      </div>

      {/* Galerie d'affichage sécurisée avec vérification de type */}
      <div className="gallery-manager-grid">
        {Array.isArray(photos) &&
          photos.map((photo, i) => (
            <div
              key={photo._id || i}
              className="gallery-manager-card"
              onClick={() => openLightbox(i)}
            >
              <img src={photo.imageUrl} alt={photo.title || `Photo ${i + 1}`} />
              {photo.title && (
                <span className="gallery-manager-card-title">
                  {photo.title}
                </span>
              )}
              <div
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDeletePhoto(photo._id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && photos[currentIndex] && (
        <div className="gallery-manager-lightbox" onClick={closeLightbox}>
          <button
            className="gallery-manager-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
          >
            &#10094;
          </button>
          <img
            className="gallery-manager-lightbox-image"
            src={photos[currentIndex].imageUrl}
            alt={photos[currentIndex].title || `Photo ${currentIndex + 1}`}
          />
          <button
            className="gallery-manager-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
          >
            &#10095;
          </button>
          <button
            className="gallery-manager-lightbox-close"
            onClick={closeLightbox}
          >
            &times;
          </button>
        </div>
      )}

      {/* Fenêtre de confirmation de suppression */}
      <ConfirmModal
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ message: "", onConfirm: null })}
      />
    </div>
  );
};

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

export default GalleryManager;

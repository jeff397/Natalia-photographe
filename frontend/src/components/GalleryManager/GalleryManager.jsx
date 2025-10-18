// src/components/GalleryManager/GalleryManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./galleryManager.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const GalleryManager = ({ galleryId }) => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [confirmModal, setConfirmModal] = useState({
    message: "",
    onConfirm: null,
  });

  const fetchGallery = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/private-users/galleries/${galleryId}`
      );

      setPhotos(res.data.photos);
    } catch (err) {
      console.error("Erreur fetch gallery:", err);
    }
  }, [galleryId]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    try {
      await axios.post(
        `${BACKEND_URL}/api/private-users/${galleryId}/photos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Reset
      setFile(null);
      setTitle("");
      setPreviewUrl(null);
      fetchGallery();
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Erreur lors de l'upload");
    }
  };

  const confirmDeletePhoto = (photoId) => {
    setConfirmModal({
      message: "Voulez-vous vraiment supprimer cette photo ?",
      onConfirm: async () => {
        try {
          await axios.delete(
            `${BACKEND_URL}/api/private-users/photos/${photoId}`
          );
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
      {/* Upload */}
      <div className="gallery-manager-upload">
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput" className="custom-file-button">
          {file ? file.name : "Choisir un fichier"}
        </label>

        {previewUrl && (
          <div className="gallery-manager-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <input
          type="text"
          placeholder="Titre (facultatif)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleUpload}>Uploader</button>
      </div>

      {/* Galerie */}
      <div className="gallery-manager-grid">
        {photos.map((photo, i) => (
          <div
            key={photo._id}
            className="gallery-manager-card"
            onClick={() => openLightbox(i)}
          >
            <img src={photo.imageUrl} alt={photo.title || `Photo ${i + 1}`} />
            {photo.title && (
              <span className="gallery-manager-card-title">{photo.title}</span>
            )}
            <div
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                confirmDeletePhoto(photo._id); // <-- plus de window.confirm ici
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

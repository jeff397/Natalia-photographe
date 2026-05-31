import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./galleryManager.css";

const BACKEND_URL = process.env.VITE_API_URL;

const GalleryManager = ({ galleryId }) => {
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // États pour suivre la progression de la file d'attente
  const [uploading, setUploading] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({
    message: "",
    onConfirm: null,
  });

  const fetchGallery = useCallback(async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/private-users/galleries/${galleryId}`,
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
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    } else {
      setPreviews([]);
    }
  };

  // La fonction magique qui envoie les photos une par une
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setAlert({
      type: "info",
      message: `Préparation de l'upload de ${files.length} photos...`,
    });

    // Boucle asynchrone sur chaque fichier
    for (let i = 0; i < files.length; i++) {
      setCurrentUploadIndex(i + 1); // Met à jour le compteur visuel (ex: 1/25)

      const formData = new FormData();
      formData.append("image", files[i]); // Utilise votre route SINGLE existante
      formData.append("title", "");

      try {
        // On attend que la photo actuelle soit chez Cloudinary avant de passer à la suivante
        await axios.post(
          `${BACKEND_URL}/private-users/${galleryId}/photos`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      } catch (err) {
        console.error(`Erreur upload photo index ${i}:`, err);
        // On continue même si une photo échoue, mais on prévient l'utilisateur
        setAlert({
          type: "error",
          message: `Échec de la photo numéro ${i + 1}, passage aux suivantes...`,
        });
      }
    }

    // Une fois la boucle complètement terminée
    setUploading(false);
    setFiles([]);
    setPreviews([]);
    fetchGallery(); // On rafraîchit la galerie d'un coup
    setAlert({
      type: "success",
      message: "Toutes les photos ont été traitées avec succès ! 🎉",
    });
  };

  // ... (Conservez vos fonctions de lightbox et delete inchangées)

  return (
    <div className="gallery-manager">
      {/* Upload */}
      <div className="gallery-manager-upload">
        <input
          type="file"
          id="fileInput"
          multiple // Permet de sélectionner 20, 30, 50 photos d'un coup
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput" className="custom-file-button">
          {files.length > 0
            ? `${files.length} photos sélectionnées`
            : "Choisir des fichiers"}
        </label>

        {/* Affichage des miniatures sélectionnées */}
        {previews.length > 0 && !uploading && (
          <div
            className="previews-grid"
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              margin: "10px 0",
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
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>
        )}

        {/* Message d'attente pendant l'upload en masse */}
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
          style={{
            backgroundColor: uploading ? "#bdc3c7" : "#2ecc71",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {uploading
            ? "Upload en cours..."
            : `Lancer l'upload (${files.length} photos)`}
        </button>
      </div>

      {/* ... Votre grille de photos existante */}
    </div>
  );
};

export default GalleryManager;

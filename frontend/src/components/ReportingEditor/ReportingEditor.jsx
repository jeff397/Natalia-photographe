import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddPhotoModal from "../AddPhotoModal/AddPhotoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  uploadImage,
  updateReporting,
  fetchPhotos,
  deleteImage,
} from "../../services/api";

import "./reportingEditor.css";

const ReportingEditor = ({
  initialReporting,
  title: initialTitle,
  isLoggedIn,
}) => {
  const { reportingId } = useParams(); // récupère l'id depuis l'URL si nécessaire
  const [reporting, setReporting] = useState(initialReporting || null);
  const [title, setTitle] = useState(initialTitle || "");
  const [intro, setIntro] = useState(initialReporting?.intro || "");
  const [photos, setPhotos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Charger le reportage depuis le backend si initialReporting absent
  useEffect(() => {
    const loadReporting = async () => {
      try {
        if (initialReporting) {
          setReporting(initialReporting);
          setIntro(initialReporting.intro || "");
          setTitle(initialReporting.title || "");
        } else if (reportingId) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/reportings/${reportingId}`
          );
          if (!res.ok) throw new Error("Impossible de charger le reportage");
          const data = await res.json();
          setReporting(data);
          setIntro(data.intro || "");
          setTitle(data.title || "");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors du chargement du reportage");
      } finally {
        setLoading(false);
      }
    };
    loadReporting();
  }, [initialReporting, reportingId]);

  // Charger les photos liées
  useEffect(() => {
    const loadPhotos = async () => {
      if (!reporting) return;
      try {
        const allPhotos = await fetchPhotos();
        const categoryName = `reportage-${reporting.title
          .replace(/\s+/g, "-")
          .toLowerCase()}`;
        const filtered = allPhotos.filter((p) => p.category === categoryName);
        setPhotos(filtered);
      } catch (err) {
        console.error("Erreur lors du chargement des photos :", err);
      }
    };
    loadPhotos();
  }, [reporting]);

  // Sauvegarde de l'introduction
  const handleIntroSave = async () => {
    if (!reporting) return;
    setSaving(true);
    try {
      const updated = await updateReporting(reporting._id, { intro });
      setReporting(updated);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (photoId, publicId) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette photo ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteImage(photoId, publicId); // <-- utilise la fonction de l'API

      // Mise à jour de l'état local
      setPhotos((prev) => prev.filter((p) => p._id !== photoId));
    } catch (err) {
      console.error("Erreur suppression photo :", err);
      alert("Impossible de supprimer la photo");
    }
  };

  // Upload d'image
  const handleAddPhoto = async (file) => {
    if (!reporting) return alert("Vous devez d'abord créer le reportage");

    setUploading(true);
    try {
      const categoryName = `reportage-${reporting.title
        .replace(/\s+/g, "-")
        .toLowerCase()}`;
      await uploadImage(
        file,
        `Photo du reportage ${reporting.title}`,
        reporting.intro || "Photo du reportage",
        categoryName
      );

      // Recharge les photos depuis le serveur
      const allPhotos = await fetchPhotos();
      const filtered = allPhotos.filter((p) => p.category === categoryName);
      setPhotos(filtered);

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de la photo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Chargement du reportage...</p>;

  return (
    <div className="reporting-editor">
      <h1>{title}</h1>
      {reporting?.subtitle && (
        <h2 className="reporting-subtitle">{reporting.subtitle}</h2>
      )}

      {isLoggedIn && (
        <div className="admin-controls">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Écrivez l'introduction..."
            rows={5}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <button onClick={handleIntroSave} disabled={saving}>
            {saving ? "Sauvegarde..." : "Sauvegarder l'introduction"}
          </button>

          <button onClick={() => setModalOpen(true)} disabled={uploading}>
            {uploading ? "Upload en cours..." : "Ajouter des photos"}
          </button>

          <AddPhotoModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            reportingId={reporting?._id}
            onPhotoAdded={handleAddPhoto}
          />
        </div>
      )}

      {intro && <p>{intro}</p>}

      {photos.length > 0 && (
        <div className="reporting-photos">
          {photos.map((p, i) =>
            p.imageUrl ? (
              <div key={i} className="photo-wrapper">
                <img
                  src={p.imageUrl}
                  alt={p.title || `Photo ${i + 1}`}
                  onClick={() => openLightbox(i)}
                />
                {isLoggedIn && (
                  <div
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(p._id, p.public_id); // <-- ajoute public_id ici
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </div>
                )}
              </div>
            ) : null
          )}

          {/* Lightbox */}
          {lightboxOpen && photos[currentPhotoIndex] && (
            <div className="lightbox-overlay" onClick={closeLightbox}>
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
          )}
        </div>
      )}
    </div>
  );
};

export default ReportingEditor;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddPhotoModal from "../AddPhotoModal/AddPhotoModal";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  uploadImage,
  updateReporting,
  fetchPhotos,
  deleteImage,
} from "../../services/api";

import "./reportingEditor.css";

// ✅ FIX ICI
const BACKEND_URL = import.meta.env.VITE_API_URL;

const ReportingEditor = ({
  initialReporting,
  title: initialTitle,
  isLoggedIn,
}) => {
  const { reportingId } = useParams();
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
  const [confirmDeleteData, setConfirmDeleteData] = useState(null);

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

  // ✅ FIX ICI
  useEffect(() => {
    const loadReporting = async () => {
      try {
        if (initialReporting) {
          setReporting(initialReporting);
          setIntro(initialReporting.intro || "");
          setTitle(initialReporting.title || "");
        } else if (reportingId) {
          const res = await fetch(`${BACKEND_URL}/reportings/${reportingId}`);

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
        console.error("Erreur photos :", err);
      }
    };

    loadPhotos();
  }, [reporting]);

  const handleIntroSave = async () => {
    if (!reporting) return;

    setSaving(true);

    try {
      const updated = await updateReporting(reporting._id, { intro });
      setReporting(updated);
    } catch (err) {
      console.error(err);
      alert("Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (photoId, publicId) => {
    setConfirmDeleteData({ photoId, publicId });
  };

  const confirmDelete = async () => {
    if (!confirmDeleteData) return;

    try {
      await deleteImage(confirmDeleteData.photoId, confirmDeleteData.publicId);

      setPhotos((prev) =>
        prev.filter((p) => p._id !== confirmDeleteData.photoId),
      );
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Impossible de supprimer");
    } finally {
      setConfirmDeleteData(null);
    }
  };

  const handleAddPhoto = async (file) => {
    if (!reporting) return alert("Créer le reportage avant");

    setUploading(true);

    try {
      const categoryName = `reportage-${reporting.title
        .replace(/\s+/g, "-")
        .toLowerCase()}`;

      await uploadImage(
        file,
        `Photo du reportage ${reporting.title}`,
        reporting.intro || "Photo",
        categoryName,
      );

      const allPhotos = await fetchPhotos();

      const filtered = allPhotos.filter((p) => p.category === categoryName);

      setPhotos(filtered);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur upload");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="reporting-editor">
      <h1>{title}</h1>

      {isLoggedIn && (
        <div className="admin-controls">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={5}
          />

          <button onClick={handleIntroSave}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>

          <button onClick={() => setModalOpen(true)}>
            {uploading ? "Upload..." : "Ajouter photo"}
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

      <div className="reporting-photos">
        {photos.map((p, i) => (
          <div key={i} className="photo-wrapper">
            <img src={p.imageUrl} alt="" onClick={() => openLightbox(i)} />

            {isLoggedIn && (
              <div
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(p._id, p.public_id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!confirmDeleteData}
        message="Supprimer cette photo ?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteData(null)}
      />
    </div>
  );
};

export default ReportingEditor;

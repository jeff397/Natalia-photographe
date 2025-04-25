import React, { useState } from "react";
import { uploadImageToServer } from "../../services/api";
import "./GalleryModal.css";

const GalleryModal = ({ onClose, onAddPhoto, forceCategory = null }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(forceCategory || "");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file && title && description && category) {
      try {
        const uploadedPhoto = await uploadImageToServer(
          file,
          title,
          description,
          forceCategory || category,
          false
        );
        onAddPhoto(uploadedPhoto);
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
      }
    } else {
      console.error(
        "Veuillez remplir tous les champs et sélectionner une image."
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Ajouter une photo</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="upload-section">
            <label className="upload-label" htmlFor="photo-upload">
              Choisir une photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="photo-upload"
              className="file-upload"
            />
          </div>

          {previewUrl && (
            <div className="image-preview">
              <img
                src={previewUrl}
                alt="Prévisualisation"
                className="rounded-lg mt-4"
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />

          {forceCategory ? (
            <input
              type="text"
              value={forceCategory}
              readOnly
              className="mb-4"
              style={{ backgroundColor: "#f1f1f1", color: "#666" }}
            />
          ) : (
            <input
              type="text"
              placeholder="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-4"
            />
          )}

          <button type="submit" className="modern-button">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default GalleryModal;

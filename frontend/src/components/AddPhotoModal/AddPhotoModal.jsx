import React, { useState } from "react";

import "./addPhotoModal.css";

const AddPhotoModal = ({ isOpen, onClose, onPhotoAdded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier !");
    setLoading(true);
    try {
      // envoi le fichier natif seulement
      await onPhotoAdded(file);
      onClose();
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout de la photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter une photo</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div className="preview">
            <img src={preview} alt="Prévisualisation" />
          </div>
        )}
        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPhotoModal;

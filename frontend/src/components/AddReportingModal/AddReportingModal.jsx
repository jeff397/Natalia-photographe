import React, { useState } from "react";
import { uploadReporting } from "../../services/api"; // fonction à créer côté api.js
import "./AddReportingModal.css";

const AddReportingModal = ({ isOpen, onClose, onNewReporting }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState(""); // nouveau champ
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return setError("Le titre et la photo sont requis");

    setLoading(true);
    setError(null);

    try {
      // On envoie maintenant le titre + sous-titre
      const newReporting = await uploadReporting(file, title, subtitle);
      onNewReporting(newReporting); // met à jour la liste côté front
      setTitle("");
      setSubtitle(""); // reset sous-titre
      setFile(null);
      setPreview(null);
      onClose();
    } catch (err) {
      setError("Erreur lors de l'ajout du reportage");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Ajouter un reportage</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre du reportage"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Sous-titre / événement"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {/* Preview image */}
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
              <p>{file?.name}</p>
            </div>
          )}

          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReportingModal;

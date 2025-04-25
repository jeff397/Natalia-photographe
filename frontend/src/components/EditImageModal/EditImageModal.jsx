import React, { useState } from "react";
import "./editimagemodal.css";
import { uploadImageToServer } from "../../services/api";

function EditImageModal({ isOpen, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !description || !category) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const uploadedPhoto = await uploadImageToServer(
        file,
        title,
        description,
        category
      );

      onSubmit(uploadedPhoto);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Ajouter une photo</h3>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="upload-section">
            {!image && (
              <label htmlFor="image-upload" className="upload-label">
                <i className="fa-regular fa-image"></i>
                <span>+ Ajouter une photo</span>
              </label>
            )}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {image && (
              <div className="image-preview">
                <img src={image} alt="Preview" />
              </div>
            )}
            <span className="photo-limits">
              Formats acceptés : jpg, png (max. 4 Mo)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Catégorie</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Choisir une catégorie --</option>
              <option value="portrait">Portrait</option>
              <option value="paysage">Paysage</option>
              <option value="mariage">Mariage</option>
              <option value="reportage">Reportage</option>
            </select>
          </div>

          <button type="submit" className="modern-button">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditImageModal;

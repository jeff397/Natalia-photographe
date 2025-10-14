import React, { useState } from "react";
import { addTestimonial } from "../../services/api";
import "./testimonialModal.css";

const TestimonialModal = ({ onClose, onAddTestimonial }) => {
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!author || !quote) {
      console.error("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const newTestimonial = await addTestimonial(author, quote);
      onAddTestimonial(newTestimonial);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du témoignage :", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Ajouter un témoignage</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Auteur"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mb-4"
          />
          <textarea
            placeholder="Citation"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="mb-4"
            rows={4}
          />
          <button type="submit" className="modern-button">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;

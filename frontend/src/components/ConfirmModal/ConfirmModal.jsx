import React from "react";
import "./confirmModal.css";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div
        className="confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

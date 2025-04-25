import "./contactModal.css";

function ContactModal({ children, onClose }) {
  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div
        className="contact-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="contact-modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default ContactModal;

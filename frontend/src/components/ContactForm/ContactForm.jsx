import { useState } from "react";
import ContactModal from "../ContactModal/ContactModal";

import "./contactForm.css";

function Contact() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="contact" id="contact">
      {/* Image de fond */}
      <img
        src="/assets/images/contactBackground.webp"
        alt="fond de contact"
        className="bg-img"
      />

      {/* Contenu */}
      <div className="contact-content">
        <h1 className="contact-title">Confiez moi votre histoire</h1>
        <p className="contact-txt">
          Chaque rencontre est une histoire à raconter…
        </p>
        <a
          href="#"
          className="modern-button"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          Me contacter
        </a>
      </div>

      {/* Modal */}
      {showModal && (
        <ContactModal onClose={() => setShowModal(false)}>
          <form className="contact-form">
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder=" "
                required
              />
              <label htmlFor="name">Nom</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                required
              />
              <label htmlFor="email">E-mail</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder=" "
                required
              />
              <label htmlFor="subject">Objet</label>
            </div>

            <div className="form-group">
              <textarea
                id="message"
                name="message"
                placeholder=" "
                rows="5"
                required
              ></textarea>
              <label htmlFor="message">Message</label>
            </div>

            <button type="submit" className="modern-button">
              Envoyer
            </button>
          </form>
        </ContactModal>
      )}
    </section>
  );
}

export default Contact;

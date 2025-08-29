import { useState } from "react";
import ContactModal from "../ContactModal/ContactModal";
import backgroundImage from "../../assets/images/contactBackground.webp";
import "./contactForm.css";

function Contact() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="contact" id="contact">
      {/* Image de fond */}
      <img src={backgroundImage} alt="fond de contact" className="bg-img" />

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
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Votre e-mail"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Objet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Ex. Mariage, portrait..."
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Votre message..."
                required
              ></textarea>
            </div>
            <button type="submit" className="modern-button">
              Envoyer le message
            </button>
          </form>
        </ContactModal>
      )}
    </section>
  );
}

export default Contact;

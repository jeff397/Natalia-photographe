import { useState } from "react";
import ContactModal from "../ContactModal/ContactModal";

import "./contactForm.css";

function Contact() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(""); // "success" | "error" | ""

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch(
        "https://formspree.io/f/mnnlapvq", // <-- ton URL Formspree
        {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setStatus("success");
        form.reset();
        // fermer la modal après 3 secondes seulement
        setTimeout(() => setShowModal(false), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="contact" id="contact">
      <img
        src="/assets/images/contactBackground.webp"
        alt="fond de contact"
        className="bg-img"
      />

      <div className="contact-content">
        <h1 className="contact-title">Confiez-moi votre histoire</h1>
        <p className="contact-txt">
          Chaque rencontre est une histoire à raconter…
        </p>
        <a
          href="#"
          className="modern-button"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
            setStatus("");
          }}
        >
          Me contacter
        </a>
      </div>

      {showModal && (
        <ContactModal onClose={() => setShowModal(false)}>
          <form className="contact-form" onSubmit={handleSubmit}>
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
              />
              <label htmlFor="message">Message</label>
            </div>

            <button type="submit" className="modern-button">
              Envoyer
            </button>

            {/* Messages de confirmation ou d'erreur */}
            {status === "success" && (
              <p className="form-message success">
                Merci ! Votre message a été envoyé. La modal se fermera dans 3
                secondes.
              </p>
            )}
            {status === "error" && (
              <p className="form-message error">
                Oups… une erreur est survenue, veuillez réessayer.
              </p>
            )}
          </form>
        </ContactModal>
      )}
    </section>
  );
}

export default Contact;

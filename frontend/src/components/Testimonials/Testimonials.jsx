import { useState, useEffect } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { fetchTestimonials, deleteTestimonial } from "../../services/api";
import TestimonialModal from "../TestimonialModal/TestimonialModal";
import "./testimonials.css";

function Testimonials({ isLoggedIn }) {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTestimonials(sorted);
      } catch (error) {
        console.error("Erreur lors du chargement des témoignages :", error);
      }
    };
    loadTestimonials();
  }, [refreshKey]);

  const handleAddTestimonial = () => {
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await deleteTestimonial(id);
      if (response.status === 200) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1200,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <section className="testimonials">
      <h2 className="testimonials-title">Ils m’ont fait confiance</h2>

      {isLoggedIn && (
        <div className="testimonials-button-wrapper">
          <button
            className="modern-button"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un témoignage
          </button>
        </div>
      )}

      {testimonials.length === 0 ? (
        <p>Aucun témoignage disponible</p>
      ) : (
        <Slider {...settings}>
          {testimonials.map((item) => (
            <div key={item._id}>
              <div className="testimonial-card">
                <blockquote className="testimonial-text">
                  “{item.quote}”
                </blockquote>
                <p className="testimonial-author">— {item.author}</p>

                {isLoggedIn && (
                  <div
                    className="delete-icon"
                    onClick={() => handleDeleteTestimonial(item._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </Slider>
      )}

      {isModalOpen && (
        <TestimonialModal
          onClose={() => setIsModalOpen(false)}
          onAddTestimonial={handleAddTestimonial}
        />
      )}
    </section>
  );
}

export default Testimonials;

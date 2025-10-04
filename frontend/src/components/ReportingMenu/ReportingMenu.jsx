import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchReportings, deleteReporting } from "../../services/api";
import AddReportingModal from "../AddReportingModal/AddReportingModal";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../utils/slugify";
import "./reportingMenu.css";

const ReportingMenu = ({ isLoggedIn }) => {
  const [reportings, setReportings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  useEffect(() => {
    const getReportings = async () => {
      try {
        const data = await fetchReportings();
        setReportings(data);
      } catch {
        setError("Impossible de charger les reportages.");
      } finally {
        setLoading(false);
      }
    };
    getReportings();
  }, []);

  const handleNewReporting = (newReporting) => {
    setReportings([newReporting, ...reportings]);
  };

  const handleDeleteClick = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReporting(toDeleteId);
      setReportings((prev) => prev.filter((r) => r._id !== toDeleteId));
    } catch (err) {
      console.error("Erreur suppression reportage :", err);
      alert("Erreur lors de la suppression du reportage");
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  if (loading) return <p>Chargement des reportages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="reporting-menu">
      {isLoggedIn && (
        <button onClick={() => setModalOpen(true)} className="modern-button">
          Ajouter un reportage
        </button>
      )}
      <AddReportingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNewReporting={handleNewReporting}
      />

      <div className="reporting-intro">
        <p>
          Au-delà des sessions privées et des célébrations, je réalise des
          reportages pour des événements, des associations, des projets
          commerciaux, mais aussi pour raconter des histoires qui me tiennent à
          cœur.
        </p>
        <p>
          Je vous présente ici mes reportages réalisés lors de prestations, de
          voyages ou de projets personnels : des instants, des regards, des
          gestes et des sentiments capturés pour vous faire vivre ces moments et
          rencontrer ces univers.
        </p>
        <p>
          Je suis également disponible pour couvrir votre événement ou raconter
          votre histoire à travers ce langage visuel unique. N’hésitez pas à me
          contacter pour en discuter !
        </p>
      </div>

      <div className="reporting-grid">
        {reportings.map((item) => {
          const slug = slugify(item.title || "reportage"); // fallback si pas de titre
          return (
            <div key={item._id} className="reporting-card">
              <Link to={`/reporting/${slug}`} state={{ title: item.title }}>
                <div className="reporting-card-image-wrapper">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="reporting-card-image"
                    />
                  ) : (
                    <div className="image-placeholder">Pas d'image</div>
                  )}
                </div>

                <div className="reporting-card-content">
                  <h3>{item.title}</h3>
                  {item.subtitle && <p className="subtitle">{item.subtitle}</p>}
                </div>
              </Link>

              {isLoggedIn && (
                <div
                  className="delete-icon"
                  onClick={() => handleDeleteClick(item._id)}
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        message="Voulez-vous vraiment supprimer ce reportage ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
};

export default ReportingMenu;

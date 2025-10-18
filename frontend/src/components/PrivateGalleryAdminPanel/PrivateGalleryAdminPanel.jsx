import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./privateGalleryAdminPanel.css";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const PrivateGalleryAdminPanel = () => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/private-users`);
      setClients(res.data);
    } catch {
      setAlert({
        type: "error",
        message: "Impossible de récupérer les clients.",
      });
    }
  };

  const generatePassword = () => Math.random().toString(36).slice(-8);

  const handleCreateClient = async () => {
    if (!name || !username) {
      setAlert({
        type: "warning",
        message: "Nom et identifiant obligatoires.",
      });
      return;
    }

    const pwd = generatePassword();

    try {
      await axios.post(`${BACKEND_URL}/private-users`, {
        name,
        username,
        password: pwd,
      });

      setNewPassword(pwd);
      setName("");
      setUsername("");
      fetchClients();
      setAlert({
        type: "success",
        message: `Client créé ! Mot de passe : ${pwd}`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Erreur lors de la création du client.",
      });
    }
  };

  const confirmDeleteClient = (clientId) => {
    setConfirmModal({
      message: "Voulez-vous vraiment supprimer ce client et sa galerie ?",
      onConfirm: async () => {
        try {
          await axios.delete(`${BACKEND_URL}/private-users/${clientId}`);
          setAlert({
            type: "success",
            message: "Client supprimé avec succès !",
          });
          fetchClients();
        } catch {
          setAlert({
            type: "error",
            message: "Erreur lors de la suppression du client.",
          });
        } finally {
          setConfirmModal({ message: "", onConfirm: null });
        }
      },
    });
  };

  return (
    <div className="private-admin-container">
      <h1>Créer une galerie privée</h1>

      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />

      {/* Formulaire création client */}
      <div className="private-admin-form">
        <input
          placeholder="Nom du client"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Identifiant client"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleCreateClient}>Créer</button>
      </div>

      {newPassword && (
        <div className="private-admin-password">
          Mot de passe généré : <strong>{newPassword}</strong>
        </div>
      )}

      <h2>Clients existants</h2>
      <div className="private-admin-list">
        {clients.map((c) => (
          <div key={c._id} className="client-card">
            <h3 className="client-name">{c.clientName || "Nom non défini"}</h3>
            <p>
              <strong>Identifiant :</strong> {c.username}
            </p>
            <p>
              <strong>Mot de passe :</strong> {c.password}
            </p>

            <div className="button-group">
              {c.gallery ? (
                <Link
                  to={`/admin/private-gallery/${c.gallery._id}`}
                  className="client-button"
                >
                  Voir / gérer la galerie
                </Link>
              ) : (
                <span className="no-gallery">Aucune galerie associée</span>
              )}

              <button
                className="delete-client-button"
                onClick={() => confirmDeleteClient(c._id)}
              >
                🗑️ Supprimer le client
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modale de confirmation stylisée */}
      <ConfirmModal
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ message: "", onConfirm: null })}
      />
    </div>
  );
};

// ✅ Composant d’alerte stylisée
const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      <button className="alert-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

// ✅ Composant de confirmation stylisée
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Confirmation</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Oui, supprimer
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateGalleryAdminPanel;

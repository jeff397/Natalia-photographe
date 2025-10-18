import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadPrivatePhoto from "./UploadPrivatePhoto";
import "./adminPrivateGallery.css";

const AdminPrivateGallery = () => {
  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const fetchClients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/private-users`);
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async () => {
    if (!newClientName || !newUsername)
      return alert("Tous les champs sont obligatoires");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/private-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newClientName,
          username: newUsername,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erreur lors de la création");

      setClients((prev) => [...prev, data]);
      setNewClientName("");
      setNewUsername("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="admin-gallery-container">
      <h1>Galeries privées - Admin</h1>

      <div className="create-client-form">
        <h2>Créer un client</h2>
        <input
          type="text"
          placeholder="Nom du client"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Identifiant (username)"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleAddClient}>Créer le client</button>
      </div>

      <div className="clients-list">
        <h2>Clients existants</h2>
        {clients.map((c) => (
          <div key={c._id} className="client-card">
            <strong>{c.clientName}</strong>
            <p>
              Identifiant : <code>{c.username}</code> <br />
              Mot de passe : <code>{c.password || "******"}</code>
            </p>
            <UploadPrivatePhoto userId={c._id} onPhotoAdded={fetchClients} />
            <a href={`/private-gallery/${c.gallery?._id}`} target="_blank">
              Voir galerie
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPrivateGallery;

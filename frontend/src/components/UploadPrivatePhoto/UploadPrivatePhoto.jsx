import { useState } from "react";

// ✅ FIX
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const UploadPrivatePhoto = ({ userId, onPhotoAdded }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Sélectionnez une photo");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      // ⚠️ on garde tel quel si déjà fonctionnel
      const resCloud = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await resCloud.json();

      // ✅ FIX ICI
      await fetch(`${BACKEND_URL}/private-users/${userId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setFile(null);
      onPhotoAdded();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    }
  };

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Uploader</button>
    </div>
  );
};

export default UploadPrivatePhoto;

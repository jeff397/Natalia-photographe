const BACKEND_URL = import.meta.env.VITE_API_URL;

export { uploadImageToServer as uploadImage };

export const uploadImageToServer = async (
  file,
  title,
  description,
  category
) => {
  if (!file || !title || !description || !category) {
    throw new Error("Tous les champs sont obligatoires pour l'upload.");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio_upload");

    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dczxdautr/image/upload",
      { method: "POST", body: formData }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok || !uploadData.secure_url) {
      throw new Error(
        uploadData.error?.message || "Échec de l'upload vers Cloudinary"
      );
    }

    const payload = {
      imageUrl: uploadData.secure_url,
      public_id: uploadData.public_id,
      title,
      description,
      category,
    };

    const backendRes = await fetch(`${BACKEND_URL}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      throw new Error(
        data.message || "Erreur lors de l'enregistrement côté serveur"
      );
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'image :", error);
    throw error;
  }
};

export const fetchPhotos = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/photos`);
    const data = await res.json();

    if (!Array.isArray(data))
      throw new Error("Les données retournées ne sont pas un tableau");

    const ids = new Set();
    const validatedData = data.filter((photo) => {
      if (!photo._id || ids.has(photo._id)) return false;
      ids.add(photo._id);
      return true;
    });

    if (validatedData.length === 0)
      throw new Error("Aucune photo valide n'a été retournée");

    return validatedData;
  } catch (error) {
    console.error("Erreur lors du chargement des photos :", error);
    throw error;
  }
};

export const deleteImage = async (id, publicId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/photos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok)
      throw new Error("Erreur lors de la suppression de l'image");

    return response;
  } catch (error) {
    console.error("Erreur dans deleteImage:", error);
    throw error;
  }
};

export const fetchReportings = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/reportings`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erreur lors du chargement des reportages :", err);
    return [];
  }
};

// services/api.js

// Fonction pour créer un nouveau reportage
export const uploadReporting = async (file, title, subtitle) => {
  try {
    // Étape 1 → upload sur Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio_upload");

    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dczxdautr/image/upload",
      { method: "POST", body: formData }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok || !uploadData.secure_url) {
      throw new Error("Échec de l'upload Cloudinary");
    }

    // Étape 2 → envoi des infos au backend
    const payload = {
      title,
      subtitle,
      cover: uploadData.secure_url, // ⚡️ URL Cloudinary
      public_id: uploadData.public_id,
    };

    const backendRes = await fetch(`${BACKEND_URL}/reportings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!backendRes.ok) {
      throw new Error("Erreur enregistrement reportage côté serveur");
    }

    return await backendRes.json();
  } catch (err) {
    console.error("Erreur uploadReporting:", err);
    throw err;
  }
};

export const deleteReporting = async (id) => {
  const res = await fetch(`${BACKEND_URL}/reportings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du reportage");
  return res.json();
};

// api.js (ajout à la fin ou avec les autres exports)

export const updateReporting = async (id, data) => {
  const res = await fetch(`${BACKEND_URL}/reportings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const updatedData = await res.json();
  if (!res.ok) throw new Error(updatedData.message || "Erreur mise à jour");
  return updatedData;
};

const BACKEND_URL = "https://natalia-photographe.onrender.com/photos";

export const uploadImageToServer = async (
  file,
  title,
  description,
  category
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "portfolio_upload");

  try {
    // Upload sur Cloudinary
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

    // Enregistrement dans ton backend Render
    const backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: uploadData.secure_url,
        public_id: uploadData.public_id,
        title,
        description,
        category,
      }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      throw new Error(
        data.message || "Erreur lors de l'enregistrement côté serveur"
      );
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'image:", error);
    throw error;
  }
};

export const fetchPhotos = async () => {
  try {
    const res = await fetch(BACKEND_URL);
    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Les données retournées ne sont pas un tableau");
    }

    const ids = new Set();
    const validatedData = data.filter((photo) => {
      if (!photo._id || ids.has(photo._id)) return false;
      ids.add(photo._id);
      return true;
    });

    if (validatedData.length === 0) {
      throw new Error("Aucune photo valide n'a été retournée");
    }

    return validatedData;
  } catch (error) {
    console.error("Erreur lors du chargement des photos:", error);
    throw error;
  }
};

export const deleteImage = async (id, publicId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'image");
    }

    return response;
  } catch (error) {
    console.error("Erreur dans deleteImage:", error);
    throw error;
  }
};

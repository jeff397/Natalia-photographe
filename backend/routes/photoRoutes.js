import express from "express";
import { upload } from "../utils/cloudinary.js";
import { cloudinary } from "../utils/cloudinary.js";
import Photo from "../models/photos.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des photos :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des photos" });
  }
});
router.post("/", async (req, res) => {
  const { imageUrl, public_id, title, description, category } = req.body;

  if (!imageUrl || !title || !description || !category) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const newPhoto = new Photo({
      imageUrl,
      public_id,
      title,
      description,
      category,
      url: imageUrl,
    });
    await newPhoto.save();

    res.status(200).json({
      message: "✅ Image enregistrée en base",
      photo: newPhoto,
    });
  } catch (err) {
    console.error("❌ Erreur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
router.get("/presentation", async (req, res) => {
  try {
    const presentationImage = await Photo.findOne().sort({ createdAt: -1 });

    if (!presentationImage) {
      return res
        .status(404)
        .json({ message: "Aucune image de présentation trouvée" });
    }

    res.json(presentationImage);
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération de l'image de présentation :",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { publicId } = req.query; // ← changement ici

  console.log("ID reçu:", id);
  console.log("public_id reçu:", publicId);

  if (!publicId) {
    return res.status(400).json({ error: "public_id manquant" });
  }

  try {
    console.log(
      "🔍 Suppression de l'image Cloudinary avec public_id:",
      publicId
    );
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
    console.log("Résultat Cloudinary:", cloudinaryResult);

    if (cloudinaryResult.result !== "ok") {
      return res.status(500).json({
        error: "Erreur lors de la suppression de l'image sur Cloudinary",
      });
    }

    const deletedPhoto = await Photo.findByIdAndDelete(id);
    console.log("Photo supprimée de MongoDB:", deletedPhoto);

    if (!deletedPhoto) {
      return res
        .status(404)
        .json({ error: "Photo non trouvée dans la base de données" });
    }

    res.status(200).json({ message: "Image supprimée avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'image:", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression de l'image" });
  }
});

export default router;

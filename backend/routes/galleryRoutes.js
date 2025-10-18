import express from "express";
import { upload } from "../utils/cloudinary.js";
import { Gallery } from "../models/gallery.js";

const router = express.Router();

// --- GET galerie par ID ---
router.get("/:id", async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery)
      return res.status(404).json({ message: "Galerie non trouvée" });
    res.json(gallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- Ajouter une photo à une galerie ---
router.post("/:galleryId/photos", upload.single("image"), async (req, res) => {
  try {
    const { galleryId } = req.params;
    const { title } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Aucun fichier reçu" });

    const imageUrl = req.file.path;
    const public_id = req.file.filename;

    const gallery = await Gallery.findById(galleryId);
    if (!gallery)
      return res.status(404).json({ message: "Galerie non trouvée" });

    gallery.photos.push({ title, imageUrl, public_id });
    await gallery.save();

    res.json({
      message: "✅ Photo ajoutée sur Cloudinary",
      photo: { title, imageUrl },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;

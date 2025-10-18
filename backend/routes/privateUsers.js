import express from "express";
import axios from "axios";
import PrivateUser from "../models/privateUser.js";
import { Gallery } from "../models/gallery.js";
import { cloudinary } from "../utils/cloudinary.js";
import path from "path";
import archiver from "archiver";
import { PassThrough } from "stream";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// GET /api/private-users → liste tous les clients
router.get("/", async (req, res) => {
  try {
    const users = await PrivateUser.find().populate("gallery"); // ← peupler la galerie
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/private-users → crée un nouveau client
router.post("/", async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // Créer une galerie vide
    const gallery = new Gallery({ photos: [] });
    await gallery.save();

    // Créer le client avec la galerie associée
    const newUser = new PrivateUser({
      clientName: name,
      username,
      password,
      gallery: gallery._id,
    });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/photos", upload.single("image"), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery)
      return res.status(404).json({ message: "Galerie non trouvée" });

    const { title } = req.body;
    const imageUrl = req.file.path; // Cloudinary URL
    const public_id = req.file.filename; // Cloudinary public_id

    gallery.photos.push({ imageUrl, title, public_id });
    await gallery.save();

    res.status(201).json(gallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/galleries/:id
router.get("/galleries/:id", async (req, res) => {
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

// POST /api/private-users/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const user = await PrivateUser.findOne({ username, password }).populate(
      "gallery"
    );
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    res.json({
      galleryId: user.gallery._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/private-users/photos/:photoId
router.delete("/photos/:photoId", async (req, res) => {
  try {
    const { photoId } = req.params;
    console.log("🗑️ Suppression de la photo :", photoId);

    // 1️⃣ Trouver la galerie contenant la photo
    const gallery = await Gallery.findOne({ "photos._id": photoId });
    if (!gallery) {
      console.log("⚠️ Galerie non trouvée pour cette photo.");
      return res.status(404).json({ message: "Galerie non trouvée" });
    }

    // 2️⃣ Trouver la photo dans la galerie
    const photo = gallery.photos.find((p) => p._id.toString() === photoId);
    if (!photo) {
      console.log("⚠️ Photo introuvable dans la galerie :", gallery._id);
      return res.status(404).json({ message: "Photo non trouvée" });
    }

    console.log("📸 Photo trouvée :", photo.public_id);

    // 3️⃣ Supprimer sur Cloudinary (important)
    try {
      await cloudinary.uploader.destroy(photo.public_id);
      console.log("✅ Photo supprimée de Cloudinary :", photo.public_id);
    } catch (cloudErr) {
      console.error("⚠️ Erreur Cloudinary :", cloudErr);
    }

    // 4️⃣ Supprimer du tableau `photos` dans MongoDB
    gallery.photos = gallery.photos.filter((p) => p._id.toString() !== photoId);

    await gallery.save();
    console.log("✅ Photo supprimée de MongoDB :", photoId);

    res.status(200).json({ message: "Photo supprimée avec succès" });
  } catch (err) {
    console.error("❌ Erreur dans la suppression :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/private-users/:id → supprime un client + sa galerie + ses photos
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await PrivateUser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    // 🔹 Si le client a une galerie associée
    if (user.gallery) {
      const gallery = await Gallery.findById(user.gallery);

      if (gallery && gallery.photos && gallery.photos.length > 0) {
        // Supprimer chaque photo de Cloudinary
        for (const photo of gallery.photos) {
          try {
            await cloudinary.uploader.destroy(photo.public_id);
            console.log(
              `✅ Photo supprimée de Cloudinary : ${photo.public_id}`
            );
          } catch (err) {
            console.warn(
              `⚠️ Erreur suppression Cloudinary (${photo.public_id}) :`,
              err.message
            );
          }
        }

        // Supprimer la galerie dans MongoDB
        await Gallery.findByIdAndDelete(user.gallery);
        console.log("✅ Galerie supprimée :", user.gallery);
      }
    }

    // Supprimer le client
    await PrivateUser.findByIdAndDelete(id);
    console.log("✅ Client supprimé :", id);

    res.json({ message: "Client et galerie supprimés avec succès" });
  } catch (err) {
    console.error("❌ Erreur suppression client :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id/download", async (req, res) => {
  try {
    const galleryId = req.params.id;
    const gallery = await Gallery.findById(galleryId);

    if (!gallery) {
      return res.status(404).json({ message: "Galerie non trouvée" });
    }

    const photos = gallery.photos;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="galerie-${galleryId}.zip"`
    );
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const photo of photos) {
      const response = await axios.get(photo.imageUrl, {
        responseType: "stream",
      });
      archive.append(response.data, {
        name: `${photo.title || photo._id}.jpg`,
      });
    }

    await archive.finalize();
  } catch (err) {
    console.error("Erreur lors de la création du zip :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;

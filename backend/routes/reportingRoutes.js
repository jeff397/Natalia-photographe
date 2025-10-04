// routes/reportingRoutes.js
import express from "express";
import Reporting from "../models/reporting.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// GET /api/reportings
router.get("/", async (req, res) => {
  try {
    const reportings = await Reporting.find().sort({ date: -1 });
    res.json(reportings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// routes/reportingRoutes.js

// POST /api/reportings
router.post("/", async (req, res) => {
  try {
    const { title, subtitle, cover, public_id } = req.body;

    if (!title || !cover) {
      return res.status(400).json({ message: "Titre et image requis" });
    }

    const newReporting = new Reporting({
      title,
      subtitle,
      cover, // ⚡️ ici on stocke directement l’URL Cloudinary
      public_id, // utile si tu veux supprimer ensuite
    });

    await newReporting.save();
    res.status(201).json(newReporting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour un reportage
// Mettre à jour un reportage
router.put("/:id", async (req, res) => {
  try {
    const { intro } = req.body; // ✅ utiliser intro
    const reporting = await Reporting.findById(req.params.id);
    if (!reporting) return res.status(404).json({ message: "Non trouvé" });

    reporting.intro = intro ?? reporting.intro; // ✅ mettre à jour intro
    await reporting.save();
    res.json(reporting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter une photo
router.post("/photos", async (req, res) => {
  const { imageUrl, public_id, reportingId } = req.body;
  const reporting = await Reporting.findById(reportingId);
  if (!reporting)
    return res.status(404).json({ message: "Reporting non trouvé" });
  const photo = { imageUrl, public_id };
  reporting.photos.push(photo);
  await reporting.save();
  res.status(201).json(photo);
});

router.delete("/:id", async (req, res) => {
  try {
    const reporting = await Reporting.findById(req.params.id);
    if (!reporting) {
      return res.status(404).json({ message: "Reportage non trouvé" });
    }

    if (reporting.public_id) {
      await cloudinary.uploader.destroy(reporting.public_id);
    } else {
      console.warn("⚠️ Pas de public_id, suppression Cloudinary ignorée");
    }

    await Reporting.findByIdAndDelete(req.params.id);

    res.json({ message: "Reportage supprimé avec succès" });
  } catch (err) {
    console.error("Erreur DELETE reporting :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;

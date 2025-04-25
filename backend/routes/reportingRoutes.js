import express from "express";
import multer from "multer";
import { cloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const storage = multer.memoryStorage();
const uploadLocal = multer({ storage: storage });
router.post("/", uploadLocal.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file;
    console.log("Image dans req.file:", image);

    if (!image || !title) {
      return res.status(400).json({ message: "Image et titre requis" });
    }
    const result = await cloudinary.uploader.upload(image.buffer, {
      folder: "reportings",
    });
    const newCard = {
      id: Date.now().toString(),
      title,
      cover: result.secure_url,
    };
    const jsonPath = path.join("Data", "reportingList.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    data.push(newCard);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    res.status(201).json({ message: "Card ajoutée avec succès", newCard });
  } catch (err) {
    console.error("Erreur lors de l'ajout :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;

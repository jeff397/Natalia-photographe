import express from "express";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

// --- GET all testimonials ---
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- POST a new testimonial ---
router.post("/", async (req, res) => {
  try {
    const { author, quote } = req.body;
    if (!author || !quote) {
      return res.status(400).json({ message: "Auteur et citation requis" });
    }

    const newTestimonial = new Testimonial({ author, quote });
    await newTestimonial.save();

    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- DELETE a testimonial by id ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Témoignage non trouvé" });
    res.json({ message: "Témoignage supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;

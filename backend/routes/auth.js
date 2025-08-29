import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// --- Création d'un utilisateur ---
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Utilisateur déjà existant ❌" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "✅ Utilisateur créé avec succès !" });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err);
    res.status(500).json({ error: "Erreur serveur ❌" });
  }
});

// --- Connexion d'un utilisateur ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Utilisateur non trouvé ❌" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe incorrect ❌" });
    }
    res.status(200).json({ message: "🎉 Vous êtes bien connecté !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur ❌" });
  }
});

export default router;

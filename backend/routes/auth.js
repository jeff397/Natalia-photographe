import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
const router = express.Router();
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
    res.status(200).json({ message: "Vous êtes bien connecté 🎉" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur ❌" });
  }
});

export default router;

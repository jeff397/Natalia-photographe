import express from "express";
import { cloudinary, upload } from "./utils/cloudinary.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import photoRoutes from "./routes/photoRoutes.js";
import authRoutes from "./routes/auth.js";
import reportingRoutes from "./routes/reportingRoutes.js";
import testimonialRoutes from "./routes/testimonials.js";
import privateUsersRoutes from "./routes/privateUsers.js";
import galleryRoutes from "./routes/galleryRoutes.js";

dotenv.config();

const app = express();

// Middleware CORS et body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Test Multer pour l'upload
app.use("/api/photos/upload", upload.single("image"), (req, res, next) => {
  console.log("Test multer");
  console.log("req.file:", req.file);
  next();
});

// --- Routes API ---
app.use("/api/photos", photoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reportings", reportingRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/private-users", privateUsersRoutes);
app.use("/api/galleries", galleryRoutes);

// --- Route racine pour tester le backend ---
app.get("/", (req, res) => {
  res.send("Backend en ligne ✅");
});

const PORT = import.meta.env.PORT || 5000;

// Connexion à MongoDB et démarrage du serveur
mongoose
  .connect(import.meta.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur démarré sur le port ${PORT}`),
    );
  })
  .catch((err) => console.log("❌ Erreur de connexion à MongoDB :", err));

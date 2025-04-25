import express from "express";
import { cloudinary, upload } from "./utils/cloudinary.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import photoRoutes from "./routes/photoRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/photos/upload", upload.single("image"), (req, res, next) => {
  console.log("Test multer");
  console.log("req.file:", req.file);
  next();
});

app.use("/api/photos", photoRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connecté à MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur démarré sur le port ${PORT}`)
    );
  })
  .catch((err) => console.log("❌ Erreur de connexion à MongoDB :", err));

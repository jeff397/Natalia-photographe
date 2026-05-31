import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "myportfolio",
      format: "jpeg", // Force un format de sortie stable pour alléger le fichier
      resource_type: "auto",
      transformation: [{ width: 1200, height: 800, crop: "limit" }],
    };
  },
});

export { cloudinary };

// Modification ici : Ajout de la limite de taille à 10 Mo
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 10 Mo maximum par fichier
  },
});

import cloudinary from "../utils/cloudinary.js";
import Photo from "../models/photos.js";
export const addPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image téléchargée" });
    }
    const result = await cloudinary.uploader
      .upload(req.file.path, {
        folder: "myportfolio",
        resource_type: "image",
      })
      .catch((error) => {
        console.error("Erreur lors de l'upload sur Cloudinary :", error);
        throw error;
      });
    const newPhoto = new Photo({
      url: result.secure_url,
      public_id: result.public_id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
    });
    await newPhoto.save();
    res.status(200).json(newPhoto);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const getAllPhotos = async (req, res) => {};

export const addMultiplePhotos = async (req, res) => {
  try {
    const uploadedPhotos = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return { url: result.secure_url, public_id: result.public_id };
      })
    );
    res.status(200).json({ photos: uploadedPhotos });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Erreur lors de l'ajout des photos", error });
  }
};

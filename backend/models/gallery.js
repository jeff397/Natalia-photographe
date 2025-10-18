import mongoose from "mongoose";

const { Schema, model } = mongoose;

const GallerySchema = new Schema({
  photos: [
    {
      imageUrl: { type: String, required: true },
      title: { type: String },
      public_id: { type: String },
    },
  ],
});

export const Gallery =
  mongoose.models.Gallery || model("Gallery", GallerySchema);

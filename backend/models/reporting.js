import mongoose from "mongoose";

const reportingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    intro: { type: String }, // ton texte d'introduction
    cover: { type: String, required: false },
    public_id: { type: String, required: false },
    photos: [
      {
        imageUrl: String,
        title: String,
        description: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Reporting", reportingSchema);

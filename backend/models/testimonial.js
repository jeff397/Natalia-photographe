import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;

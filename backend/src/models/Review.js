import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, default: "Rider", trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true, maxlength: 1000 },
    avatar: { type: String, default: "🏍️" },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);

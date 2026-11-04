import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      minlength: [5, "Feedback message must be at least 5 characters"],
      maxlength: [2000, "Feedback message cannot exceed 2000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "RESOLVED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

feedbackSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
feedbackSchema.set("toJSON", { virtuals: true });
feedbackSchema.set("toObject", { virtuals: true });

export default mongoose.model("Feedback", feedbackSchema);

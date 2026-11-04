import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    emailCode: { type: String, required: true },
    phoneCode: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("VerificationCode", verificationCodeSchema);

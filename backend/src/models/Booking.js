import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    bike: { type: mongoose.Schema.Types.ObjectId, ref: "Bike", required: true },
    bikeSnapshot: {
      brand: String,
      name: String,
      image: String,
      pricePerDay: Number,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    pickup: {
      date: { type: String, required: true },
      location: { type: String, required: true },
    },
    return: {
      date: { type: String, required: true },
      location: { type: String, required: true },
    },
    rentalDays: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    rentalAmount: { type: Number, required: true },
    tax: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    specialInstructions: { type: String, default: "" },
    paymentMethod: { type: String, default: "Pay at Pickup" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "pending", "completed", "cancelled"],
      default: "confirmed",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

// Compound indexes for high-speed availability queries and double-booking checks
bookingSchema.index({ bike: 1, bookingStatus: 1, "pickup.date": 1, "return.date": 1 });
bookingSchema.index({ bookingStatus: 1, "pickup.date": 1, "return.date": 1 });

bookingSchema.virtual("id").get(function getId() {
  return this.bookingId;
});
bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

export default mongoose.model("Booking", bookingSchema);

import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Commuter", "Cruiser", "Adventure", "Sports", "Scooter", "Premium"],
    },
    engine: { type: Number, default: 0 },
    modelYear: { type: Number },
    mileage: { type: String, default: "" },
    fuelType: { type: String, default: "Petrol" },
    transmission: { type: String, default: "Manual" },
    pricePerDay: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    location: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Support the frontend's numeric `id` lookups (bike.id) alongside Mongo's _id.
bikeSchema.virtual("id").get(function getId() {
  return this._id.toHexString();
});
bikeSchema.set("toJSON", { virtuals: true });
bikeSchema.set("toObject", { virtuals: true });

export default mongoose.model("Bike", bikeSchema);

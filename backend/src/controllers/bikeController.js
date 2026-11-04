import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  checkSingleBikeAvailability,
  getFleetAvailability,
} from "../services/availabilityService.js";

// @route GET /api/bikes
// Supports ?search=&category=&brand=&minPrice=&maxPrice=&minEngine=&maxEngine=&minRating=&available=&sort=
export const getBikes = asyncHandler(async (req, res) => {
  const { search, category, brand, minPrice, maxPrice, minEngine, maxEngine, minRating, available, sort } = req.query;

  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ name: regex }, { brand: regex }, { model: regex }];
  }
  if (category) query.category = { $in: category.split(",") };
  if (brand) query.brand = { $in: brand.split(",") };
  if (minPrice !== undefined && maxPrice !== undefined) {
    query.pricePerDay = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }
  if (minEngine !== undefined && maxEngine !== undefined) {
    query.engine = { $gte: Number(minEngine), $lte: Number(maxEngine) };
  }
  if (minRating !== undefined) query.rating = { $gte: Number(minRating) };
  if (available !== undefined) query.available = available === "true";

  let cursor = Bike.find(query);

  switch (sort) {
    case "price-low":
      cursor = cursor.sort({ pricePerDay: 1 });
      break;
    case "price-high":
      cursor = cursor.sort({ pricePerDay: -1 });
      break;
    case "rating":
      cursor = cursor.sort({ rating: -1 });
      break;
    case "popularity":
      cursor = cursor.sort({ reviews: -1 });
      break;
    default:
      cursor = cursor.sort({ createdAt: -1 });
  }

  const bikes = await cursor;
  res.json({ success: true, count: bikes.length, bikes });
});

// @route GET /api/bikes/available-fleet
// Returns all unreserved bikes in the fleet for a specific date window
export const getAvailableFleetHandler = asyncHandler(async (req, res) => {
  const {
    pickupDate,
    returnDate,
    durationDays,
    duration,
    category,
    brand,
    location,
    minPrice,
    maxPrice,
    limit,
    page,
  } = req.query;

  const resolvedDuration = durationDays || duration;

  const result = await getFleetAvailability({
    pickupDate,
    returnDate,
    durationDays: resolvedDuration,
    category,
    brand,
    location,
    minPrice,
    maxPrice,
    limit,
    page,
  });

  const statusCode = result.statusCode || (result.success ? 200 : 400);
  const responsePayload = { ...result };
  delete responsePayload.statusCode;

  return res.status(statusCode).json(responsePayload);
});

// @route POST /api/bikes/check-availability
// Checks real-time availability for a specific bike by name, model, brand or ID
export const checkBikeAvailabilityHandler = asyncHandler(async (req, res) => {
  const {
    bikeIdentifier,
    bikeId,
    name,
    brand,
    model,
    pickupDate,
    returnDate,
    durationDays,
    duration,
  } = req.body;

  const resolvedIdentifier = bikeIdentifier || bikeId || name || model || brand;
  const resolvedDuration = durationDays || duration;

  const result = await checkSingleBikeAvailability({
    bikeIdentifier: resolvedIdentifier,
    pickupDate,
    returnDate,
    durationDays: resolvedDuration,
  });

  const statusCode = result.statusCode || (result.success ? 200 : 400);
  const responsePayload = { ...result };
  delete responsePayload.statusCode;

  return res.status(statusCode).json(responsePayload);
});

// @route GET /api/bikes/:id
export const getBikeById = asyncHandler(async (req, res) => {
  const bike = await Bike.findById(req.params.id);
  if (!bike) return res.status(404).json({ success: false, message: "Bike not found." });
  res.json({ success: true, bike });
});

// @route POST /api/bikes (admin)
export const createBike = asyncHandler(async (req, res) => {
  const bike = await Bike.create(req.body);
  res.status(201).json({ success: true, bike });
});

// @route PUT /api/bikes/:id (admin)
export const updateBike = asyncHandler(async (req, res) => {
  const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bike) return res.status(404).json({ success: false, message: "Bike not found." });
  res.json({ success: true, bike });
});

// @route DELETE /api/bikes/:id (admin)
export const deleteBike = asyncHandler(async (req, res) => {
  const bike = await Bike.findById(req.params.id);
  if (!bike) return res.status(404).json({ success: false, message: "Bike not found." });

  const activeBooking = await Booking.findOne({
    bike: bike._id,
    bookingStatus: { $in: ["confirmed", "pending"] },
  });
  if (activeBooking) {
    return res.status(409).json({ success: false, message: "This bike has active bookings and cannot be deleted." });
  }

  await bike.deleteOne();
  res.json({ success: true, message: "Bike deleted." });
});

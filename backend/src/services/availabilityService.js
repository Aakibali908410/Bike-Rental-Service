import mongoose from "mongoose";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";
import { calculateRentalDays, getPriceBreakdown } from "../utils/pricing.js";

/**
 * Returns today's date formatted as YYYY-MM-DD in the Asia/Kolkata timezone.
 */
export const getKolkataTodayString = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
};

/**
 * Validates whether a string is in YYYY-MM-DD format and is a valid calendar date.
 */
export const isValidDateString = (dateStr) => {
  if (typeof dateStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
};

/**
 * Adds a number of days to a YYYY-MM-DD date string using UTC arithmetic.
 */
export const addDaysToDateString = (dateStr, days) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day + Number(days)));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dt = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dt}`;
};

/**
 * Resolves and validates pickupDate, returnDate, and durationDays.
 */
export const resolveDateRange = (rawPickupDate, rawReturnDate, rawDuration) => {
  const today = getKolkataTodayString();

  if (!rawPickupDate) {
    return {
      valid: false,
      status: "INVALID_DATES",
      message: "Pickup date is required.",
    };
  }

  const pickupDate = String(rawPickupDate).trim();
  if (!isValidDateString(pickupDate)) {
    return {
      valid: false,
      status: "INVALID_DATES",
      message: "Pickup date must be a valid date in YYYY-MM-DD format.",
    };
  }

  if (pickupDate < today) {
    return {
      valid: false,
      status: "INVALID_DATES",
      message: "Pickup date cannot be in the past.",
    };
  }

  let returnDate = rawReturnDate ? String(rawReturnDate).trim() : null;

  if (!returnDate) {
    const durationNum = Number(rawDuration);
    if (!durationNum || durationNum < 1 || !Number.isInteger(durationNum)) {
      return {
        valid: false,
        status: "INVALID_DATES",
        message: "Return date or a valid positive rental duration in days is required.",
      };
    }
    returnDate = addDaysToDateString(pickupDate, durationNum);
  } else if (!isValidDateString(returnDate)) {
    return {
      valid: false,
      status: "INVALID_DATES",
      message: "Return date must be a valid date in YYYY-MM-DD format.",
    };
  }

  if (returnDate <= pickupDate) {
    return {
      valid: false,
      status: "INVALID_DATES",
      message: "Return date must be at least one day after pickup date.",
    };
  }

  const rentalDays = calculateRentalDays(pickupDate, returnDate);
  if (rentalDays < 1) {
    return {
      valid: false,
      status: "INVALID_DATES",
      message: "Rental duration must be at least one day.",
    };
  }

  return {
    valid: true,
    pickupDate,
    returnDate,
    rentalDays,
    today,
  };
};

/**
 * Searches for a bike by ObjectId, exact name, model, brand, or partial match.
 */
export const findBikeByIdentifier = async (identifier) => {
  if (!identifier || typeof identifier !== "string") return null;
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  // 1. Valid ObjectId
  if (mongoose.isValidObjectId(trimmed)) {
    const bike = await Bike.findById(trimmed);
    if (bike) return bike;
  }

  // 2. Escape regex characters for safe querying
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 3. Exact case-insensitive match on name
  let bike = await Bike.findOne({ name: new RegExp(`^${escaped}$`, "i") });
  if (bike) return bike;

  // 4. Exact case-insensitive match on model or brand
  bike = await Bike.findOne({
    $or: [
      { model: new RegExp(`^${escaped}$`, "i") },
      { brand: new RegExp(`^${escaped}$`, "i") },
    ],
  });
  if (bike) return bike;

  // 5. Case-insensitive substring match on name or model
  bike = await Bike.findOne({
    $or: [
      { name: new RegExp(escaped, "i") },
      { model: new RegExp(escaped, "i") },
    ],
  }).sort({ available: -1, rating: -1 });

  return bike;
};

/**
 * Checks if a specific bike has any overlapping confirmed or pending bookings.
 * Cancelled or completed bookings do not block availability.
 */
export const hasBikeBookingConflict = async (bikeId, pickupDate, returnDate) => {
  const conflict = await Booking.findOne({
    bike: bikeId,
    bookingStatus: { $in: ["confirmed", "pending"] },
    "pickup.date": { $lt: returnDate },
    "return.date": { $gt: pickupDate },
  }).select("_id");

  return Boolean(conflict);
};

/**
 * Sanitizes a Bike document for safe public API exposure.
 * Never includes customer, user, booking or transaction data.
 */
export const sanitizeBike = (bike) => {
  if (!bike) return null;
  return {
    id: bike.id || bike._id.toString(),
    _id: bike._id,
    brand: bike.brand,
    model: bike.model,
    name: bike.name,
    category: bike.category,
    engine: bike.engine,
    modelYear: bike.modelYear,
    mileage: bike.mileage,
    fuelType: bike.fuelType,
    transmission: bike.transmission,
    pricePerDay: bike.pricePerDay,
    securityDeposit: bike.securityDeposit || 0,
    rating: bike.rating,
    reviews: bike.reviews,
    location: bike.location,
    image: bike.image,
    features: bike.features || [],
    available: Boolean(bike.available),
  };
};

/**
 * Finds verified available alternative bikes in the same category during the requested dates.
 */
export const getVerifiedAlternativeBikes = async (category, excludeBikeId, pickupDate, returnDate, limit = 3) => {
  // Find all conflicting bike IDs in the date window
  const conflictingBookings = await Booking.find({
    bookingStatus: { $in: ["confirmed", "pending"] },
    "pickup.date": { $lt: returnDate },
    "return.date": { $gt: pickupDate },
  }).distinct("bike");

  const query = {
    _id: { $nin: [...conflictingBookings, excludeBikeId] },
    available: true,
  };
  if (category) {
    query.category = category;
  }

  const alternativeBikes = await Bike.find(query)
    .sort({ rating: -1, pricePerDay: 1 })
    .limit(limit);

  const days = calculateRentalDays(pickupDate, returnDate);

  return alternativeBikes.map((alt) => ({
    bike: sanitizeBike(alt),
    pricing: getPriceBreakdown(alt.pricePerDay, alt.securityDeposit, days),
  }));
};

/**
 * Checks real-time availability for a single bike by name, model, brand, or ID.
 */
export const checkSingleBikeAvailability = async ({
  bikeIdentifier,
  pickupDate: rawPickupDate,
  returnDate: rawReturnDate,
  durationDays: rawDuration,
}) => {
  if (!bikeIdentifier || (typeof bikeIdentifier !== "string" && !mongoose.isValidObjectId(bikeIdentifier))) {
    return {
      success: false,
      statusCode: 400,
      status: "INVALID_INPUT",
      message: "Please specify a bike name, model, brand or bike ID.",
    };
  }

  const dateResult = resolveDateRange(rawPickupDate, rawReturnDate, rawDuration);
  if (!dateResult.valid) {
    return {
      success: false,
      statusCode: 400,
      status: dateResult.status,
      message: dateResult.message,
    };
  }

  const { pickupDate, returnDate, rentalDays } = dateResult;

  const bike = await findBikeByIdentifier(String(bikeIdentifier));
  if (!bike) {
    // Provide popular verified bike names as suggestions
    const popularBikes = await Bike.find({ available: true })
      .sort({ rating: -1 })
      .limit(4)
      .select("name brand");

    return {
      success: false,
      statusCode: 404,
      status: "BIKE_NOT_FOUND",
      message: `No bike found matching "${bikeIdentifier}".`,
      suggestions: {
        popularBikes: popularBikes.map((b) => `${b.brand} ${b.name}`),
      },
    };
  }

  // Check if the bike has been deactivated by admin in the catalogue
  if (!bike.available) {
    const alternativeBikes = await getVerifiedAlternativeBikes(
      bike.category,
      bike._id,
      pickupDate,
      returnDate,
      3
    );

    return {
      success: true,
      statusCode: 200,
      status: "NOT_AVAILABLE",
      available: false,
      message: `${bike.name} is currently inactive or under maintenance.`,
      bike: sanitizeBike(bike),
      dates: { pickupDate, returnDate, rentalDays },
      suggestions: {
        alternativeBikes,
      },
    };
  }

  // Check booking conflict with confirmed / pending bookings
  const isBooked = await hasBikeBookingConflict(bike._id, pickupDate, returnDate);

  const pricing = getPriceBreakdown(bike.pricePerDay, bike.securityDeposit, rentalDays);

  if (isBooked) {
    const alternativeBikes = await getVerifiedAlternativeBikes(
      bike.category,
      bike._id,
      pickupDate,
      returnDate,
      3
    );

    return {
      success: true,
      statusCode: 200,
      status: "NOT_AVAILABLE",
      available: false,
      message: `Sorry, ${bike.name} is already booked for the selected dates (${pickupDate} to ${returnDate}).`,
      bike: sanitizeBike(bike),
      dates: { pickupDate, returnDate, rentalDays },
      suggestions: {
        alternativeBikes,
      },
    };
  }

  return {
    success: true,
    statusCode: 200,
    status: "AVAILABLE",
    available: true,
    message: `${bike.name} is available for rent from ${pickupDate} to ${returnDate}.`,
    bike: sanitizeBike(bike),
    dates: { pickupDate, returnDate, rentalDays },
    pricing,
  };
};

/**
 * Retrieves all bikes available in the fleet for a specific date range and optional criteria.
 */
export const getFleetAvailability = async ({
  pickupDate: rawPickupDate,
  returnDate: rawReturnDate,
  durationDays: rawDuration,
  category,
  brand,
  location,
  minPrice,
  maxPrice,
  limit = 20,
  page = 1,
}) => {
  const dateResult = resolveDateRange(rawPickupDate, rawReturnDate, rawDuration);
  if (!dateResult.valid) {
    return {
      success: false,
      statusCode: 400,
      status: dateResult.status,
      message: dateResult.message,
    };
  }

  const { pickupDate, returnDate, rentalDays } = dateResult;

  // Find all bike IDs with overlapping confirmed or pending bookings
  const conflictingBikeIds = await Booking.find({
    bookingStatus: { $in: ["confirmed", "pending"] },
    "pickup.date": { $lt: returnDate },
    "return.date": { $gt: pickupDate },
  }).distinct("bike");

  const query = {
    _id: { $nin: conflictingBikeIds },
    available: true,
  };

  if (category) {
    const categories = category.split(",").map((c) => c.trim()).filter(Boolean);
    if (categories.length > 0) query.category = { $in: categories };
  }

  if (brand) {
    const brands = brand.split(",").map((b) => b.trim()).filter(Boolean);
    if (brands.length > 0) query.brand = { $in: brands };
  }

  if (location) {
    query.location = new RegExp(location.trim(), "i");
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    query.pricePerDay = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else if (minPrice !== undefined) {
    query.pricePerDay = { $gte: Number(minPrice) };
  } else if (maxPrice !== undefined) {
    query.pricePerDay = { $lte: Number(maxPrice) };
  }

  const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 50);
  const safePage = Math.max(1, Number(page) || 1);
  const skip = (safePage - 1) * safeLimit;

  const [totalAvailable, bikes] = await Promise.all([
    Bike.countDocuments(query),
    Bike.find(query).sort({ rating: -1, pricePerDay: 1 }).skip(skip).limit(safeLimit),
  ]);

  const items = bikes.map((bike) => ({
    bike: sanitizeBike(bike),
    pricing: getPriceBreakdown(bike.pricePerDay, bike.securityDeposit, rentalDays),
  }));

  return {
    success: true,
    statusCode: 200,
    status: "AVAILABLE",
    dates: { pickupDate, returnDate, rentalDays },
    count: items.length,
    totalAvailable,
    page: safePage,
    totalPages: Math.ceil(totalAvailable / safeLimit) || 1,
    bikes: items,
  };
};


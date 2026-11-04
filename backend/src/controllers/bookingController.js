import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateRentalDays, getPriceBreakdown } from "../utils/pricing.js";

// Timezone-safe local date in YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateBookingId = async (session = null) => {
  const date = getTodayString().replaceAll("-", "");
  let id;
  let exists = true;
  while (exists) {
    id = `AMR-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
    const query = Booking.exists({ bookingId: id });
    if (session) query.session(session);
    // eslint-disable-next-line no-await-in-loop
    exists = await query;
  }
  return id;
};

// @route POST /api/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { bikeId, customer, pickup, return: returnInfo, specialInstructions } = req.body;

  if (!bikeId || !pickup?.date || !pickup?.location || !returnInfo?.date || !returnInfo?.location) {
    return res.status(400).json({ success: false, message: "Bike, pickup and return details are required." });
  }

  if (!mongoose.isValidObjectId(bikeId)) {
    return res.status(404).json({ success: false, message: "Bike not found." });
  }

  const today = getTodayString();
  if (pickup.date < today) {
    return res.status(400).json({ success: false, message: "Choose a valid pickup date." });
  }
  if (returnInfo.date <= pickup.date) {
    return res.status(400).json({ success: false, message: "Return date must be at least one day after pickup." });
  }

  const customerName = (customer?.name || req.user.name || "").trim();
  const customerPhone = (customer?.phone || req.user.phone || "").trim();
  if (!customerName) {
    return res.status(400).json({ success: false, message: "Customer name is required." });
  }
  if (!customerPhone) {
    return res.status(400).json({ success: false, message: "Customer phone is required." });
  }

  // Use MongoDB session and transaction if supported to prevent race conditions on double bookings
  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch {
    if (session) {
      try {
        session.endSession();
      } catch {}
      session = null;
    }
    useTransaction = false;
  }

  try {
    // Acquire lock / check bike availability
    const bike = useTransaction
      ? await Bike.findOneAndUpdate(
          { _id: bikeId, available: true },
          { $inc: { __v: 1 } },
          { session, returnDocument: "after" }
        )
      : await Bike.findOne({ _id: bikeId, available: true });

    if (!bike) {
      const existingBike = await Bike.findById(bikeId);
      if (useTransaction && session) {
        await session.abortTransaction();
        session.endSession();
      }
      if (!existingBike) {
        return res.status(404).json({ success: false, message: "Bike not found." });
      }
      return res.status(409).json({ success: false, message: "This bike is currently unavailable." });
    }

    // Check for overlapping bookings
    const conflictQuery = {
      bike: bike._id,
      bookingStatus: { $in: ["confirmed", "pending"] },
      "pickup.date": { $lt: returnInfo.date },
      "return.date": { $gt: pickup.date },
    };
    const conflict = await (useTransaction && session
      ? Booking.findOne(conflictQuery).session(session)
      : Booking.findOne(conflictQuery));

    if (conflict) {
      if (useTransaction && session) {
        await session.abortTransaction();
        session.endSession();
      }
      return res.status(409).json({
        success: false,
        message: "Sorry, this bike is already booked for the selected dates. Please choose different dates.",
      });
    }

    const days = calculateRentalDays(pickup.date, returnInfo.date);
    const { rentalAmount, tax, securityDeposit, totalAmount } = getPriceBreakdown(
      bike.pricePerDay,
      bike.securityDeposit,
      days
    );

    const bookingId = await generateBookingId(session);
    const bookingData = {
      bookingId,
      bike: bike._id,
      bikeSnapshot: {
        brand: bike.brand,
        name: bike.name,
        image: bike.image,
        pricePerDay: bike.pricePerDay,
      },
      user: req.user._id,
      customer: {
        name: customerName,
        email: req.user.email,
        phone: customerPhone,
      },
      pickup,
      return: returnInfo,
      rentalDays: days,
      pricePerDay: bike.pricePerDay,
      rentalAmount,
      tax,
      securityDeposit,
      totalAmount,
      specialInstructions: specialInstructions || "",
      paymentMethod: "Pay at Pickup",
      paymentStatus: "pending",
      bookingStatus: "confirmed",
    };

    let newBooking;
    if (useTransaction && session) {
      const created = await Booking.create([bookingData], { session });
      newBooking = created[0];
      await session.commitTransaction();
      session.endSession();
    } else {
      newBooking = await Booking.create(bookingData);
    }

    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    if (useTransaction && session) {
      try {
        await session.abortTransaction();
      } catch {}
      try {
        session.endSession();
      } catch {}
    }
    throw err;
  }
});

// @route GET /api/bookings/mine
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// @route GET /api/bookings/:bookingId
export const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const query = mongoose.isValidObjectId(bookingId)
    ? { $or: [{ bookingId }, { _id: bookingId }] }
    : { bookingId };

  const booking = await Booking.findOne(query);
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

  const isOwner = booking.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "You do not have access to this booking." });
  }

  res.json({ success: true, booking });
});

// @route PUT /api/bookings/:bookingId/cancel
export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const query = mongoose.isValidObjectId(bookingId)
    ? { $or: [{ bookingId }, { _id: bookingId }] }
    : { bookingId };

  const booking = await Booking.findOne(query);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found." });
  }

  const isOwner = booking.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "You do not have access to cancel this booking." });
  }

  if (!["confirmed", "pending"].includes(booking.bookingStatus)) {
    return res.status(400).json({ success: false, message: "This booking cannot be cancelled." });
  }

  const today = getTodayString();
  if (booking.pickup.date <= today) {
    return res.status(400).json({ success: false, message: "Bookings cannot be cancelled after pickup has started." });
  }

  booking.bookingStatus = "cancelled";
  await booking.save();
  res.json({ success: true, booking });
});

// @route GET /api/bookings (admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// @route PUT /api/bookings/:bookingId (admin)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus, paymentStatus } = req.body;
  const { bookingId } = req.params;
  const query = mongoose.isValidObjectId(bookingId)
    ? { $or: [{ bookingId }, { _id: bookingId }] }
    : { bookingId };

  const booking = await Booking.findOne(query);
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

  if (bookingStatus) booking.bookingStatus = bookingStatus;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  await booking.save();

  res.json({ success: true, booking });
});

// @route GET /api/bookings/stats (admin)
export const getBookingStats = asyncHandler(async (req, res) => {
  const [totalBookings, activeRentals, completedRentals, pendingBookings, revenueAgg] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ bookingStatus: "confirmed" }),
    Booking.countDocuments({ bookingStatus: "completed" }),
    Booking.countDocuments({ bookingStatus: "pending" }),
    Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      totalBookings,
      activeRentals,
      completedRentals,
      pendingBookings,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});

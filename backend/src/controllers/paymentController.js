import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";

// Demo payment processing only. No real payment gateway is connected, and no
// real card credentials are ever accepted or stored.
const createPaymentId = async () => {
  let id;
  let exists = true;
  while (exists) {
    id = `AMR-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Payment.exists({ paymentId: id });
  }
  return id;
};

const createTransactionId = async () => {
  let id;
  let exists = true;
  while (exists) {
    id = `AMR-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    // eslint-disable-next-line no-await-in-loop
    exists = await Payment.exists({ transactionId: id });
  }
  return id;
};

// @route POST /api/payments
export const processPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentMethod, amount, shouldFail } = req.body;

  const booking = await Booking.findOne({ bookingId });
  if (!booking || booking.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ success: false, message: "Payment is not available for this booking." });
  }
  if (booking.bookingStatus !== "confirmed") {
    return res.status(400).json({ success: false, message: "This booking is no longer available for payment." });
  }
  if (Number(amount) !== Number(booking.totalAmount)) {
    return res.status(400).json({ success: false, message: "The payment amount could not be verified." });
  }

  const existingPaid = await Payment.findOne({ booking: booking._id, paymentStatus: "paid" });
  if (existingPaid || booking.paymentStatus === "paid") {
    return res.status(409).json({ success: false, alreadyPaid: true, payment: existingPaid, message: "Payment Already Completed" });
  }

  const normalizedMethod = paymentMethod === "pay_at_pickup" ? "pay_at_pickup" : paymentMethod;

  const existingPending = await Payment.findOne({ booking: booking._id, paymentStatus: "pending" });
  if (normalizedMethod === "pay_at_pickup" && existingPending) {
    booking.paymentMethod = "Pay at Pickup";
    booking.paymentStatus = "pending";
    await booking.save();
    return res.json({ success: true, payment: existingPending, booking });
  }

  const paymentStatus = shouldFail ? "failed" : normalizedMethod === "pay_at_pickup" ? "pending" : "paid";
  const transactionId = paymentStatus === "paid" ? await createTransactionId() : null;

  const payment = await Payment.create({
    paymentId: await createPaymentId(),
    booking: booking._id,
    user: req.user._id,
    amount: Number(booking.totalAmount),
    paymentMethod: normalizedMethod,
    paymentStatus,
    transactionId,
  });

  booking.paymentMethod = normalizedMethod === "pay_at_pickup" ? "Pay at Pickup" : normalizedMethod.toUpperCase();
  booking.paymentStatus = paymentStatus;
  if (transactionId) booking.transactionId = transactionId;
  await booking.save();

  res.status(paymentStatus === "failed" ? 402 : 201).json({
    success: paymentStatus !== "failed",
    paymentStatus,
    payment,
    booking,
    message: paymentStatus === "failed" ? "We could not process your demo payment." : "",
  });
});

// @route GET /api/payments/:idOrBookingId
export const getPayment = asyncHandler(async (req, res) => {
  const { idOrBookingId } = req.params;
  const booking = await Booking.findOne({ bookingId: idOrBookingId });

  const payment = await Payment.findOne({
    $or: [{ paymentId: idOrBookingId }, ...(booking ? [{ booking: booking._id }] : [])],
  });

  if (!payment || payment.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ success: false, message: "Payment not found." });
  }

  res.json({ success: true, payment });
});

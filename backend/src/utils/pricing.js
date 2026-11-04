// Mirrors src/utils/rentalPrice.js on the frontend so totals calculated
// server-side always match what the customer was shown.
export const TAX_RATE = 0.18;

const toLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

export const calculateRentalDays = (pickupDate, returnDate) => {
  const pickup = toLocalDate(pickupDate);
  const ret = toLocalDate(returnDate);
  if (!pickup || !ret || ret <= pickup) return 0;
  return Math.round((ret - pickup) / (1000 * 60 * 60 * 24));
};

export const calculateRentalAmount = (pricePerDay, days) =>
  Math.max(0, Number(pricePerDay) || 0) * Math.max(0, days);

export const calculateTax = (rentalAmount) => Math.round(rentalAmount * TAX_RATE);

export const calculateTotal = (rentalAmount, tax, securityDeposit) =>
  rentalAmount + tax + (Number(securityDeposit) || 0);

export const getPriceBreakdown = (pricePerDay, securityDeposit, days) => {
  const rentalAmount = calculateRentalAmount(pricePerDay, days);
  const tax = calculateTax(rentalAmount);
  const totalAmount = calculateTotal(rentalAmount, tax, securityDeposit);
  return { rentalAmount, tax, securityDeposit: Number(securityDeposit) || 0, totalAmount, days };
};

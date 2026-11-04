export const TAX_RATE = 0.18;

const toLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

export const calculateRentalDays = (pickupDate, returnDate) => {
  const pickup = toLocalDate(pickupDate);
  const returnDateValue = toLocalDate(returnDate);

  if (!pickup || !returnDateValue || returnDateValue <= pickup) return 0;

  return Math.round((returnDateValue - pickup) / (1000 * 60 * 60 * 24));
};

export const calculateRentalAmount = (pricePerDay, days) => {
  return Math.max(0, Number(pricePerDay) || 0) * Math.max(0, days);
};

export const calculateTax = (rentalAmount) => {
  return Math.round(rentalAmount * TAX_RATE);
};

export const calculateTotal = (rentalAmount, tax, securityDeposit) => {
  return rentalAmount + tax + (Number(securityDeposit) || 0);
};

export const formatCurrency = (amount) => {
  return `₹${Math.round(amount || 0).toLocaleString('en-IN')}`;
};

export default {
  TAX_RATE,
  calculateRentalDays,
  calculateRentalAmount,
  calculateTax,
  calculateTotal,
  formatCurrency,
};

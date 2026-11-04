// Pricing calculation utilities

export const calculateRentalDays = (pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD - pickup);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 1); // Minimum 1 day
};

export const calculateRentalAmount = (pricePerDay, days) => {
  return pricePerDay * days;
};

export const calculateTax = (amount, taxRate = 0.18) => {
  return Math.round(amount * taxRate);
};

export const calculateTotal = (rentalAmount, securityDeposit, tax) => {
  return rentalAmount + tax; // Security deposit is refundable, not added to total
};

export const getPriceBreakdown = (pricePerDay, securityDeposit, days) => {
  const rentalAmount = calculateRentalAmount(pricePerDay, days);
  const tax = calculateTax(rentalAmount);
  const totalAmount = calculateTotal(rentalAmount, securityDeposit, tax);

  return {
    rentalAmount: Math.round(rentalAmount),
    tax: Math.round(tax),
    securityDeposit,
    totalAmount: Math.round(totalAmount),
    days
  };
};

export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export default {
  calculateRentalDays,
  calculateRentalAmount,
  calculateTax,
  calculateTotal,
  getPriceBreakdown,
  formatPrice
};

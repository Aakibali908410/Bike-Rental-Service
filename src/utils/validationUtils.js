// Validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateDates = (pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickup < today) return { valid: false, message: 'Pickup date cannot be in the past' };
  if (returnD <= pickup) return { valid: false, message: 'Return date must be after pickup date' };

  return { valid: true };
};

export const validateBookingForm = (data) => {
  const errors = {};

  if (!data.pickupDate) errors.pickupDate = 'Pickup date is required';
  if (!data.returnDate) errors.returnDate = 'Return date is required';

  if (data.pickupDate && data.returnDate) {
    const dateValidation = validateDates(data.pickupDate, data.returnDate);
    if (!dateValidation.valid) {
      errors.dates = dateValidation.message;
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateRegistration = (data) => {
  const errors = {};

  if (!validateName(data.name)) errors.name = 'Name must be at least 2 characters';
  if (!validateEmail(data.email)) errors.email = 'Please enter a valid email';
  if (!validatePhone(data.phone)) errors.phone = 'Please enter a valid phone number';
  if (!validatePassword(data.password)) errors.password = 'Password must be at least 6 characters';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  return { isValid: Object.keys(errors).length === 0, errors };
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateDates,
  validateBookingForm,
  validateRegistration
};

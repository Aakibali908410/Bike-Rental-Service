import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { bookingAPI } from '../utils/api';

// eslint-disable-next-line react-refresh/only-export-components
export const BookingContext = createContext();

// Helper to normalize backend Mongoose booking to frontend shape
const normalizeBooking = (booking) => {
  if (!booking) return null;
  return {
    ...booking,
    id: booking.bookingId || booking.id || booking._id,
    bookingId: booking.bookingId || booking.id || booking._id,
    userId: String(booking.user?._id || booking.user || ''),
    bikeId: String(booking.bike?._id || booking.bike || ''),
    status: booking.bookingStatus || booking.status || 'confirmed',
    bookingStatus: booking.bookingStatus || booking.status || 'confirmed',
    paymentStatus: booking.paymentStatus || 'pending',
  };
};

export const BookingProvider = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from MongoDB Atlas based on user identity (customer or admin)
  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = isAdmin
        ? await bookingAPI.getAllBookings()
        : await bookingAPI.getMyBookings();

      if (res?.success && Array.isArray(res.bookings)) {
        setBookings(res.bookings.map(normalizeBooking));
      } else {
        setBookings([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, isAdmin]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Client-side quick conflict check
  const hasBookingConflict = (bikeId, pickupDate, returnDate) =>
    bookings.some((booking) => {
      const status = (booking.bookingStatus || '').toLowerCase();
      const existingPickup = booking.pickup?.date || booking.pickupDate;
      const existingReturn = booking.return?.date || booking.returnDate;
      return (
        String(booking.bikeId) === String(bikeId) &&
        ['confirmed', 'pending'].includes(status) &&
        pickupDate < existingReturn &&
        returnDate > existingPickup
      );
    });

  // Create booking via POST /api/bookings
  const createBooking = async (bookingData) => {
    if (!user) return { success: false, message: 'Please sign in before booking.' };

    try {
      const payload = {
        bikeId: bookingData.bikeId,
        customer: {
          name: bookingData.customer?.name || user.name,
          phone: bookingData.customer?.phone || user.phone || '',
        },
        pickup: {
          date: bookingData.pickup.date,
          location: bookingData.pickup.location,
        },
        return: {
          date: bookingData.return.date,
          location: bookingData.return.location,
        },
        specialInstructions: bookingData.specialInstructions || '',
      };

      const res = await bookingAPI.createBooking(payload);
      if (res?.success && res.booking) {
        const normalized = normalizeBooking(res.booking);
        setBookings((prev) => [normalized, ...prev]);
        return { success: true, booking: normalized };
      }
      throw new Error(res?.message || 'Failed to create booking.');
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Failed to complete booking. Please try again.',
      };
    }
  };

  // Synchronous lookup from current bookings cache
  const getBookingById = (bookingId) => {
    if (!bookingId) return undefined;
    return bookings.find(
      (booking) =>
        String(booking.id) === String(bookingId) ||
        String(booking.bookingId) === String(bookingId)
      );
  };

  // Direct fetch from GET /api/bookings/:bookingId (useful on direct refresh)
  const fetchBookingById = async (bookingId) => {
    try {
      const res = await bookingAPI.getBookingById(bookingId);
      if (res?.success && res.booking) {
        const normalized = normalizeBooking(res.booking);
        setBookings((prev) => {
          const exists = prev.some((b) => b.id === normalized.id);
          return exists ? prev.map((b) => (b.id === normalized.id ? normalized : b)) : [normalized, ...prev];
        });
        return normalized;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Cancel booking via PUT /api/bookings/:bookingId/cancel
  const cancelBooking = async (bookingId) => {
    try {
      const res = await bookingAPI.cancelBooking(bookingId);
      if (res?.success && res.booking) {
        const normalized = normalizeBooking(res.booking);
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? normalized : b))
        );
        return { success: true, booking: normalized };
      }
      throw new Error(res?.message || 'Failed to cancel booking.');
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Admin: Update booking status via PUT /api/bookings/:bookingId
  const updateBooking = async (bookingId, updateData) => {
    try {
      const res = await bookingAPI.updateBookingStatus(bookingId, updateData);
      if (res?.success && res.booking) {
        const normalized = normalizeBooking(res.booking);
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? normalized : b))
        );
        return normalized;
      }
      throw new Error(res?.message || 'Failed to update booking status.');
    } catch {
      // Fallback update in state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...updateData } : b))
      );
      return { id: bookingId, ...updateData };
    }
  };

  // Filter bookings for user
  const getUserBookings = (userId = user?.id) => {
    if (!userId) return [];
    return bookings.filter(
      (booking) => String(booking.userId) === String(userId) || String(booking.user) === String(userId)
    );
  };

  const getAllBookings = () => bookings;

  const getBookingStats = () => {
    return {
      totalBookings: bookings.length,
      activeRentals: bookings.filter((b) => b.bookingStatus === 'confirmed').length,
      completedRentals: bookings.filter((b) => b.bookingStatus === 'completed').length,
      cancelledRentals: bookings.filter((b) => b.bookingStatus === 'cancelled').length,
    };
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoading,
        error,
        fetchBookings,
        createBooking,
        getBookingById,
        fetchBookingById,
        cancelBooking,
        updateBooking,
        getUserBookings,
        getAllBookings,
        getBookingStats,
        hasBookingConflict,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

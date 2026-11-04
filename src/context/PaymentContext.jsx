import { createContext, useContext, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { BookingContext } from './BookingContext';
import { paymentAPI } from '../utils/api';

// eslint-disable-next-line react-refresh/only-export-components
export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { updateBooking } = useContext(BookingContext);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronous lookup from memory
  const getPaymentById = (paymentIdOrBookingId) =>
    payments.find(
      (payment) =>
        String(payment.id || payment.paymentId) === String(paymentIdOrBookingId) ||
        String(payment.bookingId) === String(paymentIdOrBookingId) ||
        String(payment.booking?._id || payment.booking) === String(paymentIdOrBookingId)
    );

  // Fetch payment directly from backend GET /api/payments/:idOrBookingId
  const fetchPayment = useCallback(async (idOrBookingId) => {
    if (!idOrBookingId) return null;
    try {
      const res = await paymentAPI.getPayment(idOrBookingId);
      if (res?.success && res.payment) {
        setPayments((prev) => {
          const exists = prev.some((p) => p.paymentId === res.payment.paymentId);
          return exists ? prev.map((p) => (p.paymentId === res.payment.paymentId ? res.payment : p)) : [res.payment, ...prev];
        });
        return res.payment;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // Process checkout through real backend POST /api/payments
  const processPayment = async ({ bookingId, paymentMethod, amount, shouldFail = false }) => {
    if (!user) {
      return { success: false, paymentStatus: 'failed', message: 'You must be signed in to complete payment.' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await paymentAPI.processPayment({
        bookingId,
        paymentMethod,
        amount: Number(amount),
        shouldFail,
      });

      if (res?.alreadyPaid) {
        return {
          success: false,
          alreadyPaid: true,
          payment: res.payment,
          message: res.message || 'Payment Already Completed',
        };
      }

      if (res?.success && res.payment) {
        const recordedPayment = {
          ...res.payment,
          id: res.payment.paymentId || res.payment._id,
          bookingId,
        };

        setPayments((prev) => [recordedPayment, ...prev]);

        // Resync booking status in BookingContext
        if (updateBooking) {
          updateBooking(bookingId, {
            paymentMethod: res.booking?.paymentMethod || (paymentMethod === 'pay_at_pickup' ? 'Pay at Pickup' : paymentMethod.toUpperCase()),
            paymentStatus: res.paymentStatus || 'paid',
            transactionId: res.payment?.transactionId,
          });
        }

        return {
          success: true,
          paymentStatus: res.paymentStatus,
          payment: recordedPayment,
          booking: res.booking,
        };
      }

      throw new Error(res?.message || 'Payment failed.');
    } catch (err) {
      const isAlreadyPaid = err?.status === 409 || err?.data?.alreadyPaid;
      if (isAlreadyPaid) {
        return {
          success: false,
          alreadyPaid: true,
          payment: err?.data?.payment,
          message: err?.message || 'Payment Already Completed',
        };
      }
      return {
        success: false,
        paymentStatus: 'failed',
        message: err.message || 'We could not process your payment. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = (paymentId, paymentStatus) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId || payment.paymentId === paymentId
          ? { ...payment, paymentStatus }
          : payment
      )
    );
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        isLoading,
        error,
        getPaymentById,
        fetchPayment,
        processPayment,
        updatePaymentStatus,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { PaymentContext } from '../context/PaymentContext';
import { formatCurrency } from '../utils/rentalPrice';

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);
  const { getBookingById, fetchBookingById, isLoading: bookingsLoading } = useContext(BookingContext);
  const { getPaymentById, fetchPayment, isLoading: paymentsLoading } = useContext(PaymentContext);
  const [directBooking, setDirectBooking] = useState(null);
  const [directPayment, setDirectPayment] = useState(null);
  const booking = getBookingById(bookingId) || directBooking;
  const payment = getPaymentById(bookingId) || directPayment;

  useEffect(() => {
    if (!booking && bookingId && fetchBookingById) {
      fetchBookingById(bookingId).then((b) => {
        if (b) setDirectBooking(b);
      });
    }
  }, [booking, bookingId, fetchBookingById]);

  useEffect(() => {
    if (!payment && bookingId && fetchPayment) {
      fetchPayment(bookingId).then((p) => {
        if (p) setDirectPayment(p);
      });
    }
  }, [payment, bookingId, fetchPayment]);

  if (bookingsLoading || paymentsLoading) return <Layout><div className="flex min-h-[60vh] items-center justify-center bg-primary text-text">Loading payment details...</div></Layout>;
  const isOwner = booking && (String(booking.userId) === String(user?.id) || String(booking.user) === String(user?.id) || user?.role === 'ADMIN');
  if (!booking || !isOwner || !payment) return <Layout><main className="flex min-h-[60vh] flex-col items-center justify-center bg-primary px-4 text-center text-text"><Receipt size={42} className="mb-4 text-accent" /><h1 className="text-3xl font-bold">Payment Information Unavailable</h1><p className="mt-3 text-textSecondary">We could not find payment details for this booking.</p><Link to="/my-bookings" className="mt-6"><Button>My Bookings</Button></Link></main></Layout>;

  const isPending = payment.paymentStatus === 'pending';
  return <Layout><main className="min-h-[60vh] bg-primary px-4 py-12 text-text sm:px-6"><motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl rounded-2xl border border-border bg-secondary p-6 text-center shadow-2xl sm:p-10"><CheckCircle size={64} className="mx-auto mb-5 text-success" /><p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{isPending ? 'Reservation secured' : 'Payment complete'}</p><h1 className="mt-2 text-4xl font-bold">{isPending ? 'Booking Confirmed' : 'Payment Successful'}</h1><p className="mt-3 text-textSecondary">{isPending ? 'Pay at pickup to complete your rental.' : 'Your rental payment has been processed successfully.'}</p><div className="mt-8 space-y-4 border-y border-border py-6 text-left"><Info label="Booking ID" value={booking.id} /><Info label="Bike" value={booking.bikeSnapshot?.name} /><Info label="Payment Method" value={payment.paymentMethod === 'pay_at_pickup' ? 'Pay at Pickup' : payment.paymentMethod.toUpperCase()} /><Info label={isPending ? 'Amount Due at Pickup' : 'Amount Paid'} value={formatCurrency(payment.amount)} />{!isPending && <Info icon={CreditCard} label="Transaction ID" value={payment.transactionId} />}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link to={`/my-bookings/${booking.id}`}><Button>View Booking</Button></Link><Link to="/my-bookings"><Button variant="outline">My Bookings</Button></Link><Link to="/"><Button variant="ghost">Back to Home</Button></Link></div></motion.section></main></Layout>;
};

const Info = ({ icon: Icon, label, value }) => <div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-xs text-textSecondary">{label}</p><p className="mt-1 break-all font-semibold">{value}</p></div>{Icon && <Icon size={18} className="text-accent" />}</div>;

export default PaymentSuccess;

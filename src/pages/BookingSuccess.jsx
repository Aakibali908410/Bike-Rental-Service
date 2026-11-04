import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import { BookingContext } from '../context/BookingContext';
import { formatCurrency } from '../utils/rentalPrice';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const { getBookingById, isLoading } = useContext(BookingContext);
  const booking = getBookingById(bookingId);
  if (isLoading) return <Layout><div className="flex min-h-[60vh] items-center justify-center bg-primary text-text">Loading...</div></Layout>;
  if (!booking) return <Layout><div className="flex min-h-[60vh] flex-col items-center justify-center bg-primary text-center text-text"><h1 className="text-3xl font-bold">Booking Not Found</h1><Link to="/my-bookings" className="mt-6"><Button>View My Bookings</Button></Link></div></Layout>;
  return <Layout><main className="min-h-[60vh] bg-primary px-4 py-12 text-text sm:px-6"><motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl rounded-2xl border border-border bg-secondary p-6 text-center shadow-2xl sm:p-10"><CheckCircle size={64} className="mx-auto mb-5 text-success" /><p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">All set</p><h1 className="mt-2 text-4xl font-bold">Booking Confirmed!</h1><p className="mt-3 text-textSecondary">Your bike has been successfully reserved.</p><div className="mt-8 border-y border-border py-6 text-left"><p className="text-xs text-textSecondary">Booking ID</p><p className="mt-1 font-bold text-accent">{booking.id}</p><h2 className="mt-5 text-xl font-bold">{booking.bikeSnapshot.name}</h2><div className="mt-4 grid gap-3 text-sm text-textSecondary sm:grid-cols-2"><p>Pickup: <strong className="text-text">{booking.pickup.date}</strong></p><p>Return: <strong className="text-text">{booking.return.date}</strong></p><p className="flex items-center gap-1"><MapPin size={15} />{booking.pickup.location}</p><p>Total: <strong className="text-accent">{formatCurrency(booking.totalAmount)}</strong></p></div></div><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link to="/my-bookings"><Button>View My Bookings</Button></Link><Link to="/"><Button variant="outline">Back to Home</Button></Link></div></motion.section></main></Layout>;
};
export default BookingSuccess;

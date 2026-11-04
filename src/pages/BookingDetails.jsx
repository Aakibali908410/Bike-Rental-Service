import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import PriceBreakdown from '../components/PriceBreakdown';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getBookingById, fetchBookingById, isLoading } = useContext(BookingContext);
  const [directBooking, setDirectBooking] = useState(null);
  const booking = getBookingById(bookingId) || directBooking;

  useEffect(() => {
    if (!booking && bookingId && fetchBookingById) {
      fetchBookingById(bookingId).then((b) => {
        if (b) setDirectBooking(b);
      });
    }
  }, [booking, bookingId, fetchBookingById]);
  if (isLoading && !booking) {
    return <Layout><main className="flex min-h-[60vh] flex-col items-center justify-center bg-primary text-text"><p className="text-textSecondary">Loading reservation...</p></main></Layout>;
  }

  const isOwner = booking && (String(booking.userId) === String(user?.id) || String(booking.user) === String(user?.id) || user?.role === 'ADMIN');
  if (!booking || !isOwner) return <Layout><main className="flex min-h-[60vh] flex-col items-center justify-center bg-primary px-4 text-center text-text"><h1 className="text-3xl font-bold">Booking Not Found</h1><p className="mt-3 text-textSecondary">This booking could not be found.</p><Link to="/my-bookings" className="mt-6"><Button>Back to My Bookings</Button></Link></main></Layout>;
  const status = (booking.bookingStatus || booking.status || 'confirmed').toLowerCase();
  const paymentStatus = (booking.paymentStatus || 'pending').toLowerCase();
  return <Layout><main className="min-h-[60vh] bg-primary px-4 py-10 text-text sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><Link to="/my-bookings" className="mb-7 inline-flex items-center gap-2 text-sm text-textSecondary hover:text-accent"><ArrowLeft size={17} /> Back to My Bookings</Link><section className="rounded-2xl border border-border bg-secondary p-6 sm:p-9"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-textSecondary">Booking ID</p><h1 className="mt-1 text-2xl font-bold text-accent">{booking.id}</h1><h2 className="mt-5 text-2xl font-bold">{booking.bikeSnapshot.name}</h2></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === 'cancelled' ? 'bg-error/20 text-red-300' : 'bg-success/20 text-green-300'}`}>{status}</span></div><div className="mt-8 grid gap-5 border-y border-border py-6 sm:grid-cols-2"><Info icon={CalendarDays} label="Pickup" value={`${booking.pickup.date} · ${booking.pickup.location}`} /><Info icon={CalendarDays} label="Return" value={`${booking.return.date} · ${booking.return.location}`} /><Info icon={MapPin} label="Customer" value={`${booking.customer.name} · ${booking.customer.phone}`} /><Info label="Payment Method" value={booking.paymentMethod || 'Pay at Pickup'} /><Info label="Payment Status" value={paymentStatus} />{booking.transactionId && <Info label="Transaction ID" value={booking.transactionId} />}</div><PriceBreakdown pricePerDay={booking.pricePerDay} days={booking.rentalDays} rentalAmount={booking.rentalAmount} securityDeposit={booking.securityDeposit} tax={booking.tax} total={booking.totalAmount} />{paymentStatus !== 'paid' && status === 'confirmed' && <Button className="mt-6" onClick={() => navigate(`/payment/${booking.id}`)}>Complete Payment</Button>}<p className="mt-6 text-xs text-textSecondary">Created {new Date(booking.createdAt).toLocaleString('en-IN')}</p></section></div></main></Layout>;
};
const Info = ({ icon: Icon, label, value }) => <div><p className="flex items-center gap-2 text-xs text-textSecondary">{Icon && <Icon size={15} className="text-accent" />}{label}</p><p className="mt-2 font-semibold">{value}</p></div>;
export default BookingDetails;

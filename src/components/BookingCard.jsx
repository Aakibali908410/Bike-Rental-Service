import { CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { formatCurrency } from '../utils/rentalPrice';

const BookingCard = ({ booking, onCancel }) => {
  const status = (booking.bookingStatus || booking.status || 'confirmed').toLowerCase();
  const pickupDate = booking.pickup?.date || booking.pickupDate;
  const returnDate = booking.return?.date || booking.returnDate;
  return (
    <article className="rounded-2xl border border-border bg-secondary p-5 shadow-lg shadow-black/10">
      <div className="flex gap-4">
        <img src={booking.bikeSnapshot?.image} alt={`${booking.bikeSnapshot?.name || 'Bike'} motorcycle`} className="h-24 w-28 rounded-xl object-cover" loading="lazy" />
        <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wider text-accent">{booking.bikeSnapshot?.brand}</p><h2 className="truncate text-lg font-bold text-text">{booking.bikeSnapshot?.name}</h2><p className="mt-1 text-xs text-textSecondary">{booking.id}</p></div>
        <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${status === 'cancelled' ? 'bg-error/20 text-red-300' : 'bg-success/20 text-green-300'}`}>{status}</span>
      </div>
      <div className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-4"><div className="flex items-center gap-2 text-textSecondary"><CalendarDays size={16} className="text-accent" />{pickupDate} to {returnDate}</div><div className="flex items-center gap-2 text-textSecondary"><MapPin size={16} className="text-accent" />{booking.pickup?.location}</div><span className="text-textSecondary">{booking.rentalDays} {booking.rentalDays === 1 ? 'day' : 'days'}</span><strong className="text-text sm:text-right">{formatCurrency(booking.totalAmount)}</strong></div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-textSecondary"><span>Booking: <strong className="text-success">{status}</strong></span><span>Payment: <strong className="text-text">{booking.paymentStatus || 'pending'}</strong></span></div>
      <div className="mt-5 flex flex-wrap gap-3"><Link to={`/my-bookings/${booking.id}`}><Button variant="outline" size="sm">View Details <ChevronRight size={15} className="ml-1 inline" /></Button></Link>{status === 'confirmed' && <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>Cancel Booking</Button>}</div>
    </article>
  );
};

export default BookingCard;

import { useContext, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import BookingCard from '../components/BookingCard';
import CancelBookingModal from '../components/CancelBookingModal';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';

const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const { getUserBookings, cancelBooking, isLoading } = useContext(BookingContext);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const userBookings = getUserBookings(user?.id);

  const filteredBookings = useMemo(() => {
    const today = getToday();
    return [...userBookings]
      .filter((booking) => {
        const status = (booking.bookingStatus || booking.status || 'confirmed').toLowerCase();
        if (activeFilter === 'cancelled') return status === 'cancelled';
        if (activeFilter === 'completed') return status === 'completed';
        if (activeFilter === 'upcoming') return status === 'confirmed' && (booking.pickup?.date || booking.pickupDate) >= today;
        return true;
      })
      .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));
  }, [activeFilter, userBookings]);

  const handleOpenCancel = (booking) => {
    setCancelError(null);
    setBookingToCancel(booking);
  };

  const handleCloseCancel = () => {
    if (isCancelling) return;
    setCancelError(null);
    setBookingToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    setCancelError(null);
    const res = await cancelBooking(bookingToCancel.id);
    setIsCancelling(false);
    if (res?.success) {
      setBookingToCancel(null);
    } else {
      setCancelError(res?.message || 'Failed to cancel booking.');
    }
  };

  return (
    <Layout>
      <main className="min-h-[60vh] bg-primary px-4 py-10 text-text sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Your rides</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">My Bookings</h1>
            <p className="mt-2 text-textSecondary">Manage your upcoming and previous rides.</p>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-textSecondary">Loading your bookings...</div>
          ) : userBookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No bookings yet"
              message="Your next adventure is waiting."
              action={<Link to="/bikes"><Button>Explore Bikes</Button></Link>}
            />
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter bookings">
                {['all', 'upcoming', 'completed', 'cancelled'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${activeFilter === filter ? 'bg-accent text-white' : 'bg-secondary text-textSecondary hover:text-text'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              {filteredBookings.length === 0 ? (
                <EmptyState title={`No ${activeFilter} bookings`} message="Try another booking filter." />
              ) : (
                <div className="grid gap-5">
                  {filteredBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onCancel={handleOpenCancel} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <CancelBookingModal
        booking={bookingToCancel}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
        isCancelling={isCancelling}
        error={cancelError}
      />
    </Layout>
  );
};

export default MyBookings;

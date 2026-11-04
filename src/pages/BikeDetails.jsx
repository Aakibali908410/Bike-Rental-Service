import { useContext, useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Star,
} from 'lucide-react';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import BikeCard from '../components/BikeCard';
import BikeFeatures from '../components/BikeFeatures';
import BikeGallery from '../components/BikeGallery';
import BikeSpecifications from '../components/BikeSpecifications';
import PriceBreakdown from '../components/PriceBreakdown';
import { BikeContext } from '../context/BikeContext';
import {
  calculateRentalAmount,
  calculateRentalDays,
  calculateTax,
  calculateTotal,
  formatCurrency,
} from '../utils/rentalPrice';

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextDay = (dateValue) => {
  if (!dateValue) return getToday();
  const [year, month, day] = dateValue.split('-').map(Number);
  const nextDay = new Date(year, month - 1, day + 1);
  return `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
};

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bikes, isLoading, fetchBikeById } = useContext(BikeContext);
  const [directBike, setDirectBike] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [dateError, setDateError] = useState('');

  const bikeFromContext = bikes.find((item) => String(item.id || item._id) === String(id));
  const bike = bikeFromContext || directBike;

  useEffect(() => {
    if (!bikeFromContext && id && fetchBikeById) {
      fetchBikeById(id).then((b) => {
        if (b) setDirectBike(b);
      });
    }
  }, [bikeFromContext, id, fetchBikeById]);
  const today = getToday();

  const rental = useMemo(() => {
    const days = calculateRentalDays(pickupDate, returnDate);
    const rentalAmount = calculateRentalAmount(bike?.pricePerDay, days);
    const tax = calculateTax(rentalAmount);
    const securityDeposit = bike?.securityDeposit || 0;
    const total = calculateTotal(rentalAmount, tax, securityDeposit);

    return { days, rentalAmount, tax, securityDeposit, total };
  }, [bike, pickupDate, returnDate]);

  const similarBikes = useMemo(() => {
    if (!bike) return [];

    return [...bikes]
      .filter((item) => String(item.id || item._id) !== String(bike.id || bike._id))
      .sort((first, second) => {
        const score = (item) => {
          const categoryMatch = item.category === bike.category ? 3 : 0;
          const brandMatch = item.brand === bike.brand ? 2 : 0;
          const priceDistance = Math.abs(item.pricePerDay - bike.pricePerDay);
          return categoryMatch + brandMatch - priceDistance / 1000;
        };
        return score(second) - score(first);
      })
      .slice(0, 3);
  }, [bike, bikes]);

  if (isLoading && !bike) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center bg-primary px-4 text-text">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-secondary" />
            <p className="text-textSecondary">Loading bike details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!bike) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center bg-primary px-4 text-text">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <AlertCircle size={32} className="text-accent" />
            </div>
            <h1 className="mb-3 text-3xl font-bold">Bike Not Found</h1>
            <p className="mb-7 text-textSecondary">
              The bike you're looking for doesn't exist or may have been removed.
            </p>
            <Link to="/bikes">
              <Button variant="primary">Back to Bikes</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePickupChange = (value) => {
    setPickupDate(value);
    if (returnDate && returnDate <= value) setReturnDate('');
    setDateError('');
  };

  const handleReturnChange = (value) => {
    setReturnDate(value);
    setDateError('');
  };

  const handleContinue = () => {
    if (!bike.available) {
      setDateError('This bike is currently unavailable for rent.');
      return;
    }
    if (!pickupDate || !returnDate) {
      setDateError('Please select both pickup and return dates.');
      return;
    }
    if (returnDate <= pickupDate || rental.days < 1) {
      setDateError('Return date must be at least one day after pickup date.');
      return;
    }

    navigate(`/booking/${bike.id}`, {
      state: {
        pickupDate,
        returnDate,
        days: rental.days,
        rentalAmount: rental.rentalAmount,
        tax: rental.tax,
        securityDeposit: rental.securityDeposit,
        total: rental.total,
      },
    });
  };

  return (
    <Layout>
      <main className="min-h-screen bg-primary text-text">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-textSecondary" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-accent">Home</Link>
            <ChevronRight size={16} />
            <Link to="/bikes" className="transition-colors hover:text-accent">Bikes</Link>
            <ChevronRight size={16} />
            <span className="text-text" aria-current="page">{bike.name}</span>
          </nav>

          <Link to="/bikes" className="mb-8 inline-flex items-center gap-2 text-sm text-textSecondary transition-colors hover:text-accent">
            <ArrowLeft size={17} /> Back to Bikes
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="min-w-0 space-y-10">
              <BikeGallery bike={bike} />

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">{bike.brand}</p>
                <h1 className="mb-5 text-4xl font-bold sm:text-5xl">{bike.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary">
                  <span className="inline-flex items-center gap-1.5 text-text">
                    <Star size={17} className="fill-accent text-accent" />
                    <strong>{bike.rating}</strong> ({bike.reviews} reviews)
                  </span>
                  <Badge>{bike.category}</Badge>
                  <span className="inline-flex items-center gap-1.5"><MapPin size={16} />{bike.location}</span>
                  <Badge variant={bike.available ? 'success' : 'error'}>
                    {bike.available ? 'Available for Rent' : 'Currently Unavailable'}
                  </Badge>
                </div>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold text-accent">{formatCurrency(bike.pricePerDay)}</span>
                  <span className="mb-1 text-textSecondary">/ day</span>
                </div>
              </motion.section>

              <BikeSpecifications bike={bike} />
              <BikeFeatures features={bike.features} />

              <section>
                <h2 className="mb-4 text-2xl font-bold text-text">About This Bike</h2>
                <p className="max-w-3xl leading-8 text-textSecondary">{bike.description}</p>
              </section>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="min-w-0 lg:sticky lg:top-24"
            >
              <div className="rounded-2xl border border-border bg-secondary p-6 shadow-xl shadow-black/20">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-textSecondary">Starting from</p>
                    <p className="mt-1 text-3xl font-bold text-accent">{formatCurrency(bike.pricePerDay)} <span className="text-sm font-normal text-textSecondary">/ day</span></p>
                  </div>
                  <Clock3 size={25} className="text-accent" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="pickup-date" className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                      <CalendarDays size={16} className="text-accent" /> Pickup Date
                    </label>
                    <input
                      id="pickup-date"
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(event) => handlePickupChange(event.target.value)}
                      className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="return-date" className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                      <CalendarDays size={16} className="text-accent" /> Return Date
                    </label>
                    <input
                      id="return-date"
                      type="date"
                      min={pickupDate ? getNextDay(pickupDate) : today}
                      value={returnDate}
                      onChange={(event) => handleReturnChange(event.target.value)}
                      className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                {dateError && (
                  <p className="mt-4 flex items-start gap-2 text-sm text-red-400" role="alert">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" /> {dateError}
                  </p>
                )}

                {rental.days > 0 ? (
                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-primary px-4 py-3">
                      <span className="text-sm text-textSecondary">Rental duration</span>
                      <strong className="text-text">{rental.days} {rental.days === 1 ? 'day' : 'days'}</strong>
                    </div>
                    <PriceBreakdown
                      pricePerDay={bike.pricePerDay}
                      days={rental.days}
                      rentalAmount={rental.rentalAmount}
                      securityDeposit={rental.securityDeposit}
                      tax={rental.tax}
                      total={rental.total}
                    />
                  </div>
                ) : (
                  <p className="mt-6 rounded-lg border border-dashed border-border px-4 py-4 text-sm text-textSecondary">
                    <AlertCircle size={16} className="mr-2 inline text-accent" />
                    Select valid rental dates to see your estimate.
                  </p>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  disabled={!bike.available}
                  onClick={handleContinue}
                >
                  {bike.available ? 'Continue to Booking' : 'Currently Unavailable'}
                </Button>
                <p className="mt-3 text-center text-xs text-textSecondary">Security deposit is refundable after return.</p>
              </div>
            </motion.aside>
          </div>

          {similarBikes.length > 0 && (
            <section className="mt-16 border-t border-border pt-12">
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">Keep exploring</p>
                  <h2 className="text-3xl font-bold">You May Also Like</h2>
                </div>
                <Link to="/bikes" className="hidden items-center gap-1 text-sm text-accent sm:flex">View all <ChevronRight size={16} /></Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarBikes.map((similarBike) => (
                  <BikeCard key={similarBike.id} bike={similarBike} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default BikeDetails;

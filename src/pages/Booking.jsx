import { useContext, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CalendarDays, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import BookingSteps from '../components/BookingSteps';
import PriceBreakdown from '../components/PriceBreakdown';
import { AuthContext } from '../context/AuthContext';
import { BikeContext } from '../context/BikeContext';
import { BookingContext } from '../context/BookingContext';
import { calculateRentalAmount, calculateRentalDays, calculateTax, calculateTotal } from '../utils/rentalPrice';

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const Booking = () => {
  const { id } = useParams();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { bikes } = useContext(BikeContext);
  const { createBooking, hasBookingConflict } = useContext(BookingContext);
  const bike = bikes.find((item) => String(item.id || item._id) === String(id));
  const today = getToday();
  const locations = useMemo(() => [...new Set(bikes.map((item) => item.location).filter(Boolean))].sort(), [bikes]);
  const state = routerLocation.state || {};
  const [step, setStep] = useState(1);
  const [formState, setForm] = useState({
    name: user?.name,
    phone: user?.phone,
    pickupDate: state.pickupDate,
    returnDate: state.returnDate,
    pickupLocation: bike?.location || locations[0],
    returnLocation: bike?.location || locations[0],
    instructions: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = {
    ...formState,
    name: formState.name ?? user?.name ?? '',
    phone: formState.phone ?? user?.phone ?? '',
    pickupDate: formState.pickupDate ?? state.pickupDate ?? '',
    returnDate: formState.returnDate ?? state.returnDate ?? '',
    pickupLocation: formState.pickupLocation ?? bike?.location ?? locations[0] ?? '',
    returnLocation: formState.returnLocation ?? bike?.location ?? locations[0] ?? '',
  };

  const rental = useMemo(() => {
    const days = calculateRentalDays(form.pickupDate, form.returnDate);
    const rentalAmount = calculateRentalAmount(bike?.pricePerDay, days);
    const tax = calculateTax(rentalAmount);
    const securityDeposit = bike?.securityDeposit || 0;
    return { days, rentalAmount, tax, securityDeposit, total: calculateTotal(rentalAmount, tax, securityDeposit) };
  }, [bike, form.pickupDate, form.returnDate]);

  if (bikes.length === 0) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center bg-primary text-text">Loading...</div>
      </Layout>
    );
  }

  if (!bike) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-primary px-4 text-center text-text">
          <AlertCircle size={42} className="mb-4 text-accent" />
          <h1 className="text-3xl font-bold">Bike Not Found</h1>
          <Link to="/bikes" className="mt-6"><Button>Back to Bikes</Button></Link>
        </div>
      </Layout>
    );
  }

  if (!bike.available) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-primary px-4 text-center text-text">
          <AlertCircle size={42} className="mb-4 text-accent" />
          <h1 className="text-3xl font-bold">This bike is currently unavailable.</h1>
          <Link to="/bikes" className="mt-6"><Button>Back to Bikes</Button></Link>
        </div>
      </Layout>
    );
  }

  const validateDetails = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.phone.trim() || !/^(?:\+91\s?)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      nextErrors.phone = 'Enter a valid Indian phone number.';
    }
    if (!form.pickupDate || form.pickupDate < today) nextErrors.pickupDate = 'Choose a valid pickup date.';
    if (!form.returnDate || form.returnDate <= form.pickupDate) {
      nextErrors.returnDate = 'Return date must be at least one day after pickup.';
    }
    if (!form.pickupLocation) nextErrors.pickupLocation = 'Pickup location is required.';
    if (!form.returnLocation) nextErrors.returnLocation = 'Return location is required.';
    if (rental.days < 1) nextErrors.dates = 'Please select valid rental dates.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const reviewBooking = (event) => {
    event.preventDefault();
    if (validateDetails()) setStep(2);
  };

  const confirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: routerLocation } });
      return;
    }
    if (!validateDetails()) {
      setStep(1);
      return;
    }
    if (!form.termsAccepted) {
      setErrors({ terms: 'Please accept the rental terms to continue.' });
      return;
    }
    if (hasBookingConflict(bike._id || bike.id, form.pickupDate, form.returnDate)) {
      setErrors({ form: 'Sorry, this bike is already booked for the selected dates. Please choose different dates.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    const result = await createBooking({
      bikeId: bike._id || bike.id,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
      },
      pickup: {
        date: form.pickupDate,
        location: form.pickupLocation,
      },
      return: {
        date: form.returnDate,
        location: form.returnLocation,
      },
      specialInstructions: form.instructions,
    });

    if (!result.success) {
      setErrors({ form: result.message || 'Failed to complete booking.' });
      setIsSubmitting(false);
      return;
    }

    navigate(`/payment/${result.booking.id}`, { replace: true });
  };

  return (
    <Layout>
      <main className="min-h-screen bg-primary px-4 py-8 text-text sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link to={`/bikes/${bike.id}`} className="mb-7 inline-flex items-center gap-2 text-sm text-textSecondary hover:text-accent">
            <ArrowLeft size={17} /> Back to bike
          </Link>
          <BookingSteps currentStep={step} />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <motion.section
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-border bg-secondary p-6 sm:p-8"
            >
              {step === 1 ? (
                <form onSubmit={reviewBooking} noValidate>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Step 1</p>
                  <h1 className="mt-2 text-3xl font-bold">Your ride details</h1>
                  <p className="mt-2 text-textSecondary">Tell us who is riding and when you would like to collect the bike.</p>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" value={form.name} error={errors.name} onChange={(value) => setForm({ ...form, name: value })} />
                    <Field label="Phone" value={form.phone} error={errors.phone} onChange={(value) => setForm({ ...form, phone: value })} type="tel" />
                    <div>
                      <label htmlFor="booking-email" className="mb-2 block text-sm font-semibold">Email</label>
                      <input id="booking-email" value={user?.email || ''} readOnly className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-textSecondary" />
                    </div>
                    <div />
                  </div>

                  <div className="mt-8 border-t border-border pt-7">
                    <h2 className="text-xl font-bold">Pickup and return</h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <DateField
                        id="booking-pickup"
                        label="Pickup Date"
                        value={form.pickupDate}
                        min={today}
                        error={errors.pickupDate}
                        onChange={(value) => setForm({ ...form, pickupDate: value, returnDate: form.returnDate && form.returnDate <= value ? '' : form.returnDate })}
                      />
                      <DateField
                        id="booking-return"
                        label="Return Date"
                        value={form.returnDate}
                        min={form.pickupDate ? form.pickupDate : today}
                        error={errors.returnDate}
                        onChange={(value) => setForm({ ...form, returnDate: value })}
                      />
                      <SelectField
                        id="booking-pickup-location"
                        label="Pickup Location"
                        value={form.pickupLocation}
                        options={locations}
                        error={errors.pickupLocation}
                        onChange={(value) => setForm({ ...form, pickupLocation: value, returnLocation: form.returnLocation || value })}
                      />
                      <SelectField
                        id="booking-return-location"
                        label="Return Location"
                        value={form.returnLocation}
                        options={locations}
                        error={errors.returnLocation}
                        onChange={(value) => setForm({ ...form, returnLocation: value })}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <label htmlFor="instructions" className="mb-2 block text-sm font-semibold">
                      Special Instructions <span className="font-normal text-textSecondary">(optional)</span>
                    </label>
                    <textarea
                      id="instructions"
                      value={form.instructions}
                      onChange={(event) => setForm({ ...form, instructions: event.target.value })}
                      placeholder="Any special request?"
                      rows="3"
                      className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text placeholder-textSecondary focus:border-accent focus:outline-none"
                    />
                  </div>

                  {(errors.dates || errors.form) && (
                    <p className="mt-5 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300" role="alert">
                      {errors.dates || errors.form}
                    </p>
                  )}

                  <Button type="submit" size="lg" className="mt-8 w-full">Review Booking</Button>
                </form>
              ) : (
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Step 2</p>
                  <h1 className="mt-2 text-3xl font-bold">Review booking</h1>
                  <p className="mt-2 text-textSecondary">Check your details before continuing to checkout.</p>

                  <div className="mt-8 space-y-5 text-sm">
                    <ReviewRow label="Customer" value={`${form.name} · ${user?.email || ''}`} />
                    <ReviewRow label="Phone" value={form.phone} />
                    <ReviewRow label="Pickup" value={`${form.pickupDate} · ${form.pickupLocation}`} />
                    <ReviewRow label="Return" value={`${form.returnDate} · ${form.returnLocation}`} />
                    <ReviewRow label="Duration" value={`${rental.days} ${rental.days === 1 ? 'day' : 'days'}`} />
                    <ReviewRow label="Payment" value="Choose your payment method at checkout" />
                  </div>

                  <label className="mt-8 flex items-start gap-3 text-sm text-textSecondary">
                    <input
                      type="checkbox"
                      checked={form.termsAccepted}
                      onChange={(event) => setForm({ ...form, termsAccepted: event.target.checked })}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      I agree to the rental terms and conditions.{' '}
                      <button type="button" onClick={() => setShowTerms(true)} className="font-semibold text-accent hover:text-orange-400">
                        View Terms
                      </button>
                    </span>
                  </label>

                  {errors.terms && <p className="mt-3 text-sm text-red-300" role="alert">{errors.terms}</p>}
                  {errors.form && (
                    <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300" role="alert">
                      {errors.form}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                    <Button variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting}>Edit Details</Button>
                    <Button variant="primary" className="flex-1" onClick={confirmBooking} disabled={isSubmitting || !form.termsAccepted}>
                      {isSubmitting ? 'Opening checkout...' : 'Continue to Payment'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.section>

            <aside className="rounded-2xl border border-border bg-secondary p-6 lg:sticky lg:top-24">
              <div className="flex gap-4">
                <img src={bike.image} alt={`${bike.name} motorcycle`} className="h-20 w-24 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">{bike.brand}</p>
                  <h2 className="font-bold">{bike.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-textSecondary">
                    <MapPin size={13} />
                    {bike.location}
                  </p>
                </div>
              </div>

              {rental.days > 0 ? (
                <div className="mt-6">
                  <div className="mb-4 flex justify-between rounded-lg bg-primary px-3 py-3 text-sm">
                    <span className="text-textSecondary">Rental duration</span>
                    <strong>{rental.days} days</strong>
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
                <p className="mt-6 text-sm text-textSecondary">Select dates to see the live price preview.</p>
              )}
            </aside>
          </div>
        </div>
      </main>

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="terms-title">
          <div className="w-full max-w-md rounded-2xl border border-border bg-secondary p-6">
            <button type="button" onClick={() => setShowTerms(false)} aria-label="Close terms" className="float-right p-2 text-textSecondary hover:text-text">
              <X size={20} />
            </button>
            <h2 id="terms-title" className="text-2xl font-bold">Rental Terms</h2>
            <p className="mt-4 leading-7 text-textSecondary">
              Please bring a valid driving licence and identity document at pickup. The security deposit is refundable after the bike is returned in good condition. Payment is collected at pickup.
            </p>
            <Button className="mt-6" onClick={() => setShowTerms(false)}>Close</Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const Field = ({ label, value, onChange, error, type = 'text' }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold">{label}</label>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" />
    {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
  </div>
);

const DateField = ({ id, label, value, min, onChange, error }) => (
  <div>
    <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-semibold">
      <CalendarDays size={16} className="text-accent" />
      {label}
    </label>
    <input id={id} type="date" value={value} min={min} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" />
    {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
  </div>
);

const SelectField = ({ id, label, value, options, onChange, error }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none">
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
  </div>
);

const ReviewRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
    <span className="text-textSecondary">{label}</span>
    <strong className="text-text sm:text-right">{value}</strong>
  </div>
);

export default Booking;

import { useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Banknote, CreditCard, LoaderCircle, Smartphone, WalletCards } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import PriceBreakdown from '../components/PriceBreakdown';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { PaymentContext } from '../context/PaymentContext';
import { formatCurrency } from '../utils/rentalPrice';

const methods = [
  { id: 'pay_at_pickup', label: 'Pay at Pickup', description: 'Pay when you collect the bike', icon: Banknote },
  { id: 'upi', label: 'UPI', description: 'Google Pay / PhonePe demo', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', description: 'Visa / Mastercard demo', icon: CreditCard },
  { id: 'wallet', label: 'Demo Wallet', description: 'Frontend wallet simulation', icon: WalletCards },
];

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getBookingById, isLoading: bookingsLoading } = useContext(BookingContext);
  const { getPaymentById, processPayment, isLoading: paymentsLoading } = useContext(PaymentContext);
  const booking = getBookingById(bookingId);
  const existingPayment = getPaymentById(bookingId);
  const [paymentMethod, setPaymentMethod] = useState('pay_at_pickup');
  const [form, setForm] = useState({ upiId: '', cardholderName: '', cardNumber: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [resultStatus, setResultStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (bookingsLoading || paymentsLoading) return <Layout><div className="flex min-h-[60vh] items-center justify-center bg-primary text-text">Loading checkout...</div></Layout>;
  if (!booking) return <PaymentMessage title="Booking Not Found" message="This booking could not be found." />;
  if (booking.userId !== user?.id) return <PaymentMessage title="Payment Not Available" message="Payment is not available for this booking." />;
  if (booking.bookingStatus !== 'confirmed') return <PaymentMessage title="Payment Not Available" message="This booking is no longer available for payment." />;
  if (existingPayment?.paymentStatus === 'paid' || booking.paymentStatus === 'paid') {
    return <PaymentMessage title="Payment Already Completed" message="This booking has already been paid." action={<Link to={`/my-bookings/${booking.id}`}><Button>View Booking</Button></Link>} />;
  }
  if (resultStatus === 'failed') {
    return <PaymentMessage title="Payment Failed" message="We couldn't process your demo payment. No money has been charged. Please try again or choose another payment method." action={<div className="flex flex-col gap-3 sm:flex-row"><Button onClick={() => { setResultStatus(''); setError(''); }}>Try Again</Button><Link to={`/my-bookings/${booking.id}`}><Button variant="outline">Back to Booking</Button></Link></div>} />;
  }

  const validatePayment = () => {
    if (paymentMethod === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(form.upiId.trim())) return 'Enter a valid demo UPI ID, such as demo@upi.';
    if (paymentMethod === 'card') {
      if (!form.cardholderName.trim()) return 'Cardholder name is required.';
      if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ''))) return 'Enter a valid 16-digit demo card number.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) return 'Enter expiry in MM/YY format.';
      if (!/^\d{3}$/.test(form.cvv)) return 'Enter a valid 3-digit CVV.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validatePayment();
    if (validationError) { setError(validationError); return; }
    setError('');
    setIsProcessing(true);
    const shouldFail = form.upiId.trim().toLowerCase() === 'fail@upi' || (paymentMethod === 'card' && form.cardNumber.replace(/\s/g, '').endsWith('0000'));
    try {
      const result = await processPayment({ bookingId: booking.id, paymentMethod, amount: booking.totalAmount, shouldFail });
      setForm({ upiId: '', cardholderName: '', cardNumber: '', expiry: '', cvv: '' });
      setIsProcessing(false);
      if (result.alreadyPaid) { setError('Payment Already Completed'); return; }
      if (!result.success) { setResultStatus('failed'); return; }
      navigate(`/payment-success/${booking.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Payment processing error');
      setIsProcessing(false);
    }
  };

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const buttonLabel = paymentMethod === 'pay_at_pickup' ? 'Confirm Booking' : `Pay ${formatCurrency(booking.totalAmount)}`;

  return (
    <Layout>
      <main className="min-h-screen bg-primary px-4 py-10 text-text sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Checkout</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Secure Checkout</h1><p className="mt-2 text-textSecondary">Choose a demo payment method for your confirmed reservation.</p></div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="rounded-2xl border border-border bg-secondary p-6 sm:p-8">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {methods.map(({ id, label, description, icon: Icon }) => <button key={id} type="button" onClick={() => { setPaymentMethod(id); setError(''); }} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${paymentMethod === id ? 'border-accent bg-accent/10' : 'border-border bg-primary hover:border-accent/60'}`} aria-pressed={paymentMethod === id}><Icon size={22} className={paymentMethod === id ? 'text-accent' : 'text-textSecondary'} /><span><strong className="block">{label}</strong><span className="mt-1 block text-xs text-textSecondary">{description}</span></span></button>)}
              </div>
              <div className="mt-8 border-t border-border pt-7">
                {paymentMethod === 'pay_at_pickup' && <div className="rounded-xl border border-border bg-primary p-4 text-sm text-textSecondary"><Banknote size={20} className="mb-2 text-accent" />You will pay at the pickup location.</div>}
                {paymentMethod === 'upi' && <div><label htmlFor="upi-id" className="mb-2 block text-sm font-semibold">UPI ID</label><input id="upi-id" value={form.upiId} onChange={(event) => updateField('upiId', event.target.value)} placeholder="yourname@upi" autoComplete="off" className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" /><p className="mt-2 text-xs text-textSecondary">Demo only. Use fail@upi to simulate a failed payment.</p></div>}
                {paymentMethod === 'card' && <div className="space-y-4"><div><label htmlFor="cardholder-name" className="mb-2 block text-sm font-semibold">Cardholder Name</label><input id="cardholder-name" value={form.cardholderName} onChange={(event) => updateField('cardholderName', event.target.value)} autoComplete="off" className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" /></div><div><label htmlFor="card-number" className="mb-2 block text-sm font-semibold">Card Number</label><input id="card-number" inputMode="numeric" maxLength="19" value={form.cardNumber} onChange={(event) => updateField('cardNumber', event.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '))} autoComplete="off" className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="expiry" className="mb-2 block text-sm font-semibold">Expiry</label><input id="expiry" placeholder="MM/YY" maxLength="5" value={form.expiry} onChange={(event) => updateField('expiry', event.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/'))} autoComplete="off" className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" /></div><div><label htmlFor="cvv" className="mb-2 block text-sm font-semibold">CVV</label><input id="cvv" type="password" inputMode="numeric" maxLength="3" value={form.cvv} onChange={(event) => updateField('cvv', event.target.value.replace(/\D/g, '').slice(0, 3))} autoComplete="off" className="w-full rounded-lg border border-border bg-primary px-3 py-3 text-text focus:border-accent focus:outline-none" /></div></div><div className="rounded-lg border border-border bg-primary p-3 text-xs text-textSecondary"><strong className="text-text">Demo Card</strong><br />4111 1111 1111 1111 · 12/30 · 123 <button type="button" onClick={() => setForm({ ...form, cardholderName: 'Demo Rider', cardNumber: '4111 1111 1111 1111', expiry: '12/30', cvv: '123' })} className="ml-2 font-semibold text-accent">Use Demo Card</button></div></div>}
                {paymentMethod === 'wallet' && <div className="rounded-xl border border-border bg-primary p-4 text-sm text-textSecondary"><WalletCards size={20} className="mb-2 text-accent" />Demo Wallet is ready for this simulated checkout.</div>}
                {error && <p className="mt-4 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-red-300" role="alert">{error}</p>}
                <p className="mt-5 text-xs text-textSecondary">Demo Payment: This is a frontend demo. No real money will be charged.</p>
                <Button type="submit" size="lg" disabled={isProcessing} className="mt-6 flex w-full items-center justify-center gap-2">{isProcessing ? <><LoaderCircle size={18} className="animate-spin" /> Processing...</> : buttonLabel}</Button>
              </div>
            </motion.form>
            <aside className="rounded-2xl border border-border bg-secondary p-6 lg:sticky lg:top-24"><div className="flex gap-4"><img src={booking.bikeSnapshot?.image} alt={`${booking.bikeSnapshot?.name || 'Bike'} motorcycle`} className="h-20 w-24 rounded-lg object-cover" /><div><p className="text-xs font-bold uppercase tracking-wider text-accent">{booking.bikeSnapshot?.brand}</p><h2 className="font-bold">{booking.bikeSnapshot?.name}</h2></div></div><div className="mt-6 space-y-3 border-y border-border py-5 text-sm"><p className="flex justify-between gap-4 text-textSecondary"><span>Pickup</span><strong className="text-text">{booking.pickup?.date}</strong></p><p className="flex justify-between gap-4 text-textSecondary"><span>Return</span><strong className="text-text">{booking.return?.date}</strong></p><p className="flex justify-between gap-4 text-textSecondary"><span>Rental days</span><strong className="text-text">{booking.rentalDays}</strong></p></div><PriceBreakdown pricePerDay={booking.pricePerDay} days={booking.rentalDays} rentalAmount={booking.rentalAmount} securityDeposit={booking.securityDeposit} tax={booking.tax} total={booking.totalAmount} /></aside>
          </div>
        </div>
      </main>
    </Layout>
  );
};

const PaymentMessage = ({ title, message, action }) => <Layout><main className="flex min-h-[60vh] flex-col items-center justify-center bg-primary px-4 text-center text-text"><AlertCircle size={42} className="mb-4 text-accent" /><h1 className="text-3xl font-bold">{title}</h1><p className="mt-3 max-w-md text-textSecondary">{message}</p><div className="mt-6">{action || <Link to="/my-bookings"><Button>My Bookings</Button></Link>}</div></main></Layout>;

export default Payment;

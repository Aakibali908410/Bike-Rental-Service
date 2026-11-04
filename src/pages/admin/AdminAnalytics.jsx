import { useContext, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import { BikeContext } from '../../context/BikeContext';
import { BookingContext } from '../../context/BookingContext';
import { PaymentContext } from '../../context/PaymentContext';
import { AdminPage, EmptyAdminState, formatCurrency } from './AdminUI';

const ranges = { '7d': 7, '30d': 30, '90d': 90, year: 365 };
const AdminAnalytics = () => {
  const { bikes } = useContext(BikeContext);
  const { bookings } = useContext(BookingContext);
  const { payments } = useContext(PaymentContext);
  const [range, setRange] = useState('30d');
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - ranges[range]);
  const scopedBookings = bookings.filter((booking) => new Date(booking.createdAt || 0) >= cutoff);
  const scopedPayments = payments.filter((payment) => payment.paymentStatus === 'paid' && new Date(payment.createdAt || 0) >= cutoff);
  const revenueData = useMemo(() => groupByDate(scopedPayments, (payment) => Number(payment.amount || 0)), [scopedPayments]);
  const bookingData = useMemo(() => groupByDate(scopedBookings, () => 1, true), [scopedBookings]);
  const performance = useMemo(() => bikes.map((bike) => { const bikeBookings = scopedBookings.filter((booking) => String(booking.bikeId) === String(bike.id)); const bikeRevenue = scopedPayments.filter((payment) => String(payment.bookingId) === String(bikeBookings.find((booking) => booking.id === payment.bookingId)?.id)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0); return { name: bike.name, bookings: bikeBookings.length, revenue: bikeRevenue }; }).filter((bike) => bike.bookings).sort((first, second) => second.bookings - first.bookings), [bikes, scopedBookings, scopedPayments]);
  return <AdminLayout><AdminPage eyebrow="Insights" title="Analytics" description="Understand bookings, paid revenue, and fleet performance." actions={<div className="flex rounded-lg border border-border bg-secondary p-1">{Object.entries({ '7d': '7 Days', '30d': '30 Days', '90d': '90 Days', year: 'This Year' }).map(([value, label]) => <button key={value} type="button" onClick={() => setRange(value)} className={`rounded-md px-3 py-2 text-xs font-semibold ${range === value ? 'bg-accent text-white' : 'text-textSecondary hover:text-text'}`}>{label}</button>)}</div>}><div className="grid gap-6 xl:grid-cols-2"><Chart title="Paid revenue"><AnalyticsChart data={revenueData} dataKey="revenue" color="#f97316" formatter={(value) => formatCurrency(value)} /></Chart><Chart title="Bookings by day"><AnalyticsChart data={bookingData} dataKey="bookings" color="#38bdf8" /></Chart></div><section className="mt-6 rounded-2xl border border-border bg-secondary p-5"><h2 className="text-lg font-bold">Bike performance</h2>{performance.length ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-textSecondary"><tr><th className="py-3">Bike</th><th className="py-3">Bookings</th><th className="py-3">Paid revenue</th></tr></thead><tbody>{performance.map((bike) => <tr key={bike.name} className="border-b border-border last:border-0"><td className="py-3 font-semibold">{bike.name}</td><td className="py-3">{bike.bookings}</td><td className="py-3 text-accent">{formatCurrency(bike.revenue)}</td></tr>)}</tbody></table></div> : <div className="mt-4"><EmptyAdminState title="Not enough data to display analytics" message="Bookings and successful payments will appear here." /></div>}</section></AdminPage></AdminLayout>;
};

const Chart = ({ title, children }) => <section className="rounded-2xl border border-border bg-secondary p-5"><h2 className="text-lg font-bold">{title}</h2><div className="mt-5">{children}</div></section>;
const AnalyticsChart = ({ data, dataKey, color, formatter }) => data.length ? <ResponsiveContainer width="100%" height={280}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="date" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip formatter={formatter} /><Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer> : <EmptyAdminState title="Not enough data to display analytics" message="There is no activity in this time range." />;
const groupByDate = (items, value, includeStatuses = false) => { const grouped = {}; items.forEach((item) => { const date = (item.createdAt || '').slice(0, 10); if (!date) return; if (!grouped[date]) grouped[date] = includeStatuses ? { bookings: 0, confirmed: 0, completed: 0, cancelled: 0 } : 0; if (includeStatuses) { grouped[date].bookings += 1; const status = item.bookingStatus; if (grouped[date][status] !== undefined) grouped[date][status] += 1; } else grouped[date] += value(item); }); return Object.entries(grouped).sort(([first], [second]) => first.localeCompare(second)).map(([date, values]) => ({ date: date.slice(5), ...(includeStatuses ? values : { revenue: values }) })); };

export default AdminAnalytics;

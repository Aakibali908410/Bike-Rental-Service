import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle, CreditCard, XCircle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';
import { BookingContext } from '../../context/BookingContext';
import { AdminPage, EmptyAdminState, StatCard, formatCurrency, formatDate } from './AdminUI';

const AdminUserDetails = () => {
  const { userId } = useParams();
  const { users } = useContext(AuthContext);
  const { bookings } = useContext(BookingContext);
  const profile = users.find((user) => String(user.id) === String(userId));
  if (!profile) return <AdminLayout><AdminPage eyebrow="People" title="User not found"><EmptyAdminState title="User Not Found" message="This user could not be found." action={<Link to="/admin/users"><Button>Back to Users</Button></Link>} /></AdminPage></AdminLayout>;
  const userBookings = bookings.filter((booking) => String(booking.userId) === String(profile.id));
  const completed = userBookings.filter((booking) => booking.bookingStatus === 'completed').length;
  const cancelled = userBookings.filter((booking) => booking.bookingStatus === 'cancelled').length;
  const active = userBookings.filter((booking) => booking.bookingStatus === 'confirmed').length;
  const spent = userBookings.filter((booking) => booking.paymentStatus === 'paid').reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
  return <AdminLayout><AdminPage eyebrow="User profile" title={profile.name} actions={<Link to="/admin/users"><Button variant="outline"><ArrowLeft size={16} className="mr-1 inline" /> Back to Users</Button></Link>}><section className="rounded-2xl border border-border bg-secondary p-6"><div className="grid gap-5 sm:grid-cols-2"><Info label="Email" value={profile.email} /><Info label="Phone" value={profile.phone || '—'} /><Info label="Role" value={profile.role} /><Info label="Joined" value={formatDate(profile.createdAt)} /></div></section><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={CalendarDays} label="Total bookings" value={userBookings.length} detail="All reservations" /><StatCard icon={CheckCircle} label="Active" value={active} detail="Confirmed bookings" /><StatCard icon={XCircle} label="Cancelled" value={cancelled} detail={`${completed} completed`} /><StatCard icon={CreditCard} label="Total spent" value={formatCurrency(spent)} detail="Paid bookings" /></div></AdminPage></AdminLayout>;
};

const Info = ({ label, value }) => <div><p className="text-xs text-textSecondary">{label}</p><p className="mt-2 break-words font-semibold">{value}</p></div>;

export default AdminUserDetails;

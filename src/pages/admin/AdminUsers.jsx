import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { AuthContext } from '../../context/AuthContext';
import { BookingContext } from '../../context/BookingContext';
import { AdminPage, EmptyAdminState, StatusBadge, formatDate } from './AdminUI';

const AdminUsers = () => {
  const { users } = useContext(AuthContext);
  const { bookings } = useContext(BookingContext);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const filteredUsers = useMemo(() => [...users].filter((user) => { const haystack = `${user.name} ${user.email} ${user.phone || ''}`.toLowerCase(); return haystack.includes(query.toLowerCase()) && (role === 'all' || (role === 'customers' ? user.role !== 'ADMIN' : user.role === 'ADMIN')); }).sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0)), [query, role, users]);
  const countFor = (userId) => bookings.filter((booking) => String(booking.userId) === String(userId)).length;
  return <AdminLayout><AdminPage eyebrow="People" title="Users" description="View registered customers and account activity."><div className="mb-5 grid gap-3 rounded-2xl border border-border bg-secondary p-4 md:grid-cols-[minmax(220px,1fr)_180px]"><div className="relative"><Search size={17} className="pointer-events-none absolute left-3 top-3 text-textSecondary" /><Input aria-label="Search users" placeholder="Search name, email, phone..." value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" /></div><Select aria-label="User role filter" value={role} options={[{ value: 'all', label: 'All users' }, { value: 'customers', label: 'Customers' }, { value: 'admins', label: 'Admins' }]} onChange={(event) => setRole(event.target.value)} /></div><div className="overflow-hidden rounded-2xl border border-border bg-secondary">{filteredUsers.length ? <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-textSecondary"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Bookings</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4" /></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id} className="border-b border-border last:border-0 hover:bg-primary/50"><td className="px-5 py-4"><p className="font-semibold">{user.name}</p><p className="text-xs text-textSecondary">{user.email}</p></td><td className="px-5 py-4">{user.phone || '—'}</td><td className="px-5 py-4"><StatusBadge value={user.role === 'ADMIN' ? 'admin' : 'customer'} /></td><td className="px-5 py-4">{countFor(user.id)}</td><td className="px-5 py-4"><StatusBadge value={user.status || 'active'} /></td><td className="px-5 py-4 text-textSecondary">{formatDate(user.createdAt)}</td><td className="px-5 py-4"><Link to={`/admin/users/${user.id}`} className="font-semibold text-accent">View</Link></td></tr>)}</tbody></table></div> : <div className="p-5"><EmptyAdminState title="No users found" message="Try changing your search or filters." /></div>}</div></AdminPage></AdminLayout>;
};

export default AdminUsers;

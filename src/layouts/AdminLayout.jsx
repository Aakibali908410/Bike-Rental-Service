import { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Bike, Bell, CalendarDays, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react';
import Brand from '../components/Brand';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bikes', label: 'Bikes', icon: Bike },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => { logout(); navigate('/'); };

  return <div className="min-h-screen bg-primary text-text"><header className="sticky top-0 z-40 border-b border-border bg-primary/95 backdrop-blur"><div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-4"><button type="button" onClick={() => setIsOpen(true)} aria-label="Open admin navigation" className="rounded-lg p-2 hover:bg-secondary lg:hidden"><Menu size={22} /></button><div className="hidden sm:block"><Brand size="md" /></div><div className="sm:hidden"><Brand size="sm" /></div><div className="hidden border-l border-border pl-4 text-sm text-textSecondary md:block">Admin Dashboard</div></div><div className="flex items-center gap-3"><button type="button" aria-label="View notifications" className="rounded-lg p-2 text-textSecondary hover:bg-secondary hover:text-text"><Bell size={19} /></button><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user?.name}</p><p className="text-xs text-textSecondary">Administrator</p></div><Button variant="ghost" size="sm" onClick={handleLogout}><LogOut size={16} className="mr-1 inline" /> Logout</Button></div></div></header><div className="flex"><aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-primary p-5 pt-24 transition-transform lg:sticky lg:top-20 lg:z-0 lg:h-[calc(100vh-5rem)] lg:w-64 lg:translate-x-0 lg:shrink-0 lg:p-5 lg:pt-7 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}><div className="mb-5 flex items-center justify-between lg:hidden"><span className="text-sm font-bold uppercase tracking-wider text-accent">Navigation</span><button type="button" onClick={closeMenu} aria-label="Close admin navigation" className="rounded-lg p-2 hover:bg-secondary"><X size={20} /></button></div><nav className="space-y-1" aria-label="Admin navigation">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={closeMenu} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-accent text-white' : 'text-textSecondary hover:bg-secondary hover:text-text'}`}><Icon size={18} />{label}</NavLink>)}</nav><div className="mt-8 border-t border-border pt-5"><p className="mb-2 px-4 text-xs uppercase tracking-wider text-textSecondary">Current section</p><p className="px-4 text-sm text-textSecondary">{links.find((link) => location.pathname.startsWith(link.to))?.label || 'Dashboard'}</p></div></aside>{isOpen && <button type="button" aria-label="Close navigation overlay" onClick={closeMenu} className="fixed inset-0 z-40 bg-black/60 lg:hidden" /> }<main className="min-w-0 flex-1">{children}</main></div></div>;
};

export default AdminLayout;

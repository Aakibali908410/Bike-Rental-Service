/* eslint-disable react-refresh/only-export-components */
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { formatCurrency } from '../../utils/rentalPrice';

export const AdminPage = ({ eyebrow, title, description, actions, children }) => <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>{description && <p className="mt-2 text-textSecondary">{description}</p>}</div>{actions && <div className="flex flex-wrap gap-3">{actions}</div>}</div>{children}</div></motion.div>;

export const StatCard = ({ icon: Icon, label, value, detail }) => <motion.article whileHover={{ y: -2 }} className="rounded-2xl border border-border bg-secondary p-5 shadow-lg shadow-black/10"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-textSecondary">{label}</p><p className="mt-3 text-3xl font-bold text-text">{value}</p><p className="mt-2 text-xs text-textSecondary">{detail}</p></div><span className="rounded-xl bg-accent/15 p-3 text-accent"><Icon size={21} /></span></div></motion.article>;

export const StatusBadge = ({ value }) => { const normalized = String(value || 'unknown').toLowerCase(); const tone = normalized === 'paid' || normalized === 'confirmed' || normalized === 'available' || normalized === 'active' ? 'bg-success/15 text-green-300' : normalized === 'cancelled' || normalized === 'failed' || normalized === 'unavailable' || normalized === 'inactive' ? 'bg-error/15 text-red-300' : 'bg-warning/15 text-yellow-200'; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{normalized}</span>; };

export const EmptyAdminState = ({ title, message, action }) => <div className="rounded-2xl border border-dashed border-border bg-secondary/50 px-6 py-14 text-center"><X size={30} className="mx-auto mb-3 text-textSecondary" /><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-textSecondary">{message}</p>{action && <div className="mt-5">{action}</div>}</div>;

export const ConfirmModal = ({ isOpen, title, message, onClose, onConfirm, confirmLabel = 'Confirm' }) => <Modal isOpen={isOpen} onClose={onClose} title={title} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></>}><p className="text-textSecondary">{message}</p></Modal>;

export const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
export { formatCurrency };

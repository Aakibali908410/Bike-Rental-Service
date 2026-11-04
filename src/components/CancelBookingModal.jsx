import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

const CancelBookingModal = ({ booking, onClose, onConfirm, isCancelling = false, error = null }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
      <div className="w-full max-w-md rounded-2xl border border-border bg-secondary p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isCancelling}
          aria-label="Close cancellation dialog"
          className="float-right rounded-lg p-2 text-textSecondary hover:bg-primary hover:text-text disabled:opacity-50"
        >
          <X size={20} />
        </button>
        <AlertTriangle size={32} className="mb-4 text-accent" />
        <h2 id="cancel-title" className="text-2xl font-bold">Cancel this booking?</h2>
        <p className="mt-3 text-textSecondary">
          Are you sure you want to cancel reservation <strong className="text-text">{booking.id}</strong>?
        </p>
        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isCancelling}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isCancelling}>
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;

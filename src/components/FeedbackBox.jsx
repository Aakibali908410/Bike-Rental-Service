import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquarePlus, 
  X, 
  Star, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Mail, 
  Tag, 
  MessageSquare
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { feedbackAPI } from '../utils/api';

const RATING_LABELS = {
  1: 'Poor - Needs significant improvement',
  2: 'Fair - Below expectations',
  3: 'Good - Met expectations',
  4: 'Very Good - Exceeded expectations',
  5: 'Excellent - Outstanding experience!'
};

const CATEGORIES = [
  'General',
  'Bike Condition',
  'Booking Process',
  'Payment & Pricing',
  'Website Experience',
  'Customer Support'
];

const FeedbackBox = () => {
  const { user } = useContext(AuthContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('General');
  const [message, setMessage] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Auto-fill from authenticated user when opening
  useEffect(() => {
    if (isOpen && user) {
      if (!name && user.name) setName(user.name);
      if (!email && user.email) setEmail(user.email);
    }
  }, [isOpen, user]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setServerError('');
    setErrors({});
    if (isSuccess) {
      resetForm();
    }
  };

  const resetForm = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setRating(0);
    setHoverRating(0);
    setCategory('General');
    setMessage('');
    setErrors({});
    setServerError('');
    setIsSuccess(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name must be under 100 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select a star rating (1 to 5 stars).';
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter your feedback message.';
    } else if (message.trim().length < 5) {
      newErrors.message = 'Feedback message must be at least 5 characters.';
    } else if (message.trim().length > 2000) {
      newErrors.message = 'Feedback message cannot exceed 2000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await feedbackAPI.submitFeedback({
        name: name.trim(),
        email: email.trim(),
        rating,
        category,
        message: message.trim(),
      });

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || 'Unable to connect to the feedback server. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING FEEDBACK BUTTON */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2.5 rounded-full bg-accent px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/25 focus:outline-none focus:ring-4 focus:ring-accent/30"
        aria-label="Open Feedback Form"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
        </span>
        <MessageSquarePlus size={20} className="shrink-0" />
        <span className="text-sm font-bold tracking-wide">Feedback</span>
      </motion.button>

      {/* 2. MODAL BACKDROP & DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-modal-title"
              className="relative w-full max-w-lg rounded-2xl border border-border bg-secondary p-6 sm:p-8 shadow-2xl z-10 my-auto text-text max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 rounded-full p-2 text-textSecondary transition-colors hover:bg-white/10 hover:text-text focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close feedback modal"
              >
                <X size={20} />
              </button>

              {/* SUCCESS VIEW */}
              {isSuccess ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-text">Thank You for Your Feedback!</h3>
                  <p className="mt-2 text-sm text-textSecondary">
                    Your valuable review has been safely recorded in our system. It helps us improve Bikes Rental Service for riders like you!
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto rounded-xl border border-border bg-primary px-5 py-2.5 text-sm font-semibold text-text hover:bg-border transition-colors"
                    >
                      Submit Another
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full sm:w-auto rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM VIEW */
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent mb-2">
                      <MessageSquare size={13} />
                      Customer Review & Feedback
                    </div>
                    <h2 id="feedback-modal-title" className="text-2xl font-bold tracking-tight text-text">
                      Share Your Experience
                    </h2>
                    <p className="mt-1 text-sm text-textSecondary">
                      Help us improve Bikes Rental Service. We review and appreciate every message.
                    </p>
                  </div>

                  {serverError && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 p-3.5 text-sm text-red-300">
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-error" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* STAR RATING */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-2">
                        How would you rate your experience? <span className="text-accent">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating || rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                setRating(star);
                                if (errors.rating) setErrors({ ...errors, rating: '' });
                              }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                              <Star
                                size={28}
                                className={`transition-colors ${
                                  active
                                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                    : 'text-border hover:text-amber-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                        {rating > 0 && (
                          <span className="ml-2 text-xs font-semibold text-amber-400">
                            {rating}/5
                          </span>
                        )}
                      </div>
                      {(hoverRating || rating) > 0 && (
                        <p className="mt-1.5 text-xs text-textSecondary italic">
                          {RATING_LABELS[hoverRating || rating]}
                        </p>
                      )}
                      {errors.rating && (
                        <p className="mt-1.5 text-xs text-error">{errors.rating}</p>
                      )}
                    </div>

                    {/* NAME & EMAIL GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
                          Your Name <span className="text-accent">*</span>
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            placeholder="John Doe"
                            className={`w-full rounded-xl border bg-primary pl-10 pr-3.5 py-2.5 text-sm text-text placeholder-textSecondary/50 transition-colors focus:outline-none focus:ring-2 ${
                              errors.name ? 'border-error focus:ring-error' : 'border-border focus:border-accent focus:ring-accent/20'
                            }`}
                          />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
                          Your Email <span className="text-accent">*</span>
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            placeholder="you@example.com"
                            className={`w-full rounded-xl border bg-primary pl-10 pr-3.5 py-2.5 text-sm text-text placeholder-textSecondary/50 transition-colors focus:outline-none focus:ring-2 ${
                              errors.email ? 'border-error focus:ring-error' : 'border-border focus:border-accent focus:ring-accent/20'
                            }`}
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                      </div>
                    </div>

                    {/* CATEGORY */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
                        Feedback Category
                      </label>
                      <div className="relative">
                        <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded-xl border border-border bg-primary pl-10 pr-4 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="bg-secondary text-text">
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-textSecondary">
                          Feedback Message <span className="text-accent">*</span>
                        </label>
                        <span className={`text-[11px] ${message.length > 1900 ? 'text-accent' : 'text-textSecondary'}`}>
                          {message.length}/2000
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors({ ...errors, message: '' });
                        }}
                        placeholder="Tell us what you liked or what we can do better for your next ride..."
                        className={`w-full resize-none rounded-xl border bg-primary p-3 text-sm text-text placeholder-textSecondary/50 transition-colors focus:outline-none focus:ring-2 ${
                          errors.message ? 'border-error focus:ring-error' : 'border-border focus:border-accent focus:ring-accent/20'
                        }`}
                      />
                      {errors.message && <p className="mt-1 text-xs text-error">{errors.message}</p>}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3 px-5 text-sm font-bold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-orange-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Submitting Feedback...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Submit Feedback</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-[11px] text-textSecondary pt-1">
                      Your feedback will be stored securely and reviewed by the Bikes Rental Service team.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackBox;


import React from 'react';

const BookingSteps = ({ currentStep }) => {
  const steps = ['Details', 'Review', 'Confirmation'];
  return <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-5" aria-label="Booking progress">{steps.map((step, index) => { const number = index + 1; const active = number <= currentStep; return <React.Fragment key={step}><li className={`flex items-center gap-2 text-sm font-semibold ${active ? 'text-accent' : 'text-textSecondary'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${active ? 'border-accent bg-accent text-white' : 'border-border'}`}>{number}</span><span className="hidden sm:inline">{step}</span></li>{number < steps.length && <li className={`h-px w-8 sm:w-16 ${number < currentStep ? 'bg-accent' : 'bg-border'}`} aria-hidden="true" />}</React.Fragment>; })}</ol>;
};

export default BookingSteps;

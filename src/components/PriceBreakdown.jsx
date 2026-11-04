import React from 'react';
import { formatCurrency } from '../utils/rentalPrice';

const PriceBreakdown = ({ pricePerDay, days, rentalAmount, securityDeposit, tax, total }) => {
  return (
    <div className="space-y-3 border-t border-border pt-5">
      <div className="flex justify-between gap-4 text-sm text-textSecondary">
        <span>{formatCurrency(pricePerDay)} x {days} {days === 1 ? 'day' : 'days'}</span>
        <span className="text-text">{formatCurrency(rentalAmount)}</span>
      </div>
      <div className="flex justify-between gap-4 text-sm text-textSecondary">
        <span>Security deposit</span>
        <span className="text-text">{formatCurrency(securityDeposit)}</span>
      </div>
      <div className="flex justify-between gap-4 text-sm text-textSecondary">
        <span>Taxes (18%)</span>
        <span className="text-text">{formatCurrency(tax)}</span>
      </div>
      <div className="flex justify-between gap-4 border-t border-border pt-4 text-lg font-bold">
        <span className="text-text">Total estimated</span>
        <span className="text-accent">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;

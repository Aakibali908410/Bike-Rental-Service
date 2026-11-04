import React from 'react';
import { Bike } from 'lucide-react';

const Brand = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 font-bold text-white ${sizes[size]} ${className}`}>
      <Bike size={size === 'sm' ? 20 : size === 'md' ? 24 : size === 'lg' ? 32 : 40} className="text-accent" />
      <div>
        <div>Bikes Rental Service</div>
        <div className="text-xs text-textSecondary font-normal">Your Ride, Your Way.</div>
      </div>
    </div>
  );
};

export default Brand;

import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-secondary text-text border border-border',
    primary: 'bg-accent text-white',
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-black',
    info: 'bg-blue-600 text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

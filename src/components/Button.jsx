import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex min-h-11 items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/40';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-orange-600 active:scale-95',
    secondary: 'bg-secondary text-text hover:bg-gray-700 border border-border',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
    ghost: 'text-text hover:bg-secondary',
    danger: 'bg-error text-white hover:bg-red-600',
    success: 'bg-success text-white hover:bg-green-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

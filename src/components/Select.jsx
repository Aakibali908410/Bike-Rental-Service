import React from 'react';

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  label = '',
  className = '',
  disabled = false,
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-11 w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-text transition-all duration-300 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 ${
          error ? 'border-error focus:border-error focus:ring-error' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const BikeFilters = ({
  filters,
  onFilterChange,
  brands,
  locations,
  priceRange,
  onClearAll,
}) => {
  const categories = ['Commuter', 'Sports', 'Cruiser', 'Adventure', 'Scooter', 'Premium'];
  const engineRanges = [
    { value: 'below-200', label: 'Below 200cc' },
    { value: '200-400', label: '200cc - 400cc' },
    { value: '400-600', label: '400cc - 600cc' },
    { value: '600+', label: '600cc+' },
  ];
  const ratings = [
    { value: 4.5, label: '4.5+ ⭐' },
    { value: 4.0, label: '4.0+ ⭐' },
    { value: 3.5, label: '3.5+ ⭐' },
  ];

  const handleCategoryChange = (category) => {
    let updatedCategories = [...(filters.category || [])];
    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter((c) => c !== category);
    } else {
      updatedCategories.push(category);
    }
    onFilterChange({ ...filters, category: updatedCategories });
  };

  const handleBrandChange = (brand) => {
    let updatedBrands = [...(filters.brand || [])];
    if (updatedBrands.includes(brand)) {
      updatedBrands = updatedBrands.filter((b) => b !== brand);
    } else {
      updatedBrands.push(brand);
    }
    onFilterChange({ ...filters, brand: updatedBrands });
  };

  const handleLocationChange = (location) => {
    let updatedLocations = [...(filters.location || [])];
    if (updatedLocations.includes(location)) {
      updatedLocations = updatedLocations.filter((l) => l !== location);
    } else {
      updatedLocations.push(location);
    }
    onFilterChange({ ...filters, location: updatedLocations });
  };

  const handleEngineChange = (range) => {
    let updatedRanges = [...(filters.engineRange || [])];
    if (updatedRanges.includes(range)) {
      updatedRanges = updatedRanges.filter((r) => r !== range);
    } else {
      updatedRanges.push(range);
    }
    onFilterChange({ ...filters, engineRange: updatedRanges });
  };

  const handleRatingChange = (rating) => {
    if (filters.minRating === rating) {
      onFilterChange({ ...filters, minRating: undefined });
    } else {
      onFilterChange({ ...filters, minRating: rating });
    }
  };

  const handleAvailabilityChange = (value) => {
    onFilterChange({
      ...filters,
      availability: filters.availability === value ? 'all' : value,
    });
  };

  const handlePriceChange = (type, value) => {
    const numValue = value === '' ? undefined : parseInt(value);
    onFilterChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    });
  };

  return (
    <div className="bg-secondary rounded-lg border border-border p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text">Filters</h2>
        {(filters.category?.length > 0 ||
          filters.brand?.length > 0 ||
          filters.minRating !== undefined ||
          filters.minPrice !== undefined ||
          filters.engineRange?.length > 0 ||
          filters.location?.length > 0 ||
          filters.availability !== 'all') && (
          <button
            onClick={onClearAll}
            className="text-sm text-accent hover:text-orange-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-text mb-3 text-sm">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category?.includes(category) || false}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 rounded border-border bg-primary"
              />
              <span className="text-sm text-textSecondary hover:text-text transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-text mb-3 text-sm">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand) || false}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 rounded border-border bg-primary"
              />
              <span className="text-sm text-textSecondary hover:text-text transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-text mb-3 text-sm">Location</h3>
        <div className="space-y-2">
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.location?.includes(location) || false}
                onChange={() => handleLocationChange(location)}
                className="w-4 h-4 rounded border-border bg-primary"
              />
              <span className="text-sm text-textSecondary hover:text-text transition-colors">
                {location}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-text mb-3 text-sm">Price Per Day</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-textSecondary block mb-1">
              Min: ₹{filters.minPrice || priceRange.min}
            </label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder={`₹${priceRange.min}`}
              className="w-full px-3 py-2 bg-primary border border-border rounded text-text text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-textSecondary block mb-1">
              Max: ₹{filters.maxPrice || priceRange.max}
            </label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder={`₹${priceRange.max}`}
              className="w-full px-3 py-2 bg-primary border border-border rounded text-text text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Engine Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-text mb-3 text-sm">Engine</h3>
        <div className="space-y-2">
          {engineRanges.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.engineRange?.includes(value) || false}
                onChange={() => handleEngineChange(value)}
                className="w-4 h-4 rounded border-border bg-primary"
              />
              <span className="text-sm text-textSecondary hover:text-text transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-text mb-3 text-sm">Rating</h3>
        <div className="space-y-2">
          {ratings.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === value}
                onChange={() => handleRatingChange(value)}
                className="w-4 h-4 border-border bg-primary"
              />
              <span className="text-sm text-textSecondary hover:text-text transition-colors">
                {label}
              </span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === undefined}
              onChange={() => handleRatingChange(undefined)}
              className="w-4 h-4 border-border bg-primary"
            />
            <span className="text-sm text-textSecondary hover:text-text transition-colors">
              All Ratings
            </span>
          </label>
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="font-semibold text-text mb-3 text-sm">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === 'all'}
              onChange={() => handleAvailabilityChange('all')}
              className="w-4 h-4 border-border bg-primary"
            />
            <span className="text-sm text-textSecondary hover:text-text transition-colors">
              All Bikes
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === 'available'}
              onChange={() => handleAvailabilityChange('available')}
              className="w-4 h-4 border-border bg-primary"
            />
            <span className="text-sm text-textSecondary hover:text-text transition-colors">
              Available Only
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === 'unavailable'}
              onChange={() => handleAvailabilityChange('unavailable')}
              className="w-4 h-4 border-border bg-primary"
            />
            <span className="text-sm text-textSecondary hover:text-text transition-colors">
              Unavailable
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BikeFilters;

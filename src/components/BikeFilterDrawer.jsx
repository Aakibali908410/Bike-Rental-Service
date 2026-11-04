import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

const BikeFilterDrawer = ({
  isOpen,
  onClose,
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-secondary border-l border-border z-50 md:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-secondary border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Filters & Sort</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-primary rounded transition-colors"
              >
                <X size={20} className="text-text" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-text mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category) || false}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 rounded border-border bg-primary"
                      />
                      <span className="text-sm text-textSecondary">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-semibold text-text mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand?.includes(brand) || false}
                        onChange={() => handleBrandChange(brand)}
                        className="w-4 h-4 rounded border-border bg-primary"
                      />
                      <span className="text-sm text-textSecondary">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="font-semibold text-text mb-3">Location</h3>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.location?.includes(location) || false}
                        onChange={() => handleLocationChange(location)}
                        className="w-4 h-4 rounded border-border bg-primary"
                      />
                      <span className="text-sm text-textSecondary">
                        {location}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold text-text mb-3">Price Per Day</h3>
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
              <div>
                <h3 className="font-semibold text-text mb-3">Engine</h3>
                <div className="space-y-2">
                  {engineRanges.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.engineRange?.includes(value) || false}
                        onChange={() => handleEngineChange(value)}
                        className="w-4 h-4 rounded border-border bg-primary"
                      />
                      <span className="text-sm text-textSecondary">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold text-text mb-3">Rating</h3>
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
                      <span className="text-sm text-textSecondary">
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
                    <span className="text-sm text-textSecondary">
                      All Ratings
                    </span>
                  </label>
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h3 className="font-semibold text-text mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === 'all'}
                      onChange={() => handleAvailabilityChange('all')}
                      className="w-4 h-4 border-border bg-primary"
                    />
                    <span className="text-sm text-textSecondary">
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
                    <span className="text-sm text-textSecondary">
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
                    <span className="text-sm text-textSecondary">
                      Unavailable
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-secondary border-t border-border p-4 space-y-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={onClose}
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => {
                  onClearAll();
                  onClose();
                }}
              >
                Clear All
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BikeFilterDrawer;

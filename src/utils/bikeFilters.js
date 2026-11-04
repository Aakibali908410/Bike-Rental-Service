/**
 * Utility functions for filtering and sorting bikes
 */

/**
 * Get unique values from bikes array for a specific property
 */
export const getUniqueValues = (bikes, property) => {
  return [...new Set(bikes.map((bike) => bike[property]))].sort();
};

/**
 * Get all unique brands from bikes
 */
export const getUniqueBrands = (bikes) => {
  return getUniqueValues(bikes, 'brand');
};

/**
 * Get all unique locations from bikes
 */
export const getUniqueLocations = (bikes) => {
  return getUniqueValues(bikes, 'location');
};

/**
 * Get price range from bikes [min, max]
 */
export const getPriceRange = (bikes) => {
  const prices = bikes.map((bike) => bike.pricePerDay);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

/**
 * Get engine range from bikes [min, max]
 */
export const getEngineRange = (bikes) => {
  const engines = bikes.map((bike) => bike.engine);
  return {
    min: Math.min(...engines),
    max: Math.max(...engines),
  };
};

/**
 * Apply filters to bikes array
 */
export const applyFilters = (bikes, filters) => {
  let result = [...bikes];

  // Search filter
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (bike) =>
        bike.name.toLowerCase().includes(searchLower) ||
        bike.brand.toLowerCase().includes(searchLower) ||
        bike.model.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category && filters.category.length > 0) {
    result = result.filter((bike) => filters.category.includes(bike.category));
  }

  // Brand filter
  if (filters.brand && filters.brand.length > 0) {
    result = result.filter((bike) => filters.brand.includes(bike.brand));
  }

  // Location filter
  if (filters.location && filters.location.length > 0) {
    result = result.filter((bike) =>
      filters.location.includes(bike.location)
    );
  }

  // Price filter
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    result = result.filter(
      (bike) =>
        bike.pricePerDay >= filters.minPrice &&
        bike.pricePerDay <= filters.maxPrice
    );
  }

  // Engine filter
  if (filters.engineRange && filters.engineRange.length > 0) {
    result = result.filter((bike) => {
      return filters.engineRange.some((range) => {
        if (range === 'below-200') return bike.engine < 200;
        if (range === '200-400') return bike.engine >= 200 && bike.engine < 400;
        if (range === '400-600') return bike.engine >= 400 && bike.engine < 600;
        if (range === '600+') return bike.engine >= 600;
        return true;
      });
    });
  }

  // Rating filter
  if (filters.minRating !== undefined) {
    result = result.filter((bike) => bike.rating >= filters.minRating);
  }

  // Availability filter
  if (filters.availability !== undefined && filters.availability !== 'all') {
    const isAvailable = filters.availability === 'available';
    result = result.filter((bike) => bike.available === isAvailable);
  }

  return result;
};

/**
 * Sort bikes array
 */
export const sortBikes = (bikes, sortBy) => {
  const sorted = [...bikes];

  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'engine-low':
      sorted.sort((a, b) => a.engine - b.engine);
      break;
    case 'engine-high':
      sorted.sort((a, b) => b.engine - a.engine);
      break;
    default:
      // Recommended: sort by rating then reviews
      sorted.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }

  return sorted;
};

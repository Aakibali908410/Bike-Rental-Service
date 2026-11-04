import React, { useState, useContext, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Filter, ChevronRight, SearchX } from 'lucide-react';
import Layout from '../layouts/Layout';
import BikeCard from '../components/BikeCard';
import BikeFilters from '../components/BikeFilters';
import BikeFilterDrawer from '../components/BikeFilterDrawer';
import Button from '../components/Button';
import { BikeContext } from '../context/BikeContext';
import {
  getUniqueBrands,
  getUniqueLocations,
  getPriceRange,
  applyFilters,
  sortBikes,
} from '../utils/bikeFilters';

const Bikes = () => {
  const { bikes, isLoading, error, fetchBikes } = useContext(BikeContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Initialize filters from URL params
  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.getAll('category') || [],
    brand: searchParams.getAll('brand') || [],
    location: searchParams.getAll('location') || [],
    minPrice: searchParams.get('minPrice')
      ? parseInt(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? parseInt(searchParams.get('maxPrice'))
      : undefined,
    engineRange: searchParams.getAll('engineRange') || [],
    minRating: searchParams.get('minRating')
      ? parseFloat(searchParams.get('minRating'))
      : undefined,
    availability: searchParams.get('availability') || 'all',
    sortBy: searchParams.get('sortBy') || 'recommended',
  };

  const [filters, setFilters] = useState(initialFilters);

  // Get filter options
  const brands = useMemo(() => getUniqueBrands(bikes), [bikes]);
  const locations = useMemo(() => getUniqueLocations(bikes), [bikes]);
  const priceRange = useMemo(() => getPriceRange(bikes), [bikes]);

  // Apply filters and sorting
  const filteredBikes = useMemo(() => {
    let results = applyFilters(bikes, filters);
    results = sortBikes(results, filters.sortBy);
    return results;
  }, [bikes, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  // Update URL search params
  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.append('search', newFilters.search);
    if (newFilters.category && newFilters.category.length > 0) {
      newFilters.category.forEach((c) => params.append('category', c));
    }
    if (newFilters.brand && newFilters.brand.length > 0) {
      newFilters.brand.forEach((b) => params.append('brand', b));
    }
    if (newFilters.location && newFilters.location.length > 0) {
      newFilters.location.forEach((l) => params.append('location', l));
    }
    if (newFilters.minPrice !== undefined)
      params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice !== undefined)
      params.append('maxPrice', newFilters.maxPrice);
    if (newFilters.engineRange && newFilters.engineRange.length > 0) {
      newFilters.engineRange.forEach((e) => params.append('engineRange', e));
    }
    if (newFilters.minRating !== undefined)
      params.append('minRating', newFilters.minRating);
    if (newFilters.availability !== 'all')
      params.append('availability', newFilters.availability);
    if (newFilters.sortBy !== 'recommended')
      params.append('sortBy', newFilters.sortBy);

    setSearchParams(params);
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      category: [],
      brand: [],
      location: [],
      minPrice: undefined,
      maxPrice: undefined,
      engineRange: [],
      minRating: undefined,
      availability: 'all',
      sortBy: 'recommended',
    };
    setFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  // Remove individual filter
  const removeFilter = (filterType, value) => {
    if (filterType === 'search') {
      handleFilterChange({ ...filters, search: '' });
    } else if (Array.isArray(filters[filterType])) {
      const updated = filters[filterType].filter((item) => item !== value);
      handleFilterChange({ ...filters, [filterType]: updated });
    } else {
      handleFilterChange({ ...filters, [filterType]: undefined });
    }
  };

  // Get engine range label
  const getEngineLabel = (range) => {
    const labels = {
      'below-200': 'Below 200cc',
      '200-400': '200cc - 400cc',
      '400-600': '400cc - 600cc',
      '600+': '600cc+',
    };
    return labels[range] || range;
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <Layout>
      <div className="bg-primary min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-textSecondary mb-4">
              <Link to="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <ChevronRight size={16} />
              <span className="text-accent">Bikes</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-text mb-3">
              Find Your Perfect Ride
            </h1>
            <p className="text-textSecondary text-lg">
              Explore our collection of premium bikes and choose the one that fits your journey.
            </p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary" size={20} />
              <input
                type="text"
                placeholder="Search by bike name, brand or model..."
                value={filters.search}
                onChange={(e) => {
                  const newSearch = e.target.value;
                  handleFilterChange({ ...filters, search: newSearch });
                }}
                className="w-full pl-12 pr-12 py-4 bg-secondary border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange({ ...filters, search: '' })}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-accent transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Filter and Sort Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between"
          >
            <div className="text-sm text-textSecondary">
              <span className="text-accent font-semibold">
                {filteredBikes.length}
              </span>{' '}
              {filteredBikes.length === 1 ? 'bike' : 'bikes'} found
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-secondary border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent transition-all"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="engine-low">Engine: Low to High</option>
                <option value="engine-high">Engine: High to Low</option>
              </select>

              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-text hover:border-accent transition-all"
              >
                <Filter size={18} />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </motion.div>

          {/* Active Filters */}
          {(filters.search ||
            filters.category.length > 0 ||
            filters.brand.length > 0 ||
            filters.location.length > 0 ||
            filters.minPrice !== undefined ||
            filters.maxPrice !== undefined ||
            filters.engineRange.length > 0 ||
            filters.minRating !== undefined ||
            filters.availability !== 'all') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex flex-wrap gap-2 items-center"
            >
              {filters.search && (
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  <span>"{filters.search}"</span>
                  <button
                    onClick={() => removeFilter('search')}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.category.map((cat) => (
                <div
                  key={cat}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => removeFilter('category', cat)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {filters.brand.map((brand) => (
                <div
                  key={brand}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                >
                  <span>{brand}</span>
                  <button
                    onClick={() => removeFilter('brand', brand)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {filters.location.map((loc) => (
                <div
                  key={loc}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                >
                  <span>{loc}</span>
                  <button
                    onClick={() => removeFilter('location', loc)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {filters.minPrice !== undefined && (
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  <span>₹{filters.minPrice}+</span>
                  <button
                    onClick={() =>
                      handleFilterChange({ ...filters, minPrice: undefined })
                    }
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.maxPrice !== undefined && (
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  <span>₹{filters.maxPrice} max</span>
                  <button
                    onClick={() =>
                      handleFilterChange({ ...filters, maxPrice: undefined })
                    }
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.engineRange.map((range) => (
                <div
                  key={range}
                  className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                >
                  <span>{getEngineLabel(range)}</span>
                  <button
                    onClick={() => removeFilter('engineRange', range)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {filters.minRating !== undefined && (
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  <span>{filters.minRating}+ ⭐</span>
                  <button
                    onClick={() =>
                      handleFilterChange({ ...filters, minRating: undefined })
                    }
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.availability !== 'all' && (
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  <span>
                    {filters.availability === 'available'
                      ? 'Available Only'
                      : 'Unavailable'}
                  </span>
                  <button
                    onClick={() =>
                      handleFilterChange({
                        ...filters,
                        availability: 'all',
                      })
                    }
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <button
                onClick={handleClearAll}
                className="text-sm text-accent hover:text-orange-400 transition-colors font-semibold"
              >
                Clear All
              </button>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden md:block lg:col-span-1">
              <BikeFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                brands={brands}
                locations={locations}
                priceRange={priceRange}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Bike Grid */}
            <div className="lg:col-span-3">
              {isLoading && bikes.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent border-r-transparent mb-4" />
                  <p className="text-textSecondary">Loading bikes from fleet...</p>
                </div>
              ) : error && bikes.length === 0 ? (
                <div className="rounded-2xl border border-error/40 bg-error/10 p-8 text-center">
                  <p className="text-red-300 font-semibold mb-4">{error}</p>
                  <Button variant="outline" onClick={() => fetchBikes()}>Retry Loading</Button>
                </div>
              ) : filteredBikes.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredBikes.map((bike) => (
                    <motion.div key={bike.id} variants={itemVariants}>
                      <BikeCard bike={bike} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                    <SearchX size={32} className="text-textSecondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-2">
                    No bikes found
                  </h3>
                  <p className="text-textSecondary mb-6">
                    Try changing your search or filters.
                  </p>
                  <Button variant="primary" onClick={handleClearAll}>
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <BikeFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        brands={brands}
        locations={locations}
        priceRange={priceRange}
        onClearAll={handleClearAll}
      />
    </Layout>
  );
};

export default Bikes;

import { createContext, useState, useEffect, useCallback } from 'react';
import { bikeAPI } from '../utils/api';

// eslint-disable-next-line react-refresh/only-export-components
export const BikeContext = createContext();

export const BikeProvider = ({ children }) => {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bikes from MongoDB Atlas via GET /api/bikes
  const fetchBikes = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await bikeAPI.getBikes(filters);
      if (res?.success && Array.isArray(res.bikes)) {
        setBikes(res.bikes);
        setFilteredBikes(res.bikes);
        return res.bikes;
      }
      throw new Error(res?.message || 'Failed to load bikes.');
    } catch (err) {
      setError(err.message || 'Unable to connect to the bikes service.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  // Synchronous lookup from memory (handles both string _id and virtual id)
  const getBikeById = (id) => {
    if (!id) return undefined;
    return bikes.find((bike) => String(bike.id || bike._id) === String(id));
  };

  // Asynchronous direct fetch from GET /api/bikes/:id (safe for direct URL navigation / refresh)
  const fetchBikeById = async (id) => {
    try {
      const res = await bikeAPI.getBikeById(id);
      if (res?.success && res.bike) {
        return res.bike;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Real-time single bike availability check (by name, model, brand or ID)
  const checkBikeAvailability = async (params) => {
    try {
      const res = await bikeAPI.checkAvailability(params);
      return res;
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        return {
          success: false,
          status: err.data.status || 'ERROR',
          message: err.data.message || err.message,
          ...err.data,
        };
      }
      return {
        success: false,
        status: 'ERROR',
        message: err.message || 'Unable to verify bike availability.',
      };
    }
  };

  // Real-time unreserved fleet search for a given date window
  const getAvailableFleet = async (filters = {}) => {
    try {
      const res = await bikeAPI.getAvailableFleet(filters);
      return res;
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        return {
          success: false,
          status: err.data.status || 'ERROR',
          message: err.data.message || err.message,
          bikes: [],
          ...err.data,
        };
      }
      return {
        success: false,
        status: 'ERROR',
        message: err.message || 'Unable to fetch available fleet.',
        bikes: [],
      };
    }
  };

  // Admin: Create new bike via POST /api/bikes
  const addBike = async (bikeData) => {
    try {
      const res = await bikeAPI.createBike(bikeData);
      if (res?.success && res.bike) {
        setBikes((prev) => [res.bike, ...prev]);
        setFilteredBikes((prev) => [res.bike, ...prev]);
        return { success: true, bike: res.bike };
      }
      throw new Error(res?.message || 'Failed to create bike.');
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Admin: Update bike via PUT /api/bikes/:id
  const updateBike = async (id, bikeData) => {
    try {
      const res = await bikeAPI.updateBike(id, bikeData);
      if (res?.success && res.bike) {
        setBikes((prev) =>
          prev.map((b) => (String(b.id || b._id) === String(id) ? res.bike : b))
        );
        setFilteredBikes((prev) =>
          prev.map((b) => (String(b.id || b._id) === String(id) ? res.bike : b))
        );
        return { success: true, bike: res.bike };
      }
      throw new Error(res?.message || 'Failed to update bike.');
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Admin: Delete bike via DELETE /api/bikes/:id
  const deleteBike = async (id) => {
    try {
      const res = await bikeAPI.deleteBike(id);
      if (res?.success) {
        setBikes((prev) => prev.filter((b) => String(b.id || b._id) !== String(id)));
        setFilteredBikes((prev) => prev.filter((b) => String(b.id || b._id) !== String(id)));
        return { success: true };
      }
      throw new Error(res?.message || 'Failed to delete bike.');
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Client-side quick search helper
  const searchBikes = (query) => {
    if (!query || !query.trim()) {
      setFilteredBikes(bikes);
      return;
    }
    const searchLower = query.toLowerCase();
    const results = bikes.filter(
      (bike) =>
        bike.name?.toLowerCase().includes(searchLower) ||
        bike.brand?.toLowerCase().includes(searchLower) ||
        bike.model?.toLowerCase().includes(searchLower)
    );
    setFilteredBikes(results);
  };

  // Client-side filter helper
  const filterBikes = (filters) => {
    let results = [...bikes];

    if (filters.category && filters.category.length > 0) {
      results = results.filter((bike) =>
        filters.category.includes(bike.category)
      );
    }

    if (filters.brand && filters.brand.length > 0) {
      results = results.filter((bike) =>
        filters.brand.includes(bike.brand)
      );
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      results = results.filter(
        (bike) =>
          bike.pricePerDay >= filters.minPrice &&
          bike.pricePerDay <= filters.maxPrice
      );
    }

    if (filters.location && filters.location.length > 0) {
      results = results.filter((bike) =>
        filters.location.includes(bike.location)
      );
    }

    if (filters.availability === 'available') {
      results = results.filter((bike) => bike.available);
    }

    setFilteredBikes(results);
  };

  return (
    <BikeContext.Provider
      value={{
        bikes,
        filteredBikes,
        isLoading,
        error,
        fetchBikes,
        getBikeById,
        fetchBikeById,
        checkBikeAvailability,
        getAvailableFleet,
        addBike,
        updateBike,
        deleteBike,
        searchBikes,
        filterBikes,
      }}
    >
      {children}
    </BikeContext.Provider>
  );
};

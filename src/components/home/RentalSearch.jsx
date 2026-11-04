import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';

const RentalSearch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.location) params.append('location', formData.location);
    if (formData.category) params.append('category', formData.category);
    if (formData.pickupDate) params.append('pickup', formData.pickupDate);
    if (formData.returnDate) params.append('return', formData.returnDate);

    navigate(`/bikes?${params.toString()}`);
  };

  return (
    <motion.section
      className="relative w-full py-8 sm:py-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary border border-border rounded-2xl p-6 shadow-2xl sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Find Your Perfect Ride
          </h2>
          <p className="mb-6 text-base text-textSecondary sm:mb-8">
            Book a bike in just a few clicks
          </p>

          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            {/* Location */}
            <div className="w-full">
              <Input
                label="Location"
                type="text"
                name="location"
                placeholder="Select location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Pickup Date */}
            <div className="w-full">
              <Input
                label="Pickup Date"
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
              />
            </div>

            {/* Return Date */}
            <div className="w-full">
              <Input
                label="Return Date"
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
              />
            </div>

            {/* Bike Type */}
            <div className="w-full">
              <Select
                label="Bike Type"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  { value: '', label: 'All Bikes' },
                  { value: 'Commuter', label: 'Commuter' },
                  { value: 'Sports', label: 'Sports' },
                  { value: 'Cruiser', label: 'Cruiser' },
                  { value: 'Adventure', label: 'Adventure' },
                  { value: 'Scooter', label: 'Scooter' },
                  { value: 'Premium', label: 'Premium' },
                ]}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="h-11 w-full sm:h-12">
              Search Bikes
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default RentalSearch;

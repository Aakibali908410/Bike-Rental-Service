import React from 'react';
import { Bike, Fuel, Gauge, MapPin, Settings2, Zap } from 'lucide-react';

const BikeSpecifications = ({ bike }) => {
  const specifications = [
    { label: 'Engine', value: `${bike.engine}cc`, icon: Zap },
    { label: 'Mileage', value: bike.mileage, icon: Gauge },
    { label: 'Fuel Type', value: bike.fuelType, icon: Fuel },
    { label: 'Transmission', value: bike.transmission, icon: Settings2 },
    { label: 'Category', value: bike.category, icon: Bike },
    { label: 'Location', value: bike.location, icon: MapPin },
  ];

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold text-text">Specifications</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {specifications.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-secondary p-4">
            <Icon size={20} className="mb-3 text-accent" />
            <p className="text-xs text-textSecondary">{label}</p>
            <p className="mt-1 font-semibold text-text">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BikeSpecifications;

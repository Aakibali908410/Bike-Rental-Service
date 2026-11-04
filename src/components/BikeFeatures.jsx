import React from 'react';
import { CheckCircle } from 'lucide-react';

const BikeFeatures = ({ features = [] }) => {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold text-text">Bike Features</h2>
      {features.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-textSecondary">
              <CheckCircle size={18} className="shrink-0 text-success" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-textSecondary">Specifications for this bike are being updated.</p>
      )}
    </section>
  );
};

export default BikeFeatures;

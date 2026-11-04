import { Link, useNavigate } from 'react-router-dom';
import { Star, Zap, MapPin } from 'lucide-react';
import { fallbackBikeImage } from '../data/images.js';
import Button from './Button';

const BikeCard = ({ bike }) => {
  const navigate = useNavigate();

  const handleRentNow = (e) => {
    e.preventDefault();
    if (bike.available) navigate(`/booking/${bike.id}`);
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackBikeImage;
  };

  return (
    <div className="group h-full rounded-lg overflow-hidden border border-border bg-secondary hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
      <Link to={`/bikes/${bike.id}`} className="block">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-slate-800">
          <img
            src={bike.image || fallbackBikeImage}
            alt={`${bike.brand} ${bike.name}`}
            onError={handleImageError}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Availability Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                bike.available
                  ? 'bg-success text-white'
                  : 'bg-error text-white'
              }`}
            >
              {bike.available ? 'Available' : 'Unavailable'}
            </div>
          </div>
          {/* Rating Badge */}
          <div className="absolute top-3 left-3 bg-black bg-opacity-60 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
            <Star size={14} className="text-accent fill-accent" />
            <span className="text-sm font-semibold text-white">{bike.rating}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
          {/* Brand & Model */}
          <div className="mb-2">
            <p className="text-xs text-accent font-semibold uppercase tracking-wider">
              {bike.brand}
            </p>
            <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
              {bike.model}
            </h3>
          </div>

          {/* Category & Engine */}
          <div className="flex items-center justify-between text-xs text-textSecondary mb-3">
            <span className="bg-border px-2 py-1 rounded">{bike.category}</span>
            <div className="flex items-center gap-1">
              <Zap size={14} />
              <span>{bike.engine}cc</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-textSecondary mb-4">
            <MapPin size={14} />
            <span>{bike.location}</span>
          </div>

          {/* Price */}
          <div className="mb-4 pb-4 border-t border-border">
            <p className="text-textSecondary text-xs mt-4 mb-2">Price Per Day</p>
            <p className="text-2xl font-bold text-accent">
              ₹{bike.pricePerDay}
            </p>
          </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link to={`/bikes/${bike.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              View Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleRentNow}
            disabled={!bike.available}
          >
            {bike.available ? 'Rent Now' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;

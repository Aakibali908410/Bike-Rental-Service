import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { fallbackBikeImage } from '../data/images';

const BikeGallery = ({ bike }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackBikeImage;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label={`View larger image of ${bike.name}`}
        >
          <div className="aspect-[4/3] sm:aspect-[16/10]">
            <img
              src={bike.image || fallbackBikeImage}
              alt={`${bike.brand} ${bike.name}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          </div>
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-sm text-white">
            <ZoomIn size={16} /> View image
          </span>
        </button>
      </motion.div>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${bike.name} image viewer`}
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-3 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close image viewer"
            >
              <X size={28} />
            </button>
            <motion.img
              src={bike.image || fallbackBikeImage}
              alt={`${bike.brand} ${bike.name} enlarged`}
              className="max-h-[90vh] max-w-full rounded-xl object-contain"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(event) => event.stopPropagation()}
              onError={handleImageError}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BikeGallery;

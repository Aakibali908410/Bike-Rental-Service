import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import BikeCard from '../BikeCard';
import { BikeContext } from '../../context/BikeContext';

const PopularBikes = () => {
  const { bikes } = useContext(BikeContext);
  const popularBikes = bikes.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      className="py-16 sm:py-20 bg-primary"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-4xl sm:text-5xl font-bold text-text mb-4">
            Popular Bikes
          </h2>
          <p className="text-textSecondary text-lg">
            Choose from our most loved rides
          </p>
        </motion.div>

        {/* Bike Grid */}
        <motion.div
          className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
        >
          {popularBikes.map((bike) => (
            <motion.div key={bike.id} variants={itemVariants}>
              <BikeCard bike={bike} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div className="text-center" variants={itemVariants}>
          <Link
            to="/bikes"
            className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors"
          >
            <span className="text-lg font-semibold">View All Bikes</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PopularBikes;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../Button';

const ExperienceSection = () => {
  return (
    <motion.section
      className="overflow-x-clip py-16 sm:py-20 bg-primary"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/images/categories/adventure.png"
              alt="Adventure riding experience"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent rounded-2xl"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-accent text-sm font-bold uppercase tracking-widest mb-4">
              Make Every Journey Special
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-text mb-6">
              More Than a Rental. It's Your Ride.
            </h2>
            <p className="text-textSecondary text-lg mb-8 leading-relaxed">
              Whether you're exploring the city, heading out for a weekend adventure, or simply enjoying the open road, Bikes Rental Service gives you the freedom: Your Ride, Your Way.
            </p>
            <p className="text-textSecondary mb-8">
              Experience premium bikes, flexible rental options, and a community of riders who share your passion for the road.
            </p>

            <Link to="/bikes">
              <Button variant="primary" size="lg">
                Explore Our Bikes
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection;

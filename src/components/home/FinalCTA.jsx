import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../Button';

const FinalCTA = () => {
  return (
    <motion.section
      className="py-16 sm:py-24 bg-gradient-to-b from-primary to-secondary"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-textSecondary text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Your perfect ride is waiting. Find your bike and start your journey today.
          </p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/bikes">
              <Button variant="primary" size="lg">
                Browse Bikes
              </Button>
            </Link>
            <Link to="/bikes">
              <Button variant="outline" size="lg">
                Book Your Ride
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FinalCTA;

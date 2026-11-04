import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../Button';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-b from-primary via-secondary to-primary"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-accent blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">

          {/* Left Content */}
          <motion.div
            className="max-w-xl"
            variants={itemVariants}
          >
            <motion.div
              className="mb-4 text-sm font-bold uppercase tracking-widest text-accent"
              variants={itemVariants}
            >
              Premium Bike Rental
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl font-bold leading-tight text-text sm:text-6xl lg:text-7xl"
              variants={itemVariants}
            >
              Your Ride,
              <span className="text-accent"> Your Way.</span>
            </motion.h1>

            <motion.p
              className="mb-8 max-w-lg text-xl leading-relaxed text-textSecondary"
              variants={itemVariants}
            >
              Premium bikes. Flexible rentals. Unforgettable rides.
              Start your journey with Bikes Rental Service today.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link to="/bikes">
                <Button variant="primary" size="lg">
                  Explore Bikes
                </Button>
              </Link>

              <Link to="/bikes">
                <Button variant="outline" size="lg">
                  Book Your Ride
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative h-[320px] w-full sm:h-[380px] lg:h-[500px]"
            variants={itemVariants}
          >
            <img
              src="/images/categories/premium.png"
              alt="Premium motorcycle"
              className="h-full w-full rounded-2xl object-cover"
            />

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Hero Stats */}
      <motion.div
        className="relative mx-auto w-full max-w-7xl border-t border-border px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
        variants={itemVariants}
      >
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-8">
          {[
            { stat: '500+', label: 'Bikes Available' },
            { stat: '10K+', label: 'Happy Riders' },
            { stat: '25+', label: 'Locations' },
            { stat: '4.8/5', label: 'Average Rating' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="space-y-2"
            >
              <p className="text-3xl font-bold text-accent sm:text-4xl">
                {item.stat}
              </p>

              <p className="text-sm text-textSecondary">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
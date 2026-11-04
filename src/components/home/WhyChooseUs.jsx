import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Gauge, Users, MapPin, Headphones } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Verified Bikes',
      description: 'Every bike is inspected and maintained.',
    },
    {
      icon: Gauge,
      title: 'Affordable Pricing',
      description: 'Transparent pricing with no unnecessary surprises.',
    },
    {
      icon: Zap,
      title: 'Easy Booking',
      description: 'Book your ride in just a few simple steps.',
    },
    {
      icon: Users,
      title: 'Flexible Rentals',
      description: 'Choose rental durations that fit your plans.',
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Find bikes conveniently near your destination.',
    },
    {
      icon: Headphones,
      title: 'Rider Support',
      description: 'Our support team is ready when you need us.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
      id="about"
      className="py-16 sm:py-20 bg-secondary"
      initial="hidden" 
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl sm:text-5xl font-bold text-text mb-4">
            Why Choose Bikes Rental Service?
          </h2>
          <p className="text-textSecondary text-lg">
            Everything you need for a smooth and memorable ride
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-xl bg-primary border border-border hover:border-accent transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="mb-4 inline-block p-3 bg-accent/10 rounded-lg group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                  <Icon size={28} className="text-accent group-hover:text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-textSecondary text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChooseUs;

import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Calendar, CreditCard, MapPin } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Bike,
      title: 'Choose Your Bike',
      description: 'Browse our collection and choose the bike that fits your ride.',
    },
    {
      icon: Calendar,
      title: 'Select Your Dates',
      description: 'Choose pickup and return dates that work for you.',
    },
    {
      icon: CreditCard,
      title: 'Make Your Payment',
      description: 'Complete your booking using our simple checkout process.',
    },
    {
      icon: MapPin,
      title: 'Enjoy Your Ride',
      description: 'Pick up your bike and hit the road.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      className="overflow-x-clip py-16 sm:py-20 bg-primary"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl sm:text-5xl font-bold text-text mb-4">
            How It Works
          </h2>
          <p className="text-textSecondary text-lg">
            Your next ride is just a few clicks away
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <div className="relative">
                  {/* Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[200%] h-1 bg-gradient-to-r from-accent to-transparent"></div>
                  )}

                  {/* Card */}
                  <div className="relative bg-secondary border border-border rounded-xl p-8 text-center hover:border-accent transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent text-primary font-bold rounded-full flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 mt-4">
                      <div className="p-3 bg-gradient-to-br from-accent to-orange-700 rounded-lg">
                        <Icon size={32} className="text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-text mb-3">
                      {step.title}
                    </h3>
                    <p className="text-textSecondary text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;

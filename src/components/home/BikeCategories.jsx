import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoryImages } from '../../data/images';

const BikeCategories = () => {
  const categories = [
    {
      name: 'Commuter',
      description: 'Perfect for daily rides around the city',
      image: categoryImages.commuter,
    },
    {
      name: 'Sports',
      description: 'Built for speed and excitement',
      image: categoryImages.sports,
    },
    {
      name: 'Cruiser',
      description: 'Comfortable and stylish rides',
      image: categoryImages.cruiser,
    },
    {
      name: 'Adventure',
      description: 'Ready for off-road exploration',
      image: categoryImages.adventure,
    },
    {
      name: 'Scooter',
      description: 'Compact and convenient transport',
      image: categoryImages.scooter,
    },
    {
      name: 'Premium',
      description: 'Luxury bikes for ultimate experience',
      image: categoryImages.premium,
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
      className="py-16 sm:py-20 bg-secondary"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-4xl sm:text-5xl font-bold text-text mb-4">
            Choose Your Ride
          </h2>
          <p className="text-textSecondary text-lg">
            From daily commutes to weekend adventures
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {categories.map((category, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Link
                to={`/bikes?category=${category.name}`}
                className="group relative block h-64 overflow-hidden rounded-xl"
              >
                <div className="relative h-full overflow-hidden rounded-xl">
                  <img
                    src={category.image}
                    alt={`${category.name} bikes`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <h3 className="mb-2 text-2xl font-bold text-white transition-colors group-hover:text-accent">
                      {category.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-200">{category.description}</p>
                    <div className="flex items-center gap-2 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100">
                      <span className="font-semibold">Explore</span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BikeCategories;

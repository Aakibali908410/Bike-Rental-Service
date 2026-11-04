import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../../utils/api';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([
    {
      name: 'Arjun Patel',
      location: 'Delhi',
      rating: 5,
      review:
        "Booking was incredibly easy and the bike was in excellent condition. I'll definitely rent from Bikes Rental Service again!",
      avatar: '👨‍🦱',
    },
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      review:
        "The best bike rental experience I've had. Professional service, well-maintained bikes, and great prices!",
      avatar: '👩‍🦰',
    },
    {
      name: 'Vikram Singh',
      location: 'Bangalore',
      rating: 4,
      review:
        "Amazing selection of bikes and super convenient pickup/drop locations. Highly recommended for weekend rides!",
      avatar: '👨‍🔬',
    },
    {
      name: 'Neha Gupta',
      location: 'Pune',
      rating: 5,
      review:
        "Smooth booking process, friendly staff, and the bike was perfect for my trip. Definitely coming back!",
      avatar: '👩‍💼',
    },
  ]);

  useEffect(() => {
    reviewAPI.getReviews().then((res) => {
      if (res?.success && Array.isArray(res.reviews) && res.reviews.length > 0) {
        setTestimonials(res.reviews);
      }
    }).catch(() => {});
  }, []);

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

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'text-accent fill-accent' : 'text-border'}
        />
      ))}
    </div>
  );

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
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl sm:text-5xl font-bold text-text mb-4">
            Riders Love Bikes Rental Service
          </h2>
          <p className="text-textSecondary text-lg">
            Real experiences from our growing rider community
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className="bg-primary border border-border rounded-xl p-6 hover:border-accent transition-all duration-300 h-full flex flex-col">
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Review */}
                <p className="text-textSecondary text-sm mb-6 flex-grow">
                  "{testimonial.review}"
                </p>

                {/* Author */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-text font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-textSecondary text-xs">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;

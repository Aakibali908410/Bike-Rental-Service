import React from 'react';
import Layout from '../layouts/Layout';
import Hero from '../components/home/Hero';
import RentalSearch from '../components/home/RentalSearch';
import PopularBikes from '../components/home/PopularBikes';
import BikeCategories from '../components/home/BikeCategories';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ExperienceSection from '../components/home/ExperienceSection';
import Testimonials from '../components/home/Testimonials';
import FinalCTA from '../components/home/FinalCTA';

const Home = () => {
  return (
    <Layout>
      <div className="bg-primary">
        {/* Hero Section */}
        <Hero />

        {/* Rental Search */}
        <div className="bg-primary px-0 sm:px-0 lg:px-0">
          <RentalSearch />
        </div>

        {/* Popular Bikes */}
        <PopularBikes />

        {/* Bike Categories */}
        <BikeCategories />

        {/* How It Works */}
        <HowItWorks />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Experience Section */}
        <ExperienceSection />

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA */}
        <FinalCTA />
      </div>
    </Layout>
  );
};

export default Home;

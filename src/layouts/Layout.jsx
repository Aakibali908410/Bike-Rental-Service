import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timeout = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return () => clearTimeout(timeout);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      <main className="flex-grow pt-20 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

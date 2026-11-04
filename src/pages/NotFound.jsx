import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-secondary rounded-full">
              <AlertCircle size={64} className="text-accent" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-text mb-4">404</h1>
          <p className="text-textSecondary text-xl mb-8">Page Not Found</p>
          <Link to="/">
            <Button variant="primary" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

/**
 * Route protection component for frontend navigation.
 * Note: Actual security and authorization are enforced by the backend JWT and middleware.
 */
const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Initial authentication check while verifying JWT token with /api/auth/me
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary text-text">
        <Loader2 size={36} className="animate-spin text-accent" />
        <p className="mt-4 text-sm text-textSecondary font-medium">Verifying authentication...</p>
      </div>
    );
  }

  // 2. Unauthenticated customer: redirect to /login and preserve requested path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Admin authorization guard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;

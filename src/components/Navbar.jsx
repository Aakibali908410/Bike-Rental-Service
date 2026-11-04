import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import Brand from './Brand';
import Button from './Button';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path && !location.hash;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/bikes', label: 'Bikes' },
    { path: '/#about', label: 'About' },
    { path: '/#contact', label: 'Contact' },
  ];

  const handleNavClick = (path, e) => {
    if (path.startsWith('/#')) {
      const hash = path.substring(1);
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', path);
        }
      }
    }
  };

  return (
    <nav
      className={`w-full z-40 transition-all duration-300 ${
        isSticky
          ? 'fixed top-0 bg-primary shadow-lg border-b border-border'
          : 'relative bg-primary border-b border-border'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Brand size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-5 lg:flex lg:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:text-accent hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <>
                {isAdmin && <Link to="/admin"><Button variant="ghost" size="sm">Admin Dashboard</Button></Link>}
                <Link to="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                {!isAdmin && <Link to="/my-bookings">
                  <Button variant="ghost" size="sm">
                    My Bookings
                  </Button>
                </Link>}
                <span className="text-xs text-textSecondary">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <LogOut size={18} className="text-text" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-text" />
              ) : (
                <Menu size={24} className="text-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  handleNavClick(link.path, e);
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-secondary text-accent'
                    : 'text-text hover:text-accent hover:bg-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border pt-2 mt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && <Link to="/admin" className="block"><Button variant="ghost" size="sm" className="w-full">Admin Dashboard</Button></Link>}
                  <Link to="/profile" className="block">
                    <Button variant="ghost" size="sm" className="w-full">Profile</Button>
                  </Link>
                  {!isAdmin && <Link to="/my-bookings" className="block">
                    <Button variant="ghost" size="sm" className="w-full">
                      My Bookings
                    </Button>
                  </Link>}
                  <div className="px-3 py-2 text-xs text-textSecondary">
                    Logged in as: {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-text hover:bg-secondary rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

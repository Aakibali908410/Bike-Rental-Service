import React, { useState } from 'react';
import { Heart, MessageCircle, Globe, Share2, Mail, Phone, MapPin, Check, ShieldCheck, HelpCircle, FileText, Lock, Cookie } from 'lucide-react';
import Brand from './Brand';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleScrollToSection = (sectionId, e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleGlobeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Bikes Rental Service – Your Ride, Your Way.');
  };

  const handleHeartClick = (e) => {
    e.preventDefault();
    const nextState = !isLiked;
    setIsLiked(nextState);
    showToast(nextState ? 'Thank you for loving Bikes Rental Service! ❤️' : 'Removed from favorites');
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    const shareData = {
      title: 'Bikes Rental Service',
      text: 'Rent premium bikes and scooters with Bikes Rental Service – Your Ride, Your Way.',
      url: window.location.origin,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.origin);
      showToast('Website link copied to clipboard! 📋');
    } catch {
      showToast('Share: ' + window.location.origin);
    }
  };

  const modalContents = {
    faq: {
      title: 'Frequently Asked Questions (FAQ)',
      icon: <HelpCircle className="text-accent" size={24} />,
      content: (
        <div className="space-y-4 text-sm text-text">
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">What documents are required to rent a bike?</h4>
            <p className="text-textSecondary">You must present a valid original Driver's License and a government-issued photo ID (Aadhaar Card, Passport, or Voter ID). Learners' permits are strictly not accepted.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">How does the refundable security deposit work?</h4>
            <p className="text-textSecondary">A refundable security deposit is collected before handover. After returning the bike in original condition without damages or pending traffic challans, it is refunded within 24 hours.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">What is the fuel policy?</h4>
            <p className="text-textSecondary">We provide enough fuel to reach the nearest petrol station. Please return the bike with the same fuel level as at handover to avoid refueling service fees.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">Can I cancel my reservation?</h4>
            <p className="text-textSecondary">Yes! Free cancellations are permitted from your "My Bookings" page any time before your scheduled pickup date.</p>
          </div>
        </div>
      ),
    },
    bookingHelp: {
      title: 'Booking Assistance & How It Works',
      icon: <FileText className="text-accent" size={24} />,
      content: (
        <div className="space-y-4 text-sm text-text">
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">1. Choose Your Bike</h4>
            <p className="text-textSecondary">Visit the "Browse Bikes" page to explore our verified fleet of Commuters, Cruisers, Sports bikes, and Scooters.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">2. Select Dates & Hub</h4>
            <p className="text-textSecondary">Pick your pickup and return dates and convenient location. Our dynamic system guarantees vehicle availability.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">3. Complete Checkout</h4>
            <p className="text-textSecondary">Select your preferred payment method: Pay at Pickup, UPI, Card, or Demo Wallet.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">4. Collect & Ride</h4>
            <p className="text-textSecondary">Show your booking ID and Driving License at our pickup hub, collect your sanitized helmet, and hit the road!</p>
          </div>
        </div>
      ),
    },
    safety: {
      title: 'Rider Safety Guidelines',
      icon: <ShieldCheck className="text-accent" size={24} />,
      content: (
        <div className="space-y-4 text-sm text-text">
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">1. Mandatory Helmets</h4>
            <p className="text-textSecondary">ISI-certified helmets must be worn at all times by both the rider and pillion as mandated by law.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">2. Pre-Ride Vehicle Inspection</h4>
            <p className="text-textSecondary">Always verify brakes, tire pressure, headlight, indicators, and mirrors before driving off from the rental station.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">3. Speed Limits & Traffic Laws</h4>
            <p className="text-textSecondary">Strictly adhere to speed limits. Reckless driving or driving under the influence will result in immediate lease cancellation and police report.</p>
          </div>
          <div className="rounded-lg bg-secondary p-4 border border-border">
            <h4 className="font-semibold text-accent mb-1">4. 24/7 Emergency Support</h4>
            <p className="text-textSecondary">In case of any mechanical issues or roadside emergencies, call our helpline immediately at +91 9084101749.</p>
          </div>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      icon: <FileText className="text-accent" size={24} />,
      content: (
        <div className="space-y-3 text-sm text-textSecondary">
          <p><strong className="text-text">1. Eligibility:</strong> The rider must be at least 18 years old and possess an active, valid permanent driving license.</p>
          <p><strong className="text-text">2. Authorized Use:</strong> Only the registered customer is authorized to operate the rental vehicle. Sub-leasing or allowing unverified riders is strictly prohibited.</p>
          <p><strong className="text-text">3. Vehicle Return:</strong> The vehicle must be returned at or before the scheduled return date and time. Overtime charges apply for unnotified late returns.</p>
          <p><strong className="text-text">4. Damage & Liability:</strong> In the event of physical damage or accident, the rider is responsible for repairs up to the security deposit limit or insurance deductible.</p>
          <p><strong className="text-text">5. Traffic Challans:</strong> Any traffic violation fines incurred during the rental duration are the sole legal responsibility of the hirer.</p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: <Lock className="text-accent" size={24} />,
      content: (
        <div className="space-y-3 text-sm text-textSecondary">
          <p><strong className="text-text">1. Data Collection:</strong> We collect your name, phone number, email address, and verification credentials solely for processing your bike rentals and ensuring vehicle security.</p>
          <p><strong className="text-text">2. Security:</strong> Your passwords and sensitive information are encrypted. We never share or sell personal customer records to third-party marketing companies.</p>
          <p><strong className="text-text">3. Communications:</strong> We use your phone and email strictly to deliver booking confirmations, payment receipts, and emergency support updates.</p>
          <p><strong className="text-text">4. Your Rights:</strong> You may edit your profile information or request account deactivation at any time through our portal.</p>
        </div>
      ),
    },
    cookies: {
      title: 'Cookie & Storage Policy',
      icon: <Cookie className="text-accent" size={24} />,
      content: (
        <div className="space-y-3 text-sm text-textSecondary">
          <p><strong className="text-text">1. Essential Storage:</strong> Bikes Rental Service uses browser local storage and session tokens exclusively to keep you authenticated, remember your preferred filters, and retain your active booking flow.</p>
          <p><strong className="text-text">2. No Ad Trackers:</strong> We do not deploy third-party advertising tracking cookies or telemetry beacons.</p>
          <p><strong className="text-text">3. Control:</strong> You can clear your browser storage or cookies at any time via your browser settings.</p>
        </div>
      ),
    },
  };

  return (
    <footer id="contact" className="bg-primary border-t border-border relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary border border-accent text-text px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Check size={18} className="text-accent" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Brand size="sm" className="mb-4" />
            <p className="text-textSecondary text-sm mb-6">
              Premium bike rentals for unforgettable rides. Experience the freedom of two-wheelers
              with our carefully maintained fleet.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleGlobeClick}
                title="Bikes Rental Service Website"
                aria-label="Website"
                className="p-2 bg-secondary hover:bg-accent hover:text-primary rounded-lg transition-all duration-300 cursor-pointer"
              >
                <Globe size={18} />
              </button>
              <a
                href="https://wa.me/919084101749?text=Hello%20Bikes%20Rental%20Service,%20I%20have%20an%20inquiry%20regarding%20bike%20rentals."
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp (+91 9084101749)"
                aria-label="WhatsApp Support"
                className="p-2 bg-secondary hover:bg-accent hover:text-primary rounded-lg transition-all duration-300 cursor-pointer"
              >
                <MessageCircle size={18} />
              </a>
              <button
                type="button"
                onClick={handleHeartClick}
                title={isLiked ? 'Favorited' : 'Like Bikes Rental Service'}
                aria-label="Favorite"
                className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  isLiked ? 'bg-accent text-white' : 'bg-secondary hover:bg-accent hover:text-primary'
                }`}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              </button>
              <button
                type="button"
                onClick={handleShareClick}
                title="Share Bikes Rental Service"
                aria-label="Share"
                className="p-2 bg-secondary hover:bg-accent hover:text-primary rounded-lg transition-all duration-300 cursor-pointer"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/bikes"
                  className="text-textSecondary hover:text-accent transition-colors duration-300 block"
                >
                  Browse Bikes
                </Link>
              </li>
              <li>
                <a
                  href="/#about"
                  onClick={(e) => handleScrollToSection('about', e)}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  onClick={(e) => handleScrollToSection('contact', e)}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 block"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-text mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('faq')}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('bookingHelp')}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 text-left cursor-pointer"
                >
                  Booking Help
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('safety')}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 text-left cursor-pointer"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="text-textSecondary hover:text-accent transition-colors duration-300 text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-text mb-4">Contact Us</h3>
            <div className="space-y-4">
              <a
                href="https://maps.google.com/?q=Uttaranchal+University+Dehradun"
                target="_blank"
                rel="noopener noreferrer"
                title="Open location in Google Maps"
                className="flex gap-3 text-textSecondary hover:text-accent transition-colors group"
              >
                <MapPin size={20} className="text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <p className="text-sm">
                  34,G-block Uttaranchal University
                </p>
              </a>
              <div className="flex gap-3">
                <Phone size={20} className="text-accent flex-shrink-0" />
                <a
                  href="tel:+919084101749"
                  title="Call customer support"
                  className="text-textSecondary hover:text-accent text-sm transition-colors"
                >
                  +91 9084101749
                </a>
              </div>
              <div className="flex gap-3">
                <Mail size={20} className="text-accent flex-shrink-0" />
                <a
                  href="mailto:aakibali466@gmail.com"
                  title="Send email to support"
                  className="text-textSecondary hover:text-accent text-sm transition-colors"
                >
                  aakibali466@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-textSecondary">
              &copy; {currentYear} Bikes Rental Service. All rights reserved.
            </p>
            <div className="flex gap-6 text-textSecondary">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('cookies')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Support & Legal Modals */}
      {activeModal && modalContents[activeModal] && (
        <Modal
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
          title={
            <div className="flex items-center gap-2">
              {modalContents[activeModal].icon}
              <span>{modalContents[activeModal].title}</span>
            </div>
          }
          size="lg"
          footer={
            <Button variant="primary" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          }
        >
          {modalContents[activeModal].content}
        </Modal>
      )}
    </footer>
  );
};

export default Footer;

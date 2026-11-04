import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import Brand from '../components/Brand';
import Button from '../components/Button';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext';
import { validateEmail, validateName, validatePassword, validatePhone } from '../utils/validationUtils';

const Register = () => {
  const { register, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGeneralError('');
    const nextErrors = {};

    if (!validateName(form.name)) nextErrors.name = 'Name must be at least 2 characters.';
    if (!validateEmail(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!validatePhone(form.phone)) nextErrors.phone = 'Please enter a valid Indian phone number.';
    if (!validatePassword(form.password)) nextErrors.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const result = await register(form.name, form.email, form.phone, form.password);
      if (!result.success) {
        const msg = result.message || 'Registration failed.';
        if (/email/i.test(msg)) {
          setErrors({ email: msg });
        } else {
          setGeneralError(msg);
        }
        setIsSubmitting(false);
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      setGeneralError(err.message || 'An unexpected error occurred during registration. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-[calc(100vh-10rem)] bg-primary px-4 py-10 text-text sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-secondary shadow-2xl lg:grid-cols-2">
          <div className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-gradient-to-br from-orange-950 via-primary to-primary p-10 lg:flex">
            <Brand size="lg" />
            <div className="relative z-10 max-w-sm">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">Ride your dream bike</p>
              <h1 className="text-4xl font-bold leading-tight">Join a community built around the ride.</h1>
              <p className="mt-5 text-textSecondary">Create your rider profile and discover a better way to explore.</p>
            </div>
            <div className="absolute -right-20 top-24 h-80 w-80 rounded-full border-[32px] border-accent/20" />
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-6 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Brand size="md" />
            </div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">Get started</p>
            <h1 className="text-3xl font-bold">Create your rider account</h1>
            <p className="mt-2 text-textSecondary">It only takes a minute to get on the road.</p>

            {generalError && (
              <p className="mt-4 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-red-300" role="alert">
                {generalError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
              <div className="relative">
                <UserPlus size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(event) => {
                    setForm({ ...form, name: event.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => {
                    setForm({ ...form, email: event.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  error={errors.email}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Phone size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(event) => {
                    setForm({ ...form, phone: event.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  error={errors.phone}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(event) => {
                    setForm({ ...form, password: event.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  error={errors.password}
                  required
                  className="pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-10 rounded p-1 text-textSecondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(event) => {
                    setForm({ ...form, confirmPassword: event.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  error={errors.confirmPassword}
                  required
                  className="pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-10 rounded p-1 text-textSecondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full"
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-textSecondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-accent hover:text-orange-400">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </Layout>
  );
};

export default Register;

import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../layouts/Layout';
import Brand from '../components/Brand';
import Button from '../components/Button';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext';
import { validateEmail } from '../utils/validationUtils';

const Login = () => {
  const { login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const destination = location.state?.from?.pathname;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password) {
      setError('Password is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setError(result.message || 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }
      navigate(destination || (result.user.role === 'ADMIN' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during sign in. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-[calc(100vh-10rem)] bg-primary px-4 py-10 text-text sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-secondary shadow-2xl lg:grid-cols-2">
          <div className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-gradient-to-br from-orange-950 via-primary to-primary p-10 lg:flex">
            <Brand size="lg" />
            <div className="relative z-10 max-w-sm">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">Welcome back</p>
              <h1 className="text-4xl font-bold leading-tight">Find your way back to the open road.</h1>
              <p className="mt-5 text-textSecondary">A curated fleet, flexible rentals, and the freedom to make the journey yours.</p>
            </div>
            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border-[32px] border-accent/20" />
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-6 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Brand size="md" />
            </div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">Sign in</p>
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-textSecondary">Pick up where your next ride begins.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => {
                    setForm({ ...form, email: event.target.value });
                    if (error) setError('');
                  }}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-3 top-11 text-textSecondary" />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) => {
                    setForm({ ...form, password: event.target.value });
                    if (error) setError('');
                  }}
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

              {error && (
                <p className="rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-red-300" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="flex w-full items-center justify-center gap-2"
                disabled={isLoading || isSubmitting}
              >
                <LogIn size={18} /> {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-textSecondary">
              New to Bikes Rental Service?{' '}
              <Link to="/register" className="font-semibold text-accent hover:text-orange-400">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;

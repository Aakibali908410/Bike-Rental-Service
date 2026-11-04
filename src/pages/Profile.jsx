import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit3, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import Layout from '../layouts/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { AuthContext } from '../context/AuthContext';
import { validateName, validatePhone } from '../utils/validationUtils';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'R';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync form when user object updates
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validateName(form.name)) return setError('Name must be at least 2 characters.');
    if (form.phone && !validatePhone(form.phone)) return setError('Please enter a valid Indian phone number.');

    setIsSaving(true);
    try {
      const result = await updateProfile(form);
      if (!result.success) {
        setError(result.message || 'Failed to update profile.');
        setIsSaving(false);
        return;
      }
      setSuccess('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', phone: user?.phone || '' });
    setError('');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <main className="flex min-h-[60vh] items-center justify-center bg-primary text-text">
          <p className="text-textSecondary">Loading profile...</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-[60vh] bg-primary px-4 py-10 text-text sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-secondary p-6 shadow-xl sm:p-10"
        >
          <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-bold text-white shadow-lg">
              {getInitials(user.name)}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Your account</p>
              <h1 className="mt-1 text-3xl font-bold">{user.name}</h1>
              <p className="mt-1 text-textSecondary">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xl font-bold">Profile details</h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuccess('');
                  setError('');
                  setIsEditing(true);
                }}
              >
                <Edit3 size={15} className="mr-2 inline" /> Edit Profile
              </Button>
            )}
          </div>

          {success && (
            <p className="mt-4 flex items-center gap-2 text-sm text-green-400" role="status">
              <Check size={16} /> {success}
            </p>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="mt-6 space-y-5" noValidate>
              <Input
                label="Full Name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="+91 98765 43210"
              />
              {error && (
                <p className="rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-red-300" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-primary p-4">
                <dt className="flex items-center gap-2 text-xs text-textSecondary">
                  <User size={15} /> Name
                </dt>
                <dd className="mt-2 font-semibold">{user.name}</dd>
              </div>

              <div className="rounded-xl border border-border bg-primary p-4">
                <dt className="flex items-center gap-2 text-xs text-textSecondary">
                  <Mail size={15} /> Email
                </dt>
                <dd className="mt-2 break-all font-semibold">{user.email}</dd>
              </div>

              <div className="rounded-xl border border-border bg-primary p-4">
                <dt className="flex items-center gap-2 text-xs text-textSecondary">
                  <Phone size={15} /> Phone
                </dt>
                <dd className="mt-2 font-semibold">{user.phone || 'Not provided'}</dd>
              </div>

              <div className="rounded-xl border border-border bg-primary p-4">
                <dt className="flex items-center gap-2 text-xs text-textSecondary">
                  <ShieldCheck size={15} /> Account
                </dt>
                <dd className="mt-2 flex items-center gap-2 font-semibold">
                  <Badge>{user.role}</Badge>
                  <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                    {user.status || 'active'}
                  </Badge>
                </dd>
              </div>

              <div className="rounded-xl border border-border bg-primary p-4 sm:col-span-2">
                <dt className="text-xs text-textSecondary">Member since</dt>
                <dd className="mt-2 font-semibold">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recent rider'}
                </dd>
              </div>
            </dl>
          )}
        </motion.section>
      </main>
    </Layout>
  );
};

export default Profile;

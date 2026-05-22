import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { register, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLocalLoading(true);
      await register(name, email, password);
      showToast('Account created successfully! Welcome to KadaWave.', 'success');
      setLocalLoading(false);
    } catch (err) {
      setLocalLoading(false);
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-brand-cream">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded border border-gray-100 shadow-premium">
        
        {/* Header Branding */}
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold-500 block mb-2">
            Join the Guild
          </span>
          <h2 className="font-playfair text-3xl font-bold tracking-wide text-brand-charcoal">
            Create Account
          </h2>
          <p className="mt-2 text-xs font-light text-gray-500 font-sans">
            Start shopping for premium, handcrafted Kerala lifestyle products.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hari Prasad"
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hariprasad@gmail.com"
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={localLoading}
              className="w-full flex items-center justify-center bg-brand-green-500 hover:bg-brand-charcoal text-white font-bold py-3.5 rounded uppercase tracking-widest text-xs shadow-md transition-colors"
            >
              {localLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-gray-100 mt-6 text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-green-500 hover:text-brand-gold-500 transition-colors">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

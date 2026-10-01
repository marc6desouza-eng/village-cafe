import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Empty fields when page loads
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);

      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(
          res.message ||
          'Invalid credentials. Please verify your email and password.'
        );
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        'Login failed. Please check network connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1714] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-cream-100">

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">

        {/* Logo */}
        <div className="w-16 h-16 rounded-full bg-burgundy-700 border-2 border-cafeYellow-500 flex items-center justify-center mx-auto shadow-warm-xl text-white font-serif font-bold text-2xl mb-4">
          VC
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
          Village Cafe CMS
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-xs sm:text-sm text-coffee-300">
          Management Console • Curtorim, Goa
        </p>
      </div>

      {/* Login Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">

        <div className="bg-charcoal-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-charcoal-800">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">

                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />

                <span>{errorMsg}</span>

              </div>
            )}

            {/* Email */}
            <div>

              <label className="block text-xs font-bold uppercase tracking-wider text-coffee-300 mb-1.5">
                Admin Email
              </label>

              <div className="relative">

                {/* Email Icon */}
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-sm text-white placeholder-charcoal-500 focus:outline-none focus:border-burgundy-500"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-1.5">

                <label className="block text-xs font-bold uppercase tracking-wider text-coffee-300">
                  Password
                </label>

              </div>

              <div className="relative">

                {/* Lock Icon */}
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-sm text-white placeholder-charcoal-500 focus:outline-none focus:border-burgundy-500"
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-white"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <div className="pt-2">

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-sm shadow-warm transition-all disabled:opacity-50"
              >

                <span>
                  {isSubmitting
                    ? 'Authenticating...'
                    : 'Sign In to Dashboard'}
                </span>

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </form>

          {/* Return to Website */}
          <div className="mt-4 text-center">

            <Link
              to="/"
              className="text-xs text-charcoal-400 hover:text-white transition-colors"
            >
              ← Return to Village Cafe Website
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};
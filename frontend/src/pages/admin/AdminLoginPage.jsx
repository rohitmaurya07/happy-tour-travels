import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useSiteData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to admin dashboard
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await login(username.trim(), password);
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white font-manrope selection:bg-yellow-400 selection:text-slate-950">
      
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Link Back */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-yellow-400 transition-colors bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-7 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-400/15 text-yellow-400 mb-4 border border-yellow-400/30 shadow-yellow-glow">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-nexa font-extrabold text-white">
              Happy Tour & Travels
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
              Sign in with your administrator credentials
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs sm:text-sm flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 text-sm text-white font-semibold focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all placeholder-gray-500"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                  Password
                </span>
                <span className="text-[11px] text-gray-400">Protected Auth</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 pr-11 text-sm text-white font-semibold focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all placeholder-gray-500"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full yellow-gradient-btn py-4 rounded-2xl text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-yellow-glow hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:pointer-events-none mt-6"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Security Credentials Notice */}
          <div className="mt-8 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-[11px] text-gray-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-yellow-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Initial Master Credentials:</span>
            </div>
            <p className="text-gray-300 font-mono">User: <strong className="text-white">admin</strong></p>
            <p className="text-gray-300 font-mono">Pass: <strong className="text-white">HappyTravels@2026!</strong></p>
            <p className="text-[10px] text-gray-500 pt-1">
              *You can update your username and password anytime in the Admin Security settings.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

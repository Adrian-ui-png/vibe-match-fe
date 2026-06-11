import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVibeMatch } from '../context/VibeMatchContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useVibeMatch();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-white bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-xs font-semibold text-gray-400">
          Sign in to check compatibility and view unlocked reports
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel p-6 rounded-2xl border-white/5 space-y-4"
      >
        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-wider text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#121626] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-black tracking-wider text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121626] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-pink to-brand-purple hover:from-pink-600 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow-lg border border-white/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={14} />
          </button>
        </form>
      </motion.div>

      <div className="text-center">
        <p className="text-xs text-gray-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-pink hover:text-brand-purple transition-colors font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

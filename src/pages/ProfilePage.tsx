import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVibeMatch, API_BASE_URL } from '../context/VibeMatchContext';
import { Mail, Shield, Sparkles, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useVibeMatch();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/transactions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error("Failed to load user transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, navigate]);

  if (!user) return null;

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '🧠';
      case 'roast': return '🔥';
      case 'predict': return '🔮';
      case 'confess': return '💌';
      case 'certificate': return '📜';
      default: return '⚡';
    }
  };

  const getFeatureLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Vibe Quiz';
      case 'roast': return 'Profile Roast';
      case 'predict': return 'AI Future Story';
      case 'confess': return 'Crush Confession';
      case 'certificate': return 'Rizz Certificate';
      default: return type;
    }
  };

  const getFeatureLink = (tx: any) => {
    if (tx.paymentStatus !== 'completed') {
      return null;
    }
    switch (tx.featureType) {
      case 'quiz': return `/chat/vibe`; // Navigates back to check details
      case 'roast': return `/chat/roast`;
      case 'predict': return `/chat/predict`;
      case 'confess': return `/confess/share`; // Unlocked link details page
      case 'certificate': return `/certificate/results`;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 py-4">
      {/* USER PROFILE INFO */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl border-white/5 space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-black text-white">{user.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
              <Mail size={10} /> {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
          <div className="bg-[#121626] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Shield size={12} className="text-brand-pink" />
            <div>
              <p className="text-[8px] text-gray-500 uppercase font-black">Role</p>
              <p className="text-[10px] text-white font-black uppercase">{user.role}</p>
            </div>
          </div>
          <div className="bg-[#121626] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Sparkles size={12} className="text-brand-purple" />
            <div>
              <p className="text-[8px] text-gray-500 uppercase font-black">SaaS Plan</p>
              <p className="text-[10px] text-white font-black uppercase">{user.plan || 'Free Tier'}</p>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <Link
            to="/admin"
            className="w-full block text-center bg-brand-purple/20 hover:bg-brand-purple/35 text-brand-purple text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border border-brand-purple/30 transition-all"
          >
            Go to Admin Dashboard
          </Link>
        )}

        <button
          onClick={logout}
          className="w-full text-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
        >
          Sign Out / Logout
        </button>
      </motion.div>

      {/* TRANSACTION HISTORY */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Unlocked Micro-Modules</h4>
        
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin h-5 w-5 border-2 border-brand-pink border-t-transparent rounded-full mx-auto" />
            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-panel p-6 rounded-2xl border-white/5 text-center space-y-2">
            <p className="text-xs text-gray-400 font-bold leading-relaxed">
              No features unlocked yet! Start a quiz, check your rizz, or audit a photo to begin.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-brand-pink text-xs font-black uppercase tracking-wider mt-2 hover:underline"
            >
              Start Exploring <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((tx) => (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4 rounded-xl border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#121626] border border-white/5 flex items-center justify-center text-lg shadow-sm">
                    {getFeatureIcon(tx.featureType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-white leading-none">
                        {getFeatureLabel(tx.featureType)}
                      </span>
                      {tx.paymentStatus === 'completed' ? (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle size={8} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[8px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded border border-amber-500/20">
                          <Clock size={8} /> Pending
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] text-gray-500 font-bold block uppercase mt-1">
                      {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {tx.paymentStatus === 'completed' && getFeatureLink(tx) && (
                  <button
                    onClick={() => {
                      const link = getFeatureLink(tx);
                      if (link) navigate(link);
                    }}
                    className="bg-[#121626] hover:bg-brand-pink/10 hover:text-brand-pink text-gray-400 p-2.5 rounded-xl border border-white/5 transition-all text-[9px] font-black uppercase tracking-wider shrink-0"
                  >
                    View
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

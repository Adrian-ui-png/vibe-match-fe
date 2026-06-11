import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Heart, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVibeMatch } from '../context/VibeMatchContext';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const {
    paywallTriggered,
    discountTimeLeft,
    paymentLoading,
    pollingStatus,
    chatSessionId,
    activeFeature,
    selfName,
    roastName,
    predictName,
    handlePaymentCheckout,
    verifyPaymentManualCheck,
    handleResetAllStates,
    user
  } = useVibeMatch();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogoClick = () => {
    handleResetAllStates();
    navigate('/');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col justify-between p-4 selection:bg-brand-pink selection:text-white">
      
      {/* GLOBAL HEADER */}
      <header className="py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <Heart className="text-brand-pink fill-brand-pink animate-pulse" size={24} />
          <span className="font-extrabold text-lg bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
            VibeMatch
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="text-[10px] font-black uppercase tracking-wider text-white bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                {user.name.split(' ')[0]}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-[10px] font-black uppercase tracking-wider text-gray-300 hover:text-white px-2 py-1 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-[10px] font-black uppercase tracking-wider text-white bg-brand-pink border border-brand-pink/20 px-2.5 py-1.5 rounded-lg hover:bg-brand-pink/80 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex flex-col justify-center py-4 relative">
        <Outlet />

        {/* HARD PAYWALL OVERLAY MODAL */}
        {paywallTriggered && (
          <div className="absolute inset-0 bg-[#0a0f1d]/70 backdrop-blur-[7px] z-50 flex flex-col justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-panel-heavy p-6 rounded-2xl border-white/10 shadow-2xl space-y-4 max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-brand-pink/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

              {/* Animated Urgent offer badge */}
              <div className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-rose-500/30 mx-auto w-fit">
                <AlertTriangle size={10} /> urgent offer: 85% off
              </div>

              <div className="space-y-1 text-center">
                <h3 className="text-lg font-black text-white text-glow-pink">Free Chat limit reached!</h3>
                <p className="text-[10px] text-gray-300 leading-relaxed max-w-xs mx-auto">
                  ⚠️ LIMITED TIME OFFER! Unlock unlimited AI chats, custom roasts, and secret hacks for just ₹15 (Regular Price: <span className="line-through">₹99</span>).
                </p>
              </div>

              {/* Fake Scarcity Countdown Ticker */}
              <div className="flex justify-center items-center gap-2 bg-[#121626] border border-white/5 py-2.5 rounded-xl max-w-[150px] mx-auto">
                <Clock size={12} className="text-brand-pink animate-pulse" />
                <span className="text-xs font-black text-white tracking-widest">{formatTime(discountTimeLeft)}</span>
              </div>

              <button
                onClick={() => handlePaymentCheckout({
                  sessionId: chatSessionId,
                  featureType: activeFeature!,
                  self: selfName || roastName || predictName
                }, () => navigate('/payment/processing'))}
                disabled={paymentLoading || pollingStatus}
                className="w-full bg-gradient-to-r from-brand-pink to-brand-purple hover:from-pink-600 hover:to-purple-700 text-white text-[11px] font-black uppercase tracking-wider py-3.5 rounded-xl shadow-lg border border-white/10 cursor-pointer disabled:opacity-50"
              >
                {paymentLoading ? "Processing payment..." : "Unlock unlimited chats for ₹15"}
              </button>

              {pollingStatus && (
                <div className="glass-panel p-2.5 rounded-xl border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full shrink-0" />
                    <span className="text-[8px] font-bold text-amber-500">Confirming payment...</span>
                  </div>
                  <button 
                    onClick={() => verifyPaymentManualCheck(() => navigate('/payment/processing'))}
                    className="text-[9px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-black hover:bg-amber-500/30"
                  >
                    Check Status
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center border-t border-white/5 mt-auto">
        <p className="text-[9px] text-gray-500 font-bold tracking-wider uppercase">
          © {new Date().getFullYear()} VIBEMATCH • FOR ENTERTAINMENT PURPOSES ONLY • SECURED BY RAZORPAY
        </p>
      </footer>
    </div>
  );
};

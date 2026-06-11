import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const CalculatingPage: React.FC = () => {
  const { pollingStatus, verifyPaymentManualCheck } = useVibeMatch();

  // If a manual check is needed, we can bind it to a button
  const handleManualCheck = () => {
    verifyPaymentManualCheck(() => {});
  };

  return (
    <motion.div
      key="calculating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-6 py-8"
    >
      <div className="flex justify-center relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="h-28 w-28 rounded-full border-4 border-brand-pink border-t-transparent shadow-xl flex items-center justify-center"
        >
          <Heart className="text-brand-purple fill-brand-purple" size={36} />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping h-10 w-10 bg-brand-pink/20 rounded-full" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-white text-glow-pink">Locking payment signatures...</h2>
        <p className="text-xs text-brand-purple font-extrabold uppercase tracking-widest animate-pulse">
          Verifying transaction hashes with webhook logs...
        </p>
      </div>

      {pollingStatus && (
        <div className="pt-4 max-w-xs mx-auto">
          <button
            onClick={handleManualCheck}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-all"
          >
            Verify Status Manually
          </button>
        </div>
      )}
    </motion.div>
  );
};

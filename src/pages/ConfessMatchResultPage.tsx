import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVibeMatch } from '../context/VibeMatchContext';

export const ConfessMatchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { confessMatchResult, handleResetAllStates } = useVibeMatch();

  const handleReturn = () => {
    handleResetAllStates();
    navigate('/');
  };

  return (
    <motion.div
      key="confess-crush-match-result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 text-center py-6"
    >
      {confessMatchResult?.matched ? (
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/30 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
          <span className="text-4xl animate-bounce inline-block">🎉💖🥂</span>
          <h2 className="text-3xl font-black text-emerald-400">IT'S A MATCH!</h2>
          <p className="text-xs text-gray-200 leading-relaxed max-w-xs mx-auto">
            {confessMatchResult.message}
          </p>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border-amber-500/30 space-y-4 shadow-2xl relative overflow-hidden">
          <span className="text-4xl animate-pulse inline-block">🤫🔒</span>
          <h2 className="text-2xl font-black text-amber-500">Confession Saved</h2>
          <p className="text-xs text-gray-200 leading-relaxed max-w-xs mx-auto">
            Your response has been recorded completely anonymously. If there's a match, they will be alerted!
          </p>
        </div>
      )}
      <button 
        onClick={handleReturn} 
        className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 text-xs cursor-pointer"
      >
        Go to VibeMatch Home
      </button>
    </motion.div>
  );
};

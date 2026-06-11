import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smile, Check, Copy } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const ConfessSharePage: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { confessResult, handleResetAllStates } = useVibeMatch();

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReturn = () => {
    handleResetAllStates();
    navigate('/');
  };

  return (
    <motion.div
      key="confess-share"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <span className="bg-brand-purple/15 text-brand-purple text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-brand-purple/20">
          Confession Link Active 🔒
        </span>
        <h2 className="text-2xl font-black text-white">Your Secret Link</h2>
      </div>

      <div className="glass-panel p-5 rounded-2xl border-brand-purple/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Smile className="text-brand-purple" size={18} />
          <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Share Anonymously 🤫</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-normal">
          Copy and send this link to your crush or put it in your bio. If they enter your name, a match will trigger!
        </p>
        
        {confessResult && (
          <div className="bg-[#121626]/90 border border-white/15 p-4 rounded-xl flex items-center justify-between gap-3 text-left">
            <span className="text-[11px] font-bold text-brand-purple select-all break-all leading-normal">
              {window.location.origin + confessResult.confessionUrl}
            </span>
            <button 
              onClick={() => handleCopyText(window.location.origin + confessResult.confessionUrl)}
              className="shrink-0 p-2.5 rounded-lg bg-brand-purple/10 border border-brand-purple/25 text-brand-purple hover:bg-brand-purple/20 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/5 text-left text-[11px] text-gray-400 space-y-2">
          <div className="flex justify-between">
            <span>Match Status:</span>
            <span className={`font-black ${confessResult?.matched ? 'text-emerald-400' : 'text-amber-500'}`}>
              {confessResult?.matched ? '🎉 MATCHED!' : 'Pending crush response...'}
            </span>
          </div>
          {confessResult?.matched && (
            <p className="text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg text-center mt-2 border border-emerald-500/20 animate-bounce">
              You matched with: {confessResult.matchedWith || 'Your Crush'}! Emails sent.
            </p>
          )}
        </div>
      </div>
      
      <button 
        onClick={handleReturn} 
        className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 text-xs cursor-pointer"
      >
        Return to Dashboard
      </button>
    </motion.div>
  );
};

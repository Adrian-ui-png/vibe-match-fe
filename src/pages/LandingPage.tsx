import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveFeature } = useVibeMatch();

  const handleSelectFeature = (feature: 'quiz' | 'roast' | 'confess' | 'predict' | 'certificate', path: string) => {
    setActiveFeature(feature);
    navigate(path);
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 text-center"
    >
      <div className="space-y-2">
        <div className="inline-flex glass-panel p-3 rounded-full bg-brand-pink/10 border-brand-pink/30">
          <Sparkles className="text-brand-pink" size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tight leading-none text-white text-center">
          College AI <br />
          <span className="bg-gradient-to-r from-brand-pink via-brand-purple to-pink-500 bg-clip-text text-transparent animate-gradient-text">
            Vibe Space
          </span>
        </h1>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Interactive dynamic AI modules. 3 free messages, pay ₹15 for dynamic premium unlock scripts.
        </p>
      </div>

      <div className="space-y-3">
        {/* 1. COMPATIBILITY CHAT */}
        <div 
          onClick={() => handleSelectFeature('quiz', '/vibe')}
          className="glass-panel glass-card-hover p-4 rounded-xl border-brand-pink/20 cursor-pointer flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-pink/10 flex items-center justify-center border border-brand-pink/20 text-lg">💬</div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Interactive Crush Guru</h3>
              <p className="text-[10px] text-gray-400">Live Guru chats, vibe meter & DM Icebreakers</p>
            </div>
          </div>
          <span className="text-[10px] bg-brand-pink/20 text-brand-pink font-extrabold px-2 py-0.5 rounded-full border border-brand-pink/30">₹15</span>
        </div>

        {/* 2. PHOTO ROAST CHAT */}
        <div 
          onClick={() => handleSelectFeature('roast', '/roast')}
          className="glass-panel glass-card-hover p-4 rounded-xl border-amber-500/20 cursor-pointer flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-lg">📸</div>
            <div>
              <h3 className="font-extrabold text-sm text-white">AI Selfie Profile Roast</h3>
              <p className="text-[10px] text-gray-400">Argue with the Roast AI & get dynamic bios</p>
            </div>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">₹15</span>
        </div>

        {/* 3. FUTURE PREDICTOR CHAT */}
        <div 
          onClick={() => handleSelectFeature('predict', '/predict')}
          className="glass-panel glass-card-hover p-4 rounded-xl border-blue-500/20 cursor-pointer flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-lg">🔮</div>
            <div>
              <h3 className="font-extrabold text-sm text-white">AI Manifestation Coach</h3>
              <p className="text-[10px] text-gray-400">Timeline headlines & full destiny story locks</p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-extrabold px-2 py-0.5 rounded-full border border-blue-500/30">₹15</span>
        </div>

        {/* 4. CRUSH CONFESSION LINK */}
        <div 
          onClick={() => handleSelectFeature('confess', '/confess')}
          className="glass-panel glass-card-hover p-4 rounded-xl border-brand-purple/20 cursor-pointer flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 text-lg">🤫</div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Crush Confession Link</h3>
              <p className="text-[10px] text-gray-400">Create anonymous link and match instantly</p>
            </div>
          </div>
          <span className="text-[10px] bg-brand-purple/20 text-brand-purple font-extrabold px-2 py-0.5 rounded-full border border-brand-purple/30">₹15</span>
        </div>

        {/* 5. SMART CERTIFICATES */}
        <div 
          onClick={() => handleSelectFeature('certificate', '/certificate')}
          className="glass-panel glass-card-hover p-4 rounded-xl border-emerald-500/20 cursor-pointer flex items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-lg">🏅</div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Rizz & Green Flag badges</h3>
              <p className="text-[10px] text-gray-400">Answer mini audits and save digital seal badges</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">₹15</span>
        </div>
      </div>
    </motion.div>
  );
};

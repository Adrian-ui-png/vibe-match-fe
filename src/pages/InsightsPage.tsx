import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Download, Sparkles, Zap, Copy, Check, Smile, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useVibeMatch } from '../context/VibeMatchContext';

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { featureType } = useParams<{ featureType: string }>();
  const [copied, setCopied] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);
  
  const vibeCardRef = useRef<HTMLDivElement>(null);
  const roastCardRef = useRef<HTMLDivElement>(null);
  const predictCardRef = useRef<HTMLDivElement>(null);

  const {
    selfName,
    crushName,
    currentScore,
    vibeReportData,
    roastName,
    roastReportData,
    photoPreviewUrl,
    predictName,
    predictReportData,
    handleResetAllStates
  } = useVibeMatch();

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCardImage = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return;
    setDownloadingCard(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(ref.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#0a0f1d',
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error(error);
      alert('Save failed. Take a screenshot instead!');
    } finally {
      setDownloadingCard(false);
    }
  };

  const handleReturn = () => {
    handleResetAllStates();
    navigate('/');
  };

  // Render Vibe Check Insights
  if (featureType === 'vibe' && vibeReportData) {
    return (
      <motion.div
        key="vibe-insights"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="bg-brand-pink/15 text-brand-pink text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-brand-pink/20">
            Dynamic compatibility unlocked 🔐
          </span>
          <h2 className="text-2xl font-black text-white">Your Crush Hacks</h2>
        </div>

        {/* Dynamic DM Cheat Sheet */}
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-emerald-400 fill-emerald-400" size={18} />
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Social Media Icebreaker Cheat Sheet 💬</h3>
          </div>
          <p className="text-[11px] text-gray-400 mb-3 leading-normal">
            Send this customized high-leverage opening DM derived from your chat logs:
          </p>
          <div className="bg-[#121626]/90 border border-white/15 p-4 rounded-xl flex items-center justify-between gap-3 text-left">
            <span className="text-xs font-semibold text-white italic leading-relaxed">
              "{vibeReportData.icebreaker}"
            </span>
            <button 
              onClick={() => handleCopyText(vibeReportData.icebreaker)}
              className="shrink-0 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Dynamic Crush Hacks */}
        <div className="glass-panel p-5 rounded-2xl border-brand-purple/40 border-glow-purple relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-brand-purple fill-brand-purple" size={18} />
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Psychological Crush Hacks 🔑</h3>
          </div>
          <div className="space-y-4">
            {vibeReportData.crushHacks.map((hack, index) => {
              const parts = hack.split(': ');
              return (
                <div key={index} className="flex gap-3 items-start text-xs">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-brand-purple/15 text-brand-purple font-extrabold shrink-0 text-[10px]">
                    {index + 1}
                  </span>
                  <div className="text-left">
                    <span className="font-bold text-white block mb-0.5">{parts[0]}</span>
                    <span className="text-gray-300 leading-normal">{parts[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Share template */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-center text-white mt-4">Download Instagram Story Card</h3>
          <div className="p-1 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple shadow-xl">
            <div 
              ref={vibeCardRef}
              className="w-full aspect-[9/16] rounded-xl flex flex-col justify-between p-6 relative overflow-hidden select-none bg-[#0a0f1d]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-pink/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-purple/25 blur-3xl" />
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-1">
                  <Heart className="text-brand-pink fill-brand-pink" size={14} />
                  <span className="text-[10px] font-black tracking-widest text-white uppercase">VIBEMATCH</span>
                </div>
                <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-widest">Official Vibe Check</span>
              </div>
              <div className="text-center z-10 my-auto space-y-4">
                <h2 className="text-2xl font-black text-white tracking-wide uppercase leading-none">
                  {selfName} <span className="text-brand-pink">&</span> {crushName}
                </h2>
                <div className="inline-flex justify-center items-center h-28 w-28 rounded-full border-4 border-brand-pink bg-brand-pink/5 text-glow-pink">
                  <div className="text-center">
                    <span className="text-3xl font-black text-white leading-none">{currentScore}%</span>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Match</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 inline-block">
                  <span className="text-xs font-extrabold text-gray-200">
                    {currentScore >= 75 ? "Soulmates 💖" : currentScore >= 45 ? "Slow Burn 🔥" : "Friendzone Danger 🚧"}
                  </span>
                </div>
              </div>
              <div className="z-10 text-center pt-2 border-t border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Calculate yours at: vibe-match.in</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => downloadCardImage(vibeCardRef, `${selfName}_${crushName}_compatibility.png`)}
            disabled={downloadingCard}
            className="w-full bg-brand-pink hover:bg-pink-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs"
          >
            <Download size={18} />
            {downloadingCard ? 'Generating HD Card...' : 'Download Card for Instagram'}
          </button>
        </div>

        <button onClick={handleReturn} className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 text-xs cursor-pointer">
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  // Render Roast Insights
  if (featureType === 'roast' && roastReportData) {
    return (
      <motion.div
        key="roast-insights"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-amber-500/20">
            Profile Audit Unlocked 🔐
          </span>
          <h2 className="text-2xl font-black text-white">Aesthetic Strategy</h2>
        </div>

        {/* Bio optimization */}
        <div className="glass-panel p-5 rounded-2xl border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Smile className="text-amber-400" size={18} />
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Optimized Instagram Bio Suggestion ✍️</h3>
          </div>
          <div className="bg-[#121626]/90 border border-white/15 p-4 rounded-xl flex items-center justify-between gap-3 text-left">
            <span className="text-xs font-semibold text-white italic leading-relaxed">
              "{roastReportData.bioSuggestion}"
            </span>
            <button 
              onClick={() => handleCopyText(roastReportData.bioSuggestion)}
              className="shrink-0 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Styling Strategy */}
        <div className="glass-panel p-5 rounded-2xl border-amber-500/30 shadow-2xl text-left relative overflow-hidden">
          <h3 className="font-extrabold text-sm text-white mb-2 uppercase tracking-wider text-amber-400">Styling & Clothing Strategy</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            {roastReportData.styleStrategy}
          </p>
        </div>

        {/* Grid Curation Blueprint */}
        <div className="glass-panel p-5 rounded-2xl border-amber-500/30 shadow-2xl text-left relative overflow-hidden">
          <h3 className="font-extrabold text-sm text-white mb-2 uppercase tracking-wider text-amber-400">Grid Curation Blueprint</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            {roastReportData.gridBlueprint}
          </p>
        </div>

        {/* Instagram Card Share */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-center text-white mt-4">Download Instagram Roast Card</h3>
          <div className="p-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-xl">
            <div 
              ref={roastCardRef}
              className="w-full aspect-[9/16] rounded-xl flex flex-col justify-between p-6 relative overflow-hidden select-none bg-[#0a0f1d]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-orange-600/15 blur-3xl" />
              
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">AESTHETIC AUDIT</span>
                <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-widest">Verified strategy</span>
              </div>

              <div className="text-center z-10 my-auto space-y-4">
                {photoPreviewUrl && (
                  <div className="inline-block p-2 bg-[#121626]/90 border border-white/10 rounded-2xl transform shadow-2xl">
                    <img src={photoPreviewUrl} alt="Roast Preview" className="h-36 w-36 object-cover rounded-xl mx-auto" />
                    <p className="text-[9px] font-black text-gray-400 mt-2 uppercase tracking-widest">
                      {roastName || 'Aesthetic User'}
                    </p>
                  </div>
                )}
                <div className="bg-[#121626]/80 p-3 rounded-lg border border-white/5 text-[9px] text-gray-300 text-left">
                  <b>Bio strategy:</b> {roastReportData.bioSuggestion}
                </div>
              </div>

              <div className="z-10 text-center pt-2 border-t border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Audit yours at: vibe-match.in</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => downloadCardImage(roastCardRef, `${roastName || 'user'}_aesthetic_audit.png`)}
            disabled={downloadingCard}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs"
          >
            <Download size={18} />
            {downloadingCard ? 'Generating Card...' : 'Download Card for Instagram'}
          </button>
        </div>

        <button onClick={handleReturn} className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 text-xs cursor-pointer">
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  // Render Predict Insights
  if (featureType === 'predict' && predictReportData) {
    return (
      <motion.div
        key="predict-insights"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="bg-blue-500/15 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-blue-500/20">
            Future Destiny Unlocked 🔐
          </span>
          <h2 className="text-2xl font-black text-white">Your 2035 Story Script</h2>
        </div>

        {/* Dynamic script text */}
        <div className="glass-panel p-5 rounded-2xl border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-blue-400" size={18} />
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Year 2035 Manifestation Script</h3>
          </div>
          <div className="bg-[#121626]/90 border border-white/5 p-4 rounded-xl text-left text-xs text-gray-200 leading-relaxed space-y-3 font-medium whitespace-pre-line">
            {predictReportData.destinyScript}
          </div>
        </div>

        {/* Instagram Card Share */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-center text-white mt-4">Download Instagram Story Card</h3>
          <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl">
            <div 
              ref={predictCardRef}
              className="w-full aspect-[9/16] rounded-xl flex flex-col justify-between p-6 relative overflow-hidden select-none bg-[#0a0f1d]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />
              
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">FUTURE STORY</span>
                <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-widest">Time Capsule 2035</span>
              </div>

              <div className="text-center z-10 my-auto space-y-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-wide leading-none">
                  {predictName}
                </h2>
                
                <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                  <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-wider">
                    Verified destiny script
                  </span>
                </div>

                <div className="text-left bg-[#0a0f1d]/85 p-4 rounded-xl border border-white/5 max-h-72 overflow-hidden">
                  <p className="text-[9.5px] text-gray-200 font-semibold leading-relaxed whitespace-pre-line">
                    {predictReportData.destinyScript.slice(0, 480) + (predictReportData.destinyScript.length > 480 ? '...' : '')}
                  </p>
                </div>
              </div>

              <div className="z-10 text-center pt-2 border-t border-white/5">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Predict yours at: vibe-match.in</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => downloadCardImage(predictCardRef, `${predictName}_destiny_2035.png`)}
            disabled={downloadingCard}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs"
          >
            <Download size={18} />
            {downloadingCard ? 'Generating Destiny...' : 'Download Card for Instagram'}
          </button>
        </div>

        <button onClick={handleReturn} className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 text-xs cursor-pointer">
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="text-center text-xs text-gray-400 py-8">
      No premium report details found. Please complete the module session.
    </div>
  );
};

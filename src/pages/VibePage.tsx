import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const VibePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selfName,
    setSelfName,
    crushName,
    setCrushName,
    nameError,
    setNameError,
    setActiveFeature,
    setChatSessionId,
    setChatMessages,
    setCurrentScore,
    handlePaymentCheckout
  } = useVibeMatch();

  const handleStartVibeChat = async () => {
    if (!selfName.trim() || !crushName.trim()) {
      setNameError('Please enter both names to start! 💖');
      return;
    }
    setNameError('');
    setActiveFeature('quiz');
    
    // Generate fresh session ID
    const sessId = `session_vibe_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setChatSessionId(sessId);
    setChatMessages([]);
    setCurrentScore(50);

    // Trigger mock checkout upfront, then route to payment processing
    handlePaymentCheckout(
      { sessionId: sessId, featureType: 'quiz', self: selfName, crush: crushName },
      () => navigate('/payment/processing')
    );
  };

  return (
    <motion.div
      key="vibe-landing"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <button 
          onClick={() => navigate('/')} 
          className="text-gray-400 hover:text-white text-xs flex items-center gap-1 mx-auto cursor-pointer"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <div className="inline-flex glass-panel p-3 rounded-full mb-2 bg-brand-pink/10 border-brand-pink/30">
          <Heart className="text-brand-pink fill-brand-pink" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white">Crush Compatibility Guru</h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Start a dynamic conversation with our Guru about your crush to analyze compatibility.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul" 
              value={selfName}
              onChange={(e) => setSelfName(e.target.value)}
              maxLength={18}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 transition-all font-medium text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-brand-purple font-semibold block mb-1">Your Crush's Name</label>
            <input 
              type="text" 
              placeholder="e.g. Priya" 
              value={crushName}
              onChange={(e) => setCrushName(e.target.value)}
              maxLength={18}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 transition-all font-medium text-xs"
            />
          </div>
        </div>

        {nameError && (
          <p className="text-xs text-brand-pink text-center font-medium bg-brand-pink/10 py-2 rounded-lg">{nameError}</p>
        )}

        <button
          onClick={handleStartVibeChat}
          className="w-full bg-gradient-to-r from-brand-pink to-brand-purple hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs uppercase"
        >
          Start live Guru Chat
          <Heart className="fill-white" size={14} />
        </button>
      </div>
    </motion.div>
  );
};

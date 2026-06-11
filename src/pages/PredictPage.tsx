import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const PredictPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    predictName,
    setPredictName,
    predictMajor,
    setPredictMajor,
    predictDream,
    setPredictDream,
    setActiveFeature,
    setChatSessionId,
    setChatMessages,
    setPredictTimeline,
    handlePaymentCheckout
  } = useVibeMatch();

  const handleStartPredictChat = async () => {
    if (!predictName.trim() || !predictMajor.trim() || !predictDream.trim()) {
      alert("Please fill out all fields first!");
      return;
    }
    setActiveFeature('predict');

    const sessId = `session_predict_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setChatSessionId(sessId);
    setChatMessages([]);
    setPredictTimeline([]);

    handlePaymentCheckout(
      { sessionId: sessId, featureType: 'predict' },
      () => navigate('/payment/processing')
    );
  };

  return (
    <motion.div
      key="predict-landing"
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
        <div className="inline-flex glass-panel p-3 rounded-full bg-blue-500/10 border-blue-500/30">
          <Calendar className="text-blue-400" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white">AI Manifestation Coach</h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Dynamic fortune teller AI chat. Setup details to launch manifestations.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs uppercase tracking-wider text-blue-400 font-semibold block mb-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul" 
              value={predictName}
              onChange={(e) => setPredictName(e.target.value)}
              maxLength={18}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all font-medium text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-blue-400 font-semibold block mb-1">Current Major or Job</label>
            <input 
              type="text" 
              placeholder="e.g. B.Tech Computer Science" 
              value={predictMajor}
              onChange={(e) => setPredictMajor(e.target.value)}
              maxLength={32}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all font-medium text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-blue-400 font-semibold block mb-1">3 words describing dream life</label>
            <input 
              type="text" 
              placeholder="e.g. Yacht, Goa, Wealth" 
              value={predictDream}
              onChange={(e) => setPredictDream(e.target.value)}
              maxLength={48}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-all font-medium text-xs"
            />
          </div>
        </div>

        <button
          onClick={handleStartPredictChat}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs uppercase"
        >
          Start live Predict Chat
        </button>
      </div>
    </motion.div>
  );
};

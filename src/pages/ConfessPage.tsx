import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ChevronLeft } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const ConfessPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    confessCreatorName,
    setConfessCreatorName,
    confessCreatorHandle,
    setConfessCreatorHandle,
    confessCreatorContact,
    setConfessCreatorContact,
    setActiveFeature,
    setChatSessionId,
    handlePaymentCheckout
  } = useVibeMatch();

  const handleTriggerConfessionSetup = async () => {
    if (!confessCreatorName.trim() || !confessCreatorHandle.trim() || !confessCreatorContact.trim()) {
      alert("Please fill out all fields to generate link!");
      return;
    }
    setActiveFeature('confess');
    const dummySessId = `confess_sess_${Date.now()}`;
    setChatSessionId(dummySessId);
    handlePaymentCheckout({
      sessionId: dummySessId,
      featureType: 'confess',
      self: confessCreatorName.trim()
    }, () => navigate('/payment/processing'));
  };

  return (
    <motion.div
      key="confess-landing"
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
        <div className="inline-flex glass-panel p-3 rounded-full mb-2 bg-brand-purple/10 border-brand-purple/30">
          <Lock className="text-brand-purple" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white text-glow-purple">Crush Confession Link</h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Create a secret match link. If your crush visits it and guesses your name, you both match instantly!
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-brand-purple font-semibold block mb-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul" 
              value={confessCreatorName}
              onChange={(e) => setConfessCreatorName(e.target.value)}
              maxLength={24}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 transition-all font-medium text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-brand-purple font-semibold block mb-1">Your Instagram Handle</label>
            <input 
              type="text" 
              placeholder="e.g. @rahul_rizz" 
              value={confessCreatorHandle}
              onChange={(e) => setConfessCreatorHandle(e.target.value)}
              maxLength={32}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 transition-all font-medium text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-brand-purple font-semibold block mb-1">Your Contact Info (WhatsApp/Email)</label>
            <input 
              type="text" 
              placeholder="e.g. rahul@gmail.com" 
              value={confessCreatorContact}
              onChange={(e) => setConfessCreatorContact(e.target.value)}
              maxLength={48}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 transition-all font-medium text-xs"
            />
          </div>
        </div>

        <button
          onClick={handleTriggerConfessionSetup}
          className="w-full bg-gradient-to-r from-brand-purple to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs uppercase"
        >
          Generate Match Link (₹15)
        </button>
      </div>
    </motion.div>
  );
};

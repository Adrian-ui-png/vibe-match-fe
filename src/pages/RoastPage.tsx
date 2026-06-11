import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smile, ChevronLeft, Upload } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const RoastPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    roastName,
    setRoastName,
    photoPreviewUrl,
    setPhotoPreviewUrl,
    setActiveFeature,
    setChatSessionId,
    setChatMessages,
    handlePaymentCheckout
  } = useVibeMatch();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("⚠️ Photo exceeds 4MB payload limit. Choose a smaller selfie image!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStartRoastChat = async () => {
    if (!photoPreviewUrl) {
      alert("Please select a photo first! 📸");
      return;
    }
    setActiveFeature('roast');

    const sessId = `session_roast_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setChatSessionId(sessId);
    setChatMessages([]);

    handlePaymentCheckout(
      { sessionId: sessId, featureType: 'roast' },
      () => navigate('/payment/processing')
    );
  };

  return (
    <motion.div
      key="roast-landing"
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
        <div className="inline-flex glass-panel p-3 rounded-full bg-amber-500/10 border-amber-500/30">
          <Smile className="text-amber-400" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white">AI Selfie Roast Audit</h2>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          Upload your photo to start a conversational roast and audit with our AI Coach.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold block mb-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul" 
              value={roastName}
              onChange={(e) => setRoastName(e.target.value)}
              maxLength={18}
              className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold block mb-2">Upload Profile/Selfie Photo (max 4MB)</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 rounded-xl p-4 bg-[#121626]/50 hover:bg-[#121626]/85 transition-all relative cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={handlePhotoSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {photoPreviewUrl ? (
                <div className="space-y-2 text-center">
                  <img src={photoPreviewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg mx-auto border-2 border-amber-500/40" />
                  <p className="text-[10px] text-amber-400 font-bold">Selfie loaded! Click to change.</p>
                </div>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <Upload className="mx-auto text-gray-500 animate-bounce" size={24} />
                  <p className="text-xs text-gray-300 font-semibold">Drag & drop image here or browse</p>
                  <p className="text-[10px] text-gray-500">Limits: max 4MB size</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleStartRoastChat}
          disabled={!photoPreviewUrl}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs uppercase disabled:opacity-50"
        >
          Start Live Roast Chat
        </button>
      </div>
    </motion.div>
  );
};

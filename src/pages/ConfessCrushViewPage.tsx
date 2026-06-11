import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useVibeMatch, API_BASE_URL } from '../context/VibeMatchContext';

export const ConfessCrushViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    confessionDetails,
    setConfessionId,
    fetchConfessionDetails,
    crushGuessName,
    setCrushGuessName,
    crushContactInfo,
    setCrushContactInfo,
    confessSubmitting,
    setConfessSubmitting,
    setConfessMatchResult
  } = useVibeMatch();

  useEffect(() => {
    if (id) {
      setConfessionId(id);
      fetchConfessionDetails(id, () => navigate('/'));
    }
  }, [id]);

  const handleSubmitConfessionAttempt = async () => {
    if (!crushGuessName.trim() || !crushContactInfo.trim()) {
      alert("Please fill out all fields first!");
      return;
    }
    setConfessSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/features/confess/attempt/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guessName: crushGuessName.trim(),
          contactInfo: crushContactInfo.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setConfessMatchResult({
          matched: data.matched,
          message: data.message
        });
        navigate('/confess/match-result');
      } else {
        alert(data.message || "Failed to submit match guess.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    } finally {
      setConfessSubmitting(false);
    }
  };

  return (
    <motion.div
      key="confess-crush-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex glass-panel p-3 rounded-full bg-brand-pink/10 border-brand-pink/30">
          <Lock className="text-brand-pink" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white">Crush Query Link</h2>
        <p className="text-xs text-gray-300 max-w-xs mx-auto leading-normal">
          Someone is secretly crushing on you and created this verification checkpoint! Enter your crush's name to check if you guys match.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
        {confessionDetails?.matched ? (
          <div className="text-center py-4 space-y-2">
            <span className="text-3xl">🎉</span>
            <h3 className="text-lg font-black text-emerald-400">Match Already Confirmed!</h3>
            <p className="text-xs text-gray-300">
              This link creator has already matched with their crush.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-left">
            <div>
              <label className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-1">
                Who is your secret crush? (Name or Instagram Handle)
              </label>
              <input 
                type="text" 
                placeholder="e.g. Rahul" 
                value={crushGuessName}
                onChange={(e) => setCrushGuessName(e.target.value)}
                maxLength={32}
                className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 transition-all font-medium text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-1">
                Your Contact Info (WhatsApp or Email to notify you)
              </label>
              <input 
                type="text" 
                placeholder="e.g. priya@gmail.com" 
                value={crushContactInfo}
                onChange={(e) => setCrushContactInfo(e.target.value)}
                maxLength={48}
                className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink/30 transition-all font-medium text-xs"
              />
            </div>

            <button
              onClick={handleSubmitConfessionAttempt}
              disabled={confessSubmitting}
              className="w-full bg-gradient-to-r from-brand-pink to-brand-purple hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs uppercase"
            >
              {confessSubmitting ? 'Verifying matches...' : 'Submit Vibe Guess'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

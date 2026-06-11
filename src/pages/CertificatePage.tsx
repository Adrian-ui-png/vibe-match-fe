import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ChevronLeft } from 'lucide-react';
import { useVibeMatch } from '../context/VibeMatchContext';

export const CertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    certAnswers,
    setCertAnswers,
    certTestType,
    setCertTestType,
    setCertQuestionIndex,
    setActiveFeature,
    certName,
    setCertName,
    paymentLoading,
    pollingStatus,
    handlePaymentCheckout
  } = useVibeMatch();

  const handleStartCertificateTest = (type: 'rizz' | 'greenflag' | 'audit') => {
    setCertTestType(type);
    setCertQuestionIndex(0);
    setCertAnswers([]);
    setActiveFeature('certificate');
    navigate('/certificate/quiz');
  };

  const handleTriggerCertificateOrder = () => {
    if (!certName.trim()) {
      alert("Please enter your name for certificate prints!");
      return;
    }

    const dummySessId = `cert_sess_${Date.now()}`;
    handlePaymentCheckout({
      sessionId: dummySessId,
      featureType: 'certificate',
      self: certName.trim()
    }, () => navigate('/payment/processing'));
  };

  return (
    <motion.div
      key="certificate-landing"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      {certAnswers.length === 5 ? (
        <div className="space-y-6 text-center">
          <div className="inline-flex glass-panel p-3 rounded-full bg-emerald-500/10 border-emerald-500/30">
            <Award className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white">Quiz Completed!</h2>
          <p className="text-xs text-gray-400">
            Enter your name to generate your verified {certTestType.toUpperCase()} badge certificate.
          </p>
          <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="text-left">
              <label className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">Your Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rahul Sharma" 
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                maxLength={24}
                className="w-full bg-[#121626]/75 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all font-medium text-xs"
              />
            </div>
            <button
              onClick={handleTriggerCertificateOrder}
              disabled={paymentLoading || pollingStatus}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs uppercase"
            >
              {paymentLoading ? "Generating Order..." : "Get Verified Certificate (₹15)"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-400 hover:text-white text-xs flex items-center gap-1 mx-auto cursor-pointer"
            >
              <ChevronLeft size={16} /> Dashboard
            </button>
            <div className="inline-flex glass-panel p-3 rounded-full bg-emerald-500/10 border-emerald-500/30">
              <Award className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white">Smart Certificates</h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Choose a mini-audit, answer 5 questions, and download a gorgeous premium digital certificate with neon badges.
            </p>
          </div>
          <div className="space-y-4">
            <div 
              onClick={() => handleStartCertificateTest('rizz')}
              className="glass-panel glass-card-hover p-4 rounded-xl border-purple-500/20 cursor-pointer flex items-center justify-between text-left"
            >
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">Rate My Rizz</h3>
                <p className="text-[10px] text-gray-400">Are you an elite charmer or dry texter? ⚡</p>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 font-extrabold px-2 py-0.5 rounded-full">Start</span>
            </div>
            <div 
              onClick={() => handleStartCertificateTest('greenflag')}
              className="glass-panel glass-card-hover p-4 rounded-xl border-emerald-500/20 cursor-pointer flex items-center justify-between text-left"
            >
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">Certified Green Flag</h3>
                <p className="text-[10px] text-gray-400">Audit your relationship green flags 💚</p>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-0.5 rounded-full">Start</span>
            </div>
            <div 
              onClick={() => handleStartCertificateTest('audit')}
              className="glass-panel glass-card-hover p-4 rounded-xl border-pink-500/20 cursor-pointer flex items-center justify-between text-left"
            >
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">Instagram Profile Audit</h3>
                <p className="text-[10px] text-gray-400">Is your feed aesthetic or spam category? 📸</p>
              </div>
              <span className="text-[10px] bg-pink-500/10 text-pink-400 font-extrabold px-2 py-0.5 rounded-full">Start</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

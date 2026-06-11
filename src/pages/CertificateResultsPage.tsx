import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useVibeMatch } from '../context/VibeMatchContext';

export const CertificateResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const certCardRef = useRef<HTMLDivElement>(null);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const {
    certTestType,
    certName,
    certificateResult,
    transactionId,
    handleResetAllStates
  } = useVibeMatch();

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

  if (!certificateResult) {
    return (
      <div className="text-center text-xs text-gray-400 py-8">
        No certificate result loaded. Please complete the test first.
      </div>
    );
  }

  return (
    <motion.div
      key="certificate-results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <span className="bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-500/20">
          Verification Passed ✅
        </span>
        <h2 className="text-2xl font-black text-white">Your Dynamic Badge</h2>
      </div>
      <div className="space-y-3">
        <div className="p-1.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 shadow-2xl">
          <div 
            ref={certCardRef}
            className="w-full aspect-[9/16] rounded-xl flex flex-col justify-between p-6 relative overflow-hidden select-none bg-[#0a0f1d]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-purple/20 blur-3xl" />
            <div className="border border-white/5 rounded-lg p-2.5 flex justify-between items-center z-10">
              <div className="flex items-center gap-1.5">
                <Award className="text-emerald-400" size={16} />
                <span className="text-[9px] font-black text-white tracking-widest uppercase">VIBEMATCH CREDENTIALS</span>
              </div>
              <span className="text-[7.5px] font-extrabold text-gray-500 uppercase">VM-CERT-{transactionId.slice(-5).toUpperCase()}</span>
            </div>
            <div className="text-center z-10 my-auto space-y-5">
              <div className="space-y-1">
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">This certifies that</p>
                <h2 className="text-2xl font-black text-white uppercase tracking-wide border-b-2 border-white/10 pb-1.5 inline-block px-4">
                  {certName}
                </h2>
              </div>
              <p className="text-[9px] text-gray-400 leading-normal max-w-[220px] mx-auto font-bold uppercase tracking-wider text-center">
                has completed all audits and is certified with the status of
                </p>
              <div className="space-y-2">
                <div 
                  className="px-6 py-2.5 rounded-xl border border-white/10 inline-block font-black text-sm uppercase tracking-wider shadow-md text-glow-pink"
                  style={{
                    backgroundColor: `${certificateResult.badgeColor}15`,
                    color: certificateResult.badgeColor,
                    borderColor: `${certificateResult.badgeColor}35`
                  }}
                >
                  {certificateResult.title}
                </div>
                <div className="text-xs font-black text-white text-center">
                  Verified Audit Score: <span className="text-emerald-400">{certificateResult.score}%</span>
                </div>
              </div>
            </div>
            <div className="z-10 pt-3 border-t border-white/5 flex justify-between items-end">
              <div className="text-left">
                <p className="text-[7px] text-gray-500 font-bold uppercase">Issued Date</p>
                <p className="text-[8px] text-gray-300 font-black">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-[7px] text-gray-500 font-bold uppercase">Digital Seal</p>
                <p className="text-[8px] text-emerald-400 font-black tracking-widest">VERIFIED</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => downloadCardImage(certCardRef, `${certName}_${certTestType}_certificate.png`)}
          disabled={downloadingCard}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer text-xs"
        >
          <Download size={18} />
          {downloadingCard ? 'Generating Badge...' : 'Download Card for Instagram'}
        </button>
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

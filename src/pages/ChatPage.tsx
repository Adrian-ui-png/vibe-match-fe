import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Send, Sparkles } from 'lucide-react';
import { useVibeMatch, API_BASE_URL, type ChatMessage } from '../context/VibeMatchContext';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { featureType } = useParams<{ featureType: string }>();
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    activeFeature,
    setActiveFeature,
    chatSessionId,
    chatMessages,
    setChatMessages,
    isGuruTyping,
    setIsGuruTyping,
    currentScore,
    setCurrentScore,
    predictTimeline,
    setPredictTimeline,
    photoPreviewUrl,
    handleResetAllStates,
    setVibeReportData,
    setRoastReportData,
    setPredictReportData
  } = useVibeMatch();

  const [localInput, setLocalInput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Setup activeFeature based on URL if not set
  useEffect(() => {
    if (featureType === 'vibe' && activeFeature !== 'quiz') {
      setActiveFeature('quiz');
    } else if (featureType === 'roast' && activeFeature !== 'roast') {
      setActiveFeature('roast');
    } else if (featureType === 'predict' && activeFeature !== 'predict') {
      setActiveFeature('predict');
    }
  }, [featureType, activeFeature]);

  const scrollChatToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages, isGuruTyping]);

  const handleSendChatMessage = async () => {
    if (!localInput.trim() || isGuruTyping) return;
    
    const userText = localInput.trim();
    setLocalInput('');

    // Append user message local state
    const userMsgObj: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text: userText
    };
    setChatMessages(prev => [...prev, userMsgObj]);
    setIsGuruTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: chatSessionId,
          text: userText,
          featureType: activeFeature
        })
      });

      if (!res.ok) {
        throw new Error("Message send error.");
      }

      const data = await res.json();
      setIsGuruTyping(false);

      setChatMessages(prev => [
        ...prev,
        {
          id: `guru-reply-${Date.now()}`,
          sender: 'guru',
          text: data.message.text
        }
      ]);

      // Feature specific metrics updates
      if (activeFeature === 'quiz' && data.vibeScore !== undefined) {
        setCurrentScore(data.vibeScore);
      } else if (activeFeature === 'predict' && data.timeline) {
        setPredictTimeline((prev: string[]) => [...prev, data.timeline]);
      }

    } catch (error) {
      console.error(error);
      setIsGuruTyping(false);
      alert("Backend dropped the chat message. Verify connectivity.");
    }
  };

  const handleRevealInsights = async () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/unlock/${chatSessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (activeFeature === 'quiz') {
          setVibeReportData(data.insights);
          navigate('/insights/vibe');
        } else if (activeFeature === 'roast') {
          setRoastReportData(data.insights);
          navigate('/insights/roast');
        } else if (activeFeature === 'predict') {
          setPredictReportData(data.insights);
          navigate('/insights/predict');
        }
      } else {
        const err = await res.json().catch(() => ({ message: "Unlock failed" }));
        alert(err.message || "Failed to unlock insights. Send another chat first.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend server.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleBack = () => {
    handleResetAllStates();
    navigate('/');
  };

  const isQuiz = activeFeature === 'quiz';
  const isRoast = activeFeature === 'roast';
  const isPredict = activeFeature === 'predict';

  return (
    <motion.div
      key="chat-room"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[550px] glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
    >
      {/* Profile Bar */}
      <div className="bg-[#121626]/90 border-b border-white/5 py-2.5 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="text-gray-400 hover:text-white shrink-0 cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <div className="h-9 w-9 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-lg shadow-inner select-none">
            {isRoast ? '🔥' : isPredict ? '🔮' : '🔮'}
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-white leading-tight">
              {isRoast ? 'Roast Guru AI' : isPredict ? 'Destiny Coach AI' : 'Guru Guru Relationship Guru'}
            </p>
            <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {isGuruTyping ? 'typing comment...' : 'online'}
            </p>
          </div>
        </div>

        {/* Score badge / Thumbnail / Reveal button */}
        <div className="flex items-center gap-3">
          {isQuiz && (
            <div className="text-right">
              <span className="text-[8px] uppercase tracking-wider text-brand-pink block font-extrabold">VIBE METRIC</span>
              <span className="text-xs font-black text-white">{currentScore}% Match</span>
            </div>
          )}
          {isRoast && photoPreviewUrl && (
            <img src={photoPreviewUrl} alt="Upload Mini" className="h-8 w-8 object-cover rounded-lg border border-amber-500/20" />
          )}

          <button
            onClick={handleRevealInsights}
            disabled={isUnlocking}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-1.5 px-3 rounded-lg shadow-lg border border-white/10 cursor-pointer text-[10px] uppercase flex items-center gap-1.5 transition-all select-none disabled:opacity-50"
          >
            <Sparkles size={11} className="fill-white" />
            {isUnlocking ? 'Unlocking...' : 'Reveal Insights'}
          </button>
        </div>
      </div>

      {/* Dynamic Progress indicator */}
      {isQuiz && (
        <div className="bg-[#101424] border-b border-white/5 py-1.5 px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={12} className="text-brand-pink fill-brand-pink shrink-0" />
            <div className="flex-grow bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-pink to-brand-purple transition-all duration-500" 
                style={{ width: `${currentScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Thread Area */}
      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 relative">
        
        {/* Predict Timeline overlay inside predictor chat */}
        {isPredict && predictTimeline.length > 0 && (
          <div className="absolute top-2 right-2 bg-blue-900/40 backdrop-blur border border-blue-500/20 rounded-xl p-2 max-w-[150px] text-[8px] text-blue-200 z-10 space-y-1 text-left shadow-lg">
            <p className="font-black border-b border-blue-500/20 pb-0.5 text-glow-pink">Manifested Timeline:</p>
            {predictTimeline.slice(-3).map((line, idx) => (
              <p key={idx} className="truncate">⏳ {line}</p>
            ))}
          </div>
        )}

        {chatMessages.map(msg => {
          const isGuruMessage = msg.sender === 'guru';
          return (
            <div key={msg.id} className={`flex gap-2 items-start ${!isGuruMessage ? 'flex-row-reverse' : ''}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs select-none ${
                isGuruMessage ? 'bg-brand-purple/20 border border-brand-purple/30' : 'bg-brand-pink/20 border border-brand-pink/30'
              }`}>
                {isGuruMessage ? '🔮' : '👤'}
              </div>
              <div className={`px-3.5 py-2 rounded-2xl max-w-[70%] text-xs font-semibold leading-relaxed text-left ${
                isGuruMessage 
                  ? 'rounded-tl-none bg-[#121626]/85 text-gray-200 border border-white/5' 
                  : 'rounded-tr-none bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-md border border-white/10'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isGuruTyping && (
          <div className="flex gap-2 items-start">
            <div className="h-7 w-7 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-xs select-none">🔮</div>
            <div className="glass-panel px-3.5 py-2 rounded-2xl rounded-tl-none border-white/5 bg-white/5 max-w-[70%] flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatMessagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="bg-[#121626]/90 border-t border-white/5 p-3 shrink-0 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Type a witty response..."
          disabled={isGuruTyping}
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
          className="flex-grow bg-[#0a0f1d]/75 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink/50 transition-all font-medium disabled:opacity-50"
        />
        <button
          onClick={handleSendChatMessage}
          disabled={isGuruTyping || !localInput.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple hover:opacity-90 active:scale-95 transition-all cursor-pointer text-white shrink-0 disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </motion.div>
  );
};

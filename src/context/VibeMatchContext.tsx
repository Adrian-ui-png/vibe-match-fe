import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export interface ChatMessage {
  id: string;
  sender: 'guru' | 'user';
  text: string;
}

export type FeatureType = 'quiz' | 'roast' | 'confess' | 'predict' | 'certificate';

interface VibeMatchContextType {
  activeFeature: FeatureType | null;
  setActiveFeature: (f: FeatureType | null) => void;
  
  // Payment states
  transactionId: string;
  setTransactionId: (id: string) => void;
  paymentLoading: boolean;
  setPaymentLoading: (loading: boolean) => void;
  pollingStatus: boolean;
  setPollingStatus: (status: boolean) => void;
  pollingAttempts: number;
  setPollingAttempts: (attempts: number) => void;
  discountTimeLeft: number;
  setDiscountTimeLeft: (time: number) => void;
  paywallTriggered: boolean;
  setPaywallTriggered: (triggered: boolean) => void;
  
  // Vibe Check states
  selfName: string;
  setSelfName: (name: string) => void;
  crushName: string;
  setCrushName: (name: string) => void;
  nameError: string;
  setNameError: (error: string) => void;
  currentScore: number;
  setCurrentScore: (score: number) => void;
  vibeReportData: { crushHacks: string[]; icebreaker: string } | null;
  setVibeReportData: (data: { crushHacks: string[]; icebreaker: string } | null) => void;
  
  // Photo Roast states
  roastName: string;
  setRoastName: (name: string) => void;
  photoPreviewUrl: string | null;
  setPhotoPreviewUrl: (url: string | null) => void;
  roastReportData: { bioSuggestion: string; styleStrategy: string; gridBlueprint: string } | null;
  setRoastReportData: (data: { bioSuggestion: string; styleStrategy: string; gridBlueprint: string } | null) => void;
  
  // Anonymous Confessions states
  confessCreatorName: string;
  setConfessCreatorName: (name: string) => void;
  confessCreatorHandle: string;
  setConfessCreatorHandle: (handle: string) => void;
  confessCreatorContact: string;
  setConfessCreatorContact: (contact: string) => void;
  confessResult: { confessionUrl: string; userId: string; secretToken: string; matched: boolean; matchedWith?: string } | null;
  setConfessResult: (res: any) => void;
  confessionId: string;
  setConfessionId: (id: string) => void;
  confessionDetails: { creatorName: string; matched: boolean } | null;
  setConfessionDetails: (details: any) => void;
  crushGuessName: string;
  setCrushGuessName: (name: string) => void;
  crushContactInfo: string;
  setCrushContactInfo: (info: string) => void;
  confessMatchResult: { matched: boolean; message: string } | null;
  setConfessMatchResult: (res: any) => void;
  confessSubmitting: boolean;
  setConfessSubmitting: (submitting: boolean) => void;
  
  // Future Predictor states
  predictName: string;
  setPredictName: (name: string) => void;
  predictMajor: string;
  setPredictMajor: (major: string) => void;
  predictDream: string;
  setPredictDream: (dream: string) => void;
  predictTimeline: string[];
  setPredictTimeline: React.Dispatch<React.SetStateAction<string[]>>;
  predictReportData: { destinyScript: string } | null;
  setPredictReportData: (data: { destinyScript: string } | null) => void;
  
  // Smart Certificate states
  certTestType: 'rizz' | 'greenflag' | 'audit';
  setCertTestType: (type: 'rizz' | 'greenflag' | 'audit') => void;
  certQuestionIndex: number;
  setCertQuestionIndex: (idx: number) => void;
  certAnswers: number[];
  setCertAnswers: (answers: number[]) => void;
  certScore: number;
  setCertScore: (score: number) => void;
  certName: string;
  setCertName: (name: string) => void;
  certificateResult: { score: number; title: string; badgeColor: string } | null;
  setCertificateResult: (res: any) => void;
  
  // Chat States
  chatSessionId: string;
  setChatSessionId: (id: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isGuruTyping: boolean;
  setIsGuruTyping: (typing: boolean) => void;

  // Auth states & functions
  user: any | null;
  token: string | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Functions
  handlePaymentCheckout: (payload: { sessionId: string; featureType: string; self?: string; crush?: string }, onCalculated: () => void) => Promise<void>;
  verifyPaymentManualCheck: (onCalculated: () => void) => Promise<void>;
  handleResetAllStates: () => void;
  fetchConfessionDetails: (id: string, onFailure: () => void) => Promise<void>;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const VibeMatchContext = createContext<VibeMatchContextType | undefined>(undefined);

export const VibeMatchContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);

  // Authentication states
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Helper for authenticated requests
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
    return fetch(url, { ...options, headers });
  };

  // Profile loader on mount or token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setToken(null);
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Login failed." }));
      throw new Error(err.message || "Login failed.");
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Registration failed." }));
      throw new Error(err.message || "Registration failed.");
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    handleResetAllStates();
    navigate('/login');
  };
  
  // Common states
  const [transactionId, setTransactionId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [discountTimeLeft, setDiscountTimeLeft] = useState(600);
  const [paywallTriggered, setPaywallTriggered] = useState(false);
  
  // Vibe Check
  const [selfName, setSelfName] = useState('');
  const [crushName, setCrushName] = useState('');
  const [nameError, setNameError] = useState('');
  const [currentScore, setCurrentScore] = useState(50);
  const [vibeReportData, setVibeReportData] = useState<{ crushHacks: string[]; icebreaker: string } | null>(null);
  
  // Photo Roast
  const [roastName, setRoastName] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [roastReportData, setRoastReportData] = useState<{ bioSuggestion: string; styleStrategy: string; gridBlueprint: string } | null>(null);
  
  // Confessions
  const [confessCreatorName, setConfessCreatorName] = useState('');
  const [confessCreatorHandle, setConfessCreatorHandle] = useState('');
  const [confessCreatorContact, setConfessCreatorContact] = useState('');
  const [confessResult, setConfessResult] = useState<any>(null);
  const [confessionId, setConfessionId] = useState('');
  const [confessionDetails, setConfessionDetails] = useState<any>(null);
  const [crushGuessName, setCrushGuessName] = useState('');
  const [crushContactInfo, setCrushContactInfo] = useState('');
  const [confessMatchResult, setConfessMatchResult] = useState<any>(null);
  const [confessSubmitting, setConfessSubmitting] = useState(false);
  
  // Predictor
  const [predictName, setPredictName] = useState('');
  const [predictMajor, setPredictMajor] = useState('');
  const [predictDream, setPredictDream] = useState('');
  const [predictTimeline, setPredictTimeline] = useState<string[]>([]);
  const [predictReportData, setPredictReportData] = useState<{ destinyScript: string } | null>(null);
  
  // Certificate
  const [certTestType, setCertTestType] = useState<'rizz' | 'greenflag' | 'audit'>('rizz');
  const [certQuestionIndex, setCertQuestionIndex] = useState(0);
  const [certAnswers, setCertAnswers] = useState<number[]>([]);
  const [certScore, setCertScore] = useState(0);
  const [certName, setCertName] = useState('');
  const [certificateResult, setCertificateResult] = useState<any>(null);
  
  // Chat states
  const [chatSessionId, setChatSessionId] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGuruTyping, setIsGuruTyping] = useState(false);

  // Global Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setDiscountTimeLeft(prev => (prev <= 1 ? 600 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchConfessionDetails = async (id: string, onFailure: () => void) => {
    try {
      const res = await fetch(`${API_BASE_URL}/features/confess/details/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConfessionDetails(data);
      } else {
        alert("Confession link is invalid or expired. ⚠️");
        onFailure();
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting local backend server.");
      onFailure();
    }
  };

  const handlePaymentSuccess = async (data: any) => {
    setPollingStatus(false);
    setPaymentLoading(false);
    setPaywallTriggered(false);

    if (activeFeature === 'quiz') {
      try {
        const initRes = await authFetch(`${API_BASE_URL}/chat/initiate`, {
          method: 'POST',
          body: JSON.stringify({ sessionId: chatSessionId, featureType: 'quiz' })
        });
        const initData = await initRes.json();
        setIsGuruTyping(false);
        setChatMessages([
          {
            id: `guru-${Date.now()}`,
            sender: 'guru',
            text: initData.message.text
          }
        ]);
        setCurrentScore(50);
        navigate('/chat/vibe');
      } catch (err) {
        console.error(err);
        alert("Failed to connect to backend server.");
        navigate('/');
      }
    } else if (activeFeature === 'roast') {
      try {
        const initRes = await authFetch(`${API_BASE_URL}/chat/initiate`, {
          method: 'POST',
          body: JSON.stringify({
            sessionId: chatSessionId,
            featureType: 'roast',
            photoBase64: photoPreviewUrl,
            name: roastName.trim() || 'User'
          })
        });
        const initData = await initRes.json();
        setIsGuruTyping(false);
        setChatMessages([
          {
            id: `guru-${Date.now()}`,
            sender: 'guru',
            text: initData.message.text
          }
        ]);
        navigate('/chat/roast');
      } catch (err) {
        console.error(err);
        alert("Failed to connect to backend server.");
        navigate('/');
      }
    } else if (activeFeature === 'predict') {
      try {
        const initRes = await authFetch(`${API_BASE_URL}/chat/initiate`, {
          method: 'POST',
          body: JSON.stringify({ sessionId: chatSessionId, featureType: 'predict' })
        });
        const initData = await initRes.json();
        
        const greetingMsg = initData.message.text;
        const initialUserText = `Hi! I'm ${predictName.trim()}. I study ${predictMajor.trim()}, and my dream is: ${predictDream.trim()}. Predict my timeline!`;

        setChatMessages([
          { id: `guru-${Date.now()}`, sender: 'guru', text: greetingMsg },
          { id: `user-${Date.now()}`, sender: 'user', text: initialUserText }
        ]);

        const msgRes = await authFetch(`${API_BASE_URL}/chat/message`, {
          method: 'POST',
          body: JSON.stringify({
            sessionId: chatSessionId,
            text: initialUserText,
            featureType: 'predict'
          })
        });
        const msgData = await msgRes.json();
        setIsGuruTyping(false);

        setChatMessages(prev => [
          ...prev,
          {
            id: `guru-reply-${Date.now()}`,
            sender: 'guru',
            text: msgData.message.text
          }
        ]);

        if (msgData.timeline) {
          setPredictTimeline([msgData.timeline]);
        }
        navigate('/chat/predict');
      } catch (err) {
        console.error(err);
        alert("Failed to connect to backend server.");
        navigate('/');
      }
    } else if (activeFeature === 'confess') {
      setConfessResult(data);
      navigate('/confess/share');
    } else if (activeFeature === 'certificate') {
      setCertificateResult(data.certificateOutput);
      navigate('/certificate/results');
    }
  };

  // Conversational v2 Webhook polling handler (Updated for upfront mock payment routing)
  useEffect(() => {
    let interval: any;
    if (pollingStatus && transactionId && activeFeature) {
      interval = setInterval(async () => {
        setPollingAttempts(prev => prev + 1);
        try {
          let url = '';
          if (activeFeature === 'confess') {
            url = `${API_BASE_URL}/features/confess/result/${transactionId}`;
          } else if (activeFeature === 'certificate') {
            url = `${API_BASE_URL}/features/certificate/result/${transactionId}`;
          } else {
            // For chats, we verify status by checking unlock route or details. Let's hit the unlock endpoint.
            url = `${API_BASE_URL}/chat/unlock/${chatSessionId}`;
          }

          const res = await authFetch(url);
          if (res.status === 200) {
            const data = await res.json();
            await handlePaymentSuccess(data);
          }
        } catch (err) {
          console.error("Polling check failed: ", err);
        }

        if (pollingAttempts > 15) {
          setPollingStatus(false);
          setPaymentLoading(false);
          alert("Payment confirmation issue. Please retry.");
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [pollingStatus, transactionId, activeFeature, chatSessionId, pollingAttempts, navigate, photoPreviewUrl, roastName, predictName, predictMajor, predictDream]);

  const handlePaymentCheckout = async (
    payload: { sessionId: string; featureType: string; self?: string; crush?: string },
    onCalculated: () => void
  ) => {
    if (paymentLoading || pollingStatus) return;
    setPaymentLoading(true);

    try {
      let url = `${API_BASE_URL}/chat/pay`;
      let body: any = payload;

      if (payload.featureType === 'confess') {
        url = `${API_BASE_URL}/features/confess/initiate`;
        body = {
          creatorName: confessCreatorName,
          creatorHandle: confessCreatorHandle,
          creatorContact: confessCreatorContact
        };
      } else if (payload.featureType === 'certificate') {
        url = `${API_BASE_URL}/features/certificate/initiate`;
        
        let finalTitle = '';
        if (certTestType === 'rizz') {
          if (certScore >= 23) finalTitle = "Rizz God";
          else if (certScore >= 18) finalTitle = "Smooth Operator";
          else if (certScore >= 12) finalTitle = "Dry Texter";
          else finalTitle = "Rizz Deficit";
        } else if (certTestType === 'greenflag') {
          if (certScore >= 23) finalTitle = "Certified Green Flag";
          else if (certScore >= 18) finalTitle = "Healthy boundary";
          else if (certScore >= 12) finalTitle = "Yellow Flag Danger";
          else finalTitle = "Certified Red Flag";
        } else {
          if (certScore >= 23) finalTitle = "Instagram Aesthetic Icon";
          else if (certScore >= 18) finalTitle = "Curated Feed Specialist";
          else if (certScore >= 12) finalTitle = "Spam Account Manager";
          else finalTitle = "Digital Disaster";
        }
        
        body = {
          name: certName.trim(),
          testType: certTestType,
          score: Math.round((certScore / 25) * 100),
          title: finalTitle
        };
      }

      const res = await authFetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Order creation crashed" }));
        throw new Error(err.message || "Failed order creation");
      }

      const data = await res.json();
      setTransactionId(data.transactionId);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        setPaymentLoading(false);
        return;
      }

      // Initialize Razorpay Options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "VibeMatch",
        description: `Unlock ${payload.featureType} features`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Call verification API
            const verifyRes = await authFetch(`${API_BASE_URL}/payment/verify`, {
              method: 'POST',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              onCalculated();
              setPollingStatus(true);
              setPollingAttempts(0);
            } else {
              const err = await verifyRes.json().catch(() => ({ message: "Verification failed" }));
              alert(err.message || "Payment verification failed.");
              setPaymentLoading(false);
            }
          } catch (err) {
            console.error("Verification call failed: ", err);
            // Fallback: poll anyway
            onCalculated();
            setPollingStatus(true);
            setPollingAttempts(0);
          }
        },
        prefill: {
          name: payload.self || "VibeMatch User"
        },
        theme: {
          color: "#a855f7"
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Order creation failed. Verify server environment config.");
      setPaymentLoading(false);
    }
  };

  const verifyPaymentManualCheck = async (onCalculated: () => void) => {
    if (!activeFeature) return;
    setPaymentLoading(true);
    try {
      let url = '';
      if (activeFeature === 'confess') {
        url = `${API_BASE_URL}/features/confess/result/${transactionId}`;
      } else if (activeFeature === 'certificate') {
        url = `${API_BASE_URL}/features/certificate/result/${transactionId}`;
      } else {
        url = `${API_BASE_URL}/chat/unlock/${chatSessionId}`;
      }

      const res = await authFetch(url);
      if (res.status === 200) {
        const data = await res.json();
        await handlePaymentSuccess(data);
        onCalculated();
      } else {
        alert("Payment confirmation has not cleared yet. If paid, please try again in a few seconds.");
      }
    } catch (err) {
      alert("Error contacting backend. Verify server is running.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleResetAllStates = () => {
    setActiveFeature(null);
    setTransactionId('');
    setPaymentLoading(false);
    setPollingStatus(false);
    setPaywallTriggered(false);
    setPhotoPreviewUrl(null);
    setRoastReportData(null);
    setPredictReportData(null);
    setVibeReportData(null);
    setSelfName('');
    setCrushName('');
    setChatMessages([]);
    setPredictTimeline([]);
    setConfessCreatorName('');
    setConfessCreatorHandle('');
    setConfessCreatorContact('');
    setConfessResult(null);
    setCrushGuessName('');
    setCrushContactInfo('');
    setConfessMatchResult(null);
    setCertQuestionIndex(0);
    setCertAnswers([]);
    setCertScore(0);
    setCertName('');
    setCertificateResult(null);
  };

  return (
    <VibeMatchContext.Provider
      value={{
        activeFeature,
        setActiveFeature,
        transactionId,
        setTransactionId,
        paymentLoading,
        setPaymentLoading,
        pollingStatus,
        setPollingStatus,
        pollingAttempts,
        setPollingAttempts,
        discountTimeLeft,
        setDiscountTimeLeft,
        paywallTriggered,
        setPaywallTriggered,
        selfName,
        setSelfName,
        crushName,
        setCrushName,
        nameError,
        setNameError,
        currentScore,
        setCurrentScore,
        vibeReportData,
        setVibeReportData,
        roastName,
        setRoastName,
        photoPreviewUrl,
        setPhotoPreviewUrl,
        roastReportData,
        setRoastReportData,
        confessCreatorName,
        setConfessCreatorName,
        confessCreatorHandle,
        setConfessCreatorHandle,
        confessCreatorContact,
        setConfessCreatorContact,
        confessResult,
        setConfessResult,
        confessionId,
        setConfessionId,
        confessionDetails,
        setConfessionDetails,
        crushGuessName,
        setCrushGuessName,
        crushContactInfo,
        setCrushContactInfo,
        confessMatchResult,
        setConfessMatchResult,
        confessSubmitting,
        setConfessSubmitting,
        predictName,
        setPredictName,
        predictMajor,
        setPredictMajor,
        predictDream,
        setPredictDream,
        predictTimeline,
        setPredictTimeline,
        predictReportData,
        setPredictReportData,
        certTestType,
        setCertTestType,
        certQuestionIndex,
        setCertQuestionIndex,
        certAnswers,
        setCertAnswers,
        certScore,
        setCertScore,
        certName,
        setCertName,
        certificateResult,
        setCertificateResult,
        chatSessionId,
        setChatSessionId,
        chatMessages,
        setChatMessages,
        isGuruTyping,
        setIsGuruTyping,
        user,
        token,
        authLoading,
        login,
        signUp,
        logout,
        handlePaymentCheckout,
        verifyPaymentManualCheck,
        handleResetAllStates,
        fetchConfessionDetails
      }}
    >
      {children}
    </VibeMatchContext.Provider>
  );
};

export const useVibeMatch = () => {
  const context = useContext(VibeMatchContext);
  if (!context) {
    throw new Error('useVibeMatch must be used within a VibeMatchContextProvider');
  }
  return context;
};

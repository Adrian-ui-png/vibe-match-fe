import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VibeMatchContextProvider } from './context/VibeMatchContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { VibePage } from './pages/VibePage';
import { RoastPage } from './pages/RoastPage';
import { PredictPage } from './pages/PredictPage';
import { ConfessPage } from './pages/ConfessPage';
import { ConfessSharePage } from './pages/ConfessSharePage';
import { ConfessCrushViewPage } from './pages/ConfessCrushViewPage';
import { ConfessMatchResultPage } from './pages/ConfessMatchResultPage';
import { CertificatePage } from './pages/CertificatePage';
import { CertificateQuizPage } from './pages/CertificateQuizPage';
import { CertificateResultsPage } from './pages/CertificateResultsPage';
import { ChatPage } from './pages/ChatPage';
import { InsightsPage } from './pages/InsightsPage';
import { CalculatingPage } from './pages/CalculatingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <VibeMatchContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/vibe" element={<VibePage />} />
            <Route path="/roast" element={<RoastPage />} />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/confess" element={<ConfessPage />} />
            <Route path="/confess/share" element={<ConfessSharePage />} />
            <Route path="/confess/:id" element={<ConfessCrushViewPage />} />
            <Route path="/confess/match-result" element={<ConfessMatchResultPage />} />
            <Route path="/certificate" element={<CertificatePage />} />
            <Route path="/certificate/quiz" element={<CertificateQuizPage />} />
            <Route path="/certificate/results" element={<CertificateResultsPage />} />
            <Route path="/chat/:featureType" element={<ChatPage />} />
            <Route path="/insights/:featureType" element={<InsightsPage />} />
            <Route path="/payment/processing" element={<CalculatingPage />} />
          </Route>
        </Routes>
      </VibeMatchContextProvider>
    </BrowserRouter>
  );
}

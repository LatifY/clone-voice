import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  HomePage,
  PricingPage,
  PurchaseSuccessPage,
  NotFoundPage,
  ProfilePage,
  PurchaseHistoryPage,
  VoiceClonePage,
  EmailConfirmationPage,
  VerifyEmailPage,
  AuthCallbackPage,
} from "./components/pages";
import { SignIn, SignUp } from "./components/auth";
import { GamepadCursor } from "./components/GamepadCursor";
import { AuthProvider } from "./contexts";

function App() {



  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
            <Route path="/voice-clone" element={<VoiceClonePage />} />
            <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <GamepadCursor />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  HomePage,
  PricingPage,
  PurchaseSuccessPage,
  NotFoundPage,
  ProfilePage,
  PurchaseHistoryPage,
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

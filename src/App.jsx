import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Tickets from "./components/Tickets";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import YukiAdmin from "./admin/YukiAdmin";
import Ticketadmin from "./admin/Ticketadmin";
import PaymentAdmin from "./admin/PaymentAdmin";
import AdminPanel from "./admin/AdminPanel";
import ScrollToTop from "./components/ScrollToTop";
import Error1 from "./pages/Error1";

import ProtectedRoute from "./components/ProtectedRoute";

// ── Tawk.to live chat widget ────────────────────────────────────────────────
function useTawkTo() {
  useEffect(() => {
    if (window.Tawk_API) return; // avoid double-injecting in StrictMode/dev

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/6a4e66e01548d51d459d70a9/1jt143ned";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
    // intentionally no cleanup — should persist for the whole app lifetime
  }, []);
}

// 1. AppContent handles hooks that depend on the Router context
function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/yukiadmin",
    "/ticketadmin",
    "/paymentadmin",
    "/adminyuki",
  ];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  const showFooter = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Error1 />} />

        {/* Protected Customer Routes */}
        <Route path="/" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/step1" element={<ProtectedRoute><Step1 /></ProtectedRoute>} />
        <Route path="/step2" element={<ProtectedRoute><Step2 /></ProtectedRoute>} />
        <Route path="/step2/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/yukiadmin" element={<YukiAdmin />} />
        <Route path="/ticketadmin" element={<Ticketadmin />} />
        <Route path="/paymentadmin" element={<PaymentAdmin />} />
        <Route path="/adminyuki" element={<AdminPanel />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

// 2. App provides the BrowserRouter context and acts as the entry point
function App() {
  useTawkTo();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
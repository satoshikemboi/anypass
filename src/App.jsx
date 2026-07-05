import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
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
import Error from "./pages/Error";
import Error1 from "./pages/Error1";
import Fee from "./pages/Fee";
import History from "./pages/History";

import ProtectedRoute from "./components/ProtectedRoute"; 

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

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Error />} />
        <Route path="/error1" element={<Error1 />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/history" element={<History />} />

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
    </>
  );
}

// 2. App provides the BrowserRouter context and acts as the entry point
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
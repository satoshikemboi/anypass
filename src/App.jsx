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
        <Route path="/" element={<Tickets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Customer Routes */}
        <Route path="/step1" element={<Step1 />} />
        <Route path="/step2" element={<ProtectedRoute><Step2 /></ProtectedRoute>} />
        <Route path="/step2/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/yukiadmin" element={<ProtectedRoute><YukiAdmin /></ProtectedRoute>} />
        <Route path="/ticketadmin" element={<ProtectedRoute><Ticketadmin /></ProtectedRoute>} />
        <Route path="/paymentadmin" element={<ProtectedRoute><PaymentAdmin /></ProtectedRoute>} />
        <Route path="/adminyuki" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

// 2. App provides the BrowserRouter context and acts as the entry point
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
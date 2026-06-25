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

function AppContent() {
  const location = useLocation();

  // Routes where navbar should be hidden
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
        <Route path="/" element={<Tickets />} />
        <Route path="/step1" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step2/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes */}
        <Route path="/yukiadmin" element={<YukiAdmin />} />
        <Route path="/ticketadmin" element={<Ticketadmin />} />
        <Route path="/paymentadmin" element={<PaymentAdmin />} />
        <Route path="/adminyuki" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Tickets from "./components/Tickets";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Payment from "./pages/Payment";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Tickets />} />
        <Route path="/step1" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step2/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
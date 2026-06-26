import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const DARK = "#1F1F1F";

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8C8C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Divider() {
  return <hr className="border-t border-gray-100 mx-4" />;
}

function MenuRow({ label, labelColor = DARK, showDot = false, onClick }) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors" onClick={onClick}>
      <span className="text-[14px] font-medium leading-snug" style={{ color: labelColor }}>{label}</span>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {showDot && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PINK }} />}
        <ChevronIcon />
      </div>
    </button>
  );
}

function Profile({ onClose }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.clear(); // Wipes user, token, and admin states cleanly
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch protected data using backend API and headers setup
        const response = await axios.get("https://anypass.onrender.com/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Use the user payload returned from your backend profile controller
        setUserData(response.data?.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-sm text-gray-500">Loading profile details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center pt-24 px-4 font-sans">
        <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-full max-w-lg text-center">
          <p className="text-md text-gray-700 font-semibold mb-6">{error}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-pink-400 hover:bg-pink-600 text-white py-3 rounded transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pb-8 font-sans max-w-100 mx-auto">
      <div className="flex justify-end px-4 mb-3">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
          <Link to="/"><CloseIcon /></Link>
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-lg border-gray-200 overflow-hidden mb-3">
        <MenuRow label="Number of tickets currently listed for sale" showDot={userData?.ticketCount > 0} />
        <Divider />
        <MenuRow label="Purchase history" onClick={() => navigate("/purchase-history")} />
        <Divider />
        <MenuRow label="Log out" labelColor={PINK} onClick={handleLogout} />
      </div>

      <div className="bg-white rounded-lg border shadow-lg border-gray-200 px-4 py-4 mb-3">
        <p className="text-[13px] font-semibold mb-2 leading-none" style={{ color: BLUE }}>[Registration Information]</p>
        <p className="text-[13px] text-gray-700 mb-1.5">Mobile phone number : <span style={{ color: BLUE }}>{userData?.phone || "N/A"}</span></p>
        <p className="text-[13px] text-gray-700">AnyPASS ID/Username : <span style={{ color: BLUE }}>{userData?.username || "N/A"}</span></p>
        <p className="text-[13px] text-gray-700 mt-1.5">email : <span style={{ color: BLUE}}>{userData?.email || "N/A"}</span></p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <MenuRow label="Help/Contact Us" />
        <Divider />
        <MenuRow label="terms of service" />
      </div>
    </div>
  );
}

export default Profile;
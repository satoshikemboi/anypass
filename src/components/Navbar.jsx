import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const PINK = "#D4537E";

function Navbar() {
  const location = useLocation();
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const name = parsedUser?.fullName || parsedUser?.user?.fullName || "My Account";
        setUserName(name);
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        setUserName("My Account");
      }
    } else {
      setUserName("Guest");
    }
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 md:px-8 border-b shadow-sm transition-all duration-200" style={{ borderBottomColor: PINK }}>
      
      {/* Left Section */}
      <div className="flex items-center">
        <Link
          to="/tickets"
          className="flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke={PINK}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        {/* Brand Logo Container */}
        <Link to="/" className="flex items-center gap-2 select-none group">
          <div className="h-11 w-auto flex items-center overflow-hidden rounded-md transition-transform duration-200 group-hover:scale-[1.03]">
            <img 
              src="/logo.png" 
              alt="AnyPASS Logo" 
              className="h-full object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Right Section */}
      <Link
        to="/profile"
        className="flex items-center gap-3 group"
      >
        <div className="p-1 rounded-full bg-white border border-gray-100 shadow-sm transition-colors group-hover:border-pink-200">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={PINK}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <div className="flex flex-col text-left leading-none max-w-30">
          <p className="text-[13px] font-bold mb-0.5 tracking-tight group-hover:text-pink-700 transition-colors" style={{ color: PINK }}>
            My Page
          </p>
          <span className="text-[11px] text-gray-500 truncate font-medium">
            {userName}
          </span>
        </div>
      </Link>
    </nav>
  );
}

export default Navbar;
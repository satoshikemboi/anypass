import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const DARK = "#1F1F1F";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
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

function CalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function MyEvents() {
  const navigate = useNavigate();
  // Replace with data from your API (e.g. fetched with axios, like in Profile)
  const [events] = useState([]);

  return (
    <div className="min-h-screen pt-4 pb-8 font-sans max-w-100 mx-auto">
      <div className="flex items-center justify-between px-4 mb-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          aria-label="戻る"
        >
          <BackIcon />
        </button>
        <h1 className="text-[15px] font-semibold" style={{ color: DARK }}>マイイベント</h1>
        <Link to="/tickets" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="閉じる">
          <CloseIcon />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg border shadow-lg border-gray-200 px-6 py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#FDEBEF" }}>
            <CalendarIcon />
          </div>
          <p className="text-[14px] font-semibold mb-2" style={{ color: DARK }}>
            参加予定のイベントはありません
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
            チケットを購入すると、<br />イベントがここに表示されます。
          </p>
          <Link
            to="/tickets"
            className="w-full text-white text-[14px] font-medium py-3 rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK }}
          >
            イベントを探す
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-lg border-gray-200 px-4 py-4">
          <p className="text-[13px] font-semibold mb-2 leading-none" style={{ color: BLUE }}>【参加予定のイベント】</p>
          {/* Render your events list here */}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
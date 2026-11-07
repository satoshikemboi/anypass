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

function ReceiptIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 2.5 2L12 20l2.5 2L17 20l3 2V2l-3 2-2.5-2L12 4 9.5 2 7 4 4 2z" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
    </svg>
  );
}

function PurchaseHistory() {
  const navigate = useNavigate();
  // Replace with data from your API (e.g. fetched with axios, like in Profile)
  const [purchases] = useState([]);

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
        <h1 className="text-[15px] font-semibold" style={{ color: DARK }}>購入履歴</h1>
        <Link to="/tickets" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors" aria-label="閉じる">
          <CloseIcon />
        </Link>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white rounded-lg border shadow-lg border-gray-200 px-6 py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#FDEBEF" }}>
            <ReceiptIcon />
          </div>
          <p className="text-[14px] font-semibold mb-2" style={{ color: DARK }}>
            購入履歴はまだありません
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
            チケットを購入すると、<br />購入履歴がここに表示されます。
          </p>
          <Link
            to="/tickets"
            className="w-full text-white text-[14px] font-medium py-3 rounded transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK }}
          >
            チケットを探す
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-lg border-gray-200 px-4 py-4">
          <p className="text-[13px] font-semibold mb-2 leading-none" style={{ color: BLUE }}>【購入履歴】</p>
          {/* Render your purchase list here */}
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
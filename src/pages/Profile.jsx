import React from "react";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const DARK = "#1F1F1F";
const MID  = "#555555";

/* ── Icons ─────────────────────────────────────────────────── */

function ChevronIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="#C8C8C8" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="#888888" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Primitives ─────────────────────────────────────────────── */

function Divider() {
  return <hr className="border-t border-gray-100 mx-4" />;
}

// Standard menu row: label on left, optional pink dot + chevron on right
function MenuRow({ label, labelColor = DARK, showDot = false, onClick }) {
  return (
    <button
      className="w-full flex items-center justify-between px-4 py-[14px] text-left"
      onClick={onClick}
    >
      <span className="text-[14px] font-medium leading-snug" style={{ color: labelColor }}>
        {label}
      </span>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {showDot && (
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: PINK }}
            aria-label="Active"
          />
        )}
        <ChevronIcon />
      </div>
    </button>
  );
}

// Row with a secondary right-aligned note below the label (e.g. "Go to the AnyPASS app")
function MenuRowWithNote({ label, labelColor = DARK, note, noteColor = PINK, onClick }) {
  return (
    <button
      className="w-full flex flex-col px-4 py-[14px] text-left"
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-[14px] font-medium leading-snug" style={{ color: labelColor }}>
          {label}
        </span>
        <ChevronIcon />
      </div>
      <p
        className="text-[12px] text-right w-full mt-[3px]"
        style={{ color: noteColor }}
      >
        {note}
      </p>
    </button>
  );
}

/* ── Profile Page ───────────────────────────────────────────── */

function Profile({ onClose }) {
  return (
    <div className="min-h-screen pt-4 pb-8 font-sans max-w-[400px] mx-auto">

      {/* Close button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ── Section 1: Main account menu ────────────────────── */}
      <div className="bg-white rounded-lg border shadow-lg border-gray-200 overflow-hidden mb-3">
        <MenuRow
          label="Number of tickets currently listed for sale"
          showDot
        />
        <Divider />
        <MenuRow label="Purchase history" />
        <Divider />
        <MenuRow label="Sales history" />
        <Divider />
        <MenuRow label="Sales Management" />
        <Divider />
        <MenuRow label="Bank transfer history" />
        <Divider />
        <MenuRow label="Account management" />
        <Divider />
        <MenuRow label="Log out" />
      </div>

      {/* ── Section 2: Bill splitting ────────────────────────── */}
      <div className="bg-white rounded-lg border shadow-lg border-gray-200 overflow-hidden mb-3">
        <MenuRow label="History of splitting the bill"/>
        <Divider />
        <MenuRow label="Exchange history" />
      </div>

      {/* ── Section 3: Registration information (no chevrons) ── */}
      <div className="bg-white rounded-lg border shadow-lg border-gray-200 px-4 py-4 mb-3">
        <p className="text-[13px] font-semibold mb-2 leading-none" style={{ color: BLUE }}>
          [Registration Information]
        </p>
        <p className="text-[13px] text-gray-700 mb-[6px]">
          Mobile phone number :{" "}
          <span style={{ color: BLUE }}>08345678976</span>
        </p>
        <p className="text-[13px] text-gray-700">
          AnyPASS ID{" "}
          <span style={{ color: BLUE }}>affa5303b5</span>
        </p>
      </div>

      {/* ── Section 4: Account settings ─────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-3">
        <MenuRowWithNote
          label="Change registration information"
          noteColor={PINK}
        />
        <Divider />
        <MenuRow label="Change email address" />
        <Divider />
        <MenuRow label="Newsletter settings" />
      </div>

      {/* ── Section 5: Help & legal ──────────────────────────── */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <MenuRow label="Help/Contact Us" />
        <Divider />
        <MenuRow label="terms of service" />
      </div>

    </div>
  );
}

export default Profile;
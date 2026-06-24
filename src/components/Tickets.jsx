import { useState } from "react";
import { Link } from "react-router-dom";

const PINK = "#E84060";
const BLUE = "#4A8AF4";

const ticketData = [
  { id: 1, seats: 1 },
  { id: 2, seats: 2 },
  { id: 3, seats: 3 },
];

function MapPinIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TicketIcon({ color = BLUE }) {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="#ffffff" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TicketCard({ seats, selected, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onClick()}
      className="rounded-lg shadow-xl border px-5 pt-[18px] pb-5 mb-3 transition-all duration-150 cursor-pointer select-none outline-none"
      style={{
        backgroundColor: selected ? "#FFF0F3" : "#ffffff",
        borderColor: selected ? PINK : "#E5E7EB",
        borderWidth: selected ? "2px" : "1px",
        boxShadow: selected
          ? `0 0 0 3px ${PINK}22, 0 4px 16px 0 ${PINK}18`
          : "0 4px 16px 0 rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Top row: label + checkmark ────────────────── */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-medium leading-none" style={{ color: PINK }}>
          Aina the End
        </p>

        {/* Checkmark bubble */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150"
          style={{
            backgroundColor: selected ? PINK : "transparent",
            border: selected ? `2px solid ${PINK}` : "2px solid #D1D5DB",
          }}
        >
          {selected && <CheckIcon />}
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3.5">
        AiNA THE END LIVE TOUR 2026 - PICNIC -
      </h2>

      <div className="flex items-center gap-[7px] mb-[7px]">
        <MapPinIcon />
        <span className="text-md text-gray-700 leading-none">
          ORIX THEATER, Osaka Prefecture
        </span>
      </div>

      <div className="flex items-center gap-[7px]">
        <ClockIcon />
        <span className="text-md text-gray-700 leading-none">
          2026/06/25 18:00 / 19:00
        </span>
      </div>

      <hr
        className="my-4"
        style={{ borderColor: selected ? `${PINK}33` : "#F3F4F6" }}
      />

      <div className="flex items-center gap-1.5 mb-2.5">
        <TicketIcon color={selected ? PINK : BLUE} />
        <span
          className="text-md font-semibold leading-none"
          style={{ color: selected ? PINK : BLUE }}
        >
          General reserved
        </span>
        <span className="text-md text-gray-800 leading-none">
          {seats === 1 ? "seat" : "seats"} x
        </span>
        <span className="text-[22px] font-bold leading-none" style={{ color: PINK }}>
          {seats}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-md" style={{ color: PINK }}>
          ¥9,500
        </span>
        <span className="text-md text-gray-800">
          / 1 sheet
        </span>
      </div>
    </div>
  );
}

function Tickets() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">

      {/* ── Instruction ───────────────────────────────── */}
      <p className="text-[12px] text-gray-400 mb-3 px-1">
        Select the number of seats
      </p>

      {ticketData.map((ticket) => (
        <TicketCard
          key={ticket.id}
          seats={ticket.seats}
          selected={selectedId === ticket.id}
          onClick={() =>
            setSelectedId(prev => (prev === ticket.id ? null : ticket.id))
          }
        />
      ))}

      {/* ── Confirm button ────────────────────────────── */}
      <button
        disabled={selectedId === null}
        className="w-full mt-2 py-[14px] rounded-lg text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150"
        style={{
          backgroundColor: PINK,
          opacity: selectedId === null ? 0.35 : 1,
          cursor: selectedId === null ? "not-allowed" : "pointer",
        }}
      >
        <Link to="./step1" > {selectedId === null
          ? "Select a ticket to continue"
          : `Confirm — ${ticketData.find(t => t.id === selectedId).seats} seat${ticketData.find(t => t.id === selectedId).seats > 1 ? "s" : ""} selected`}
        </Link>
      </button>

    </div>
  );
}

export default Tickets;
import { useState } from "react";
import { Link } from "react-router-dom";

const PINK = "#E84060";
const BLUE  = "#4A8AF4";

// ── Ticket data ─────────────────────────────────────────────
// priceNum / systemFee are numeric for calculations in later steps.
// dateFormatted, sellByDate, salesPeriodText are used by Step 1 & 2.
export const ticketData = [
  {
    id: 1,
    artist: "Aina the End",
    event: "AiNA THE END LIVE TOUR 2026 - PICNIC -",
    venue: "ORIX THEATER, Osaka Prefecture",
    date: "2026/06/25 18:00 / 19:00",
    dateFormatted: "2026/06/25 (Thu)  18:00/19:00",
    seatType: "General reserved",
    seatUnit: "seat",
    seats: 1,
    price: "¥9,500",
    priceNum: 9500,
    systemFee: 1320,
    systemFeeLabel: "一般指定席",
    sellByDate: "2026/6/24 (Wed) 23:59",
    salesPeriodText: "Until 23:59 on June 24, 2026 (Wednesday)",
    status: null,
  },
  {
    id: 2,
    artist: "claquepot",
    event: "claquepot crosspoint 2026",
    venue: "Zepp Haneda, Tokyo",
    date: "2026/06/25 18:00 / 19:00",
    dateFormatted: "2026/06/25 (Thu)  18:00/19:00",
    seatType: "Total freedom",
    seatUnit: "piece",
    seats: 1,
    price: "¥7,700",
    priceNum: 7700,
    systemFee: 880,
    systemFeeLabel: "立見席",
    sellByDate: "2026/6/24 (Wed) 23:59",
    salesPeriodText: "Until 23:59 on June 24, 2026 (Wednesday)",
    status: null,
  },
  {
    id: 3,
    artist: "LUNA SEA",
    event: "LUNA SEA TOUR 2026 UNENDING JOURNEY -FOREVER-",
    venue: "Aichi Prefecture, Aichi Prefectural Arts Theater, Main Hall",
    date: "2026/07/04 17:00 / 18:00",
    dateFormatted: "2026/07/04 (Sat)  17:00/18:00",
    seatType: "General reserved",
    seatUnit: "seat",
    seats: 1,
    price: "¥12,100",
    priceNum: 12100,
    systemFee: 1320,
    systemFeeLabel: "一般指定席",
    sellByDate: "2026/7/3 (Fri) 23:59",
    salesPeriodText: "Until 23:59 on July 3, 2026 (Friday)",
    status: "Purchase in progress",
  },
];

/* ── Icons ─────────────────────────────────────────────────── */

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

function TicketIcon({ color }) {
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
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="#ffffff" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── Ticket Card ────────────────────────────────────────────── */

function TicketCard({ ticket, selected, onToggle }) {
  const iconColor = selected ? PINK : BLUE;

  return (
    <div className="relative mb-3">

      {/* Status badge */}
      {ticket.status && (
        <div
          className="absolute top-0 right-0 z-10 px-3 py-[5px] rounded-tr-xl rounded-bl-xl"
          style={{ background: PINK }}
        >
          <span className="text-white text-[11px] font-semibold whitespace-nowrap">
            {ticket.status}
          </span>
        </div>
      )}

      {/* Card */}
      <div
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && onToggle()}
        className="rounded-xl px-5 pt-[18px] pb-5 cursor-pointer select-none outline-none transition-all duration-150"
        style={{
          backgroundColor: selected ? "#FFF0F3" : "#ffffff",
          border: selected ? `2px solid ${PINK}` : "1px solid #E5E7EB",
          boxShadow: selected
            ? `0 0 0 3px ${PINK}22, 0 4px 16px 0 ${PINK}18`
            : "0 4px 16px 0 rgba(0,0,0,0.07)",
        }}
      >
        {/* Artist + checkmark */}
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-medium leading-none" style={{ color: PINK }}>
            {ticket.artist}
          </p>
          <div
            className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ml-2 transition-all duration-150"
            style={{
              backgroundColor: selected ? PINK : "transparent",
              border: selected ? `2px solid ${PINK}` : "2px solid #D1D5DB",
            }}
          >
            {selected && <CheckIcon />}
          </div>
        </div>

        {/* Event title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
          {ticket.event}
        </h2>

        {/* Venue */}
        <div className="flex items-center gap-[7px] mb-[7px]">
          <MapPinIcon />
          <span className="text-[13px] text-gray-500 leading-snug">{ticket.venue}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-[7px]">
          <ClockIcon />
          <span className="text-[13px] text-gray-500 leading-none">{ticket.date}</span>
        </div>

        {/* Divider */}
        <hr
          className="my-4 border-t"
          style={{ borderColor: selected ? `${PINK}33` : "#F3F4F6" }}
        />

        {/* Seat type row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <TicketIcon color={iconColor} />
          <span className="text-[13px] font-medium leading-none" style={{ color: iconColor }}>
            {ticket.seatType}
          </span>

          {ticket.seatUnit === "seat" && (
            <>
              <span className="text-[13px] text-gray-400 leading-none">
                {ticket.seats === 1 ? "seat" : "seats"} x
              </span>
              <span className="text-[22px] font-bold leading-none" style={{ color: PINK }}>
                {ticket.seats}
              </span>
            </>
          )}

          {ticket.seatUnit === "piece" && (
            <>
              <span className="text-[13px] text-gray-400 leading-none">x</span>
              <span className="text-[22px] font-bold leading-none" style={{ color: PINK }}>
                {ticket.seats}
              </span>
              <span className="text-[13px] text-gray-400 leading-none">
                {ticket.seats === 1 ? "piece" : "pieces"}
              </span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold" style={{ color: PINK }}>{ticket.price}</span>
          <span className="text-[13px] text-gray-400">/ 1 sheet</span>
        </div>
      </div>
    </div>
  );
}

/* ── Tickets Page ───────────────────────────────────────────── */

function Tickets() {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const count = selectedIds.size;
  // Build the array of full ticket objects to pass forward
  const selectedTickets = ticketData.filter(t => selectedIds.has(t.id));

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">
      <p className="text-[12px] text-gray-400 mb-3 px-1">
        Select tickets to purchase
      </p>

      {ticketData.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          selected={selectedIds.has(ticket.id)}
          onToggle={() => toggle(ticket.id)}
        />
      ))}

      {/* Confirm button — passes selectedTickets in router state */}
      <Link
        to={count > 0 ? "./step1" : "#"}
        state={{ selectedTickets }}
        className="block w-full mt-2"
        onClick={e => count === 0 && e.preventDefault()}
      >
        <button
          disabled={count === 0}
          className="w-full py-[14px] rounded-xl text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150"
          style={{
            backgroundColor: PINK,
            opacity: count === 0 ? 0.35 : 1,
            cursor: count === 0 ? "not-allowed" : "pointer",
          }}
        >
          {count === 0
            ? "Select tickets to continue"
            : `Confirm — ${count} ticket${count > 1 ? "s" : ""} selected`}
        </button>
      </Link>
    </div>
  );
}

export default Tickets;
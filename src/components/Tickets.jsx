import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PINK = "#E84060";
const BLUE  = "#4A8AF4";

/* ── Icons ──────────────────────────────────────────────────────────────────── */

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

/* ── Ticket Card ─────────────────────────────────────────────────────────────── */

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

/* ── Tickets Page ─────────────────────────────────────────────────────────────── */

function Tickets() {
  const [tickets,     setTickets]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ── Fetch from the admin backend (localStorage) on mount ──────────────────
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/tickets"
        );

        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
  
        const data = await res.json();
  
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTickets();
  }, []);

  const toggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const count           = selectedIds.size;
  const selectedTickets = tickets.filter(t => selectedIds.has(t._id));

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${PINK}55`, borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-400">Loading tickets…</p>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (tickets.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6 font-sans">
        <span className="text-4xl mb-3">🎫</span>
        <p className="text-sm font-bold text-gray-600 mb-1">No tickets available</p>
        <p className="text-xs text-gray-400 text-center max-w-[200px]">
          Tickets added in the admin panel will appear here.
        </p>
      </div>
    );
  }

  // ── Main list ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">
      <p className="text-[12px] text-gray-400 mb-3 px-1">
        Select tickets to purchase
      </p>

      {tickets.map(ticket => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          selected={selectedIds.has(ticket._id)}
          onToggle={() => toggle(ticket._id)}
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
            : `Confirm —  ticket${count > 1 ? "s" : ""} selected`}
        </button>
      </Link>
    </div>
  );
}

export default Tickets;
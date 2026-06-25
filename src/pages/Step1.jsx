import React from "react";
import { Link, useLocation } from "react-router-dom";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const ORANGE = "#CC6500";

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

function TicketIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke={BLUE} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0 mt-0.5"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="white" strokeWidth="3.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── Shared primitives ──────────────────────────────────────── */

function Divider() {
  return <hr className="border-t border-gray-100 -mx-5" />;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-[13px]">
      <span className="text-[13px] text-gray-500 shrink-0 mr-3">{label}</span>
      <span className="text-[13px] text-gray-700 text-right leading-snug">{value}</span>
    </div>
  );
}

function CheckRow({ label, centered = false }) {
  return (
    <div className={`flex items-center gap-3 px-1 ${centered ? "justify-center" : ""}`}>
      <div
        className="w-[22px] h-[22px] rounded-sm flex items-center justify-center shrink-0"
        style={{ background: PINK }}
      >
        <CheckIcon />
      </div>
      <p className={`text-[14px] text-gray-800 leading-snug ${centered ? "text-center" : ""}`}>
        {label}
      </p>
    </div>
  );
}

/* ── Per-ticket card (event info + purchase details) ────────── */

function TicketSummaryCard({ ticket }) {
  // Safe dynamic fallback calculations if backend variable formatting differs
  const quantityLabel =
    ticket.seatUnit === "piece"
      ? `${ticket.seats} ${ticket.seats === 1 ? "piece" : "pieces"}`
      : `${ticket.seats} ${ticket.seats === 1 ? "sheet" : "sheets"}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 pt-[18px] pb-5 mb-3">

      {/* Artist */}
      <p className="text-xs font-medium mb-1 leading-none" style={{ color: PINK }}>
        {ticket.artist}
      </p>

      {/* Event title */}
      <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
        {ticket.event}
      </h2>

      {/* Venue */}
      <div className="flex items-center gap-[7px] mb-[7px]">
        <MapPinIcon />
        <span className="text-[13px] text-gray-500">{ticket.venue}</span>
      </div>

      {/* Date (Fix: Falls back to ticket.date if dateFormatted isn't sent) */}
      <div className="flex items-center gap-[7px]">
        <ClockIcon />
        <span className="text-[13px] text-gray-500">
          {ticket.dateFormatted || ticket.date}
        </span>
      </div>

      {/* Divider into purchase details */}
      <div className="mt-4 -mx-5">
        <Divider />
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 pt-4 pb-3">
        <span className="text-2xl font-bold" style={{ color: PINK }}>{ticket.price}</span>
        <span className="text-[13px] text-gray-400">/ 1 sheet</span>
      </div>

      <Divider />

      {/* Seat type + assignment */}
      <div className="flex items-start justify-between py-[13px]">
        <div className="flex items-start gap-1.5">
          <TicketIcon />
          <span className="text-[13px] font-medium leading-snug" style={{ color: BLUE }}>
            {ticket.seatType}<br />seats
          </span>
        </div>
        <span className="text-[13px] text-gray-500 text-right leading-snug">
          Seat assignment<br />undecided
        </span>
      </div>

      <Divider />

      {/* Sales period (Fix: Falls back to a default label string if undefined) */}
      <InfoRow 
        label="Sales period" 
        value={ticket.salesPeriodText || ticket.salesPeriod || "General Sales"} 
      />

      <Divider />

      {/* Quantity */}
      <InfoRow label="Number of items purchased" value={quantityLabel} />

    </div>
  );
}

/* ── Step 1 ─────────────────────────────────────────────────── */

function Step1() {
  // Pull the ticket array passed from Tickets.jsx
  const { state } = useLocation();
  const selectedTickets = state?.selectedTickets ?? [];

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">

      {/* Top instruction */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        To purchase tickets, please click &ldquo;{" "}
        <span className="cursor-pointer" style={{ color: PINK }}>
          Proceed to Checkout
        </span>{" "}
        &rdquo;.
      </p>

      {/* One combined event + purchase card per selected ticket */}
      {/* Fix: Changed ticket.id to ticket._id to match data structure passed from Tickets.jsx */}
      {selectedTickets.map(ticket => (
        <TicketSummaryCard key={ticket._id} ticket={ticket} />
      ))}

      {/* ── Terms & Conditions ─────────────────────────────── */}

      <h1 className="text-[15px] font-bold text-gray-900 text-center leading-snug mb-4 mt-3 px-1">
        AnyPASS STORE Terms and Conditions / Terms and Conditions Regarding the
        Split Payment Function / AnyPASS MATCH Terms and Conditions
      </h1>

      {/* Scrollable terms card */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-5 max-h-[200px] overflow-y-auto">
        <p className="text-[13px] font-medium mb-3 leading-snug" style={{ color: PINK }}>
          [AnyPASS STORE Individual Terms and Conditions]
        </p>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: ORANGE }}>
          AnyPASS STORE (hereinafter referred to as &ldquo;this store&rdquo;) is a
          membership-based ticket trading site for this service. To use this store,
          you must agree to these individual terms and conditions.
        </p>
        <p className="text-[13px]" style={{ color: PINK }}>
          Article 1 (Definitions of Terms)
        </p>
      </div>

      {/* Agree checkbox */}
      <div className="mb-6">
        <CheckRow
          label="I agree to the above individual terms and conditions."
          centered
        />
      </div>

      {/* Minors section */}
      <h2 className="text-[15px] font-bold text-gray-900 text-center mb-4">
        Ticket purchase by minors
      </h2>

      <p className="text-[13px] text-gray-600 leading-relaxed mb-5 px-1">
        If a minor purchases a ticket, it is assumed that they have obtained
        parental consent. Even if it is discovered after the ticket purchase that
        parental consent was not obtained, cancellations and refunds will not be
        possible.
      </p>

      {/* Consent checkbox */}
      <div className="mb-5">
        <CheckRow label="I consent to the purchase by a minor." />
      </div>

      {/* CTA — forwards selectedTickets state to Step 2 */}
      <div className="rounded-2xl px-4 pt-5 pb-4" style={{ background: "#FBEAF0" }}>
        <Link
          to="/step2"
          state={{ selectedTickets }}
          className="block w-full py-3.5 rounded-full text-white font-bold text-[15px] text-center mb-3"
          style={{ background: PINK }}
        >
          Proceed to purchase
        </Link>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          Please complete your application within 15 minutes. Applications may be
          cancelled if more than 15 minutes have passed. Please note that the
          tickets you purchase may not be for consecutive seats.
        </p>
      </div>

    </div>
  );
}

export default Step1;
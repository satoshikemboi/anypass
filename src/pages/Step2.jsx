import React from "react";
import { Link } from "react-router-dom";
const PINK = "#E84060";
const BLUE  = "#4A8AF4";

/* ── Icons ─────────────────────────────────────────────── */

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

/* ── Shared primitives ──────────────────────────────────── */

function SectionLabel({ text }) {
  return (
    <p className="text-[12px] text-gray-400 mb-2 px-1">
      {text}
    </p>
  );
}

function Divider() {
  return <hr className="border-t border-gray-100 -mx-5" />;
}

function Row({ label, value, valueClass = "text-[13px] text-gray-700" }) {
  return (
    <div className="flex items-center justify-between py-[14px]">
      <span className="text-[13px] text-gray-600">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

/* ── Step 2 ─────────────────────────────────────────────── */

function Step2() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">

      {/* ── 1. Confirmation of purchase details ─────────── */}
      <SectionLabel text="Confirmation of purchase details" />
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-[18px] pb-5 mb-5">

        <p className="text-xs font-medium mb-1 leading-none" style={{ color: PINK }}>
          Aina the End
        </p>

        <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
          AiNA THE END LIVE TOUR 2026 - PICNIC -
        </h2>

        <div className="flex items-center gap-[7px] mb-[7px]">
          <MapPinIcon />
          <span className="text-[13px] text-gray-500">
            ORIX THEATER, Osaka Prefecture
          </span>
        </div>

        <div className="flex items-center gap-[7px]">
          <ClockIcon />
          <span className="text-[13px] text-gray-500">
            2026/06/25 (Thu)&nbsp;&nbsp;&nbsp;&nbsp;18:00/19:00
          </span>
        </div>

      </div>

      {/* ── 2. Purchase ticket / amount ──────────────────── */}
      <SectionLabel text="Purchase ticket / amount" />
      <div className="bg-white rounded-xl border border-gray-200 px-5 mb-5">

        {/* Unit price */}
        <div className="flex items-baseline gap-2 py-4">
          <span className="text-2xl font-bold" style={{ color: PINK }}>¥9,500</span>
          <span className="text-[13px] text-gray-400">per ticket</span>
        </div>

        <Divider />

        {/* Seat type */}
        <div className="flex items-start justify-between py-[14px]">
          <div className="flex items-start gap-1.5">
            <TicketIcon />
            <span className="text-[13px] font-medium leading-snug" style={{ color: BLUE }}>
              General reserved<br />seats
            </span>
          </div>
          <span className="text-[13px] text-gray-500">Seat TBD</span>
        </div>

        <Divider />

        {/* Sell-by-Date */}
        <Row label="Sell-by-Date" value="2026/6/24 (Wed) 23:59" />

        <Divider />

        {/* Number of purchases */}
        <Row label="Number of purchases" value="1" />

      </div>

      {/* ── 3. Purchase price ────────────────────────────── */}
      <SectionLabel text="Purchase price" />
      <div className="bg-white rounded-xl border border-gray-200 px-5 mb-5">

        {/* Ticket price */}
        <Row label="Ticket price (tax included)" value="¥9,500" />

        <Divider />

        {/* System usage fee header */}
        <div className="pt-[14px] pb-1">
          <span className="text-[13px] text-gray-600">System usage fee</span>
        </div>

        {/* Indented sub-row */}
        <div className="flex items-start justify-between pb-[14px] pl-3">
          <span className="text-[12px] text-gray-400 leading-snug" style={{ maxWidth: "62%" }}>
            一般指定席：(¥ 1320 per ticket, tax included)
          </span>
          <span className="text-[13px] text-gray-700">¥1320</span>
        </div>

        <Divider />

        {/* Total */}
        <div className="flex items-center justify-between py-[14px]">
          <span className="text-[13px] text-gray-600">Total (tax included)</span>
          <span className="text-[20px] font-bold" style={{ color: PINK }}>¥10,820</span>
        </div>

      </div>

      {/* ── 4. Disclaimer + phone + CTA ─────────────────── */}
      <p className="text-[12px] text-gray-500 leading-relaxed mb-3 px-1">
        *Please note that tickets cannot be canceled, changed, or refunded after purchase, regardless of the reason.
      </p>

      <div
        className="rounded-xl px-5 pt-5 pb-5 flex flex-col items-center gap-3"
        style={{ backgroundColor: "#FCE8ED" }}
      >
        {/* Phone number */}
        <p className="text-[22px] font-bold tracking-wide" style={{ color: PINK }}>
          0812345678
        </p>

        {/* Sub-note */}
        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          *Purchased tickets will be automatically displayed on the AnyPASS app registered with the above phone number.
        </p>

        {/* CTA button */}
        <button
          className="w-full py-[14px] rounded-lg text-white text-[14px] font-semibold tracking-wide"
          style={{ backgroundColor: PINK }}
        >
          <Link to="./payment">Payment information input</Link>
        </button>
      </div>

    </div>
  );
}

export default Step2;
import React from "react";
import { Link } from "react-router-dom";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const AMBER = "#B45309";

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

function AlertIcon() {
  return (
    <svg
      width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke={AMBER} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0 mt-0.5"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ── Shared primitives ──────────────────────────────────────── */

function Divider() {
  return <hr className="border-t border-gray-100 -mx-5" />;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-3.25">
      <span className="text-[13px] text-gray-500 shrink-0 mr-3">{label}</span>
      <span className="text-[13px] text-gray-700 text-right leading-snug">{value}</span>
    </div>
  );
}

/* ── History ticket card ──────────────────────────────────── */

function HistoryTicketCard({ ticket }) {
  const quantityLabel = `${ticket.seats}枚`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 pt-4.5 pb-5 mb-3">

      {/* Artist + status badge */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium leading-none" style={{ color: PINK }}>
          {ticket.artist}
        </p>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: "#EAF7EE", color: "#1E9E4C" }}
        >
          購入済み
        </span>
      </div>

      {/* Event title */}
      <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5 mt-1">
        {ticket.event}
      </h2>

      {/* Venue */}
      <div className="flex items-center gap-1.75 mb-1.75">
        <MapPinIcon />
        <span className="text-[13px] text-gray-500">{ticket.venue}</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.75">
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
        <span className="text-[13px] text-gray-400">/ 1枚</span>
      </div>

      <Divider />

      {/* Seat type + assignment */}
      <div className="flex items-start justify-between py-3.25">
        <div className="flex items-start gap-1.5">
          <TicketIcon />
          <span className="text-[13px] font-medium leading-snug" style={{ color: BLUE }}>
            {ticket.seatType}<br />席
          </span>
        </div>
        <span className="text-[13px] text-gray-500 text-right leading-snug">
          座席<br />未定
        </span>
      </div>

      <Divider />

      {/* Sales period */}
      <InfoRow
        label="販売期間"
        value={ticket.salesPeriodText || ticket.salesPeriod || "一般販売"}
      />

      <Divider />

      {/* Quantity */}
      <InfoRow label="購入枚数" value={quantityLabel} />

      {/* Pairing requirement warning */}
      {ticket.requiresPair && (
        <div
          className="mt-4 rounded-lg px-3.5 py-3"
          style={{ background: "#FFF7E6", border: "1px solid #FDE4B0" }}
        >
          <div className="flex items-start gap-2">
            <AlertIcon />
            <p className="text-[12.5px] leading-relaxed" style={{ color: AMBER }}>
              このチケットは2枚1組でのご購入が条件となっており、1枚のみでは入場に使用できません。有効なチケットとするには、もう1枚を追加でご購入ください。
            </p>
          </div>
          <Link
            to="/step1"
            state={{ selectedTickets: [ticket] }}
            className="block w-full mt-3 py-2.5 rounded-full text-white font-bold text-[13px] text-center"
            style={{ background: PINK }}
          >
            もう1枚購入して手続きへ進む
          </Link>
        </div>
      )}

      {/* PayPay pending status */}
      {ticket.paypayPending && (
        <div className="flex items-center gap-2 mt-3.5 px-1">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ background: "#22C55E" }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: "#22C55E" }}
            />
          </span>
          <span className="text-[12.5px] text-gray-700 leading-snug">
          送信されたPayPayの支払いリクエストを完了してください。
          </span>
        </div>
      )}

    </div>
  );
}

/* ── History page ─────────────────────────────────────────── */

const purchaseHistory = [
  {
    _id: "hist-001",
    artist: "MRS GREENAPPLE",
    event: "Mrs. GREEN APPLE – ゼンジン未到とイ/ミュータプル〜間奏編〜",
    venue: "Tokyo National Stadium",
    dateFormatted: "2026/07/05 15:00 / 18:00",
    price: "¥16,500",
    seatType: "Total freedom",
    salesPeriodText: "一般販売",
    seats: 1,
    requiresPair: true,
    paypayPending: true,
  },
];

function History() {
  return (
    <div className="bg-gray-100 min-h-screen p-4 pb-10 font-sans">

      <h1 className="text-[17px] font-bold text-gray-900 mb-4 px-1">
        購入履歴
      </h1>

      {purchaseHistory.length === 0 ? (
        <p className="text-sm text-gray-500 text-center mt-10">
          購入履歴はまだありません。
        </p>
      ) : (
        purchaseHistory.map(ticket => (
          <HistoryTicketCard key={ticket._id} ticket={ticket} />
        ))
      )}

    </div>
  );
}

export default History;
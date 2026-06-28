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
    <div className="flex items-start justify-between py-3.25">
      <span className="text-[13px] text-gray-500 shrink-0 mr-3">{label}</span>
      <span className="text-[13px] text-gray-700 text-right leading-snug">{value}</span>
    </div>
  );
}

function CheckRow({ label, centered = false }) {
  return (
    <div className={`flex items-center gap-3 px-1 ${centered ? "justify-center" : ""}`}>
      <div
        className="w-5.5 h-5.5 rounded-sm flex items-center justify-center shrink-0"
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
  const quantityLabel = `${ticket.seats}枚`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 pt-4.5 pb-5 mb-3">

      {/* Artist */}
      <p className="text-xs font-medium mb-1 leading-none" style={{ color: PINK }}>
        {ticket.artist}
      </p>

      {/* Event title */}
      <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
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

    </div>
  );
}

/* ── Step 1 ─────────────────────────────────────────────────── */

function Step1() {
  const { state } = useLocation();
  const selectedTickets = state?.selectedTickets ?? [];

  return (
    <div className="bg-gray-100 min-h-screen p-4 pb-36 font-sans">

      {/* Top instruction */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        チケットを購入するには、「
        <span className="cursor-pointer" style={{ color: PINK }}>
          購入手続きへ進む
        </span>
        」をクリックしてください。
      </p>

      {/* One combined event + purchase card per selected ticket */}
      {selectedTickets.map(ticket => (
        <TicketSummaryCard key={ticket._id} ticket={ticket} />
      ))}

      {/* ── Terms & Conditions ─────────────────────────────── */}

      <h1 className="text-[15px] font-bold text-gray-900 text-center leading-snug mb-4 mt-3 px-1">
        AnyPASS STORE利用規約 / 分割払い機能に関する利用規約 / AnyPASS MATCH利用規約
      </h1>

      {/* Scrollable terms card */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-5 max-h-50 overflow-y-auto">
        <p className="text-[13px] font-medium mb-3 leading-snug" style={{ color: PINK }}>
          【AnyPASS STORE個別利用規約】
        </p>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: ORANGE }}>
          AnyPASS STORE（以下「本ストア」といいます）は、本サービスの会員制チケット売買サイトです。本ストアをご利用いただくには、これらの個別利用規約に同意していただく必要があります。
        </p>
        <p className="text-[13px]" style={{ color: PINK }}>
          第1条（定義）
        </p>
      </div>

      {/* Agree checkbox */}
      <div className="mb-6">
        <CheckRow
          label="上記の個別利用規約に同意します。"
          centered
        />
      </div>

      {/* Minors section */}
      <h2 className="text-[15px] font-bold text-gray-900 text-center mb-4">
        未成年者によるチケットの購入
      </h2>

      <p className="text-[13px] text-gray-600 leading-relaxed mb-5 px-1">
        未成年者がチケットを購入する場合、保護者の同意を得ているものとみなします。チケット購入後に保護者の同意が得られていなかったことが判明した場合でも、キャンセルおよび返金はできません。
      </p>

      {/* Consent checkbox */}
      <div className="mb-5">
        <CheckRow label="未成年者による購入に同意します。" />
      </div>

      {/* CTA — fixed to bottom of screen */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4" style={{ background: "#FBEAF0" }}>
        <Link
          to="/step2"
          state={{ selectedTickets }}
          className="block w-full py-3.5 rounded-full text-white font-bold text-[15px] text-center mb-3"
          style={{ background: PINK }}
        >
          購入手続きへ進む
        </Link>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          15分以内にお手続きを完了してください。15分を超えた場合、申し込みがキャンセルされる場合があります。ご購入いただくチケットは連続した座席でない場合がありますので、あらかじめご了承ください。
        </p>
      </div>

    </div>
  );
}

export default Step1;
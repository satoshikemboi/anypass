import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PINK = "#E84060";
const BLUE = "#4A8AF4";

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

/* Clickable, stateful checkbox row — restyled to sit inside a white card,
   consistent with the ticket/purchase cards above it. */
function CheckRow({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left cursor-pointer rounded-lg px-1 py-1 transition-colors hover:bg-black/[0.03] active:bg-black/[0.05]"
    >
      <div
        className="w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0 transition-colors duration-150 border-2"
        style={
          checked
            ? { background: PINK, borderColor: PINK }
            : { background: "white", borderColor: "#d1d5db" }
        }
      >
        {checked && <CheckIcon />}
      </div>
      <p className="text-[14px] text-gray-800 leading-snug">{label}</p>
    </button>
  );
}

/* ── Card 1 — event info ──────────────────────────────────────
   Artist, title, venue, date. Mirrors the "who/what/where/when"
   block from the inspo image, split out from the pricing details. */

function EventInfoCard({ ticket }) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 px-5 pt-4.5 pb-5 mb-3">
      <p className="text-xs font-medium mb-1 leading-none" style={{ color: PINK }}>
        {ticket.artist}
      </p>

      <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
        {ticket.event}
      </h2>

      <div className="flex items-center gap-1.75 mb-1.75">
        <MapPinIcon />
        <span className="text-[13px] text-gray-500">{ticket.venue}</span>
      </div>

      <div className="flex items-center gap-1.75">
        <ClockIcon />
        <span className="text-[13px] text-gray-500">
          {ticket.dateFormatted || ticket.date}
        </span>
      </div>
    </div>
  );
}

/* ── Card 2 — purchase details ────────────────────────────────
   Price, seat type, sales cutoff, quantity — its own card, as in
   the inspo image, rather than merged into the event card. */

function PurchaseDetailsCard({ ticket }) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 px-5 pt-4.5 pb-2 mb-5">

      {/* Price */}
      <div className="flex items-baseline gap-1.5 pb-4">
        <span className="text-[13px] font-medium" style={{ color: PINK }}>
          チケット1枚あたり
        </span>
        <span className="text-2xl font-bold" style={{ color: PINK }}>
          {ticket.price}
        </span>
      </div>

      <Divider />

      {/* Seat type + assignment */}
      <div className="flex items-center justify-between py-3.25">
        <div className="flex items-center gap-1.5">
          <TicketIcon />
          <span className="text-[13px] font-medium" style={{ color: BLUE }}>
            {ticket.seatType}
          </span>
        </div>
      </div>

      <Divider />

      {/* Sales cutoff */}
      <InfoRow
        label="日付別販売"
        value={ticket.salesPeriodText || ticket.salesPeriod || "一般販売"}
      />

      <Divider />

      {/* Quantity */}
      <InfoRow label="購入数" value={`${ticket.seats}`} />

    </div>
  );
}

/* ── Notices section ───────────────────────────────────────────
   注意事項 — centered header under a full-width rule, followed by
   a plain left-aligned list, matching the inspo image. */

   const NOTICES = [
    "★公演当日にチケットを利用してご入場される方ご本人がチケットをご購入ください。",
    "代理でチケットをご購入された場合でも、ご購入いただいたチケットはご同行者へ分配・譲渡することができます。",
    "ご購入後のお客様都合によるキャンセル・返金はお受けできませんので、あらかじめご了承ください。",
    "※お支払い方法はクレジットカードまたはPayPayをご利用いただけます。",
    "※購入完了後、チケットは「マイイベント」のチケット一覧に表示されます。",
    "複数枚ご購入の場合は、ご同行者へチケットを分配してください。",
    "※チケットを受け取るご同行者も、AnyPASS（無料）のダウンロードおよび会員登録が必要です。",
    "※リセールで購入したチケットは、指定されたリセール期間中に再度出品することができます。",
  ];

function NoticesSection() {
  return (
    <div className="mb-6">
      <hr className="border-t border-gray-200 mb-4" />
      <h2 className="text-[15px] font-bold text-gray-900 text-center mb-3">
        注意事項
      </h2>
      <div className="text-[12.5px] text-gray-600 leading-relaxed space-y-1 px-1">
        {NOTICES.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

/* ── Shared page content ──────────────────────────────────────
   Everything between the intro line and the checkboxes is identical
   between mobile and desktop — only the outer container (width,
   padding, centering) differs. Kept as one component so both
   breakpoints always render the same design. */

function Step1Content({ selectedTickets, agreedToTerms, onToggleTerms, agreedMinors, onToggleMinors }) {
  return (
    <>
      {/* Top instruction */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        チケットを購入するには、「
        <span className="cursor-pointer" style={{ color: PINK }}>
          購入手続きへ進む
        </span>
        」をクリックしてください。
      </p>

      {/* Event info + purchase details, as two cards per selected ticket */}
      {selectedTickets.map(ticket => (
        <React.Fragment key={ticket._id}>
          <EventInfoCard ticket={ticket} />
          <PurchaseDetailsCard ticket={ticket} />
        </React.Fragment>
      ))}

      {/* ── Notices ──────────────────────────────────────────── */}
      <NoticesSection />

      {/* ── Terms & Conditions ─────────────────────────────── */}

      <h1 className="text-[15px] font-bold text-gray-900 text-center leading-snug mb-4 px-1">
        AnyPASS STORE利用規約 / 分割払い機能に関する利用規約 / AnyPASS MATCH利用規約
      </h1>

      {/* Scrollable terms card — restyled to match the plain white
          card look used above (no more colored body text). */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-4 max-h-50 overflow-y-auto">
        <p className="text-[13px] font-semibold mb-3 leading-snug" style={{ color: PINK }}>
          【AnyPASS STORE個別利用規約】
        </p>
        <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
          AnyPASS STORE（以下「本ストア」といいます）は、本サービスの会員制チケット売買サイトです。本ストアをご利用いただくには、これらの個別利用規約に同意していただく必要があります。
        </p>
        <p className="text-[13px] font-semibold" style={{ color: PINK }}>
          第1条（定義）
        </p>
      </div>

      {/* Agree checkbox — now inside its own card, consistent with
          the rest of the page */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-5">
        <CheckRow
          label="上記の個別利用規約に同意します。"
          checked={agreedToTerms}
          onToggle={onToggleTerms}
        />
      </div>

      {/* Minors section */}
      <h2 className="text-[15px] font-bold text-gray-900 text-center mb-4">
        未成年者によるチケットの購入
      </h2>

      <p className="text-[13px] text-gray-600 leading-relaxed mb-4 px-1">
        未成年者がチケットを購入する場合、保護者の同意を得ているものとみなします。チケット購入後に保護者の同意が得られていなかったことが判明した場合でも、キャンセルおよび返金はできません。
      </p>

      {/* Consent checkbox — restyled to match */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-5">
        <CheckRow
          label="未成年者による購入に同意します。"
          checked={agreedMinors}
          onToggle={onToggleMinors}
        />
      </div>
    </>
  );
}

/* ── Shared CTA bar ────────────────────────────────────────────
   Fixed to the bottom of the screen either way; on desktop the
   background bar still spans full width but the button/notice
   text is constrained to maxWidthClass so it lines up with the
   centered content column above it. */

function CtaBar({ canProceed, selectedTickets, maxWidthClass = "" }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4" style={{ background: "#FBEAF0" }}>
      <div className={`${maxWidthClass} mx-auto`}>
        {canProceed ? (
          <Link
            to="/step2"
            state={{ selectedTickets }}
            className="block w-full py-3.5 rounded-sm text-white font-bold text-[15px] text-center mb-3"
            style={{ background: PINK }}
          >
            購入手続きへ進む
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="block w-full py-3.5 rounded-sm text-white font-bold text-[15px] text-center mb-3 cursor-not-allowed"
            style={{ background: "#f0a8b8" }}
          >
            購入手続きへ進む
          </button>
        )}

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          15分以内にお手続きを完了してください。15分を超えた場合、申し込みがキャンセルされる場合があります。ご購入いただくチケットは連続した座席でない場合がありますので、あらかじめご了承ください。
        </p>
      </div>
    </div>
  );
}

/* ── Step 1 ─────────────────────────────────────────────────── */

function Step1() {
  const { state } = useLocation();
  const selectedTickets = state?.selectedTickets ?? [];

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedMinors, setAgreedMinors] = useState(false);

  const canProceed = agreedToTerms && agreedMinors;

  const contentProps = {
    selectedTickets,
    agreedToTerms,
    onToggleTerms: () => setAgreedToTerms(v => !v),
    agreedMinors,
    onToggleMinors: () => setAgreedMinors(v => !v),
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">

      {/* ══ Mobile / tablet view (< lg) — single column, full width ══════ */}
      <div className="lg:hidden p-4 pb-40">
        <Step1Content {...contentProps} />
      </div>
      <div className="lg:hidden">
        <CtaBar canProceed={canProceed} selectedTickets={selectedTickets} />
      </div>

      {/* ══ Desktop view (lg and up) — same design, centered column ══════ */}
      <div className="hidden lg:block max-w-[640px] mx-auto px-4 pt-10 pb-40">
        <Step1Content {...contentProps} />
      </div>
      <div className="hidden lg:block">
        <CtaBar
          canProceed={canProceed}
          selectedTickets={selectedTickets}
          maxWidthClass="max-w-[640px]"
        />
      </div>

    </div>
  );
}

export default Step1;
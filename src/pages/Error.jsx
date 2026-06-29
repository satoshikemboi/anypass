import { useNavigate } from "react-router-dom";

const PINK       = "#E84060";
const PINK_BG    = "#FFF0F3";
const PINK_DARK  = "#9B1C3A";
const PINK_BORDER = "#FFCDD2";

/* ── Icons ──────────────────────────────────────────────────── */

function BrokenTicketIcon() {
  return (
    <svg
      width="44" height="44" viewBox="0 0 24 24"
      fill="none" stroke={PINK} strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Ticket outline */}
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      {/* Vertical dash line (perforation) */}
      <line x1="9" y1="9" x2="9" y2="15" strokeDasharray="1.5 1.5" />
      {/* X mark in the right half */}
      <line x1="13.5" y1="10.5" x2="16.5" y2="13.5" />
      <line x1="16.5" y1="10.5" x2="13.5" y2="13.5" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PairIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke={PINK} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke={PINK} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0 mt-0.25"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Error Page ─────────────────────────────────────────────── */

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans flex flex-col">

      {/* ── Hero error card ──────────────────────────────── */}
      <div
        className="rounded-xl px-5 pt-8 pb-7 mb-4 flex flex-col items-center text-center"
        style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
      >
        {/* Icon badge */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: "#FFDCE4", border: `1.5px solid ${PINK_BORDER}` }}
        >
          <BrokenTicketIcon />
        </div>

        {/* Error label */}
        <p
          className="text-[11px] font-bold tracking-widest uppercase mb-2"
          style={{ color: `${PINK}99` }}
        >
          譲渡エラー
        </p>

        {/* Headline */}
        <h1
          className="text-[19px] font-bold leading-snug mb-3"
          style={{ color: PINK_DARK }}
        >
          チケットの個別譲渡は<br />できません
        </h1>

        {/* Sub-message */}
        <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs">
          ご購入いただいたチケットは、購入時の単位（ペア）でのみ譲渡が可能です。1枚ずつの個別譲渡はお受けできません。
        </p>
      </div>

      {/* ── Rule explanation card ────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 mb-4">

        <div className="flex items-center gap-2 mb-4">
          <PairIcon />
          <span className="text-[13px] font-bold text-gray-800">譲渡のルールについて</span>
        </div>

        {/* Rule rows */}
        <div className="space-y-3.5">

          <div className="flex items-start gap-2.5">
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.25"
              style={{ backgroundColor: PINK_BG, color: PINK }}
            >
              NG
            </span>
            <p className="text-[13px] text-gray-500 leading-snug">
              2枚購入したチケットのうち、1枚のみを別の方に譲渡すること
            </p>
          </div>

          <div className="border-t border-gray-100" />

          <div className="flex items-start gap-2.5">
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.25"
              style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}
            >
              OK
            </span>
            <p className="text-[13px] text-gray-500 leading-snug">
              購入した2枚のチケットをセットで同じ方に譲渡すること
            </p>
          </div>

        </div>
      </div>

      {/* ── Notice banner ────────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-4 mb-6 flex items-start gap-2.5"
        style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
      >
        <InfoIcon />
        <p className="text-[12px] leading-relaxed" style={{ color: PINK_DARK }}>
          チケットの譲渡はAnyPASSアプリ内の「チケット譲渡」機能から行えます。譲渡はペア単位でのみ受け付けております。ご不明な点はサポートまでお問い合わせください。
        </p>
      </div>

      {/* ── Back button ──────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-opacity duration-150 active:opacity-80"
        style={{ backgroundColor: PINK }}
      >
        <ArrowLeftIcon />
        前のページに戻る
      </button>

    </div>
  );
}
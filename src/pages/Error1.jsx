import { useNavigate } from "react-router-dom";

const PINK        = "#E23662";
const PINK_BG     = "#FFF1F4";
const PINK_DARK   = "#7A1338";
const PINK_BORDER = "#FFD3DC";
const GRAY_TEXT   = "#7A7476";

/* ── Icons ──────────────────────────────────────────────────── */

function PairedTicketIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={PINK}
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" strokeDasharray="1.6 1.6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

/* ── Error Page ─────────────────────────────────────────────── */

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen p-5 font-sans flex flex-col">
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
        >
          <PairedTicketIcon />
        </div>

        {/* Eyebrow */}
        <p className="text-[12px] font-bold tracking-wide mb-2" style={{ color: PINK }}>
          譲渡エラー
        </p>

        {/* Headline */}
        <h1 className="text-[19px] font-bold leading-snug mb-3" style={{ color: PINK_DARK }}>
          なにわ男子 LIVE TOUR 2026<br />「ND⁵」チケットの1日分のみの譲渡はできません
        </h1>

        {/* Body */}
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: GRAY_TEXT }}>
          チケットの譲渡は、公演両日分をご購入いただいた場合のみ可能です。いずれか1日分のみのご購入では譲渡をお受けできません。両日分をご購入のうえ、あらためて譲渡のお手続きをお願いいたします。
        </p>

        {/* Rule strip */}
        <div
          className="rounded-xl px-4 py-4 mb-8 space-y-3"
          style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{ backgroundColor: "#FFFFFF", color: PINK }}
            >
              NG
            </span>
            <p className="text-[13px]" style={{ color: PINK_DARK }}>
              いずれか1日分のチケットのみを譲渡すること
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0"
              style={{ backgroundColor: "#FFFFFF", color: PINK }}
            >
              OK
            </span>
            <p className="text-[13px]" style={{ color: PINK_DARK }}>
              両日分のチケットをご購入のうえ、まとめて譲渡すること
            </p>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-opacity duration-150 active:opacity-80 mt-auto"
          style={{ backgroundColor: PINK }}
        >
          <ArrowLeftIcon />
          前のページに戻る
        </button>

      </div>
    </div>
  );
}
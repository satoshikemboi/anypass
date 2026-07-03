import { useNavigate } from "react-router-dom";

const PINK        = "#E23662";
const PINK_BG     = "#FFF1F4";
const PINK_DARK   = "#7A1338";
const PINK_BORDER = "#FFD3DC";
const GRAY_TEXT   = "#7A7476";
const INK         = "#231A1D";

/* ── Icons ──────────────────────────────────────────────────── */

function ReceiptIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PINK}
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2h12a1 1 0 0 1 1 1v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3a1 1 0 0 1 1-1Z" />
      <line x1="8.5" y1="7" x2="15.5" y2="7" />
      <line x1="8.5" y1="11" x2="15.5" y2="11" />
      <line x1="8.5" y1="15" x2="12.5" y2="15" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PINK}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Fee row ───────────────────────────────────────────────── */

function FeeRow({ label, amount, bold }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span
        className={bold ? "text-[14px] font-bold" : "text-[13.5px]"}
        style={{ color: bold ? INK : GRAY_TEXT }}
      >
        {label}
      </span>
      <span
        className={bold ? "text-[17px] font-bold" : "text-[14px] font-semibold"}
        style={{ color: bold ? PINK : INK }}
      >
        ¥{amount.toLocaleString()}
      </span>
    </div>
  );
}

/* ── Fee Page ─────────────────────────────────────────────── */

export default function PlatformFee() {
  const navigate = useNavigate();

  const fees = [
    { label: "サービス利用料", amount: 8000 },
    { label: "発券手数料", amount: 4000 },
  ];
  const total = fees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="bg-white min-h-screen p-5 font-sans flex flex-col">
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
        >
          <ReceiptIcon />
        </div>

        {/* Eyebrow */}
        <p className="text-[12px] font-bold tracking-wide mb-2" style={{ color: PINK }}>
          お支払いのご案内
        </p>

        {/* Headline */}
        <h1 className="text-[19px] font-bold leading-snug mb-3" style={{ color: PINK_DARK }}>
          プラットフォーム利用料の<br />お支払いが必要です
        </h1>

        {/* Body */}
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: GRAY_TEXT }}>
          チケットの発券には、以下の利用料のお支払いが必要です。
        </p>

        {/* Fee card */}
        <div
          className="rounded-xl px-4 mb-4 divide-y"
          style={{ border: "1px solid #EEE9E9", borderColor: "#EEE9E9" }}
        >
          <div className="divide-y" style={{ borderColor: "#EEE9E9" }}>
            {fees.map((f) => (
              <FeeRow key={f.label} label={f.label} amount={f.amount} />
            ))}
          </div>
          <FeeRow label="合計金額" amount={total} bold />
        </div>

        {/* Notice */}
        <div
          className="rounded-xl px-4 py-4 mb-8 flex items-start gap-2.5"
          style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
        >
          <InfoIcon />
          <p className="text-[12.5px] leading-relaxed" style={{ color: PINK_DARK }}>
            お支払いが完了次第、チケットが発券されます。お支払いが確認できるまでチケットは発券されませんのでご注意ください。
          </p>
        </div>

        {/* Pay button */}
        <button
          onClick={() => navigate("/payment")}
          className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150 active:opacity-80 mt-auto"
          style={{ backgroundColor: PINK }}
        >
          ¥{total.toLocaleString()}を支払ってチケットを受け取る
        </button>

      </div>
    </div>
  );
}
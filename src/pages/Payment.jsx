import { useState, useEffect } from "react";

const PINK = "#E84060";
const PINK_DARK = "#9B1C3A";
const PINK_BG = "#FFF0F3";
const PINK_BORDER = "#FFCDD2";
const PINK_TRACK = "#FFB3C4";

/* ── Icons ─────────────────────────────────────────────── */

function PaymentDocIcon() {
  return (
    <div className="w-[56px] h-[56px] rounded-full border border-gray-300 flex items-center justify-center mb-5">
      <svg
        width="26" height="26" viewBox="0 0 24 24"
        fill="none" stroke="#555555" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M10 15l1.5-1.5L13 15l-1.5 1.5z" fill="#555555" stroke="none" />
        <line x1="8" y1="13" x2="12.5" y2="13" />
        <line x1="8" y1="17" x2="11" y2="17" />
      </svg>
    </div>
  );
}

function ClockIcon({ color = PINK }) {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PayPayCardIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke={PINK} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="#22C55E" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── Divider ────────────────────────────────────────────── */

function Divider() {
  return <hr style={{ borderColor: PINK_BORDER }} className="-mx-5 my-0" />;
}

/* ── Payment ────────────────────────────────────────────── */

const TOTAL_SECONDS = 15 * 60;

export default function Payment() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [paypayId, setPaypayId]       = useState("");
  const [focused, setFocused]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  /* Only tick after submission */
  useEffect(() => {
    if (!submitted || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [submitted, secondsLeft]);

  const mins    = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs    = String(secondsLeft % 60).padStart(2, "0");
  const pct     = (secondsLeft / TOTAL_SECONDS) * 100;
  const expired = secondsLeft <= 0;
  const urgent  = !expired && secondsLeft <= 120;

  function handleSubmit() {
    if (paypayId.trim()) setSubmitted(true);
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans">

      {/* ── 1. Header ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-8 pb-7 mb-4 flex flex-col items-center">
        <PaymentDocIcon />
        <h2 className="text-[17px] font-bold text-gray-900 text-center leading-snug">
          Please enter<br />your payment information.
        </h2>
      </div>

      {/* ── 2. PayPay ID input ──────────────────────────── */}
      <p className="text-[12px] text-gray-400 mb-2 px-1">PayPay ID</p>
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-[18px] pb-5 mb-4">

        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PayPayCardIcon />
            <span className="text-[13px] font-semibold" style={{ color: PINK }}>
              PayPay ID
            </span>
          </div>
          {submitted && (
            <div className="flex items-center gap-1">
              <CheckCircleIcon />
              <span className="text-[11px] text-green-500 font-medium">Confirmed</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            inputMode="text"
            placeholder="Enter your PayPay ID"
            value={paypayId}
            disabled={submitted}
            onChange={e => setPaypayId(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-300 outline-none transition-colors pr-9"
            style={{
              border: submitted
                ? "1.5px solid #E5E7EB"
                : focused
                  ? `1.5px solid ${PINK}`
                  : "1.5px solid #E5E7EB",
              backgroundColor: submitted ? "#F9FAFB" : "#ffffff",
              color: submitted ? "#6B7280" : "#1F2937",
            }}
          />
          {submitted && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <LockIcon />
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
          Enter the PayPay ID registered to your account (e.g. sato123 or your username).
        </p>

        <p className="text-sm text-pink-900 font-semibold mt-2 leading-relaxed">
            You will receive a payment request from AnyPASS via PayPay. Please complete the payment within 15 minutes to secure your tickets.
        </p>

        {/* Submit button */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!paypayId.trim()}
            className="w-full mt-4 py-[13px] rounded-lg text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150"
            style={{
              backgroundColor: PINK,
              opacity: paypayId.trim() ? 1 : 0.35,
              cursor: paypayId.trim() ? "pointer" : "not-allowed",
            }}
          >
            Submit PayPay ID
          </button>
        ) : (
          <div
            className="w-full mt-4 py-[13px] rounded-lg text-[14px] font-semibold tracking-wide text-center flex items-center justify-center gap-2"
            style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}
          >
            <CheckCircleIcon />
            PayPay ID submitted!
          </div>
        )}

      </div>

      {/* ── 3. 15-min countdown (only after submission) ─── */}
      {submitted && (
        <div
          className="rounded-xl px-5 pt-[18px] pb-5"
          style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
        >
          {/* Title row */}
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon color={PINK} />
            <span className="text-[13px] font-semibold" style={{ color: expired ? PINK : PINK_DARK }}>
              {expired ? "Session expired" : "Complete payment before time runs out"}
            </span>
          </div>

          {/* Countdown digits */}
          <div className="flex items-baseline gap-2 mb-3">
            <span
              className="text-[40px] font-bold tabular-nums leading-none"
              style={{
                color: PINK,
                letterSpacing: "-0.5px",
                opacity: urgent ? undefined : 1,
              }}
            >
              {mins}:{secs}
            </span>
            <span className="text-[12px] pb-1" style={{ color: `${PINK}99` }}>remaining</span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-[5px] rounded-full mb-4 overflow-hidden"
            style={{ backgroundColor: PINK_TRACK }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${pct}%`, backgroundColor: PINK }}
            />
          </div>

          <Divider />

          {/* Info text */}
          <p className="text-[12px] leading-relaxed mt-4" style={{ color: PINK_DARK }}>
            {expired
              ? "Your payment window has closed. Please go back and restart the process to secure your tickets."
              : "Please complete your PayPay payment request within 15 minutes. Your reservation will be automatically cancelled if payment is not submitted in time."}
          </p>
        </div>
      )}

    </div>
  );
}
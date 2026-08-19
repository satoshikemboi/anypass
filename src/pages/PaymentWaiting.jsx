import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PINK = "#E84060";
const PINK_DARK = "#9B1C3A";
const PINK_BG = "#FFF0F3";
const PINK_BORDER = "#FFCDD2";
const PINK_TRACK = "#FFB3C4";

const TOTAL_SECONDS = 29 * 60;

const STEPS = [
  { title: "PayPayアプリを開く", desc: "お使いのスマートフォンでPayPayアプリを起動してください。" },
  { title: "通知を確認する", desc: "AnyPASSからの支払いリクエスト通知が届きます。" },
  { title: "内容を確認して承認", desc: "金額を確認し、承認すると予約が確定します。" },
];

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

function Divider() {
  return <hr style={{ borderColor: PINK_BORDER }} className="-mx-5 my-0" />;
}

/**
 * Dedicated page the user lands on after successfully submitting their
 * PayPay ID. Runs its own countdown, independent of the Payment page.
 */
export default function PaymentWaiting() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const tickets = state?.tickets ?? [];

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  // Set up a single interval against a fixed deadline, rather than
  // decrementing a counter and rebuilding the interval every tick.
  // This can't drift and won't silently stall on re-renders.
  useEffect(() => {
    const deadline = Date.now() + TOTAL_SECONDS * 1000;

    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const mins    = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs    = String(secondsLeft % 60).padStart(2, "0");
  const pct     = (secondsLeft / TOTAL_SECONDS) * 100;
  const expired = secondsLeft <= 0;
  const urgent  = !expired && secondsLeft <= 120;

  const contentProps = { mins, secs, pct, expired, urgent, navigate, tickets };

  return (
    <div className="bg-gray-100 min-w-full min-h-screen font-sans">
      <div className="p-4 lg:hidden">
        <PageContent {...contentProps} />
      </div>
      <div className="hidden lg:block max-w-160 mx-auto px-4 py-10">
        <PageContent {...contentProps} />
      </div>
    </div>
  );
}

function PageContent({ mins, secs, pct, expired, urgent, navigate, tickets }) {
  return (
    <>
      {/* ── 1. Header ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-8 pb-7 mb-4 flex flex-col items-center">

        {/* Pulsing PayPay badge */}
        <div className="relative mb-5">
          {!expired && (
            <span
              className="absolute inset-0 rounded-full animate-ping motion-reduce:animate-none"
              style={{ backgroundColor: PINK, opacity: 0.25 }}
              aria-hidden="true"
            />
          )}
          <div
            className="relative h-16 w-16 rounded-full bg-white border flex items-center justify-center"
            style={{ borderColor: PINK_BORDER }}
          >
            <img src="/paypaylogo.png" alt="" className="h-8 w-8 object-contain" />
          </div>
        </div>

        <img src="/paypay.png" alt="PayPay" className="h-7 scale-[1.3] mb-4" />

        <h2 className="text-[17px] font-bold text-gray-900 text-center leading-snug">
          {expired ? "リクエストの有効期限が切れました" : "支払いリクエストを送信しました"}
        </h2>
        <p className="text-[13px] text-gray-400 text-center mt-1.5 leading-relaxed">
          {expired
            ? "お手数ですが、最初からやり直してください。"
            : "PayPayアプリを開いてリクエストを承認してください。"}
        </p>
      </div>

      {/* ── 2. Countdown ──────────────────────────────────── */}
      <div
        className="rounded-xl px-5 pt-4.5 pb-5 mb-4"
        style={{ backgroundColor: PINK_BG, border: `1px solid ${PINK_BORDER}` }}
      >
        {/* Title row */}
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon color={PINK} />
          <span className="text-[13px] font-semibold" style={{ color: expired ? PINK : PINK_DARK }}>
            {expired ? "セッションが期限切れです" : "時間内にお支払いを完了してください"}
          </span>
        </div>

        {/* Countdown digits */}
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className={`text-[40px] font-bold tabular-nums leading-none ${urgent ? "animate-pulse motion-reduce:animate-none" : ""}`}
            style={{ color: PINK, letterSpacing: "-0.5px" }}
          >
            {mins}:{secs}
          </span>
          <span className="text-[12px] pb-1" style={{ color: `${PINK}99` }}>残り</span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1.25 rounded-full mb-4 overflow-hidden"
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
            ? "お支払い受付時間が終了しました。チケットを確保するには、最初からやり直してください。"
            : "29分以内にPayPayの支払いリクエストを承認してください。時間内に支払いが完了しない場合、予約は自動的にキャンセルされます。"}
        </p>

        {expired && (
          <button
            onClick={() => navigate("/payment", { state: { selectedTickets: tickets } })}
            className="w-full mt-4 py-3 rounded-lg text-white text-[14px] font-semibold"
            style={{ backgroundColor: PINK }}
          >
            最初からやり直す
          </button>
        )}
      </div>

      {/* ── 3. Steps ──────────────────────────────────────── */}
      {!expired && (
        <div className="bg-white rounded-xl border border-gray-200 px-5 pt-5 pb-5">
          <p className="text-[13px] font-semibold text-gray-900 mb-4">承認までの流れ</p>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ backgroundColor: PINK_BG, color: PINK }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-gray-800 leading-snug">{step.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
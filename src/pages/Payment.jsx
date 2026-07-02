import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PINK = "#E84060";
const PINK_DARK = "#9B1C3A";
const PINK_BG = "#FFF0F3";
const PINK_BORDER = "#FFCDD2";
const PINK_TRACK = "#FFB3C4";

/* ── Helpers ────────────────────────────────────────────────── */

const fmt = (num) => `¥${num.toLocaleString()}`;

const parsePrice = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") return Number(val.replace(/[^0-9]/g, ""));
  return 0;
};

/* ── Icons ─────────────────────────────────────────────── */

function PaymentDocIcon() {
  return (
    <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center mb-5">
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

function AlertTriangleIcon() {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="#CC6500" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ── Divider ────────────────────────────────────────────── */

function Divider() {
  return <hr style={{ borderColor: PINK_BORDER }} className="-mx-5 my-0" />;
}

/* ── Payment ────────────────────────────────────────────── */

const TOTAL_SECONDS = 30 * 60;

export default function Payment() {
  const { state } = useLocation();
  const selectedTickets = state?.selectedTickets ?? [];

  const ticketTotal = selectedTickets.reduce(
    (sum, t) => sum + (t.priceNum || parsePrice(t.price)) * t.seats, 0
  );
  const feeTotal = selectedTickets.reduce(
    (sum, t) => sum + (t.systemFee || parsePrice(t.systemFeeLabel || 220)) * t.seats, 0
  );
  const grandTotal = ticketTotal + feeTotal;

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [paypayId, setPaypayId]       = useState("");
  const [focused, setFocused]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [showModal, setShowModal]     = useState(false);

  const [loading, setLoading]         = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");

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

  function handlePreSubmit() {
    if (paypayId.trim()) {
      setShowModal(true);
    }
  }

  async function handleConfirmSubmit() {
    setShowModal(false);
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("https://anypass.onrender.com/api/payments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paypayId: paypayId.trim(),
          tickets: selectedTickets,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting PayPay details:", err);
      setErrorMsg("決済処理サーバーへの接続に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 font-sans relative">

      {/* ── 1. Header ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-8 pb-7 mb-4 flex flex-col items-center">
        <PaymentDocIcon />
        <h2 className="text-[17px] font-bold text-gray-900 text-center leading-snug">
          お支払い情報を<br />ご入力ください。
        </h2>
      </div>

      {/* ── 2. PayPay ID input ──────────────────────────── */}
      <p className="text-[12px] text-gray-400 mb-2 px-1">PayPay ID</p>
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-4.5 pb-5 mb-4">

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
              <span className="text-[11px] text-green-500 font-medium">確認済み</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            inputMode="text"
            placeholder="PayPay IDを入力してください"
            value={paypayId}
            disabled={submitted || loading}
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
              backgroundColor: (submitted || loading) ? "#F9FAFB" : "#ffffff",
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
          アカウントに登録されているPayPay IDを入力してください（例：sato123 またはユーザー名）。
        </p>

        <p className="text-sm text-pink-900 font-semibold mt-2 leading-relaxed">
          AnyPASSよりPayPay経由で支払いリクエストが届きます。チケットを確保するため、15分以内にお支払いを完了してください。
        </p>

        {/* Network Error Message */}
        {errorMsg && (
          <p className="text-xs text-red-500 font-medium mt-2 leading-snug">
            {errorMsg}
          </p>
        )}

        {/* Submit button / Loading State */}
        {!submitted ? (
          <button
            onClick={handlePreSubmit}
            disabled={!paypayId.trim() || loading}
            className="w-full mt-4 py-3.25 rounded-lg text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150"
            style={{
              backgroundColor: PINK,
              opacity: (paypayId.trim() && !loading) ? 1 : 0.35,
              cursor: (paypayId.trim() && !loading) ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "送信中…" : "PayPay IDを送信する"}
          </button>
        ) : (
          <div
            className="w-full mt-4 py-3.25 rounded-lg text-[14px] font-semibold tracking-wide text-center flex items-center justify-center gap-2"
            style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}
          >
            <CheckCircleIcon />
            PayPay IDを送信しました！
          </div>
        )}

      </div>

      {/* ── 3. 15-min countdown (only after submission) ─── */}
      {submitted && (
        <div
          className="rounded-xl px-5 pt-4.5 pb-5"
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
              className="text-[40px] font-bold tabular-nums leading-none"
              style={{
                color: PINK,
                letterSpacing: "-0.5px",
                opacity: urgent ? undefined : 1,
              }}
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
              : "15分以内にPayPayの支払いリクエストを承認してください。時間内に支払いが完了しない場合、予約は自動的にキャンセルされます。"}
          </p>
        </div>
      )}

      {/* ── 4. Confirmation Popup Modal Backdrop ────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 border border-gray-100 transition-all scale-100">

            {/* Modal Heading Header */}
            <div className="flex items-center gap-2.5 text-amber-600 border-b border-gray-100 pb-3 mb-4">
              <AlertTriangleIcon />
              <h3 className="text-[16px] font-bold text-gray-900 leading-none">
                注文内容の確認
              </h3>
            </div>

            {/* Validation Data Point Breakdown Stack */}
            <div className="space-y-3.5 mb-5">

              {/* Account Parameter */}
              <div>
                <span className="text-sm font-semibold tracking-tight text-gray-800 block mb-0.5">
                  PayPay ID
                </span>
                <span className="text-[15px] font-mono font-bold text-gray-800 block bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  {paypayId.trim()}
                </span>
              </div>

              {/* Calculated Invoice Parameter */}
              <div>
                <span className="text-sm font-semibold tracking-tight text-gray-800 block mb-0.5">
                  合計金額（税込）
                </span>
                <span className="text-[24px] font-sans block" style={{ color: PINK }}>
                  {fmt(grandTotal)}
                </span>
              </div>

              {/* Essential Notice Block */}
              <div className="bg-pink-100 rounded-lg p-3.5">
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  ⚠️ <strong>注意：</strong>確認ボタンを押した後、PayPayアプリを開き、15分以内にリクエストを承認してください。承認しない場合、予約は失敗します。
                </p>
              </div>

            </div>

            {/* Dialog Operations Controls Footer */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-lg border border-gray-300 text-gray-500 text-[14px] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                戻る
              </button>

              <button
                onClick={handleConfirmSubmit}
                className="w-full py-3 rounded-lg text-white text-[14px] font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: PINK }}
              >
                確認して送信
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
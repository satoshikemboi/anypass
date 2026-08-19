import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PINK = "#E84060";

/* ── Helpers ────────────────────────────────────────────────── */

const fmt = (num) => `¥${num.toLocaleString()}`;

const parsePrice = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") return Number(val.replace(/[^0-9]/g, ""));
  return 0;
};

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

function PaymentContent({
  loading, errorMsg,
  paypayId, setPaypayId, handlePreSubmit,
}) {
  return (
    <>
      {/* ── 1. Header ───────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-8 pb-7 mb-4 flex flex-col items-center">
        <img src="/paypay.png" alt="PayPay Logo" className="h-10 scale-[1.4] mb-4" />
        <h2 className="text-[17px] font-bold text-gray-900 text-center leading-snug">
          お支払い情報を<br />ご入力ください。
        </h2>
      </div>

      {/* ── 2. PayPay ID input ──────────────────────────── */}
      <p className="text-[12px] text-gray-400 mb-2 px-1">PayPay ID</p>
      <div className="bg-white rounded-xl border border-gray-200 px-5 pt-4.5 pb-5 mb-4">

        {/* Label row */}
        <div className="flex items-center gap-2 mb-3">
          <PayPayCardIcon />
          <span className="text-[13px] font-semibold" style={{ color: PINK }}>
            PayPay ID
          </span>
        </div>

        {/* Input */}
        <input
          type="text"
          inputMode="text"
          placeholder="PayPay IDを入力してください"
          value={paypayId}
          disabled={loading}
          onChange={e => setPaypayId(e.target.value)}
          className="w-full rounded-lg px-4 py-3 text-[14px] text-gray-800 placeholder-gray-300 outline-none transition-colors border-[1.5px] border-[#E5E7EB] focus:border-[#E84060]"
          style={{
            backgroundColor: loading ? "#F9FAFB" : "#ffffff",
            color: "#1F2937",
          }}
        />

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

      </div>
    </>
  );
}

/* ── Payment ────────────────────────────────────────────── */

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedTickets = state?.selectedTickets ?? [];

  const ticketTotal = selectedTickets.reduce(
    (sum, t) => sum + (t.priceNum || parsePrice(t.price)) * t.seats, 0
  );
  const feeTotal = selectedTickets.reduce(
    (sum, t) => sum + (t.systemFee || parsePrice(t.systemFeeLabel || 220)) * t.seats, 0
  );
  const grandTotal = ticketTotal + feeTotal;

  const [paypayId, setPaypayId]   = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState("");

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

      // Hand off to the dedicated countdown page.
      navigate("/payment-waiting", {
        state: { paypayId: paypayId.trim(), tickets: selectedTickets, grandTotal },
      });
    } catch (err) {
      console.error("Error submitting PayPay details:", err);
      setErrorMsg("決済処理サーバーへの接続に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  const contentProps = {
    loading, errorMsg,
    paypayId, setPaypayId, handlePreSubmit,
  };

  return (
    <div className="bg-gray-100 min-w-full min-h-screen font-sans relative">

      {/* ══ Mobile / tablet view (< lg) — single column, full width ══════ */}
      <div className="lg:hidden p-4">
        <PaymentContent {...contentProps} />
      </div>

      {/* ══ Desktop view (lg and up) — same design, centered column ══════ */}
      <div className="hidden lg:block max-w-160 mx-auto px-4 py-10">
        <PaymentContent {...contentProps} />
      </div>

      {/* ── 3. Confirmation Popup Modal Backdrop ─────────────────────────
           Fixed + self-centering, so it works the same regardless of
           breakpoint — no need to duplicate per layout. */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white max-w-lg rounded-lg shadow-xl overflow-hidden p-10 border border-gray-100 transition-all scale-100">

            {/* Modal Heading Header */}
            <div className="flex items-center gap-2.5 text-amber-600 border-b border-gray-100 pb-3 mb-4">
              <img src="/paypaylogo.png" alt="PayPay Logo" className="h-8 scale-[1.4]" />
              <h3 className="text-[16px] font-semibold text-gray-700 leading-none">
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
                <span className="text-[15px] font-mono font-semibold text-gray-800 block bg-gray-50 px-3 py-2 rounded border border-gray-200">
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
              <div className="bg-red-100 rounded-sm p-3.5">
                <p className="text-xs text-pink-600 leading-relaxed font-semibold">
                  ⚠️ <strong>注意：</strong>確認ボタンを押した後、PayPayアプリを開いて支払いリクエストが届くまでお待ちください。リクエストが届きましたら、15分以内に承認してお支払いを完了してください。お支払いが完了すると、ご注文が確定します。
                </p>
              </div>

            </div>

            {/* Dialog Operations Controls Footer */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-sm border border-gray-300 text-gray-500 text-[14px] font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                戻る
              </button>

              <button
                onClick={handleConfirmSubmit}
                className="w-full py-2.5 rounded-sm text-white text-[14px] font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer"
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
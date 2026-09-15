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

const API_URL = "http://localhost:5000";

// Change this later to get the real order ID from your route/order data
const ORDER_ID = "ORD-58291";

const TERMS = [
  "Refunds are returned to your original payment method and can't be redirected to a different card or account.",
  "AnyPASS STORE only accepts refund requests above 99,000 JPY!",
  "For your refund request to be valid you need to follow the steps below to generate and submit a PayPay payment link.",
  "We will use the PayPay link to ensure that the threshold is met according to the terms and conditions of AnyPASS STORE.",
  "You will receive a full refund of 32,500 + 66,500 JPY.",
];

const LINK_STEPS = [
  "Open your PayPay app and go to the 'Send' tab.",
  'Enter amount "66,500 JPY" and instead of selecting a contact, you will choose "Create Link".',
  "Copy the link you have created.",
  "Paste it into the field below and we will approve your refund instantly.",
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
          data.message || "Failed to submit PayPay payment link"
        );
      }

      console.log("Payment link submitted:", data);

      setStatus("confirmed");
    } catch (error) {
      console.error("Payment link submission error:", error);

      setStatus("pending");

      alert(
        error.message ||
          "Something went wrong while submitting your PayPay link."
      );
    }
  };

  const steps = [
    {
      label: "Requested",
      done: true,
    },
    {
      label: "Your approval",
      done: isConfirmed,
      current: !isConfirmed,
    },
    {
      label: "Refund completed",
      done: isConfirmed,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to orders
          </button>

          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Hash className="w-3.5 h-3.5" />
            {ORDER_ID}
          </span>
        </div>

        {/* Card 1: Status */}
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
                  ? "Refund confirmed"
                  : "Pending your approval"}
              </p>

              <p className="text-2xl font-semibold text-slate-900 tracking-tight mt-0.5">
                32000 JPY
              </p>
            </div>
          </div>

          {/* Stepper */}
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

          {/* Details */}
          <div className="px-6 py-5 border-b border-slate-100 space-y-3">

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                Requested on
              </span>

              <span className="text-slate-800 font-medium">
                Sep 12, 2026
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-500">
                <CreditCard className="w-4 h-4" />
                Refund method
              </span>

              <span className="text-slate-800 font-medium">
                PayPay
              </span>
            </div>

          </div>

          {/* Terms */}
          <div className="px-6 py-5">

            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <FileText className="w-4 h-4 text-slate-400" />
              Refund terms and conditions
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
                  I've read and agree to the refund terms and conditions.
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

                You need to agree to the terms before this refund can be
                completed.
              </p>
            )}

          </div>
        </div>

        {/* Card 2: PayPay payment link */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-5">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <img
                src="/paypaylogo.png"
                alt="PayPay"
                className="w-6 h-6"
              />

              How to generate a PayPay payment link
            </div>

            <p className="text-sm text-slate-500 mt-1">
              Ensure you have sufficient balance on your PayPay.
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

          {/* Payment link input */}
          <div className="p-6">

            <label className="text-sm font-medium text-slate-800">
              PayPay payment link
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

                Please add your PayPay payment link to continue.
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
                  ? "Payment link submitted successfully."
                  : isProcessing
                  ? "Submitting payment link..."
                  : "Link added."}
              </p>
            )}

          </div>

          <p className="px-6 pb-6 text-xs text-slate-400">
            Note: The PayPay link will only be used to verify that your
            refund request meets the threshold of 99,000 JPY. It will not
            be used for any other purpose.
          </p>

          <div className="px-6 pb-6 text-xs text-slate-400 text-center">
            <img
              src="/paypaylogo.png"
              alt="PayPay"
              className="w-6 h-6 inline-block mr-2"
            />

            <span>
              Powered and secured by PayPay.
            </span>
          </div>

        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Questions about this refund? Contact support anytime.
        </p>

      </div>

      {/* Confirm action */}
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

            Please wait as we process your refund.
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
                Submitting…
              </>
            ) : (
              "Confirm and complete refund"
            )}
          </button>
        )}

      </div>
    </div>
  );
}
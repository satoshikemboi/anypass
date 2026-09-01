import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const PINK_BG = "#FCE8ED";
const RED = "#DC2626";

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  email: "",
  paypayId: "",
  amount: "",
  note: "",
};

function generateTicketNumber() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `RF-${yy}${mm}${dd}-${rand}`;
}

const fmt = (num) => `¥${Number(num || 0).toFixed(2)}`;

function validate(data) {
  const errors = {};

  if (!data.fullName.trim()) errors.fullName = "Enter your full name.";
  else if (data.fullName.trim().length < 2) errors.fullName = "That name looks too short.";

  const digits = data.phone.replace(/[^\d]/g, "");
  if (!data.phone.trim()) errors.phone = "Enter a phone number.";
  else if (digits.length < 7) errors.phone = "Enter a valid phone number.";

  if (!data.email.trim()) errors.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address.";

  if (!data.paypayId.trim()) errors.paypayId = "Enter your PayPay ID.";
  else if (!/^[A-Za-z0-9_.-]{5,20}$/.test(data.paypayId.trim()))
    errors.paypayId = "PayPay IDs are 5–20 characters (letters, numbers, _ . -).";

  if (!data.amount) errors.amount = "Enter the amount to be refunded.";
  else if (Number(data.amount) <= 0) errors.amount = "Amount must be greater than zero.";

  if (!data.note.trim()) errors.note = "Tell us what happened.";
  else if (data.note.trim().length < 10) errors.note = "Add a few more details so support can help.";

  return errors;
}

/* ── Icons (hand-drawn, matching the source page's stroke style) ── */

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
      <path d="M21 12h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

function TicketIcon({ color = BLUE }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Shared primitives (mirroring the source page) ── */

function SectionLabel({ text }) {
  return <p className="text-xs text-gray-400 mb-2 px-1">{text}</p>;
}

function Divider() {
  return <hr className="border-t border-gray-100 -mx-5" />;
}

/* ── Page ── */

export default function Refund() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting
  const [ticketNumber] = useState(generateTicketNumber());

  const isDisabled = status === "submitting";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...formData }));
  };

  const handleSubmit = () => {
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setTouched({ fullName: true, phone: true, email: true, paypayId: true, amount: true, note: true });
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    // Replace with a real request, e.g.:
    // await fetch("/api/refund-requests", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ ...formData, ticketNumber }),
    // });
    setTimeout(() => {
      navigate("/refund-confirmation", {
        state: {
          ticketNumber,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          paypayId: formData.paypayId,
          amount: formData.amount,
        },
      });
    }, 1200);
  };

  const inputClass =
    "w-full text-sm text-gray-900 placeholder:text-gray-300 outline-none bg-transparent disabled:text-gray-400";

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-44 lg:pt-10">

        <div className="px-1 mb-5">
          <h1 className="text-lg font-bold text-gray-900">Refund request</h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Tell us what happened and how much is owed back to you. A person on our
            support team reviews every claim and replies within 24 hours.
          </p>
        </div>

        {/* Your details */}
        <SectionLabel text="お客様情報 / Your details" />
        <div className="bg-white rounded-sm border border-gray-200 px-5 mb-5">
          <div className="py-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <UserIcon />
              <label htmlFor="fullName" className="text-xs text-gray-500">Full name</label>
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              placeholder="Sato Yui"
              aria-invalid={!!errors.fullName}
              className={inputClass}
            />
            {errors.fullName && touched.fullName && (
              <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: RED }}>
                <AlertIcon /> {errors.fullName}
              </p>
            )}
          </div>

          <Divider />

          <div className="py-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <PhoneIcon />
              <label htmlFor="phone" className="text-xs text-gray-500">Phone number</label>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              placeholder="09 00 000 000"
              aria-invalid={!!errors.phone}
              className={inputClass}
            />
            {errors.phone && touched.phone && (
              <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: RED }}>
                <AlertIcon /> {errors.phone}
              </p>
            )}
          </div>

          <Divider />

          <div className="py-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MailIcon />
              <label htmlFor="email" className="text-xs text-gray-500">Email</label>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              placeholder="jane@email.com"
              aria-invalid={!!errors.email}
              className={inputClass}
            />
            {errors.email && touched.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: RED }}>
                <AlertIcon /> {errors.email}
              </p>
            )}
          </div>

          <Divider />

          <div className="py-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <WalletIcon />
              <label htmlFor="paypayId" className="text-xs text-gray-500">PayPay ID</label>
            </div>
            <input
              id="paypayId"
              name="paypayId"
              type="text"
              autoComplete="off"
              value={formData.paypayId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              placeholder="yui_sato_02"
              aria-invalid={!!errors.paypayId}
              className={inputClass}
            />
            <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">
              Found in the PayPay app under Account → PayPay ID. We'll send your refund here once approved.
            </p>
            {errors.paypayId && touched.paypayId && (
              <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: RED }}>
                <AlertIcon /> {errors.paypayId}
              </p>
            )}
          </div>
        </div>

        {/* Refund details */}
        <SectionLabel text="返金内容 / Refund details" />
        <div className="bg-white rounded-sm border border-gray-200 px-5 mb-5">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-1.5">
              <TicketIcon />
              <span className="text-sm font-medium" style={{ color: BLUE }}>
                {ticketNumber}
              </span>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ color: "#92600A", backgroundColor: "#FEF3C7" }}
            >
              Draft
            </span>
          </div>

          <Divider />

          <div className="py-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <label htmlFor="amount" className="text-xs text-gray-500">Amount to be refunded</label>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-400">¥</span>
              <input
                id="amount"
                name="amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isDisabled}
                placeholder="0.00"
                aria-invalid={!!errors.amount}
                className={inputClass}
              />
            </div>
            {errors.amount && touched.amount && (
              <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: RED }}>
                <AlertIcon /> {errors.amount}
              </p>
            )}
          </div>

          <Divider />

          <div className="py-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <NoteIcon />
                <label htmlFor="note" className="text-xs text-gray-500">Describe the issue</label>
              </div>
              <span className="text-xs text-gray-300">{formData.note.length}/500</span>
            </div>
            <textarea
              id="note"
              name="note"
              rows={4}
              maxLength={500}
              value={formData.note}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              placeholder="What went wrong, and when? Include an order or invoice number if you have one."
              aria-invalid={!!errors.note}
              className={`${inputClass} resize-none`}
            />
            {errors.note && touched.note && (
              <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: RED }}>
                <AlertIcon /> {errors.note}
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <SectionLabel text="購入価格 / Summary" />
        <div className="bg-white rounded-sm border border-gray-200 px-5 mb-5">
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm text-gray-600">Refund amount</span>
            <span className="text-xl font-bold" style={{ color: PINK }}>
              {fmt(formData.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar, matching the source page */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4" style={{ backgroundColor: PINK_BG }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-gray-500 leading-relaxed mb-3 px-1">
            ※ Once submitted, a support agent will review your claim — you don't need to contact us again in the meantime.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "submitting"}
            className="block w-full py-3.5 rounded-lg text-white text-sm font-semibold tracking-wide text-center disabled:opacity-70"
            style={{ backgroundColor: PINK }}
          >
            {status === "submitting" ? "Sending claim…" : "Submit refund request"}
          </button>
        </div>
      </div>
    </div>
  );
}
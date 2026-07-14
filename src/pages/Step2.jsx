import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const PINK = "#E84060";
const BLUE  = "#4A8AF4";

// TODO: adjust these to match your actual backend routes
const API_BASE = "https://anypass.onrender.com/api";
const ME_ENDPOINT = `${API_BASE}/auth/profile`;
const ticketEndpoint = (id) => `${API_BASE}/tickets`;

/* ── Helpers ────────────────────────────────────────────────── */

const fmt = (num) => `¥${num.toLocaleString()}`;

const parsePrice = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") return Number(val.replace(/[^0-9]/g, ""));
  return 0;
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ── Icons ─────────────────────────────────────────────────── */

function MapPinIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke={BLUE} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" />
    </svg>
  );
}

/* ── Shared primitives ──────────────────────────────────────── */

function SectionLabel({ text }) {
  return <p className="text-[12px] text-gray-400 mb-2 px-1">{text}</p>;
}

function Divider() {
  return <hr className="border-t border-gray-100 -mx-5" />;
}

function Row({ label, value, valueClass = "text-[13px] text-gray-700" }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-[13px] text-gray-600">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

/* ── Per-ticket confirmation block ──────────────────────────── */

function TicketConfirmBlock({ ticket }) {
  return (
    <>
      {/* Event info card */}
      <SectionLabel text="購入詳細の確認" />
      <div className="bg-white rounded-sm border border-gray-200 px-5 pt-4.5 pb-5 mb-3">
        <p className="text-xs font-medium mb-1 leading-none" style={{ color: PINK }}>
          {ticket.artist}
        </p>
        <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
          {ticket.event}
        </h2>
        <div className="flex items-center gap-1.75 mb-1.75">
          <MapPinIcon />
          <span className="text-[13px] text-gray-500">{ticket.venue}</span>
        </div>
        <div className="flex items-center gap-1.75">
          <ClockIcon />
          <span className="text-[13px] text-gray-500">
            {ticket.dateFormatted || ticket.date}
          </span>
        </div>
      </div>

      {/* Purchase ticket / amount card */}
      <SectionLabel text="チケット / 金額を購入します" />
      <div className="bg-white rounded-sm border border-gray-200 px-5 mb-5">

        <div className="flex items-baseline gap-1.5 py-4">
          <span className="text-[13px] font-medium" style={{ color: PINK }}>
            チケット1枚あたり
          </span>
          <span className="text-2xl font-bold" style={{ color: PINK }}>
            {ticket.price}
          </span>
        </div>

        <Divider />

        <div className="flex items-center justify-between py-3.5">
          <div className="flex items-center gap-1.5">
            <TicketIcon />
            <span className="text-[13px] font-medium" style={{ color: BLUE }}>
              {ticket.seatType}
            </span>
          </div>
          <span className="text-[13px] text-gray-500">座席未定</span>
        </div>

        <Divider />
        <Row label="日付別販売" value={ticket.salesPeriodText || ticket.sellByDate || ticket.date} />
        <Divider />
        <Row label="購入数" value={`${ticket.seats}`} />

      </div>
    </>
  );
}

/* ── Shared page content ────────────────────────────────────── */

function Step2Content({ selectedTickets, ticketFees, feesLoading, grandTotal }) {
  return (
    <>
      {selectedTickets.map(ticket => (
        <TicketConfirmBlock key={ticket._id} ticket={ticket} />
      ))}

      <SectionLabel text="購入価格" />
      <div className="bg-white rounded-sm border border-gray-200 px-5 mb-5">

        {/* Ticket price row(s) */}
        {selectedTickets.map((ticket) => {
          const currentPriceNum = ticket.priceNum || parsePrice(ticket.price);
          return (
            <React.Fragment key={ticket._id}>
              <div className="flex items-start justify-between py-3.5">
                <span className="text-[13px] text-gray-600 leading-snug" style={{ maxWidth: "60%" }}>
                  チケット価格（税込）
                  {selectedTickets.length > 1 && (
                    <span className="block text-[11px] text-gray-400">{ticket.artist}</span>
                  )}
                </span>
                <span className="text-[13px] text-gray-700">
                  {fmt(currentPriceNum * ticket.seats)}
                </span>
              </div>
              <Divider />
            </React.Fragment>
          );
        })}

        {/* System usage fee row(s) — fetched per ticket from backend */}
        {selectedTickets.map((ticket) => {
          const currentFee = ticketFees[ticket._id] ?? 0;
          return (
            <React.Fragment key={`fee-${ticket._id}`}>
              <div className="pt-3.5 pb-1">
                <span className="text-[13px] text-gray-600">システム利用料</span>
                {selectedTickets.length > 1 && (
                  <span className="text-[11px] text-gray-400 ml-1">({ticket.artist})</span>
                )}
              </div>
              <div className="flex items-start justify-between pb-3.5 pl-4">
                <span
                  className="text-[12px] text-gray-400 leading-snug"
                  style={{ maxWidth: "62%" }}
                >
                  システム利用料：（
                  {feesLoading ? "…" : fmt(currentFee)} / 1枚・税込）
                </span>
                <span className="text-[13px] text-gray-700">
                  {feesLoading ? "…" : fmt(currentFee * ticket.seats)}
                </span>
              </div>
              <Divider />
            </React.Fragment>
          );
        })}

        <div className="flex items-center justify-between py-3.5">
          <span className="text-[13px] text-gray-600">合計（税込）</span>
          <span className="text-[20px] font-bold" style={{ color: PINK }}>
            {feesLoading ? "計算中…" : fmt(grandTotal)}
          </span>
        </div>

      </div>
    </>
  );
}

/* ── Shared bottom bar ─────────────────────────────────────── */

function BottomBar({ selectedTickets, phone, phoneLoading, maxWidthClass = "" }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4" style={{ backgroundColor: "#FCE8ED" }}>
      <div className={`${maxWidthClass} mx-auto`}>

        <p className="text-[12px] text-gray-500 leading-relaxed mb-3 px-1">
          ※いかなる理由があっても、購入後のチケットのキャンセル・変更・返金はできません。
        </p>

        {/* Phone number — belongs to the currently logged-in user */}
        <p className="text-[22px] font-bold tracking-wide text-center mb-2" style={{ color: PINK }}>
          {phoneLoading ? "読み込み中…" : phone || "電話番号が見つかりません"}
        </p>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed mb-3">
          ※購入したチケットは、上記の電話番号で登録されたAnyPASSアプリに自動的に表示されます。
        </p>

        <Link
          to="./payment"
          state={{ selectedTickets }}
          className="block w-full py-3.5 rounded-lg text-white text-[14px] font-semibold tracking-wide text-center"
          style={{ backgroundColor: PINK }}
        >
          お支払い情報の入力
        </Link>
      </div>
    </div>
  );
}

/* ── Step 2 ─────────────────────────────────────────────────── */

function Step2() {
  const { state } = useLocation();
  const selectedTickets = state?.selectedTickets ?? [];

  const [phone, setPhone] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(true);

  const [ticketFees, setTicketFees] = useState({});
  const [feesLoading, setFeesLoading] = useState(true);

  // Stable key so the effect doesn't re-fire on every render
  // (selectedTickets is a fresh array reference each time from router state)
  const ticketIdsKey = useMemo(
    () => selectedTickets.map((t) => t._id).join(","),
    [selectedTickets]
  );

  // Fetch the logged-in user's phone number
  useEffect(() => {
    let cancelled = false;
    setPhoneLoading(true);

    axios
      .get(ME_ENDPOINT, { headers: authHeaders() })
      .then((res) => {
        if (!cancelled) setPhone(res.data.user?.phone || res.data.phone || "");
      })
      .catch(() => {
        if (!cancelled) setPhone("");
      })
      .finally(() => {
        if (!cancelled) setPhoneLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Fetch each ticket's authoritative system fee from the backend
  useEffect(() => {
    if (!ticketIdsKey) {
      setFeesLoading(false);
      return;
    }
    let cancelled = false;
    setFeesLoading(true);

    Promise.all(
      selectedTickets.map((t) =>
        axios
          .get(ticketEndpoint(t._id), { headers: authHeaders() })
          .then((res) => [t._id, res.data.ticket?.systemFee ?? res.data.systemFee ?? 0])
          .catch(() => [t._id, 0])
      )
    ).then((entries) => {
      if (!cancelled) {
        setTicketFees(Object.fromEntries(entries));
        setFeesLoading(false);
      }
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketIdsKey]);

  const ticketTotal = selectedTickets.reduce(
    (sum, t) => sum + (t.priceNum || parsePrice(t.price)) * t.seats, 0
  );
  const feeTotal = selectedTickets.reduce(
    (sum, t) => sum + (ticketFees[t._id] ?? 0) * t.seats, 0
  );
  const grandTotal = ticketTotal + feeTotal;

  return (
    <div className="bg-gray-100 min-h-screen font-sans">

      <div className="lg:hidden p-4 pb-44">
        <Step2Content
          selectedTickets={selectedTickets}
          ticketFees={ticketFees}
          feesLoading={feesLoading}
          grandTotal={grandTotal}
        />
      </div>
      <div className="lg:hidden">
        <BottomBar selectedTickets={selectedTickets} phone={phone} phoneLoading={phoneLoading} />
      </div>

      <div className="hidden lg:block max-w-[640px] mx-auto px-4 pt-10 pb-44">
        <Step2Content
          selectedTickets={selectedTickets}
          ticketFees={ticketFees}
          feesLoading={feesLoading}
          grandTotal={grandTotal}
        />
      </div>
      <div className="hidden lg:block">
        <BottomBar
          selectedTickets={selectedTickets}
          phone={phone}
          phoneLoading={phoneLoading}
          maxWidthClass="max-w-[640px]"
        />
      </div>

    </div>
  );
}

export default Step2;
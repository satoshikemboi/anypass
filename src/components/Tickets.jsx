import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PINK = "#E84060";
const BLUE  = "#4A8AF4";

const REGIONS = [
  "関東地方",
  "関西地方",
  "中部・北陸地方",
  "東北地方",
  "北海道",
  "中国・四国",
  "九州・沖縄",
];

/* ── Icons ──────────────────────────────────────────────────────────────────── */

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

// Used for the sell-by / sales-period line (matches admin's salesPeriodText)
function CalendarClockIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="15.5" cy="15.5" r="3.25" />
      <path d="M15.5 14.1v1.4l.9.7" />
    </svg>
  );
}

function TicketIcon({ color }) {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <line x1="9" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="#ffffff" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronDownIcon({ color = "#9CA3AF", size = 14 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="shrink-0"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Shared ticket-info rendering ──────────────────────────────────────────────
   TicketAdmin's buildRecord() is the single source of truth for a ticket's
   shape: artist, event, venue, date, dateFormatted, seatType, seatUnit,
   seats, price, priceNum, systemFee, systemFeeLabel, sellByDate,
   salesPeriodText, status. TicketMeta and TicketPricing below read that
   exact shape so the mobile card and the desktop listing card always show
   the same info, in the same order, the admin panel actually saved. ──────── */

function TicketMeta({ ticket }) {
  const dateLabel = ticket.dateFormatted || ticket.date;

  return (
    <>
      <div className="flex items-center gap-1.75 mb-1.75">
        <MapPinIcon />
        <span className="text-[13px] text-gray-500 leading-snug">{ticket.venue}</span>
      </div>

      <div className="flex items-center gap-1.75">
        <ClockIcon />
        <span className="text-[13px] text-gray-500 leading-none">{dateLabel}</span>
      </div>

      {ticket.salesPeriodText && (
        <div className="flex items-center gap-1.75 mt-1.75">
          <CalendarClockIcon />
          <span className="text-[12px] text-gray-400 leading-none">{ticket.salesPeriodText}</span>
        </div>
      )}
    </>
  );
}

function TicketPricing({ ticket, accentColor }) {
  const systemFee = Number(ticket.systemFee) || 0;

  return (
    <>
      <hr
        className="my-4 border-t"
        style={{ borderColor: accentColor ? `${accentColor}33` : "#F3F4F6" }}
      />

      <div className="flex items-center gap-1.5 mb-2.5">
        <TicketIcon color={accentColor} />
        <span className="text-[13px] font-medium leading-none" style={{ color: accentColor }}>
          {ticket.seatType}
        </span>

        {ticket.seatUnit === "seat" && (
          <>
            <span className="text-[13px] text-gray-400 leading-none">席 x</span>
            <span className="text-[22px] font-bold leading-none" style={{ color: PINK }}>
              {ticket.seats}
            </span>
          </>
        )}

        {ticket.seatUnit === "piece" && (
          <>
            <span className="text-[13px] text-gray-400 leading-none">x</span>
            <span className="text-[22px] font-bold leading-none" style={{ color: PINK }}>
              {ticket.seats}
            </span>
            <span className="text-[13px] text-gray-400 leading-none">枚</span>
          </>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold" style={{ color: PINK }}>{ticket.price}</span>
        <span className="text-[13px] text-gray-400">/ 1枚</span>
      </div>

      {systemFee > 0 && (
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-dashed border-gray-100">
          <span className="text-[11px] text-gray-400">
            システム利用料{ticket.systemFeeLabel ? `（${ticket.systemFeeLabel}）` : ""}
          </span>
          <span className="text-[12px] font-semibold text-gray-500">
            +¥{systemFee.toLocaleString()}
          </span>
        </div>
      )}
    </>
  );
}

/* ── Ticket Card (mobile — select-to-buy) ──────────────────────────────────── */

function TicketCard({ ticket, selected, onToggle }) {
  const iconColor = selected ? PINK : BLUE;

  return (
    <div className="relative mb-3">

      {/* Status badge */}
      {ticket.status && (
        <div
          className="absolute top-0 right-0 z-10 px-3 py-1.25 rounded-tr-xl rounded-bl-xl"
          style={{ background: PINK }}
        >
          <span className="text-white text-[11px] font-semibold whitespace-nowrap">
            {ticket.status}
          </span>
        </div>
      )}

      {/* Card */}
      <div
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && onToggle()}
        className="rounded-lg px-5 pt-4.5 pb-5 cursor-pointer select-none outline-none transition-all duration-150"
        style={{
          backgroundColor: selected ? "#FFF0F3" : "#ffffff",
          border: selected ? `2px solid ${PINK}` : "1px solid #E5E7EB",
          boxShadow: selected
            ? `0 0 0 3px ${PINK}22, 0 4px 16px 0 ${PINK}18`
            : "0 4px 16px 0 rgba(0,0,0,0.07)",
        }}
      >
        {/* Artist + checkmark */}
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-medium leading-none" style={{ color: PINK }}>
            {ticket.artist}
          </p>
          <div
            className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all duration-150"
            style={{
              backgroundColor: selected ? PINK : "transparent",
              border: selected ? `2px solid ${PINK}` : "2px solid #D1D5DB",
            }}
          >
            {selected && <CheckIcon />}
          </div>
        </div>

        {/* Event title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
          {ticket.event}
        </h2>

        <TicketMeta ticket={ticket} />
        <TicketPricing ticket={ticket} accentColor={iconColor} />
      </div>
    </div>
  );
}

/* ── Listing Card (desktop — browse) ───────────────────────────────────────── */

function ListingCard({ ticket, selected, onToggle }) {
  const iconColor = selected ? PINK : BLUE;

  return (
    <div className="relative mb-4">

      {/* Status badge */}
      {ticket.status && (
        <div
          className="absolute top-0 right-0 z-10 px-3 py-1.25 rounded-tr-xl rounded-bl-xl"
          style={{ background: PINK }}
        >
          <span className="text-white text-[11px] font-semibold whitespace-nowrap">
            {ticket.status}
          </span>
        </div>
      )}

      {/* Card */}
      <div
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && onToggle()}
        className="rounded-lg px-5 pt-4.5 pb-5 cursor-pointer select-none outline-none transition-all duration-150"
        style={{
          backgroundColor: selected ? "#FFF0F3" : "#ffffff",
          border: selected ? `2px solid ${PINK}` : "1px solid #E5E7EB",
          boxShadow: selected
            ? `0 0 0 3px ${PINK}22, 0 4px 16px 0 ${PINK}18`
            : "0 4px 16px 0 rgba(0,0,0,0.07)",
        }}
      >
        {/* Artist + checkmark */}
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-medium leading-none" style={{ color: PINK }}>
            {ticket.artist}
          </p>
          <div
            className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ml-2 transition-all duration-150"
            style={{
              backgroundColor: selected ? PINK : "transparent",
              border: selected ? `2px solid ${PINK}` : "2px solid #D1D5DB",
            }}
          >
            {selected && <CheckIcon />}
          </div>
        </div>

        {/* Event title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug mb-3.5">
          {ticket.event}
        </h2>

        <TicketMeta ticket={ticket} />
        <TicketPricing ticket={ticket} accentColor={iconColor} />
      </div>
    </div>
  );
}

/* ── Filter Sidebar (desktop) ──────────────────────────────────────────────── */

function FilterSidebar() {
  const [keyword, setKeyword]                 = useState("");
  const [checkedRegions, setCheckedRegions]     = useState(new Set());
  const [excludeInProgress, setExcludeInProgress] = useState(false);

  const toggleRegion = (region) => {
    setCheckedRegions(prev => {
      const next = new Set(prev);
      next.has(region) ? next.delete(region) : next.add(region);
      return next;
    });
  };

  return (
    <aside className="w-[280px] shrink-0">

      {/* フリーワード */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">フリーワード</p>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="アーティスト名、イベント名"
          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-gray-300"
        />
      </div>

      {/* 開催地方で選ぶ */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">開催地方で選ぶ</p>
        <div className="rounded-lg border border-gray-200 bg-white px-4">
          {REGIONS.map((region, i) => (
            <label
              key={region}
              className={`flex items-center gap-2.5 py-2.5 cursor-pointer ${
                i < REGIONS.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checkedRegions.has(region)}
                onChange={() => toggleRegion(region)}
                className="w-4 h-4 rounded border-gray-300 accent-[#E84060]"
              />
              <span className="text-sm text-gray-600">{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* イベントで選ぶ */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">イベントで選ぶ</p>
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-left"
        >
          <span className="text-sm" style={{ color: PINK }}>イベントを選択</span>
          <ChevronDownIcon />
        </button>
      </div>

      {/* フィルター */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">フィルター</p>
        <div className="rounded-lg border border-gray-200 bg-white px-4">
          <label className="flex items-center gap-2.5 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeInProgress}
              onChange={() => setExcludeInProgress(v => !v)}
              className="w-4 h-4 rounded border-gray-300 accent-[#E84060]"
            />
            <span className="text-sm text-gray-600">購入手続き中を除く</span>
          </label>
        </div>
      </div>

      {/* 検索 */}
      <button
        type="button"
        className="w-full py-3 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: PINK }}
      >
        検索
      </button>
    </aside>
  );
}

/* ── Tickets Page ─────────────────────────────────────────────────────────────── */

function Tickets() {
  const [tickets,     setTickets]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ── Fetch from the admin backend on mount ──────────────────────────────────
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          "https://anypass.onrender.com/api/tickets"
        );

        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
  
        const data = await res.json();
  
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTickets();
  }, []);

  const toggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const count           = selectedIds.size;
  const selectedTickets = tickets.filter(t => selectedIds.has(t._id));

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${PINK}55`, borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-400">チケットを読み込み中…</p>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (tickets.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6 font-sans">
        <span className="text-4xl mb-3">🎫</span>
        <p className="text-sm font-bold text-gray-600 mb-1">チケットがありません</p>
        <p className="text-xs text-gray-400 text-center max-w-50">
          管理パネルで追加されたチケットがここに表示されます。
        </p>
      </div>
    );
  }

  // ── Main list ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen font-sans">

      {/* ══ Mobile / tablet view (< lg) — select-to-buy flow ══════════════════ */}
      <div className="lg:hidden p-4 pb-24">
        <p className="text-[12px] text-gray-400 mb-3 px-1">
          購入するチケットを選択してください
        </p>

        {tickets.map(ticket => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            selected={selectedIds.has(ticket._id)}
            onToggle={() => toggle(ticket._id)}
          />
        ))}

        {/* Confirm button — fixed to bottom of screen */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100">
          <Link
            to="./step1"
            state={{ selectedTickets }}
            className="block w-full"
            onClick={e => count === 0 && e.preventDefault()}
          >
            <button
              disabled={count === 0}
              className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150"
              style={{
                backgroundColor: PINK,
                opacity: count === 0 ? 0.35 : 1,
                cursor: count === 0 ? "not-allowed" : "pointer",
              }}
            >
              {count === 0
                ? "チケットを選択してください"
                : `確認 — ${count}枚のチケットを選択中`}
            </button>
          </Link>
        </div>
      </div>

      {/* ══ Desktop view (lg and up) — browse / filter layout ═════════════════ */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-8 py-8 pb-28">

        {/* Header row: result count + sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-bold" style={{ color: PINK }}>{tickets.length}</span>
            件の出品があります。
          </p>
          <button type="button" className="flex items-center gap-1.5 text-sm text-gray-600">
            新着順
            <ChevronDownIcon color={PINK} />
          </button>
        </div>

        <div className="flex gap-8 items-start">
          <FilterSidebar />

          <div className="flex-1 min-w-0">
            {tickets.map(ticket => (
              <ListingCard
                key={ticket._id}
                ticket={ticket}
                selected={selectedIds.has(ticket._id)}
                onToggle={() => toggle(ticket._id)}
              />
            ))}
          </div>
        </div>

        {/* Confirm bar — fixed to bottom, mirrors mobile's flow */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-end">
            <Link
              to="./step1"
              state={{ selectedTickets }}
              onClick={e => count === 0 && e.preventDefault()}
            >
              <button
                disabled={count === 0}
                className="px-8 py-3.5 rounded-xl text-white text-[14px] font-semibold tracking-wide transition-opacity duration-150"
                style={{
                  backgroundColor: PINK,
                  opacity: count === 0 ? 0.35 : 1,
                  cursor: count === 0 ? "not-allowed" : "pointer",
                }}
              >
                {count === 0
                  ? "チケットを選択してください"
                  : `確認 — ${count}枚のチケットを選択中`}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;
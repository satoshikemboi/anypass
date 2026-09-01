import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PINK = "#E84060";
const BLUE = "#4A8AF4";
const PINK_BG = "#FCE8ED";
const RED = "#DC2626";
const GREEN = "#16A34A";
const AMBER = "#92600A";
const AMBER_BG = "#FEF3C7";

const API_BASE = "https://anypass.onrender.com/api";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const fmt = (num) => `$${Number(num || 0).toFixed(2)}`;

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Icons (matching the source pages' stroke style) ── */

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

function CheckIcon({ color = GREEN, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XIcon({ color = RED, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="shrink-0 transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

/* ── Shared primitives ── */

function SectionLabel({ text }) {
  return <p className="text-xs text-gray-400 mb-2 px-1">{text}</p>;
}

function Divider() {
  return <hr className="border-t border-gray-100 -mx-5" />;
}

function StatusBadge({ status }) {
  const styles = {
    pending: { color: AMBER, backgroundColor: AMBER_BG, label: "Pending" },
    approved: { color: GREEN, backgroundColor: "#DCFCE7", label: "Approved" },
    rejected: { color: RED, backgroundColor: "#FEE2E2", label: "Rejected" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
      style={{ color: s.color, backgroundColor: s.backgroundColor }}
    >
      {s.label}
    </span>
  );
}

function StatCard({ label, value, color = "#1F1F1F" }) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 px-4 py-3 flex-1 min-w-[120px]">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

/* ── Page ── */

export default function RefundAdmin() {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [actionState, setActionState] = useState({}); // { [id]: "approving" | "rejecting" | "error" }

  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/admin/refunds`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Accept either { refunds: [...] } or a bare array from the backend
      const list = Array.isArray(response.data) ? response.data : response.data?.refunds || [];
      setRefunds(list);
    } catch (err) {
      console.error("Error fetching refund requests:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Failed to load refund requests.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const updateStatus = async (id, nextStatus) => {
    setActionState((prev) => ({ ...prev, [id]: nextStatus === "approved" ? "approving" : "rejecting" }));
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/admin/refunds/${id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefunds((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
      setActionState((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      console.error("Error updating refund status:", err);
      setActionState((prev) => ({ ...prev, [id]: "error" }));
    }
  };

  const filtered = useMemo(() => {
    return refunds.filter((r) => {
      if (statusFilter !== "all" && (r.status || "pending") !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        r.fullName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.ticketNumber?.toLowerCase().includes(q)
      );
    });
  }, [refunds, statusFilter, query]);

  const stats = useMemo(() => {
    const pending = refunds.filter((r) => (r.status || "pending") === "pending").length;
    const approved = refunds.filter((r) => r.status === "approved").length;
    const totalOwed = refunds
      .filter((r) => (r.status || "pending") === "pending")
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    return { pending, approved, totalOwed };
  }, [refunds]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-gray-100">
        <p className="text-sm text-gray-500">Loading refund requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 px-4 font-sans">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg text-center">
          <p className="text-md text-gray-700 font-semibold mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full text-white py-3 rounded transition-colors font-medium"
            style={{ backgroundColor: PINK }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16 lg:pt-10">

        <div className="flex items-start justify-between px-1 mb-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Refund requests</h1>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Every claim submitted through the refund form lands here for review.
            </p>
          </div>
          <button
            onClick={fetchRefunds}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shrink-0"
            style={{ color: BLUE }}
          >
            <RefreshIcon /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-5">
          <StatCard label="Pending" value={stats.pending} color={AMBER} />
          <StatCard label="Approved" value={stats.approved} color={GREEN} />
          <StatCard label="Owed (pending)" value={fmt(stats.totalOwed)} color={PINK} />
        </div>

        {/* Search */}
        <div className="bg-white rounded-sm border border-gray-200 px-4 py-2.5 mb-3 flex items-center gap-2">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, or ticket number"
            className="w-full text-sm text-gray-900 placeholder:text-gray-300 outline-none bg-transparent"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              style={
                statusFilter === tab.key
                  ? { color: "#fff", backgroundColor: PINK }
                  : { color: "#666", backgroundColor: "#fff", border: "1px solid #e5e7eb" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <SectionLabel text={`${filtered.length} request${filtered.length === 1 ? "" : "s"}`} />

        {filtered.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-200 px-5 py-10 text-center">
            <p className="text-sm text-gray-400">No refund requests match this view.</p>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-gray-200 px-5">
            {filtered.map((r, idx) => {
              const isOpen = expandedId === r.id;
              const action = actionState[r.id];
              const status = r.status || "pending";
              return (
                <div key={r.id ?? r.ticketNumber ?? idx}>
                  {idx > 0 && <Divider />}
                  <div className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : r.id)}
                      className="w-full flex items-center justify-between gap-2 text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronIcon open={isOpen} />
                        <TicketIcon />
                        <span className="text-sm font-medium truncate" style={{ color: BLUE }}>
                          {r.ticketNumber || "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold" style={{ color: PINK }}>
                          {fmt(r.amount)}
                        </span>
                        <StatusBadge status={status} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3 pl-6 space-y-2">
                        <p className="text-xs text-gray-500">
                          Name: <span className="text-gray-800">{r.fullName || "N/A"}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Phone: <span className="text-gray-800">{r.phone || "N/A"}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Email: <span className="text-gray-800">{r.email || "N/A"}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: <span className="text-gray-800">{fmtDate(r.createdAt)}</span>
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Note: <span className="text-gray-800">{r.note || "—"}</span>
                        </p>

                        {action === "error" && (
                          <p className="flex items-center gap-1 text-xs" style={{ color: RED }}>
                            <AlertIcon /> Couldn't update this request. Try again.
                          </p>
                        )}

                        {status === "pending" && (
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => updateStatus(r.id, "approved")}
                              disabled={action === "approving" || action === "rejecting"}
                              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-60"
                              style={{ color: GREEN, backgroundColor: "#DCFCE7" }}
                            >
                              <CheckIcon size={13} />
                              {action === "approving" ? "Approving…" : "Approve"}
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(r.id, "rejected")}
                              disabled={action === "approving" || action === "rejecting"}
                              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-60"
                              style={{ color: RED, backgroundColor: "#FEE2E2" }}
                            >
                              <XIcon size={13} />
                              {action === "rejecting" ? "Rejecting…" : "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";

const PINK = "#E84060";
const BLUE = "#4A8AF4";

export default function PaymentAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // ── Fetch all payment submissions from backend ───────────────────────────
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payments/submit");
        
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        
        const data = await res.json();
        // Fallback to handling wrapped array formats cleanly
        setPayments(Array.isArray(data) ? data : data.payments || []);
      } catch (err) {
        console.error("Error fetching admin checkout details:", err);
        setErrorMsg("Failed to load payment transactions from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []); // <-- Properly closing the useEffect hook here

  // ── Handle Delete Transaction ────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        throw new Error("Delete failed");
      }
  
      setPayments((prev) => prev.filter((p) => p._id !== id));
      setOpenMenu(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: `${PINK}55`, borderTopColor: PINK }}
          />
          <p className="text-sm text-gray-500 font-medium">Loading checkout data…</p>
        </div>
      </div>
    );
  }

  // ── Main Dashboard Layout ─────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">

      {/* Error Banner */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {/* ── Data Table Panel ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-bold text-gray-800">Transaction History Log</h2>
          <span className="text-xs bg-gray-200 text-gray-600 font-semibold px-2.5 py-1 rounded-full">
            {payments.length} Entries Found
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-3xl block mb-2">💸</span>
            <p className="text-sm font-bold text-gray-600">No payment logs available</p>
            <p className="text-xs text-gray-400 mt-0.5">When users submit a PayPay ID at checkout, records populate here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 select-none">
                  <th className="py-3 px-6">Timestamp / Order ID</th>
                  <th className="py-3 px-6">PayPay ID Contact</th>
                  <th className="py-3 px-6">Allocated Items & Artist Description</th>
                  <th className="py-3 px-6 text-right">Price Tally</th>
                  <th className="py-3 px-6 text-center">System Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px] text-gray-700">
                {payments.map((record) => {
                  const dateString = record.createdAt 
                    ? new Date(record.createdAt).toLocaleString("en-US", { hour12: false })
                    : "N/A";

                  return (
                    <tr key={record._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* ID / Timestamp */}
                      <td className="py-4 px-6 vertical-top">
                        <span className="font-semibold text-gray-900 block">{dateString}</span>
                        <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                          {record._id}
                        </span>
                      </td>

                      {/* PayPay Handle */}
                      <td className="py-4 px-6 vertical-top">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PINK }} />
                          <span className="font-mono font-bold text-gray-800 bg-pink-50 text-pink-700 px-2 py-0.5 rounded border border-pink-100">
                            {record.paypayId}
                          </span>
                        </div>
                      </td>

                      {/* Ticket Details Sub-List */}
                      <td className="py-4 px-6">
                        <div className="space-y-3">
                          {record.tickets?.map((item, idx) => (
                            <div key={item._id || idx} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100 max-w-md">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold uppercase tracking-tight" style={{ color: PINK }}>
                                  {item.artist || "Unknown Artist"}
                                </span>
                                <span className="text-[11px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                  {item.seats} {item.seatUnit || "sheet"}(s)
                                </span>
                              </div>
                              <p className="font-bold text-gray-900 text-sm leading-tight mb-0.5">
                                {item.event || "Standard Event Access"}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate">
                                📍 {item.venue || "Venue Unspecified"} | 🗓️ {item.date || "Date Unspecified"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Financial Sum Info */}
                      <td className="py-4 px-6 text-right font-mono font-bold text-gray-900 vertical-top">
                        <div className="inline-block bg-gray-100 px-2 py-1 rounded">
                          {record.tickets?.reduce((acc, current) => {
                            const rawPrice = current.priceNum || parseFloat(String(current.price || "0").replace(/[^0-9]/g, ""));
                            return acc + (rawPrice * (current.seats || 1));
                          }, 0).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
                        </div>
                      </td>

                      {/* Live Process Badging */}
                      <td className="py-4 px-6 text-center vertical-top">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 capitalize">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                          {record.status || "pending"}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td className="py-4 px-6 text-center relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === record._id ? null : record._id)}
                          className="text-xl text-gray-500 hover:text-gray-800"
                        >
                          ⋮
                        </button>

                        {openMenu === record._id && (
                          <div className="absolute right-6 top-12 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="px-4 py-2 text-red-500 hover:bg-red-50 w-full text-left"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
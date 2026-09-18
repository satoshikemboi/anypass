import { useEffect, useState } from "react";
import {
  RefreshCw,
  Eye,
  X,
  CircleDollarSign,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const API_URL = "http://anypass.onrender.com/api/refundRequest";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-purple-100 text-purple-700",
};

const formatYen = (amount) =>
  `¥${Number(amount || 0).toLocaleString("en-US")}`;

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function RefundAdmin() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedRefund, setSelectedRefund] = useState(null);

  // Fetch refunds
  const fetchRefunds = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch refund requests.");
      }

      const data = await response.json();

      // Supports either an array or { refunds: [...] }
      const refundData = Array.isArray(data)
        ? data
        : data.refunds || data.refundRequests || [];

      setRefunds(refundData);
    } catch (err) {
      console.error("Fetch refunds error:", err);
      setError(err.message || "Unable to load refund requests.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              AnyPASS STORE
            </h1>

            <p className="text-sm text-gray-500">
              Refund Administration
            </p>
          </div>

          <button
            onClick={() => fetchRefunds(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div>
          <h2 className="text-2xl font-bold">
            Refund Requests
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            All refund submissions as fetched from the backend.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={20} className="shrink-0" />

            <div className="flex-1">
              {error}
            </div>

            <button onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Refund table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="font-semibold">
              All Refund Requests
            </h3>

            <span className="text-sm text-gray-500">
              {refunds.length} results
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
              <Loader2 size={22} className="animate-spin" />
              Loading refund requests...
            </div>
          ) : refunds.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <CircleDollarSign
                size={38}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium">
                No refund requests found.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="divide-y md:hidden">
                {refunds.map((refund) => (
                  <RefundMobileCard
                    key={refund._id || refund.id}
                    refund={refund}
                    onView={() => setSelectedRefund(refund)}
                  />
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4">
                        Customer
                      </th>

                      <th className="px-5 py-4">
                        Ticket Number
                      </th>

                      <th className="px-5 py-4">
                        Amount
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {refunds.map((refund) => (
                      <tr
                        key={refund._id || refund.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {refund.fullName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {refund.email}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-medium">
                          {refund.ticketNumber}
                        </td>

                        <td className="px-5 py-4 font-semibold">
                          {formatYen(refund.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={refund.status} />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                          {formatDate(refund.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              setSelectedRefund(refund)
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Refund details modal */}
      {selectedRefund && (
        <RefundDetailsModal
          refund={selectedRefund}
          onClose={() => setSelectedRefund(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------
   Status Badge
------------------------------ */

function StatusBadge({ status }) {
  const safeStatus = status || "pending";

  const styles =
    STATUS_STYLES[safeStatus] ||
    "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {formatStatus(safeStatus)}
    </span>
  );
}

function formatStatus(status) {
  return String(status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* ------------------------------
   Mobile Refund Card
------------------------------ */

function RefundMobileCard({ refund, onView }) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">
            {refund.fullName}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {refund.email}
          </p>
        </div>

        <StatusBadge status={refund.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">
            Ticket Number
          </p>

          <p className="mt-1 font-medium">
            {refund.ticketNumber}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Refund Amount
          </p>

          <p className="mt-1 font-semibold">
            {formatYen(refund.amount)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          {formatDate(refund.createdAt)}
        </p>

        <button
          onClick={onView}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white"
        >
          <Eye size={15} />
          View Details
        </button>
      </div>
    </div>
  );
}

/* ------------------------------
   Refund Details Modal (read-only)
------------------------------ */

function RefundDetailsModal({ refund, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-bold">
              Refund Details
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {refund.ticketNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Status and amount */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">
                Refund Amount
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatYen(refund.amount)}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">
                Status
              </p>

              <div className="mt-2">
                <StatusBadge status={refund.status} />
              </div>
            </div>
          </div>

          {/* Customer information */}
          <section>
            <h4 className="mb-3 font-semibold">
              Customer Information
            </h4>

            <div className="grid grid-cols-1 gap-4 rounded-xl border p-4 sm:grid-cols-2">
              <DetailItem
                label="Full Name"
                value={refund.fullName}
              />

              <DetailItem
                label="Phone"
                value={refund.phone}
              />

              <DetailItem
                label="Email"
                value={refund.email}
              />

              <DetailItem
                label="Ticket Number"
                value={refund.ticketNumber}
              />
            </div>
          </section>

          {/* Payment information */}
          <section>
            <h4 className="mb-3 font-semibold">
              Payment Information
            </h4>

            <div className="space-y-4 rounded-xl border p-4">
              <DetailItem
                label="PayPay ID"
                value={refund.paypayId}
              />

              <DetailItem
                label="Refund Amount"
                value={formatYen(refund.amount)}
              />
            </div>
          </section>

          {/* Note */}
          <section>
            <h4 className="mb-3 font-semibold">
              Customer Note
            </h4>

            <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
              {refund.note || "No note provided."}
            </div>
          </section>

          {/* Metadata */}
          <section>
            <h4 className="mb-3 font-semibold">
              Request Information
            </h4>

            <div className="space-y-3 rounded-xl border p-4">
              <DetailItem
                label="Request ID"
                value={refund._id || refund.id}
              />

              <DetailItem
                label="Created At"
                value={formatDate(refund.createdAt)}
              />

              <DetailItem
                label="Last Updated"
                value={formatDate(refund.updatedAt)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------
   Detail Item
------------------------------ */

function DetailItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}
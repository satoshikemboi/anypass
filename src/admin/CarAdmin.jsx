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
        throw new Error(data.message || "Failed to fetch car records");
      }

      setCars(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      if (err.name === "AbortError") return; // Ignore unmount cancels
      console.error("Fetch cars error:", err);
      setError(err.message || "Failed to load car records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    const controller = new AbortController();
    fetchCars(false, controller.signal);
    return () => controller.abort();
  }, [fetchCars]);

  // ==========================================
  // DELETE CAR
  // ==========================================
  const handleDelete = async (id) => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this car record?");
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

      // Optimistic state update
      setCars((currentCars) => currentCars.filter((car) => car._id !== id));
    } catch (err) {
      console.error("Delete car error:", err);
      setError(err.message || "Failed to delete car record.");
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "-";
    }
  };

  const uniqueFleets = new Set(cars.map((car) => car.fleet_id).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Car Administration</h1>
            <p className="text-sm text-gray-500 mt-1">Manage vehicle and parking records</p>
          </div>

          <button
            type="button"
            onClick={() => fetchCars(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* SUMMARY */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{cars.length}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Active Fleets</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{uniqueFleets}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Latest Record</p>
              <p className="text-sm font-medium text-gray-800 mt-2">
                {cars.length > 0 ? formatDate(cars[0].createdAt) : "No records"}
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
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

        {/* LOADING */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 mt-3">Loading car records...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && cars.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
              🚗
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-4">No car records</h2>
            <p className="text-sm text-gray-500 mt-1">No vehicle records have been submitted yet.</p>
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!loading && cars.length > 0 && (
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">#</th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">Total Number</th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">Car Number</th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">Fleet ID</th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">Parking Ticket</th>
                    <th className="px-5 py-4 text-left font-semibold text-gray-600">Created</th>
                    <th className="px-5 py-4 text-right font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars.map((car, index) => (
                    <tr key={car._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-400">{index + 1}</td>
                      <td className="px-5 py-4 font-medium text-gray-800">{car.total_number}</td>
                      <td className="px-5 py-4 text-gray-700">{car.car_number}</td>
                      <td className="px-5 py-4 text-gray-700">{car.fleet_id}</td>
                      <td className="px-5 py-4 text-gray-700">{car.parking_ticket_number}</td>
                      <td className="px-5 py-4 text-gray-500">{formatDate(car.createdAt)}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOBILE CARDS */}
        {!loading && cars.length > 0 && (
          <div className="md:hidden flex flex-col gap-4">
            {cars.map((car, index) => (
              <div key={car._id || index} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Record</p>
                    <p className="font-semibold text-gray-800">#{index + 1}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                    Vehicle
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-400">Total Number</span>
                    <span className="text-sm font-medium text-gray-800 text-right">{car.total_number}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-400">Car Number</span>
                    <span className="text-sm font-medium text-gray-800">{car.car_number}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-400">Fleet ID</span>
                    <span className="text-sm font-medium text-gray-800">{car.fleet_id}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-400">Parking Ticket</span>
                    <span className="text-sm font-medium text-gray-800">{car.parking_ticket_number}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(car.createdAt)}</p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo, useCallback } from "react";

function formatDate(iso) {
  if (!iso) return "-";

  const date = new Date(iso);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Avatar({ name = "Unknown User" }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 text-xs font-bold flex items-center justify-center shrink-0"
    >
      {initials || "U"}
    </div>
  );
}

export default function YukiAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/users", { signal });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Invalid JSON from server: ${text.slice(0, 200)}`
        );
      }

      setUsers(Array.isArray(data) ? data : data.users ?? []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load users.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal);

    return () => controller.abort();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return users;

    return users.filter((u) =>
      [u.fullName, u.email, u.username]
        .filter(Boolean)
        .some((field) =>
          field.toLowerCase().includes(query)
        )
    );
  }, [users, search]);

  const handleRetry = () => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-pink-500 font-extrabold text-lg tracking-tight">
            Yuki
          </span>
          <span className="text-gray-400 text-sm font-medium">
            Admin
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
      </header>

      <main className="px-6 py-8 max-w-5xl mx-auto">
        {/* Title + Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Users
            </h1>

            <p className="text-sm text-gray-400 mt-0.5">
              Showing {filtered.length} of {users.length} users
            </p>
          </div>

          <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 gap-2 bg-white w-full sm:w-64 focus-within:border-pink-400 transition-colors">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>

            <input
              aria-label="Search users"
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-gray-400">
              Loading users...
            </p>
          ) : error ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-red-500 mb-4">
                {error}
              </p>

              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        User
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Phone
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Username
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Joined
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-sm text-gray-400"
                        >
                          No users match your search.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user, index) => (
                        <tr
                          key={user._id || index}
                          className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                            index === filtered.length - 1
                              ? "border-none"
                              : ""
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar
                                name={user.fullName}
                              />
                              <span className="font-medium text-gray-800">
                                {user.fullName || "Unknown User"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-gray-500">
                            {user.email || "-"}
                          </td>

                          <td className="px-5 py-3.5 text-gray-500">
                            {user.phone || "-"}
                          </td>

                          <td className="px-5 py-3.5">
                            <span className="text-pink-500 font-medium">
                              @{user.username || "unknown"}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-gray-400">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="sm:hidden divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-gray-400">
                    No users match your search.
                  </p>
                ) : (
                  filtered.map((user, index) => (
                    <div
                      key={user._id || index}
                      className="px-5 py-4 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <Avatar
                          name={user.fullName}
                        />
                        <span className="font-semibold text-gray-800 text-sm">
                          {user.fullName || "Unknown User"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        {user.email || "-"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {user.phone || "-"}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-pink-500 font-medium">
                          @{user.username || "unknown"}
                        </span>

                        <span className="text-xs text-gray-400">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
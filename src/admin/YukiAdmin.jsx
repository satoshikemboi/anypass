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

function TrashIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

export default function YukiAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("https://anypass.onrender.com/api/users", { signal });

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

  const handleDelete = async (id, name) => {
    if (!id) return;

    const confirmed = window.confirm(
      `Delete ${name || "this user"}? This can't be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setDeleteError("");

      const res = await fetch(
        `https://anypass.onrender.com/api/users/${id}`,
        { method: "DELETE" }
      );

      const text = await res.text();

      if (!res.ok) {
        let message = `Server error ${res.status}`;

        try {
          message = JSON.parse(text)?.message || message;
        } catch {
          // response wasn't JSON, fall back to default message
        }

        throw new Error(message);
      }

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setDeleteError(err.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
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

        {/* Delete error banner */}
        {deleteError && (
          <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-500 flex items-center justify-between gap-3">
            <span>{deleteError}</span>
            <button
              onClick={() => setDeleteError("")}
              aria-label="Dismiss error"
              className="text-red-400 hover:text-red-600 shrink-0"
            >
              ✕
            </button>
          </div>
        )}

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
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
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

                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() =>
                                handleDelete(user._id, user.fullName)
                              }
                              disabled={deletingId === user._id}
                              aria-label={`Delete ${user.fullName || "user"}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                {deletingId === user._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>
                            </button>
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
                      <div className="flex items-center justify-between gap-2.5 mb-1">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={user.fullName}
                          />
                          <span className="font-semibold text-gray-800 text-sm">
                            {user.fullName || "Unknown User"}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            handleDelete(user._id, user.fullName)
                          }
                          disabled={deletingId === user._id}
                          aria-label={`Delete ${user.fullName || "user"}`}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
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
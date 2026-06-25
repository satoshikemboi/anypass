import { useState, useEffect } from "react";

const PINK = "#E84060";
const BLUE  = "#4A8AF4";

// ── Day helper ───────────────────────────────────────────────────────────────
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Convert admin form data → full ticket record (tickets.jsx shape) ─────────
function buildRecord(form) {
  const dateSlash = form.eventDate.replace(/-/g, "/");
  let dayLabel = "";
  try {
    dayLabel = DAY_NAMES[new Date(form.eventDate + "T12:00:00").getDay()];
  } catch {}

  const priceNum  = Number(form.priceNum)  || 0;
  const systemFee = Number(form.systemFee) || 0;
  const seats     = Number(form.seats)     || 1;

  return {
    artist:          form.artist.trim(),
    event:           form.event.trim(),
    venue:           form.venue.trim(),
    date:            `${dateSlash} ${form.doorsTime} / ${form.showTime}`,
    dateFormatted:   `${dateSlash} (${dayLabel})  ${form.doorsTime}/${form.showTime}`,
    seatType:        form.seatType,
    seatUnit:        form.seatUnit,
    seats,
    price:           `¥${priceNum.toLocaleString()}`,
    priceNum,
    systemFee,
    systemFeeLabel:  form.seatType === "General reserved" ? "一般指定席" : "立見席",
    sellByDate:      form.sellByDate || "",
    salesPeriodText: form.sellByDate ? `Until 23:59 on ${form.sellByDate}` : "",
    status:          form.status || null,
  };
}

// ── Reverse: existing record → form state ────────────────────────────────────
function recordToForm(r) {
  const datePart = r.date?.split(" ")[0]?.replace(/\//g, "-") ?? "";
  const m = r.date?.match(/(\d{2}:\d{2}) \/ (\d{2}:\d{2})/);
  return {
    artist:     r.artist   ?? "",
    event:      r.event    ?? "",
    venue:      r.venue    ?? "",
    eventDate:  datePart,
    doorsTime:  m?.[1]      ?? "18:00",
    showTime:   m?.[2]      ?? "19:00",
    seatType:   r.seatType  ?? "General reserved",
    seatUnit:   r.seatUnit  ?? "seat",
    seats:      r.seats     ?? 1,
    priceNum:   r.priceNum  ?? 0,
    systemFee:  r.systemFee ?? 0,
    status:     r.status    ?? "",
    sellByDate: r.sellByDate ?? "",
  };
}

const EMPTY_FORM = {
  artist: "", event: "", venue: "",
  eventDate: "", doorsTime: "18:00", showTime: "19:00",
  seatType: "General reserved", seatUnit: "seat",
  seats: 1, priceNum: 0, systemFee: 0,
  status: "", sellByDate: "",
};

/* ── Icons ──────────────────────────────────────────────────────────────────── */

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

/* ── Shared input style ─────────────────────────────────────────────────────── */

const inputBase =
  "w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white outline-none " +
  "transition-all focus:ring-2 focus:ring-[#E84060] focus:border-[#E84060]";

/* ── Field wrapper ──────────────────────────────────────────────────────────── */

function Field({ label, required, error, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
        {required && <span className="ml-0.5" style={{ color: PINK }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] mt-1 font-medium" style={{ color: PINK }}>{error}</p>
      )}
    </div>
  );
}

/* ── Ticket Form (Add / Edit) ───────────────────────────────────────────────── */

function TicketForm({ initialForm, id, onSave, onCancel }) {
  const [f, setF]         = useState(initialForm);
  const [errors, setErrs] = useState({});

  const set = (key, val) => setF(prev => ({ ...prev, [key]: val }));

  function validate() {
    const e = {};
    if (!f.artist.trim())               e.artist    = "Required";
    if (!f.event.trim())                e.event     = "Required";
    if (!f.venue.trim())                e.venue     = "Required";
    if (!f.eventDate)                   e.eventDate = "Required";
    if (!f.doorsTime)                   e.doorsTime = "Required";
    if (!f.showTime)                    e.showTime  = "Required";
    if (!f.priceNum || Number(f.priceNum) <= 0) e.priceNum = "Must be greater than 0";
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSave(f, id);
  }

  function handleSeatTypeChange(val) {
    set("seatType", val);
    if (val === "Total freedom") set("seatUnit", "piece");
    else set("seatUnit", "seat");
  }

  const preview_price = Number(f.priceNum) > 0
    ? `¥${Number(f.priceNum).toLocaleString()}`
    : null;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button
          onClick={onCancel}
          className="p-1 -ml-1 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon />
        </button>
        <h1 className="flex-1 text-[15px] font-bold text-gray-800">
          {id ? "Edit Ticket" : "Add New Ticket"}
        </h1>
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold shadow-sm"
          style={{ backgroundColor: PINK }}
        >
          Save
        </button>
      </div>

      <div className="p-4 pb-12">
        <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Basic Info</p>
          <Field label="Artist / Performer Name" required error={errors.artist}>
            <input
              className={inputBase}
              style={{ borderColor: errors.artist ? PINK : "#E5E7EB" }}
              placeholder="e.g. Aina the End"
              value={f.artist}
              onChange={e => set("artist", e.target.value)}
            />
          </Field>
          <Field label="Event Title" required error={errors.event}>
            <input
              className={inputBase}
              style={{ borderColor: errors.event ? PINK : "#E5E7EB" }}
              placeholder="e.g. AiNA THE END LIVE TOUR 2026 - PICNIC -"
              value={f.event}
              onChange={e => set("event", e.target.value)}
            />
          </Field>
          <Field label="Venue / Location" required error={errors.venue}>
            <input
              className={inputBase}
              style={{ borderColor: errors.venue ? PINK : "#E5E7EB" }}
              placeholder="e.g. Zepp Haneda, Tokyo"
              value={f.venue}
              onChange={e => set("venue", e.target.value)}
            />
          </Field>
        </div>

        <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Date & Time</p>
          <Field label="Event Date" required error={errors.eventDate}>
            <input
              type="date"
              className={inputBase}
              style={{ borderColor: errors.eventDate ? PINK : "#E5E7EB" }}
              value={f.eventDate}
              onChange={e => set("eventDate", e.target.value)}
            />
          </Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Doors Open" required error={errors.doorsTime}>
                <input
                  type="time"
                  className={inputBase}
                  style={{ borderColor: errors.doorsTime ? PINK : "#E5E7EB" }}
                  value={f.doorsTime}
                  onChange={e => set("doorsTime", e.target.value)}
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Show Start" required error={errors.showTime}>
                <input
                  type="time"
                  className={inputBase}
                  style={{ borderColor: errors.showTime ? PINK : "#E5E7EB" }}
                  value={f.showTime}
                  onChange={e => set("showTime", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ticket Details</p>
          <Field label="Seat Type">
            <select
              className={inputBase}
              style={{ borderColor: "#E5E7EB" }}
              value={f.seatType}
              onChange={e => handleSeatTypeChange(e.target.value)}
            >
              <option value="General reserved">General reserved</option>
              <option value="Total freedom">Total freedom</option>
            </select>
          </Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Seat Unit">
                <select
                  className={inputBase}
                  style={{ borderColor: "#E5E7EB" }}
                  value={f.seatUnit}
                  onChange={e => set("seatUnit", e.target.value)}
                >
                  <option value="seat">seat</option>
                  <option value="piece">piece</option>
                </select>
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Number of Pieces" required>
                <input
                  type="number"
                  min={1}
                  className={inputBase}
                  style={{ borderColor: "#E5E7EB" }}
                  value={f.seats}
                  onChange={e => set("seats", e.target.value)}
                />
              </Field>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Price per Sheet (¥)" required error={errors.priceNum}>
                <input
                  type="number"
                  min={0}
                  className={inputBase}
                  style={{ borderColor: errors.priceNum ? PINK : "#E5E7EB" }}
                  value={f.priceNum}
                  onChange={e => set("priceNum", e.target.value)}
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="System Fee (¥)">
                <input
                  type="number"
                  min={0}
                  className={inputBase}
                  style={{ borderColor: "#E5E7EB" }}
                  value={f.systemFee}
                  onChange={e => set("systemFee", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Status</p>
          <Field label="Purchase Status">
            <select
              className={inputBase}
              style={{ borderColor: "#E5E7EB" }}
              value={f.status}
              onChange={e => set("status", e.target.value)}
            >
              <option value="">None</option>
              <option value="Purchase in progress">Purchase in progress</option>
              <option value="Sold out">Sold out</option>
              <option value="Coming soon">Coming soon</option>
            </select>
          </Field>
          <Field label="Sell-by Date (display text)">
            <input
              className={inputBase}
              style={{ borderColor: "#E5E7EB" }}
              placeholder="e.g. 2026/6/24 (Wed) 23:59"
              value={f.sellByDate}
              onChange={e => set("sellByDate", e.target.value)}
            />
          </Field>
        </div>

        {(f.artist || f.event) && (
          <div className="rounded-xl p-4 mb-4 border" style={{ background: "#FFF0F3", borderColor: `${PINK}33` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: PINK }}>Preview</p>
            <p className="text-xs font-semibold mb-0.5" style={{ color: PINK }}>{f.artist || "—"}</p>
            <p className="text-sm font-bold text-gray-800 leading-snug mb-2">{f.event || "—"}</p>
            {f.venue && <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><MapPinIcon />{f.venue}</div>}
            {f.eventDate && <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2"><ClockIcon />{f.eventDate.replace(/-/g, "/")} {f.doorsTime} / {f.showTime}</div>}
            {preview_price && <p className="text-sm font-bold" style={{ color: PINK }}>{preview_price} / sheet &nbsp;×&nbsp; {f.seats} {f.seatUnit}(s)</p>}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3.5 rounded-xl text-white text-sm font-semibold shadow-sm" style={{ backgroundColor: PINK }}>
            {id ? "Save Changes" : "Add Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Ticket Row (list view) ─────────────────────────────────────────────────── */

function TicketRow({ ticket, onEdit, onDelete }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm flex items-start gap-3" style={{ borderLeft: `4px solid ${PINK}` }}>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold mb-0.5" style={{ color: PINK }}>{ticket.artist}</p>
        <p className="text-sm font-bold text-gray-800 leading-snug">{ticket.event}</p>
        <div className="flex items-center gap-1 text-[12px] text-gray-400 mt-1.5"><MapPinIcon /><span className="truncate">{ticket.venue}</span></div>
        <div className="flex items-center gap-1 text-[12px] text-gray-400 mt-0.5"><ClockIcon /><span>{ticket.date}</span></div>
        <p className="text-sm font-bold mt-1.5" style={{ color: PINK }}>{ticket.price} / sheet &nbsp;×&nbsp; {ticket.seats} {ticket.seatUnit}(s)</p>
        {ticket.status && <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: PINK }}>{ticket.status}</span>}
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <button onClick={() => onEdit(ticket)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ backgroundColor: BLUE }}><EditIcon /> Edit</button>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold bg-red-500"><TrashIcon /> Delete</button>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-semibold text-red-500">Sure?</p>
            <div className="flex gap-1">
              <button onClick={() => setConfirm(false)} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-600">No</button>
              <button onClick={() => onDelete(ticket._id)} className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white bg-red-500">Yes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Admin Page ─────────────────────────────────────────────────────────── */

function TicketAdmin() {
  const [tickets, setTickets] = useState([]);
  const [view, setView]       = useState("list"); // "list" | "form"
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Fetch from DB on Mount
  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    try {
      const res = await fetch("https://anypass.onrender.com/api/tickets");
      if (!res.ok) throw new Error("Could not load backend records");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("API error reading records:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData, id) {
    const record = buildRecord(formData);
    
    try {
      let res;
      if (id) {
        // Since your ticketController didn't show a direct PUT/PATCH route implemented, 
        // fallback to standard REST design pattern structure:
        res = await fetch(`https://anypass.onrender.com/api/tickets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      } else {
        res = await fetch("https://anypass.onrender.com/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
      }

      if (!res.ok) throw new Error("Could not persist data changes.");
      
      await fetchTickets(); // Clear and reload tracking
      setView("list");
      setEditTarget(null);
    } catch (err) {
      console.error("Save error details:", err);
      alert("Error committing changes to DB collection.");
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`https://anypass.onrender.com/api/tickets/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error performing delete execution.");
      
      await fetchTickets();
    } catch (err) {
      console.error("Delete call failure:", err);
      alert("Could not remove the selected target record.");
    }
  }

  function openAdd() {
    setEditTarget(null);
    setView("form");
  }

  function openEdit(ticket) {
    setEditTarget(ticket);
    setView("form");
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
        <p className="text-sm text-gray-400">Loading Configuration Data...</p>
      </div>
    );
  }

  if (view === "form") {
    return (
      <TicketForm
        initialForm={editTarget ? recordToForm(editTarget) : { ...EMPTY_FORM }}
        id={editTarget?._id ?? null} // MongoDB unique object ID token
        onSave={handleSave}
        onCancel={() => { setView("list"); setEditTarget(null); }}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-[15px] font-bold text-gray-800">Ticket Admin</h1>
          <p className="text-[11px] text-gray-400">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-sm font-semibold shadow-sm"
          style={{ backgroundColor: PINK }}
        >
          <PlusIcon /> Add Ticket
        </button>
      </div>

      <div className="p-4">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${PINK}15` }}>
              <span className="text-3xl">🎫</span>
            </div>
            <p className="text-[15px] font-bold text-gray-700 mb-1">No tickets yet</p>
            <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Add your first ticket and it will appear in the Tickets page immediately.</p>
            <button onClick={openAdd} className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm" style={{ backgroundColor: PINK }}>+ Add First Ticket</button>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketRow
              key={ticket._id}
              ticket={ticket}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TicketAdmin;
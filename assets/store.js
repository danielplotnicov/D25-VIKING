/* =========================================================
   VIKING Pulse — shared data store (client-side)
   Persists to localStorage; pub/sub so all views stay in sync.
   Booking a vessel reserves spare parts, updates compliance,
   forecasts and activity — one connected platform.
   ========================================================= */
window.Pulse = (function () {
  "use strict";

  const KEY = "viking-pulse-state-v2";
  const DAY = 86400000;

  /* ---------- seed data ---------- */
  // map coords are in the dashboard SVG viewBox (760 x 360)
  const SEED_VESSELS = [
    ["MV Nordkapp", "Ro-Ro ferry", "Norway", "North Sea", 9, 6, 250, 110],
    ["Aurora Spirit", "Tanker", "Denmark", "North Sea", 6, 5, 265, 140],
    ["Polar Queen", "Cruise", "Norway", "Norwegian Sea", 4, 18, 270, 95],
    ["Stena Baltica", "Cargo", "Sweden", "Baltic Sea", 22, 4, 320, 130],
    ["Fjord Cat", "Fast ferry", "Norway", "North Sea", 27, 8, 230, 80],
    ["Baltic Pearl", "Container", "Germany", "Baltic Sea", 14, 10, 300, 122],
    ["Sea Falcon", "Offshore PSV", "UK", "North Sea", 31, 4, 215, 100],
    ["Ocean Vega", "Bulk carrier", "Netherlands", "North Sea", 19, 6, 255, 135],
    ["Nordlys", "Coastal ferry", "Norway", "Norwegian Sea", 11, 7, 238, 72],
    ["MSC Aria", "Container", "Panama", "Strait of Malacca", 24, 12, 600, 215],
    ["Esvagt Dana", "Offshore PSV", "Denmark", "North Sea", 38, 5, 248, 128],
    ["Color Viking", "Ro-Pax", "Norway", "Skagerrak", 16, 14, 252, 90],
    ["Hanse Trader", "General cargo", "Germany", "Baltic Sea", 45, 3, 312, 118],
    ["Atlantic Dawn", "Trawler", "Ireland", "Atlantic", 8, 4, 170, 120],
    ["Gdynia Star", "Container", "Poland", "Baltic Sea", 29, 9, 330, 124],
    ["Bergen Explorer", "Expedition cruise", "Norway", "Arctic", 52, 16, 245, 60],
    ["Singapore Hope", "Tanker", "Singapore", "South China Sea", 13, 8, 610, 225],
    ["Rhine Carrier", "Inland barge", "Netherlands", "North Sea", 60, 2, 258, 150],
    ["Skagen Wind", "SOV (wind)", "Denmark", "North Sea", 21, 6, 246, 116],
    ["Helsinki Express", "Ro-Pax", "Finland", "Gulf of Finland", 34, 11, 345, 108],
    ["Aberdeen Tide", "Offshore PSV", "UK", "North Sea", 7, 5, 210, 96],
    ["Lübeck Maersk", "Container", "Denmark", "Baltic Sea", 41, 13, 305, 128],
  ];

  const SEED_STATIONS = [
    { id: "esbjerg", name: "Esbjerg (HQ)", country: "Denmark", bays: 8, daily: 14 },
    { id: "rotterdam", name: "Rotterdam", country: "Netherlands", bays: 6, daily: 12 },
    { id: "hamburg", name: "Hamburg", country: "Germany", bays: 5, daily: 10 },
    { id: "gothenburg", name: "Gothenburg", country: "Sweden", bays: 4, daily: 8 },
    { id: "bergen", name: "Bergen", country: "Norway", bays: 3, daily: 6 },
    { id: "singapore", name: "Singapore", country: "Singapore", bays: 9, daily: 16 },
  ];

  // which station VIKING would route each region to
  const REGION_PORT = {
    "North Sea": "esbjerg",
    "Norwegian Sea": "bergen",
    "Arctic": "bergen",
    "Skagerrak": "gothenburg",
    "Baltic Sea": "hamburg",
    "Gulf of Finland": "gothenburg",
    "Atlantic": "rotterdam",
    "Strait of Malacca": "singapore",
    "South China Sea": "singapore",
  };

  const SEED_PARTS = [
    { sku: "CO2-35", name: "CO₂ Inflation Cylinder", stock: 420, reserved: 0, reorder: 120, perRaft: 1 },
    { sku: "HRU-12", name: "Hydrostatic Release Unit", stock: 175, reserved: 0, reorder: 70, perRaft: 1 },
    { sku: "FLR-SET", name: "SOLAS Pyrotechnic Flare Set", stock: 96, reserved: 0, reorder: 45, perRaft: 1 },
    { sku: "RTN-24", name: "Survival Ration Pack (24p)", stock: 310, reserved: 0, reorder: 90, perRaft: 1 },
    { sku: "PCH-KIT", name: "Tube Repair Patch Kit", stock: 64, reserved: 0, reorder: 28, perBooking: 1 },
    { sku: "SLG-300", name: "Seam Sealant 300 ml", stock: 130, reserved: 0, reorder: 55, perBooking: 1 },
  ];

  /* ---------- state ---------- */
  let state = null;
  const listeners = [];

  function seed() {
    const vessels = SEED_VESSELS.map((v, i) => {
      const [name, type, flag, region, days, rafts, x, y] = v;
      const stationId = REGION_PORT[region] || "esbjerg";
      return {
        id: "V" + (1000 + i),
        imo: "IMO" + (9100000 + i * 137),
        name, type, flag, region, rafts, x, y, stationId,
        certDays: days,                 // days until certificate expires
        lastService: daysAgoISO(365 - days * 5 - 40),
        bookingId: null,
        serviced: false,
      };
    });
    return {
      seq: 1,
      vessels,
      stations: SEED_STATIONS.map((s) => ({ ...s })),
      parts: SEED_PARTS.map((p) => ({ ...p })),
      bookings: [],
      activity: [
        { c: "#38bdf8", t: "Sensor sync complete · 1,284 rafts reporting", ts: Date.now() - 120000 },
        { c: "#ffb020", t: "Baltic Pearl certificate entered 14-day window", ts: Date.now() - 660000 },
        { c: "#38bdf8", t: "Rotterdam capacity updated → 94%", ts: Date.now() - 2400000 },
      ],
    };
  }

  function daysAgoISO(d) {
    return new Date(Date.now() - d * DAY).toISOString().slice(0, 10);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { state = JSON.parse(raw); return; }
    } catch (e) {}
    state = seed();
    save();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function emit() { save(); listeners.forEach((fn) => fn(state)); }

  /* ---------- derived helpers ---------- */
  const sev = (d) => (d <= 10 ? "crit" : d <= 30 ? "warn" : "ok");
  const sevColor = (d) => (d <= 10 ? "#e6394a" : d <= 30 ? "#ffb020" : "#38bdf8");
  const sevLabel = (d) => (d <= 10 ? "Critical" : d <= 30 ? "Expiring" : "Compliant");

  function stationById(id) { return state.stations.find((s) => s.id === id); }
  function vesselById(id) { return state.vessels.find((v) => v.id === id); }
  function partBySku(sku) { return state.parts.find((p) => p.sku === sku); }

  // parts needed for a booking of N rafts
  function partsNeeded(rafts) {
    const out = {};
    state.parts.forEach((p) => {
      if (p.perRaft) out[p.sku] = p.perRaft * rafts;
      else if (p.perBooking) out[p.sku] = p.perBooking * Math.max(1, Math.ceil(rafts / 3));
    });
    return out;
  }

  function expiringVessels(within) {
    return state.vessels
      .filter((v) => !v.bookingId && v.certDays <= (within || 31))
      .sort((a, b) => a.certDays - b.certDays);
  }

  // weekly load per station from upcoming bookings (rafts)
  function stationLoad(stationId) {
    const st = stationById(stationId);
    const weekly = st.daily * 5;
    const booked = state.bookings
      .filter((b) => b.stationId === stationId && b.status === "upcoming")
      .reduce((s, b) => s + b.rafts, 0);
    const base = Math.round(weekly * 0.62); // existing baseline demand
    const pct = Math.min(100, Math.round(((base + booked) / weekly) * 100));
    return { pct, booked, capacity: weekly, base };
  }

  /* ---------- actions ---------- */
  function logActivity(t, c) {
    state.activity.unshift({ c: c || "#22c08a", t, ts: Date.now() });
    state.activity = state.activity.slice(0, 40);
  }

  function createBooking({ vesselId, date, time, bay, stationId }) {
    const v = vesselById(vesselId);
    if (!v || v.bookingId) return null;
    const station = stationById(stationId || v.stationId);
    const parts = partsNeeded(v.rafts);
    // reserve parts
    Object.entries(parts).forEach(([sku, qty]) => {
      const p = partBySku(sku);
      if (p) p.reserved += qty;
    });
    const b = {
      id: "B" + (2000 + state.seq++),
      vesselId: v.id,
      vesselName: v.name,
      rafts: v.rafts,
      stationId: station.id,
      port: station.name,
      date, time, bay,
      parts,
      status: "upcoming",
      createdAt: Date.now(),
    };
    state.bookings.unshift(b);
    v.bookingId = b.id;
    logActivity(`<b>${v.name}</b> auto-booked at ${station.name} — ${date} ${time}`, "#22c08a");
    emit();
    return b;
  }

  function cancelBooking(bookingId) {
    const b = state.bookings.find((x) => x.id === bookingId);
    if (!b || b.status !== "upcoming") return;
    // release reserved parts
    Object.entries(b.parts).forEach(([sku, qty]) => {
      const p = partBySku(sku);
      if (p) p.reserved = Math.max(0, p.reserved - qty);
    });
    b.status = "cancelled";
    const v = vesselById(b.vesselId);
    if (v) v.bookingId = null;
    logActivity(`Booking for <b>${b.vesselName}</b> cancelled — parts released`, "#e6394a");
    emit();
  }

  function rescheduleBooking(bookingId, date, time) {
    const b = state.bookings.find((x) => x.id === bookingId);
    if (!b || b.status !== "upcoming") return;
    b.date = date; b.time = time;
    logActivity(`<b>${b.vesselName}</b> rescheduled to ${date} ${time}`, "#38bdf8");
    emit();
  }

  function completeBooking(bookingId) {
    const b = state.bookings.find((x) => x.id === bookingId);
    if (!b || b.status !== "upcoming") return;
    // consume reserved parts from stock
    Object.entries(b.parts).forEach(([sku, qty]) => {
      const p = partBySku(sku);
      if (p) { p.stock = Math.max(0, p.stock - qty); p.reserved = Math.max(0, p.reserved - qty); }
    });
    b.status = "completed";
    b.completedAt = Date.now();
    const v = vesselById(b.vesselId);
    if (v) {
      v.serviced = true;
      v.bookingId = null;
      v.certDays = 365;                       // fresh certificate issued
      v.lastService = new Date().toISOString().slice(0, 10);
      v.certId = "VK-" + b.id + "-" + new Date().getFullYear();
    }
    logActivity(`<b>${b.vesselName}</b> service completed — new SOLAS certificate issued`, "#22c08a");
    emit();
  }

  function reorderPart(sku, qty) {
    const p = partBySku(sku);
    if (!p) return;
    p.stock += qty || (p.reorder * 2);
    logActivity(`Reorder received: <b>${p.name}</b> (+${qty || p.reorder * 2})`, "#38bdf8");
    emit();
  }

  function reset() {
    state = seed();
    emit();
  }

  /* ---------- public ---------- */
  load();
  return {
    get state() { return state; },
    subscribe(fn) { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); },
    // selectors
    vessels: () => state.vessels,
    stations: () => state.stations,
    parts: () => state.parts,
    bookings: () => state.bookings,
    activity: () => state.activity,
    vesselById, stationById, partBySku,
    expiringVessels, stationLoad, partsNeeded,
    sev, sevColor, sevLabel,
    expiryDate: (days) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10),
    // actions
    createBooking, cancelBooking, rescheduleBooking, completeBooking, reorderPart, reset, logActivity, emit,
  };
})();

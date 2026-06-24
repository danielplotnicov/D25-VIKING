/* =========================================================
   VIKING Pulse — Planner dashboard app
   Multi-view SPA over the shared Pulse store.
   ========================================================= */
(function () {
  "use strict";

  const S = window.Pulse;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---------- view state ---------- */
  let currentView = "overview";
  const ui = {
    fleetSearch: "",
    fleetFilter: "all",
    fleetSort: { key: "certDays", dir: 1 },
    bookFilter: "upcoming",
    compFilter: "all",
  };
  // booking-modal working state
  const mb = { vesselId: null, stationId: null, slotIdx: 0, slots: [] };

  /* ---------- formatting ---------- */
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const fmtShort = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  function relTime(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " h ago";
    return Math.floor(s / 86400) + " d ago";
  }

  /* =========================================================
     Toast
     ========================================================= */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    $("#toastMsg").textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* =========================================================
     Modal helpers
     ========================================================= */
  const modalBg = $("#modalBg");
  const modal = $("#modal");
  function openModal(html) { modal.innerHTML = html; modalBg.classList.add("show"); }
  function closeModal() { modalBg.classList.remove("show"); }
  modalBg.addEventListener("click", (e) => { if (e.target === modalBg) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBg.classList.contains("show")) closeModal();
  });

  /* =========================================================
     Booking modal (auto-book) — works from anywhere
     ========================================================= */
  function genSlots(vessel, station) {
    const base = new Date();
    base.setDate(base.getDate() + Math.max(1, vessel.certDays - 4));
    const bays = station ? station.bays : 4;
    const times = ["08:30", "11:00", "14:00"];
    return [0, 1, 2].map((off, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + off);
      return { iso: d.toISOString().slice(0, 10), date: fmtShort(d), time: times[i], bay: "Bay " + ((i % bays) + 1) };
    });
  }

  function openBookingModal(vesselId) {
    mb.vesselId = vesselId || null;
    mb.slotIdx = 0;
    const v = vesselId ? S.vesselById(vesselId) : null;
    if (v) { mb.stationId = v.stationId; mb.slots = genSlots(v, S.stationById(v.stationId)); }
    renderBookingModal();
    modalBg.classList.add("show");
  }

  function renderBookingModal() {
    const v = mb.vesselId ? S.vesselById(mb.vesselId) : null;
    const unbooked = S.vessels().filter((x) => !x.bookingId);

    if (!v) {
      modal.innerHTML = `
        <div class="modal-head"><h3>New booking</h3><button class="x" data-close>×</button></div>
        <div class="modal-body">
          <div class="field">
            <label>Select a vessel awaiting service</label>
            <select id="vesselSelect">
              <option value="">— choose vessel —</option>
              ${unbooked.map((x) => `<option value="${x.id}">${x.name} · ${x.certDays}d to expiry · ${x.type}</option>`).join("")}
            </select>
          </div>
          <p class="muted">Pulse will propose the predicted harbour and open service slots automatically.</p>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">Cancel</button></div>`;
      wireModalClose();
      const sel = $("#vesselSelect");
      sel && sel.addEventListener("change", () => { if (sel.value) openBookingModal(sel.value); });
      return;
    }

    const station = S.stationById(mb.stationId);
    const parts = S.partsNeeded(v.rafts);
    const partsTxt = Object.entries(parts).map(([sku, q]) => `${q}× ${sku}`).join(" · ");

    modal.innerHTML = `
      <div class="modal-head"><h3>Auto-book service</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="match-banner">
          <span class="mb-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <div><b>Match found</b><br><small>Pulse paired live position + certificate + open capacity</small></div>
        </div>
        <div class="detail"><span>Vessel</span><b>${v.name}</b></div>
        <div class="detail"><span>Life rafts to service</span><b>${v.rafts}</b></div>
        <div class="detail"><span>Certificate expires in</span><b style="color:${S.sevColor(v.certDays)}">${v.certDays} days</b></div>
        <div class="field" style="margin-top:14px">
          <label>Predicted harbour</label>
          <select id="stationSelect">
            ${S.stations().map((s) => `<option value="${s.id}" ${s.id === mb.stationId ? "selected" : ""}>${s.name}</option>`).join("")}
          </select>
        </div>
        <p style="color:#8aa3bd;font-size:13px;margin:6px 0 4px">Proposed service slots</p>
        <div class="slots" id="slots">
          ${mb.slots.map((s, i) => `<div class="slot ${i === mb.slotIdx ? "sel" : ""}" data-s="${i}"><b>${s.date}</b><small>${s.time} · ${s.bay}</small></div>`).join("")}
        </div>
        <div class="detail" style="margin-top:12px"><span>Parts auto-reserved</span><b style="font-size:12px;font-weight:600;color:#9fb6cd">${partsTxt}</b></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">Cancel</button>
        <button class="btn btn-primary" id="confirmBtn">Confirm &amp; notify customer</button>
      </div>`;

    wireModalClose();
    $("#stationSelect").addEventListener("change", (e) => {
      mb.stationId = e.target.value;
      mb.slots = genSlots(v, S.stationById(mb.stationId));
      renderBookingModal();
    });
    $$("#slots .slot").forEach((el) =>
      el.addEventListener("click", () => {
        mb.slotIdx = +el.dataset.s;
        $$("#slots .slot").forEach((s) => s.classList.toggle("sel", s === el));
      })
    );
    $("#confirmBtn").addEventListener("click", () => {
      const slot = mb.slots[mb.slotIdx];
      const b = S.createBooking({ vesselId: v.id, date: slot.date, time: slot.time, bay: slot.bay, stationId: mb.stationId });
      if (b) { showBookingSuccess(v, b); showToast(`${v.name} scheduled at ${b.port}`); }
    });
  }

  function showBookingSuccess(v, b) {
    modal.innerHTML = `
      <div class="modal-head"><h3>Booking confirmed</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="success">
          <div class="ring"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h3>${v.name} is scheduled</h3>
          <p>${v.rafts} rafts · ${b.port} · ${b.date} ${b.time} (${b.bay})<br>
          The customer has been notified automatically and parts are reserved.</p>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-primary" data-close>Done</button></div>`;
    wireModalClose();
  }

  function wireModalClose() {
    $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
  }

  /* =========================================================
     Vessel detail modal (from fleet "View")
     ========================================================= */
  function openVesselModal(vesselId) {
    const v = S.vesselById(vesselId);
    if (!v) return;
    // simulated live sensor readings
    const rnd = (a, b) => (a + Math.random() * (b - a)).toFixed(1);
    const co2 = rnd(34, 36), temp = rnd(4, 22), hum = rnd(40, 68);
    const history = S.bookings().filter((b) => b.vesselId === v.id);
    openModal(`
      <div class="modal-head"><h3>${v.name}</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="detail"><span>Type</span><b>${v.type}</b></div>
        <div class="detail"><span>Flag · IMO</span><b>${v.flag} · ${v.imo}</b></div>
        <div class="detail"><span>Region</span><b>${v.region}</b></div>
        <div class="detail"><span>Life rafts</span><b>${v.rafts}</b></div>
        <div class="detail"><span>Certificate</span><b style="color:${S.sevColor(v.certDays)}">${S.sevLabel(v.certDays)} · ${v.certDays}d (${fmtShort(S.expiryDate(v.certDays))})</b></div>
        <div class="detail"><span>Last service</span><b>${fmtDate(v.lastService)}</b></div>
        <p style="color:#8aa3bd;font-size:13px;margin:16px 0 4px">Live sensor readings (on rack)</p>
        <div class="slots">
          <div class="slot"><b>${co2}%</b><small>CO₂ cylinder</small></div>
          <div class="slot"><b>${temp}°C</b><small>Temperature</small></div>
          <div class="slot"><b>${hum}%</b><small>Humidity</small></div>
        </div>
        ${history.length ? `<p style="color:#8aa3bd;font-size:13px;margin:16px 0 4px">Service bookings</p>
          <div class="hist">${history.map((b) => `<div class="h-row"><span>${b.port} · ${b.date} ${b.time}</span><b><span class="badge ${b.status}">${b.status}</span></b></div>`).join("")}</div>` : ""}
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">Close</button>
        ${v.bookingId ? `<button class="btn btn-light" data-close>Already booked</button>` : `<button class="btn btn-primary" id="bookFromDetail">Auto-book service</button>`}
      </div>`);
    wireModalClose();
    const bf = $("#bookFromDetail");
    bf && bf.addEventListener("click", () => openBookingModal(v.id));
  }

  /* =========================================================
     OVERVIEW
     ========================================================= */
  function renderKPIs() {
    const vessels = S.vessels();
    const expiring = S.expiringVessels(30).length;
    const active = S.bookings().filter((b) => b.status === "upcoming").length;
    const loads = S.stations().map((s) => S.stationLoad(s.id).pct);
    const util = Math.round(loads.reduce((a, b) => a + b, 0) / loads.length);
    const tiles = [
      { ico: "k-blue", svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.6"/>`, label: "Tracked vessels", val: vessels.length, d: "▲ live feed", dc: "up" },
      { ico: "k-red", svg: `<path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>`, label: "Certificates ≤ 30 days", val: expiring, d: expiring ? "needs action" : "all handled", dc: expiring ? "warn" : "up" },
      { ico: "k-green", svg: `<path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`, label: "Active bookings", val: active, d: "▲ auto-matched", dc: "up" },
      { ico: "k-orange", svg: `<path d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, label: "Avg station utilisation", val: util + "%", d: "▲ +14% vs manual", dc: "up" },
    ];
    $("#kpis").innerHTML = tiles.map((t) => `
      <div class="kpi">
        <div class="k-ico ${t.ico}"><svg viewBox="0 0 24 24" fill="none">${t.svg}</svg></div>
        <span class="label">${t.label}</span>
        <b>${t.val}</b>
        <span class="delta ${t.dc}">${t.d}</span>
      </div>`).join("");
  }

  function renderMap() {
    const layer = $("#dashVessels");
    const tip = $("#mapTip");
    const mapWrap = $("#dashMap");
    if (!layer) return;
    layer.innerHTML = "";

    // background compliant scatter
    for (let i = 0; i < 55; i++) {
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("cx", 60 + Math.random() * 640);
      c.setAttribute("cy", 60 + Math.random() * 270);
      c.setAttribute("r", "1.5");
      c.setAttribute("fill", "rgba(56,189,248,.3)");
      layer.appendChild(c);
    }

    S.vessels().forEach((v, i) => {
      const booked = !!v.bookingId;
      const color = booked ? "#22c08a" : S.sevColor(v.certDays);
      if (!booked && v.certDays <= 30) {
        const ring = document.createElementNS(SVGNS, "circle");
        ring.setAttribute("cx", v.x); ring.setAttribute("cy", v.y); ring.setAttribute("r", "3");
        ring.setAttribute("fill", "none"); ring.setAttribute("stroke", color); ring.setAttribute("stroke-width", "1.4");
        ring.style.transformBox = "fill-box"; ring.style.transformOrigin = "center";
        ring.style.animation = `ringPulse 2.4s ${(i * 0.18).toFixed(2)}s infinite ease-out`;
        layer.appendChild(ring);
      }
      const dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("cx", v.x); dot.setAttribute("cy", v.y);
      dot.setAttribute("r", !booked && v.certDays <= 10 ? "4.5" : "3.6");
      dot.setAttribute("fill", color);
      dot.setAttribute("class", "vessel");
      layer.appendChild(dot);

      dot.addEventListener("mouseenter", () => {
        const rect = mapWrap.getBoundingClientRect();
        const svg = $("#mapSvg");
        const sx = rect.width / svg.viewBox.baseVal.width;
        const sy = rect.height / svg.viewBox.baseVal.height;
        tip.style.left = v.x * sx + "px";
        tip.style.top = v.y * sy + "px";
        tip.innerHTML = `<b>${v.name}</b>${v.type} · ${v.rafts} rafts<br>${booked ? "✓ booked for service" : v.certDays <= 30 ? "⚠ cert expires in " + v.certDays + "d" : "compliant"}`;
        tip.classList.add("show");
      });
      dot.addEventListener("mouseleave", () => tip.classList.remove("show"));
      dot.addEventListener("click", () => (booked ? openVesselModal(v.id) : openBookingModal(v.id)));
    });
    $("#mapMeta").textContent = `${S.vessels().length} vessels in view · 280+ stations network`;
  }

  function renderQueue() {
    const q = $("#queue");
    const list = S.expiringVessels(31);
    if (!list.length) {
      q.innerHTML = `<div class="empty" style="padding:30px"><h3>All clear ✓</h3><p>No certificates need action right now.</p></div>`;
      return;
    }
    q.innerHTML = list.map((v) => `
      <div class="cert">
        <span class="days ${S.sev(v.certDays)}">${v.certDays}d</span>
        <div class="vinfo"><b>${v.name}</b><small>${v.type} · → ${S.stationById(v.stationId).name}</small></div>
        <button class="act" data-book="${v.id}">Auto-book</button>
      </div>`).join("");
    $$("#queue .act").forEach((b) => b.addEventListener("click", () => openBookingModal(b.dataset.book)));
  }

  function renderCap() {
    $("#cap").innerHTML = S.stations().map((s) => {
      const l = S.stationLoad(s.id);
      return `<div class="cap-row">
        <div class="ct"><b>${s.name}</b><span>${l.pct}%</span></div>
        <div class="bar"><i class="${l.pct >= 90 ? "hot" : ""}" style="width:${l.pct}%"></i></div>
      </div>`;
    }).join("");
  }

  function renderSpark() {
    const spark = $("#spark");
    const base = [12, 18, 15, 22, 28, 9, 6];
    // add Esbjerg upcoming bookings spread across the week
    const esbjergBooked = S.bookings().filter((b) => b.stationId === "esbjerg" && b.status === "upcoming").length;
    const data = base.map((x, i) => x + (i < esbjergBooked ? 3 : 0));
    const max = Math.max(...data);
    spark.innerHTML = data.map((v) => `<div class="b ${v === max ? "peak" : ""}" style="height:0%" title="${v} rafts"></div>`).join("");
    requestAnimationFrame(() => $$(".b", spark).forEach((b, i) => setTimeout(() => (b.style.height = (data[i] / max) * 100 + "%"), 60 + i * 30)));
  }

  function renderFeed() {
    $("#feed").innerHTML = S.activity().slice(0, 6).map((f) => `
      <div class="feed-item"><span class="fdot" style="background:${f.c}"></span>
        <div><div class="ftext">${f.t}</div><div class="ftime">${relTime(f.ts)}</div></div>
      </div>`).join("");
  }

  function renderOverview() {
    renderKPIs(); renderMap(); renderQueue(); renderCap(); renderSpark(); renderFeed();
  }

  /* =========================================================
     LIVE FLEET (table)
     ========================================================= */
  function renderFleet() {
    const body = $("#fleetBody");
    const term = ui.fleetSearch.toLowerCase();
    let rows = S.vessels().filter((v) => {
      if (term && !(v.name + v.type + v.flag + v.region).toLowerCase().includes(term)) return false;
      const f = ui.fleetFilter;
      if (f === "booked") return !!v.bookingId;
      if (f === "all") return true;
      if (v.bookingId) return false;
      return S.sev(v.certDays) === f;
    });
    const { key, dir } = ui.fleetSort;
    rows.sort((a, b) => (typeof a[key] === "number" ? (a[key] - b[key]) * dir : String(a[key]).localeCompare(String(b[key])) * dir));

    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="8"><div class="empty"><h3>No vessels match</h3><p>Try a different search or filter.</p></div></td></tr>`;
    } else {
      body.innerHTML = rows.map((v) => {
        const status = v.bookingId
          ? `<span class="badge booked">Booked</span>`
          : `<span class="badge ${S.sev(v.certDays)}">${S.sevLabel(v.certDays)}</span>`;
        return `<tr>
          <td><div class="vname">${v.name}</div><div class="vsub">${v.imo}</div></td>
          <td>${v.type}</td><td>${v.flag}</td><td>${v.region}</td>
          <td class="num">${v.rafts}</td>
          <td class="num" style="color:${v.bookingId ? "#6ee3b6" : S.sevColor(v.certDays)}">${v.bookingId ? "scheduled" : v.certDays + "d"}</td>
          <td>${status}</td>
          <td><div class="row-actions">
            <button class="btn-xs ghost" data-view-vessel="${v.id}">View</button>
            ${v.bookingId ? "" : `<button class="btn-xs book" data-book="${v.id}">Auto-book</button>`}
          </div></td>
        </tr>`;
      }).join("");
    }
    $$("#fleetBody [data-book]").forEach((b) => b.addEventListener("click", () => openBookingModal(b.dataset.book)));
    $$("#fleetBody [data-view-vessel]").forEach((b) => b.addEventListener("click", () => openVesselModal(b.dataset.viewVessel)));
    // sort indicators
    $$("#fleetTable thead th").forEach((th) => {
      th.classList.toggle("sorted", th.dataset.sort === key);
      th.classList.toggle("asc", th.dataset.sort === key && dir === 1);
    });
  }

  /* =========================================================
     BOOKINGS
     ========================================================= */
  function renderBookings() {
    const wrap = $("#bookingsWrap");
    const f = ui.bookFilter;
    const list = S.bookings().filter((b) => f === "all" || b.status === f);
    if (!list.length) {
      wrap.innerHTML = `<div class="card"><div class="empty">
        <div class="e-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2"/></svg></div>
        <h3>No ${f === "all" ? "" : f} bookings yet</h3>
        <p>Auto-book a vessel from the fleet or the overview queue to see it here.</p>
      </div></div>`;
      return;
    }
    wrap.innerHTML = `<div class="booking-list">${list.map((b) => {
      const partsTxt = Object.entries(b.parts).map(([sku, q]) => `${q}× ${sku}`).join(" · ");
      return `<div class="booking">
        <div class="b-main">
          <div class="b-title"><b>${b.vesselName}</b><span class="badge ${b.status}">${b.status}</span></div>
          <div class="b-meta">
            <span>📍 <b>${b.port}</b></span>
            <span>🗓 <b>${b.date} · ${b.time}</b></span>
            <span>🛟 <b>${b.rafts} rafts</b></span>
            <span>🔧 <b>${b.bay}</b></span>
          </div>
          <div class="b-parts">Parts reserved: ${partsTxt}</div>
        </div>
        <div class="b-actions">
          ${b.status === "upcoming" ? `
            <button class="btn-xs go" data-complete="${b.id}">Mark complete</button>
            <button class="btn-xs ghost" data-reschedule="${b.id}">Reschedule</button>
            <button class="btn-xs danger" data-cancel="${b.id}">Cancel</button>` : ""}
        </div>
      </div>`;
    }).join("")}</div>`;

    $$("#bookingsWrap [data-cancel]").forEach((b) => b.addEventListener("click", () => {
      S.cancelBooking(b.dataset.cancel); showToast("Booking cancelled · parts released");
    }));
    $$("#bookingsWrap [data-complete]").forEach((b) => b.addEventListener("click", () => {
      S.completeBooking(b.dataset.complete); showToast("Service completed · certificate issued");
    }));
    $$("#bookingsWrap [data-reschedule]").forEach((b) => b.addEventListener("click", () => openReschedule(b.dataset.reschedule)));
  }

  function openReschedule(bookingId) {
    const b = S.bookings().find((x) => x.id === bookingId);
    if (!b) return;
    const opts = [1, 3, 5, 8].map((off) => {
      const d = new Date(); d.setDate(d.getDate() + off);
      return fmtShort(d);
    });
    openModal(`
      <div class="modal-head"><h3>Reschedule ${b.vesselName}</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="detail"><span>Current</span><b>${b.date} · ${b.time}</b></div>
        <div class="field" style="margin-top:14px"><label>New date</label>
          <select id="rsDate">${opts.map((o) => `<option>${o}</option>`).join("")}</select></div>
        <div class="field"><label>New time</label>
          <select id="rsTime"><option>08:30</option><option>11:00</option><option>14:00</option><option>16:30</option></select></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">Cancel</button>
        <button class="btn btn-primary" id="rsSave">Save</button>
      </div>`);
    wireModalClose();
    $("#rsSave").addEventListener("click", () => {
      S.rescheduleBooking(bookingId, $("#rsDate").value, $("#rsTime").value);
      closeModal(); showToast("Booking rescheduled");
    });
  }

  /* =========================================================
     COMPLIANCE
     ========================================================= */
  function renderCompliance() {
    const vessels = S.vessels();
    const crit = vessels.filter((v) => !v.bookingId && v.certDays <= 10).length;
    const warn = vessels.filter((v) => !v.bookingId && v.certDays > 10 && v.certDays <= 30).length;
    const serviced = vessels.filter((v) => v.serviced).length;
    const ok = vessels.length - crit - warn;
    $("#compSummary").innerHTML = `
      <div class="comp-tile"><b>${ok}</b><span>Compliant vessels</span></div>
      <div class="comp-tile"><b style="color:#ffb020">${warn}</b><span>Expiring ≤ 30 days</span></div>
      <div class="comp-tile"><b style="color:#ff8a96">${crit}</b><span>Critical / at risk</span></div>
      <div class="comp-tile"><b style="color:#6ee3b6">${serviced}</b><span>Serviced this cycle</span></div>`;

    let rows = vessels.slice();
    if (ui.compFilter === "crit") rows = rows.filter((v) => !v.bookingId && v.certDays <= 30);
    if (ui.compFilter === "serviced") rows = rows.filter((v) => v.serviced);
    rows.sort((a, b) => a.certDays - b.certDays);

    $("#compBody").innerHTML = rows.map((v) => {
      const st = v.bookingId ? "booked" : S.sev(v.certDays);
      const label = v.bookingId ? "Service booked" : S.sevLabel(v.certDays);
      const cert = v.serviced
        ? `<button class="btn-xs go" data-cert="${v.id}">⤓ ${v.certId}</button>`
        : `<span class="vsub">${v.bookingId ? "issued after service" : "current"}</span>`;
      return `<tr>
        <td><div class="vname">${v.name}</div><div class="vsub">${v.type}</div></td>
        <td class="vsub">${v.imo}</td>
        <td>${fmtDate(v.lastService)}</td>
        <td class="num" style="color:${v.certDays > 30 ? "#6ee3b6" : S.sevColor(v.certDays)}">${v.certDays}d</td>
        <td><span class="badge ${st}">${label}</span></td>
        <td>${cert}</td>
      </tr>`;
    }).join("");
    $$("#compBody [data-cert]").forEach((b) => b.addEventListener("click", () => downloadCert(b.dataset.cert)));
  }

  function downloadCert(vesselId) {
    const v = S.vesselById(vesselId);
    const txt =
`VIKING LIFE-SAVING EQUIPMENT
SOLAS LIFE-RAFT SERVICE CERTIFICATE
=====================================

Certificate ID : ${v.certId}
Vessel         : ${v.name}
IMO number     : ${v.imo}
Flag state     : ${v.flag}
Life rafts     : ${v.rafts}
Service date   : ${fmtDate(v.lastService)}
Valid until    : ${fmtDate(S.expiryDate(v.certDays))}
Issued by      : VIKING Pulse · Esbjerg HQ

This certifies the above life rafts were serviced and
inspected in accordance with SOLAS requirements.

(Demo certificate generated by VIKING Pulse prototype.)`;
    download(`${v.name.replace(/\s+/g, "_")}_SOLAS_certificate.txt`, txt, "text/plain");
    showToast("Certificate downloaded");
  }

  function exportAudit() {
    const head = ["Vessel", "IMO", "Type", "Flag", "Region", "Rafts", "LastService", "CertValidDays", "Status", "CertificateID"];
    const lines = S.vessels().map((v) => [
      v.name, v.imo, v.type, v.flag, v.region, v.rafts, v.lastService, v.certDays,
      v.bookingId ? "Booked" : S.sevLabel(v.certDays), v.certId || "",
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
    download("viking-pulse-compliance-audit.csv", [head.join(","), ...lines].join("\n"), "text/csv");
    showToast("Audit report exported (CSV)");
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  /* =========================================================
     SPARE PARTS
     ========================================================= */
  function renderParts() {
    const parts = S.parts();
    const low = parts.filter((p) => p.stock - p.reserved <= p.reorder);
    $("#partsAlert").innerHTML = low.length
      ? `<div class="alert-bar"><svg viewBox="0 0 24 24" fill="none"><path d="M12 9v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.1" fill="currentColor"/><path d="M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        ${low.length} part${low.length > 1 ? "s" : ""} at or below reorder level — reorder to keep bookings flowing.</div>`
      : `<div class="part-legend"><span><i style="background:#1e7ae0"></i>Available</span><span><i style="background:#ff7a33"></i>Reserved (committed to bookings)</span></div>`;

    $("#partsGrid").innerHTML = parts.map((p) => {
      const avail = p.stock - p.reserved;
      const isLow = avail <= p.reorder;
      const resPct = (p.reserved / p.stock) * 100;
      const availPct = (avail / p.stock) * 100;
      return `<div class="part">
        <div class="p-head"><div><b>${p.name}</b><small>${p.sku}</small></div>
          <span class="badge ${isLow ? "crit" : "ok"}">${isLow ? "Low" : "OK"}</span></div>
        <div class="p-stat"><span>Available</span><b>${avail}</b></div>
        <div class="p-stat"><span>Reserved</span><b style="color:var(--orange)">${p.reserved}</b></div>
        <div class="p-bar"><i class="avail" style="width:${availPct}%"></i><i class="res" style="width:${resPct}%"></i></div>
        <div class="p-foot"><small class="vsub">In stock ${p.stock} · reorder @ ${p.reorder}</small>
          <button class="btn-xs ghost" data-reorder="${p.sku}">Reorder</button></div>
      </div>`;
    }).join("");
    $$("#partsGrid [data-reorder]").forEach((b) => b.addEventListener("click", () => {
      S.reorderPart(b.dataset.reorder); showToast("Reorder placed");
    }));
  }

  /* =========================================================
     FORECAST
     ========================================================= */
  function demandSeries() {
    const out = [];
    const cap = S.stations().reduce((s, st) => s + st.daily, 0); // network daily capacity
    const upcoming = S.bookings().filter((b) => b.status === "upcoming").length;
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const dow = d.getDay();
      const weekend = dow === 0 || dow === 6 ? 0.45 : 1;
      const wave = Math.sin(i / 2) * 9;
      let demand = Math.round((cap * 0.85 + wave) * weekend) + (i % 3) + (i < upcoming ? 4 : 0);
      out.push({ d, demand, cap });
    }
    return out;
  }

  function renderForecast() {
    const series = demandSeries();
    const max = Math.max(...series.map((s) => Math.max(s.demand, s.cap)));
    $("#forecastChart").innerHTML = `
      <div class="fc-legend"><span><i style="background:#38bdf8"></i>Forecast demand</span>
        <span><i style="background:#e6394a"></i>Over capacity</span>
        <span style="margin-left:auto;color:#6f86a0">Network capacity ≈ ${series[0].cap}/day</span></div>
      <div class="fc-chart">${series.map((s) => {
        const within = Math.min(s.demand, s.cap);
        const over = Math.max(0, s.demand - s.cap);
        return `<div class="fc-col" title="${s.demand} rafts">
          <div class="stack"><div class="over" style="height:0%" data-h="${(over / max) * 100}"></div><div class="dem" style="height:0%" data-h="${(within / max) * 100}"></div></div>
          <div class="fc-x">${s.d.getDate()}/${s.d.getMonth() + 1}</div>
        </div>`;
      }).join("")}</div>`;
    requestAnimationFrame(() => $$("#forecastChart .stack > i, #forecastChart .stack > div").forEach((el, i) =>
      setTimeout(() => (el.style.height = (el.dataset.h || 0) + "%"), 40 + i * 12)));

    $("#stationCards").innerHTML = S.stations().map((st) => {
      const l = S.stationLoad(st.id);
      const hot = l.pct >= 90;
      const rec = hot
        ? `<span style="color:#ff8a96">⚠ Near capacity — Pulse suggests routing new bookings to a neighbouring station.</span>`
        : `<span style="color:#6ee3b6">✓ Healthy headroom for ${Math.max(0, l.capacity - l.base - l.booked)} more rafts this week.</span>`;
      return `<div class="part">
        <div class="p-head"><div><b>${st.name}</b><small>${st.country} · ${st.bays} bays</small></div>
          <span class="badge ${hot ? "crit" : "ok"}">${l.pct}%</span></div>
        <div class="p-stat"><span>Weekly capacity</span><b>${l.capacity} rafts</b></div>
        <div class="p-stat"><span>Booked via Pulse</span><b style="color:var(--orange)">${l.booked}</b></div>
        <div class="bar" style="margin:10px 0 12px"><i class="${hot ? "hot" : ""}" style="width:${l.pct}%"></i></div>
        <small class="muted" style="font-size:12.5px">${rec}</small>
      </div>`;
    }).join("");
  }

  /* =========================================================
     Router + render dispatch
     ========================================================= */
  const TITLES = {
    overview: ["Planner Overview", "Esbjerg HQ · global network · "],
    fleet: ["Live Fleet", "Real-time vessel & certificate tracking · "],
    bookings: ["Bookings", "Auto-matched service appointments · "],
    compliance: ["Compliance & SOLAS", "Auditable service records · "],
    parts: ["Spare Parts", "Inventory linked to bookings · "],
    forecast: ["Demand Forecast", "Capacity planning across the network · "],
  };

  function setView(view) {
    if (!TITLES[view]) view = "overview";
    currentView = view;
    $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === view));
    $$("#nav .navlink").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    $("#viewTitle").textContent = TITLES[view][0];
    $("#viewSub").innerHTML = TITLES[view][1] + `<span id="clock">${clockStr()}</span>`;
    renderView(view);
    document.querySelector(".content").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function renderView(view) {
    ({
      overview: renderOverview, fleet: renderFleet, bookings: renderBookings,
      compliance: renderCompliance, parts: renderParts, forecast: renderForecast,
    }[view] || renderOverview)();
  }

  function renderBadges() {
    const exp = S.expiringVessels(30).length;
    const up = S.bookings().filter((b) => b.status === "upcoming").length;
    const low = S.parts().filter((p) => p.stock - p.reserved <= p.reorder).length;
    setBadge("#badgeFleet", exp);
    setBadge("#badgeBookings", up);
    setBadge("#badgeParts", low);
  }
  function setBadge(sel, n) { const el = $(sel); el.textContent = n > 0 ? n : ""; }

  /* ---------- clock ---------- */
  function clockStr() { return new Date().toLocaleTimeString("en-GB"); }
  setInterval(() => { const c = $("#clock"); if (c) c.textContent = clockStr(); }, 1000);

  /* =========================================================
     Wiring (one-time)
     ========================================================= */
  // nav / hash routing
  window.addEventListener("hashchange", () => setView(location.hash.replace("#", "")));

  // fleet toolbar
  $("#fleetSearch").addEventListener("input", (e) => { ui.fleetSearch = e.target.value; renderFleet(); });
  $("#fleetFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip-f"); if (!b) return;
    ui.fleetFilter = b.dataset.f;
    $$("#fleetFilters .chip-f").forEach((x) => x.classList.toggle("active", x === b));
    renderFleet();
  });
  $("#fleetTable").querySelector("thead").addEventListener("click", (e) => {
    const th = e.target.closest("th[data-sort]"); if (!th) return;
    const key = th.dataset.sort;
    if (ui.fleetSort.key === key) ui.fleetSort.dir *= -1;
    else ui.fleetSort = { key, dir: 1 };
    renderFleet();
  });

  // bookings toolbar
  $("#bookFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip-f"); if (!b) return;
    ui.bookFilter = b.dataset.f;
    $$("#bookFilters .chip-f").forEach((x) => x.classList.toggle("active", x === b));
    renderBookings();
  });
  $("#newBookingBtn").addEventListener("click", () => openBookingModal(null));

  // compliance toolbar
  $("#compFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip-f"); if (!b) return;
    ui.compFilter = b.dataset.f;
    $$("#compFilters .chip-f").forEach((x) => x.classList.toggle("active", x === b));
    renderCompliance();
  });
  $("#exportBtn").addEventListener("click", exportAudit);

  // reset
  $("#resetBtn").addEventListener("click", () => {
    if (confirm("Reset all demo data (bookings, parts, certificates)?")) {
      S.reset(); showToast("Demo data reset");
    }
  });

  // store subscription — re-render whatever's on screen + badges
  S.subscribe(() => { renderBadges(); renderView(currentView); });

  // ambient sensor chatter (visual life)
  const ambient = [
    ["Sensor drift cleared on Sea Falcon", "#38bdf8"],
    ["Gothenburg capacity recalculated", "#38bdf8"],
    ["New vessel onboarded: MV Helios", "#22c08a"],
    ["Hamburg parts inventory synced", "#38bdf8"],
  ];
  let ai = 0;
  setInterval(() => {
    S.logActivity(ambient[ai % ambient.length][0], ambient[ai % ambient.length][1]);
    S.emit();
    ai++;
  }, 12000);

  /* ---------- boot ---------- */
  renderBadges();
  setView(location.hash.replace("#", "") || "overview");
})();

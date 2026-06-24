/* =========================================================
   VIKING Pulse — Planner dashboard app
   Multi-view SPA over the shared Pulse store, fully i18n-aware.
   ========================================================= */
(function () {
  "use strict";

  const S = window.Pulse;
  const T = (k, p) => (window.I18N ? window.I18N.t(k, p) : k);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SVGNS = "http://www.w3.org/2000/svg";

  let currentView = "overview";
  const ui = { fleetSearch: "", fleetFilter: "all", fleetSort: { key: "certDays", dir: 1 }, bookFilter: "upcoming", compFilter: "all" };
  const mb = { vesselId: null, stationId: null, slotIdx: 0, slots: [] };

  /* ---------- formatting ---------- */
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const fmtShort = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  function relTime(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return T("rel.now");
    if (s < 3600) return T("rel.min", { n: Math.floor(s / 60) });
    if (s < 86400) return T("rel.hour", { n: Math.floor(s / 3600) });
    return T("rel.day", { n: Math.floor(s / 86400) });
  }
  const statusLabel = (days) => T("status." + S.sev(days));

  /* ---------- toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(msg) {
    $("#toastMsg").textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ---------- modal ---------- */
  const modalBg = $("#modalBg");
  const modal = $("#modal");
  function openModal(html) { modal.innerHTML = html; modalBg.classList.add("show"); }
  function closeModal() { modalBg.classList.remove("show"); }
  modalBg.addEventListener("click", (e) => { if (e.target === modalBg) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modalBg.classList.contains("show")) closeModal(); });
  function wireModalClose() { $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal)); }

  /* =========================================================
     Booking modal (auto-book)
     ========================================================= */
  function genSlots(vessel, station) {
    const base = new Date();
    base.setDate(base.getDate() + Math.max(1, vessel.certDays - 4));
    const bays = station ? station.bays : 4;
    const times = ["08:30", "11:00", "14:00"];
    return [0, 1, 2].map((off, i) => {
      const d = new Date(base); d.setDate(d.getDate() + off);
      return { iso: d.toISOString().slice(0, 10), date: fmtShort(d), time: times[i], bay: "Bay " + ((i % bays) + 1) };
    });
  }

  function openBookingModal(vesselId) {
    mb.vesselId = vesselId || null; mb.slotIdx = 0;
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
        <div class="modal-head"><h3>${T("modal.newbooking")}</h3><button class="x" data-close>×</button></div>
        <div class="modal-body">
          <div class="field">
            <label>${T("modal.chooseVessel")}</label>
            <select id="vesselSelect">
              <option value="">${T("modal.choose")}</option>
              ${unbooked.map((x) => `<option value="${x.id}">${x.name} · ${T("modal.toExpiry", { d: x.certDays })} · ${x.type}</option>`).join("")}
            </select>
          </div>
          <p class="muted">${T("modal.autoHint")}</p>
        </div>
        <div class="modal-foot"><button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">${T("btn.cancel")}</button></div>`;
      wireModalClose();
      const sel = $("#vesselSelect");
      sel && sel.addEventListener("change", () => { if (sel.value) openBookingModal(sel.value); });
      return;
    }

    const parts = S.partsNeeded(v.rafts);
    const partsTxt = Object.entries(parts).map(([sku, q]) => `${q}× ${sku}`).join(" · ");

    modal.innerHTML = `
      <div class="modal-head"><h3>${T("modal.autobook")}</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="match-banner">
          <span class="mb-ico"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <div><b>${T("modal.matchFound")}</b><br><small>${T("modal.matchSub")}</small></div>
        </div>
        <div class="detail"><span>${T("modal.vessel")}</span><b>${v.name}</b></div>
        <div class="detail"><span>${T("modal.raftsToService")}</span><b>${v.rafts}</b></div>
        <div class="detail"><span>${T("modal.certExpiresIn")}</span><b style="color:${S.sevColor(v.certDays)}">${T("modal.days", { d: v.certDays })}</b></div>
        <div class="field" style="margin-top:14px">
          <label>${T("modal.harbour")}</label>
          <select id="stationSelect">
            ${S.stations().map((s) => `<option value="${s.id}" ${s.id === mb.stationId ? "selected" : ""}>${s.name}</option>`).join("")}
          </select>
        </div>
        <p style="color:#8aa3bd;font-size:13px;margin:6px 0 4px">${T("modal.proposedSlots")}</p>
        <div class="slots" id="slots">
          ${mb.slots.map((s, i) => `<div class="slot ${i === mb.slotIdx ? "sel" : ""}" data-s="${i}"><b>${s.date}</b><small>${s.time} · ${s.bay}</small></div>`).join("")}
        </div>
        <div class="detail" style="margin-top:12px"><span>${T("modal.partsReserved")}</span><b style="font-size:12px;font-weight:600;color:#9fb6cd">${partsTxt}</b></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">${T("btn.cancel")}</button>
        <button class="btn btn-primary" id="confirmBtn">${T("btn.confirm")}</button>
      </div>`;

    wireModalClose();
    $("#stationSelect").addEventListener("change", (e) => {
      mb.stationId = e.target.value;
      mb.slots = genSlots(v, S.stationById(mb.stationId));
      renderBookingModal();
    });
    $$("#slots .slot").forEach((el) => el.addEventListener("click", () => {
      mb.slotIdx = +el.dataset.s;
      $$("#slots .slot").forEach((s) => s.classList.toggle("sel", s === el));
    }));
    $("#confirmBtn").addEventListener("click", () => {
      const slot = mb.slots[mb.slotIdx];
      const b = S.createBooking({ vesselId: v.id, date: slot.date, time: slot.time, bay: slot.bay, stationId: mb.stationId });
      if (b) { showBookingSuccess(v, b); showToast(T("toast.scheduledAt", { vessel: v.name, port: b.port })); }
    });
  }

  function showBookingSuccess(v, b) {
    modal.innerHTML = `
      <div class="modal-head"><h3>${T("modal.confirmed")}</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="success">
          <div class="ring"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h3>${T("modal.scheduledTitle", { vessel: v.name })}</h3>
          <p>${T("modal.scheduledBody", { rafts: v.rafts, port: b.port, date: b.date, time: b.time, bay: b.bay })}<br>${T("modal.notified")}</p>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-primary" data-close>${T("btn.done")}</button></div>`;
    wireModalClose();
  }

  /* =========================================================
     Vessel detail modal
     ========================================================= */
  function openVesselModal(vesselId) {
    const v = S.vesselById(vesselId);
    if (!v) return;
    const rnd = (a, b) => (a + Math.random() * (b - a)).toFixed(1);
    const co2 = rnd(34, 36), temp = rnd(4, 22), hum = rnd(40, 68);
    const history = S.bookings().filter((b) => b.vesselId === v.id);
    openModal(`
      <div class="modal-head"><h3>${v.name}</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="detail"><span>${T("modal.type")}</span><b>${v.type}</b></div>
        <div class="detail"><span>${T("modal.flagimo")}</span><b>${v.flag} · ${v.imo}</b></div>
        <div class="detail"><span>${T("modal.region")}</span><b>${v.region}</b></div>
        <div class="detail"><span>${T("modal.rafts")}</span><b>${v.rafts}</b></div>
        <div class="detail"><span>${T("modal.certificate")}</span><b style="color:${S.sevColor(v.certDays)}">${statusLabel(v.certDays)} · ${v.certDays}d (${fmtShort(S.expiryDate(v.certDays))})</b></div>
        <div class="detail"><span>${T("modal.lastService")}</span><b>${fmtDate(v.lastService)}</b></div>
        <p style="color:#8aa3bd;font-size:13px;margin:16px 0 4px">${T("modal.sensors")}</p>
        <div class="slots">
          <div class="slot"><b>${co2}%</b><small>${T("modal.co2")}</small></div>
          <div class="slot"><b>${temp}°C</b><small>${T("modal.temp")}</small></div>
          <div class="slot"><b>${hum}%</b><small>${T("modal.hum")}</small></div>
        </div>
        ${history.length ? `<p style="color:#8aa3bd;font-size:13px;margin:16px 0 4px">${T("modal.history")}</p>
          <div class="hist">${history.map((b) => `<div class="h-row"><span>${b.port} · ${b.date} ${b.time}</span><b><span class="badge ${b.status}">${T("bstatus." + b.status)}</span></b></div>`).join("")}</div>` : ""}
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">${T("btn.close")}</button>
        ${v.bookingId ? `<button class="btn btn-light" data-close>${T("btn.alreadyBooked")}</button>` : `<button class="btn btn-primary" id="bookFromDetail">${T("btn.autobookService")}</button>`}
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
      { ico: "k-blue", svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.6"/>`, label: T("kpi.tracked"), val: vessels.length, d: T("kpi.d.live"), dc: "up" },
      { ico: "k-red", svg: `<path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>`, label: T("kpi.expiring"), val: expiring, d: expiring ? T("kpi.d.needs") : T("kpi.d.handled"), dc: expiring ? "warn" : "up" },
      { ico: "k-green", svg: `<path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`, label: T("kpi.active"), val: active, d: T("kpi.d.matched"), dc: "up" },
      { ico: "k-orange", svg: `<path d="M4 19V5m0 14h16M8 15l3-4 3 2 4-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, label: T("kpi.util"), val: util + "%", d: T("kpi.d.util"), dc: "up" },
    ];
    $("#kpis").innerHTML = tiles.map((t) => `
      <div class="kpi"><div class="k-ico ${t.ico}"><svg viewBox="0 0 24 24" fill="none">${t.svg}</svg></div>
        <span class="label">${t.label}</span><b>${t.val}</b><span class="delta ${t.dc}">${t.d}</span></div>`).join("");
  }

  function renderMap() {
    const layer = $("#dashVessels"), tip = $("#mapTip"), mapWrap = $("#dashMap");
    if (!layer) return;
    layer.innerHTML = "";
    for (let i = 0; i < 55; i++) {
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("cx", 60 + Math.random() * 640); c.setAttribute("cy", 60 + Math.random() * 270);
      c.setAttribute("r", "1.5"); c.setAttribute("fill", "rgba(56,189,248,.3)");
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
      dot.setAttribute("fill", color); dot.setAttribute("class", "vessel");
      layer.appendChild(dot);
      dot.addEventListener("mouseenter", () => {
        const rect = mapWrap.getBoundingClientRect(), svg = $("#mapSvg");
        const sx = rect.width / svg.viewBox.baseVal.width, sy = rect.height / svg.viewBox.baseVal.height;
        tip.style.left = v.x * sx + "px"; tip.style.top = v.y * sy + "px";
        const line = booked ? "✓ " + T("status.booked") : v.certDays <= 30 ? "⚠ " + T("modal.toExpiry", { d: v.certDays }) : T("status.ok");
        tip.innerHTML = `<b>${v.name}</b>${v.type} · ${T("fc.rafts", { n: v.rafts })}<br>${line}`;
        tip.classList.add("show");
      });
      dot.addEventListener("mouseleave", () => tip.classList.remove("show"));
      dot.addEventListener("click", () => (booked ? openVesselModal(v.id) : openBookingModal(v.id)));
    });
    $("#mapMeta").textContent = T("map.meta", { n: S.vessels().length });
  }

  function renderQueue() {
    const q = $("#queue");
    const list = S.expiringVessels(31);
    if (!list.length) {
      q.innerHTML = `<div class="empty" style="padding:30px"><h3>${T("queue.allclear")}</h3><p>${T("queue.none")}</p></div>`;
      return;
    }
    q.innerHTML = list.map((v) => `
      <div class="cert">
        <span class="days ${S.sev(v.certDays)}">${v.certDays}d</span>
        <div class="vinfo"><b>${v.name}</b><small>${v.type} · → ${S.stationById(v.stationId).name}</small></div>
        <button class="act" data-book="${v.id}">${T("btn.autobook")}</button>
      </div>`).join("");
    $$("#queue .act").forEach((b) => b.addEventListener("click", () => openBookingModal(b.dataset.book)));
  }

  function renderCap() {
    $("#cap").innerHTML = S.stations().map((s) => {
      const l = S.stationLoad(s.id);
      return `<div class="cap-row"><div class="ct"><b>${s.name}</b><span>${l.pct}%</span></div>
        <div class="bar"><i class="${l.pct >= 90 ? "hot" : ""}" style="width:${l.pct}%"></i></div></div>`;
    }).join("");
  }

  function renderSpark() {
    const spark = $("#spark");
    const base = [12, 18, 15, 22, 28, 9, 6];
    const esbjergBooked = S.bookings().filter((b) => b.stationId === "esbjerg" && b.status === "upcoming").length;
    const data = base.map((x, i) => x + (i < esbjergBooked ? 3 : 0));
    const max = Math.max(...data);
    spark.innerHTML = data.map((v) => `<div class="b ${v === max ? "peak" : ""}" style="height:0%"></div>`).join("");
    requestAnimationFrame(() => $$(".b", spark).forEach((b, i) => setTimeout(() => (b.style.height = (data[i] / max) * 100 + "%"), 60 + i * 30)));
  }

  function renderFeed() {
    $("#feed").innerHTML = S.activity().slice(0, 6).map((f) => {
      const p = Object.assign({}, f.p);
      if (p.scope) p.scope = T("word." + p.scope);
      const txt = f.k ? T(f.k, p) : (f.t || "");
      return `<div class="feed-item"><span class="fdot" style="background:${f.c}"></span>
        <div><div class="ftext">${txt}</div><div class="ftime">${relTime(f.ts)}</div></div></div>`;
    }).join("");
  }

  function renderOverview() { renderKPIs(); renderMap(); renderQueue(); renderCap(); renderSpark(); renderFeed(); }

  /* =========================================================
     LIVE FLEET
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
      body.innerHTML = `<tr><td colspan="8"><div class="empty"><h3>${T("fleet.none")}</h3><p>${T("fleet.noneSub")}</p></div></td></tr>`;
    } else {
      body.innerHTML = rows.map((v) => {
        const status = v.bookingId ? `<span class="badge booked">${T("status.booked")}</span>` : `<span class="badge ${S.sev(v.certDays)}">${statusLabel(v.certDays)}</span>`;
        return `<tr>
          <td><div class="vname">${v.name}</div><div class="vsub">${v.imo}</div></td>
          <td>${v.type}</td><td>${v.flag}</td><td>${v.region}</td>
          <td class="num">${v.rafts}</td>
          <td class="num" style="color:${v.bookingId ? "#6ee3b6" : S.sevColor(v.certDays)}">${v.bookingId ? T("fleet.scheduled") : v.certDays + "d"}</td>
          <td>${status}</td>
          <td><div class="row-actions">
            <button class="btn-xs ghost" data-view-vessel="${v.id}">${T("btn.view")}</button>
            ${v.bookingId ? "" : `<button class="btn-xs book" data-book="${v.id}">${T("btn.autobook")}</button>`}
          </div></td></tr>`;
      }).join("");
    }
    $$("#fleetBody [data-book]").forEach((b) => b.addEventListener("click", () => openBookingModal(b.dataset.book)));
    $$("#fleetBody [data-view-vessel]").forEach((b) => b.addEventListener("click", () => openVesselModal(b.dataset.viewVessel)));
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
      const title = f === "all" ? T("book.noneAll") : T("book.none", { f: T("bstatus." + f) });
      wrap.innerHTML = `<div class="card"><div class="empty">
        <div class="e-ico"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2"/></svg></div>
        <h3>${title}</h3><p>${T("book.noneSub")}</p></div></div>`;
      return;
    }
    wrap.innerHTML = `<div class="booking-list">${list.map((b) => {
      const partsTxt = Object.entries(b.parts).map(([sku, q]) => `${q}× ${sku}`).join(" · ");
      return `<div class="booking">
        <div class="b-main">
          <div class="b-title"><b>${b.vesselName}</b><span class="badge ${b.status}">${T("bstatus." + b.status)}</span></div>
          <div class="b-meta">
            <span>📍 <b>${b.port}</b></span>
            <span>🗓 <b>${b.date} · ${b.time}</b></span>
            <span>🛟 <b>${T("fc.rafts", { n: b.rafts })}</b></span>
            <span>🔧 <b>${b.bay}</b></span>
          </div>
          <div class="b-parts">${T("book.partsReserved")}${partsTxt}</div>
        </div>
        <div class="b-actions">
          ${b.status === "upcoming" ? `
            <button class="btn-xs go" data-complete="${b.id}">${T("btn.complete")}</button>
            <button class="btn-xs ghost" data-reschedule="${b.id}">${T("btn.reschedule")}</button>
            <button class="btn-xs danger" data-cancel="${b.id}">${T("btn.cancel")}</button>` : ""}
        </div></div>`;
    }).join("")}</div>`;

    $$("#bookingsWrap [data-cancel]").forEach((b) => b.addEventListener("click", () => { S.cancelBooking(b.dataset.cancel); showToast(T("toast.cancelled")); }));
    $$("#bookingsWrap [data-complete]").forEach((b) => b.addEventListener("click", () => { S.completeBooking(b.dataset.complete); showToast(T("toast.completed")); }));
    $$("#bookingsWrap [data-reschedule]").forEach((b) => b.addEventListener("click", () => openReschedule(b.dataset.reschedule)));
  }

  function openReschedule(bookingId) {
    const b = S.bookings().find((x) => x.id === bookingId);
    if (!b) return;
    const opts = [1, 3, 5, 8].map((off) => { const d = new Date(); d.setDate(d.getDate() + off); return fmtShort(d); });
    const stationOpts = S.stations().map((s) => {
      const pct = S.stationLoad(s.id).pct;
      return `<option value="${s.id}" ${s.id === b.stationId ? "selected" : ""}>${s.name} (${pct}%)</option>`;
    }).join("");
    openModal(`
      <div class="modal-head"><h3>${T("resched.title", { vessel: b.vesselName })}</h3><button class="x" data-close>×</button></div>
      <div class="modal-body">
        <div class="detail"><span>${T("resched.current")}</span><b>${b.port} · ${b.date} · ${b.time}</b></div>
        <div class="field" style="margin-top:14px"><label>${T("resched.newPort")}</label>
          <select id="rsPort">${stationOpts}</select></div>
        <p class="muted" style="font-size:12.5px;margin:-6px 0 12px">${T("resched.moveHint")}</p>
        <div class="field"><label>${T("resched.newDate")}</label>
          <select id="rsDate">${opts.map((o) => `<option>${o}</option>`).join("")}</select></div>
        <div class="field"><label>${T("resched.newTime")}</label>
          <select id="rsTime"><option>08:30</option><option>11:00</option><option>14:00</option><option>16:30</option></select></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-close style="border-color:rgba(255,255,255,.2)">${T("btn.cancel")}</button>
        <button class="btn btn-primary" id="rsSave">${T("btn.save")}</button>
      </div>`);
    wireModalClose();
    $("#rsSave").addEventListener("click", () => {
      const newStation = $("#rsPort").value;
      const moved = newStation !== b.stationId;
      S.rescheduleBooking(bookingId, $("#rsDate").value, $("#rsTime").value, newStation);
      closeModal();
      showToast(moved ? T("toast.moved", { port: S.stationById(newStation).name }) : T("toast.rescheduled"));
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
      <div class="comp-tile"><b>${ok}</b><span>${T("comp.tile.ok")}</span></div>
      <div class="comp-tile"><b style="color:#ffb020">${warn}</b><span>${T("comp.tile.warn")}</span></div>
      <div class="comp-tile"><b style="color:#ff8a96">${crit}</b><span>${T("comp.tile.crit")}</span></div>
      <div class="comp-tile"><b style="color:#6ee3b6">${serviced}</b><span>${T("comp.tile.serviced")}</span></div>`;

    let rows = vessels.slice();
    if (ui.compFilter === "crit") rows = rows.filter((v) => !v.bookingId && v.certDays <= 30);
    if (ui.compFilter === "serviced") rows = rows.filter((v) => v.serviced);
    rows.sort((a, b) => a.certDays - b.certDays);

    $("#compBody").innerHTML = rows.map((v) => {
      const st = v.bookingId ? "booked" : S.sev(v.certDays);
      const label = v.bookingId ? T("comp.serviceBooked") : statusLabel(v.certDays);
      const cert = v.serviced
        ? `<button class="btn-xs go" data-cert="${v.id}">⤓ ${v.certId}</button>`
        : `<span class="vsub">${v.bookingId ? T("comp.issued") : T("comp.current")}</span>`;
      return `<tr>
        <td><div class="vname">${v.name}</div><div class="vsub">${v.type}</div></td>
        <td class="vsub">${v.imo}</td><td>${fmtDate(v.lastService)}</td>
        <td class="num" style="color:${v.certDays > 30 ? "#6ee3b6" : S.sevColor(v.certDays)}">${v.certDays}d</td>
        <td><span class="badge ${st}">${label}</span></td><td>${cert}</td></tr>`;
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
    showToast(T("toast.certDl"));
  }

  function exportAudit() {
    const head = ["Vessel", "IMO", "Type", "Flag", "Region", "Rafts", "LastService", "CertValidDays", "Status", "CertificateID"];
    const lines = S.vessels().map((v) => [
      v.name, v.imo, v.type, v.flag, v.region, v.rafts, v.lastService, v.certDays,
      v.bookingId ? "Booked" : S.sevLabel(v.certDays), v.certId || "",
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
    download("viking-pulse-compliance-audit.csv", [head.join(","), ...lines].join("\n"), "text/csv");
    showToast(T("toast.audit"));
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
        ${T(low.length === 1 ? "parts.low1" : "parts.low", { n: low.length })}</div>`
      : `<div class="part-legend"><span><i style="background:#1e7ae0"></i>${T("parts.legendAvail")}</span><span><i style="background:#ff7a33"></i>${T("parts.legendReserved")}</span></div>`;

    $("#partsGrid").innerHTML = parts.map((p) => {
      const avail = p.stock - p.reserved;
      const isLow = avail <= p.reorder;
      const resPct = (p.reserved / p.stock) * 100, availPct = (avail / p.stock) * 100;
      return `<div class="part">
        <div class="p-head"><div><b>${p.name}</b><small>${p.sku}</small></div>
          <span class="badge ${isLow ? "crit" : "ok"}">${isLow ? T("badge.low") : T("badge.ok")}</span></div>
        <div class="p-stat"><span>${T("parts.available")}</span><b>${avail}</b></div>
        <div class="p-stat"><span>${T("parts.reserved")}</span><b style="color:var(--orange)">${p.reserved}</b></div>
        <div class="p-bar"><i class="avail" style="width:${availPct}%"></i><i class="res" style="width:${resPct}%"></i></div>
        <div class="p-foot"><small class="vsub">${T("parts.instock", { stock: p.stock, reorder: p.reorder })}</small>
          <button class="btn-xs ghost" data-reorder="${p.sku}">${T("btn.reorder")}</button></div>
      </div>`;
    }).join("");
    $$("#partsGrid [data-reorder]").forEach((b) => b.addEventListener("click", () => { S.reorderPart(b.dataset.reorder); showToast(T("toast.reorder")); }));
  }

  /* =========================================================
     FORECAST
     ========================================================= */
  function demandSeries() {
    const out = [];
    const cap = S.stations().reduce((s, st) => s + st.daily, 0);
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
      <div class="fc-legend"><span><i style="background:#38bdf8"></i>${T("fc.legendDemand")}</span>
        <span><i style="background:#e6394a"></i>${T("fc.legendOver")}</span>
        <span style="margin-left:auto;color:#6f86a0">${T("fc.capacity", { n: series[0].cap })}</span></div>
      <div class="fc-chart">${series.map((s) => {
        const within = Math.min(s.demand, s.cap), over = Math.max(0, s.demand - s.cap);
        return `<div class="fc-col" title="${T("fc.rafts", { n: s.demand })}">
          <div class="stack"><div class="over" style="height:0%" data-h="${(over / max) * 100}"></div><div class="dem" style="height:0%" data-h="${(within / max) * 100}"></div></div>
          <div class="fc-x">${s.d.getDate()}/${s.d.getMonth() + 1}</div></div>`;
      }).join("")}</div>`;
    requestAnimationFrame(() => $$("#forecastChart .stack > div").forEach((el, i) => setTimeout(() => (el.style.height = (el.dataset.h || 0) + "%"), 40 + i * 12)));

    $("#stationCards").innerHTML = S.stations().map((st) => {
      const l = S.stationLoad(st.id);
      const hot = l.pct >= 90;
      const rec = hot ? `<span style="color:#ff8a96">${T("fc.hot")}</span>` : `<span style="color:#6ee3b6">${T("fc.ok", { n: Math.max(0, l.capacity - l.base - l.booked) })}</span>`;
      return `<div class="part">
        <div class="p-head"><div><b>${st.name}</b><small>${T("fc.bays", { country: st.country, n: st.bays })}</small></div>
          <span class="badge ${hot ? "crit" : "ok"}">${l.pct}%</span></div>
        <div class="p-stat"><span>${T("fc.weekly")}</span><b>${T("fc.rafts", { n: l.capacity })}</b></div>
        <div class="p-stat"><span>${T("fc.booked")}</span><b style="color:var(--orange)">${l.booked}</b></div>
        <div class="bar" style="margin:10px 0 12px"><i class="${hot ? "hot" : ""}" style="width:${l.pct}%"></i></div>
        <small class="muted" style="font-size:12.5px">${rec}</small></div>`;
    }).join("");
  }

  /* =========================================================
     Router
     ========================================================= */
  const VIEWS = ["overview", "fleet", "bookings", "compliance", "parts", "forecast"];
  const RENDER = { overview: renderOverview, fleet: renderFleet, bookings: renderBookings, compliance: renderCompliance, parts: renderParts, forecast: renderForecast };

  function setView(view) {
    if (!VIEWS.includes(view)) view = "overview";
    currentView = view;
    $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === view));
    $$("#nav .navlink").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    $("#viewTitle").textContent = T("title." + view);
    $("#viewSub").innerHTML = T("sub." + view) + `<span id="clock">${clockStr()}</span>`;
    (RENDER[view] || renderOverview)();
    document.querySelector(".content").scrollTop = 0;
    window.scrollTo(0, 0);
  }
  function renderView(view) { (RENDER[view] || renderOverview)(); }

  function renderBadges() {
    setBadge("#badgeFleet", S.expiringVessels(30).length);
    setBadge("#badgeBookings", S.bookings().filter((b) => b.status === "upcoming").length);
    setBadge("#badgeParts", S.parts().filter((p) => p.stock - p.reserved <= p.reorder).length);
  }
  function setBadge(sel, n) { const el = $(sel); if (el) el.textContent = n > 0 ? n : ""; }

  function clockStr() { return new Date().toLocaleTimeString("en-GB"); }
  setInterval(() => { const c = $("#clock"); if (c) c.textContent = clockStr(); }, 1000);

  /* =========================================================
     Wiring
     ========================================================= */
  window.addEventListener("hashchange", () => setView(location.hash.replace("#", "")));
  window.addEventListener("pulse:lang", () => setView(currentView));

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
    if (ui.fleetSort.key === key) ui.fleetSort.dir *= -1; else ui.fleetSort = { key, dir: 1 };
    renderFleet();
  });

  $("#bookFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip-f"); if (!b) return;
    ui.bookFilter = b.dataset.f;
    $$("#bookFilters .chip-f").forEach((x) => x.classList.toggle("active", x === b));
    renderBookings();
  });
  $("#newBookingBtn").addEventListener("click", () => openBookingModal(null));

  $("#compFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip-f"); if (!b) return;
    ui.compFilter = b.dataset.f;
    $$("#compFilters .chip-f").forEach((x) => x.classList.toggle("active", x === b));
    renderCompliance();
  });
  $("#exportBtn").addEventListener("click", exportAudit);

  // bulk auto-book
  function bulk(scope) {
    const made = S.bulkAutoBook(scope);
    showToast(made.length ? T("toast.bulk", { n: made.length }) : T("toast.bulkNone"));
  }
  $("#bulkCrit").addEventListener("click", () => bulk("crit"));
  $("#bulkExp").addEventListener("click", () => bulk("expiring"));

  $("#resetBtn").addEventListener("click", () => {
    if (confirm(T("confirm.reset"))) { S.reset(); showToast(T("toast.reset")); }
  });

  S.subscribe(() => { renderBadges(); renderView(currentView); });

  // ambient sensor chatter
  const ambient = [
    { k: "act.ambDrift", c: "#38bdf8" },
    { k: "act.ambCapacity", c: "#38bdf8" },
    { k: "act.ambOnboard", c: "#22c08a" },
    { k: "act.ambParts", c: "#38bdf8" },
  ];
  let ai = 0;
  setInterval(() => { const a = ambient[ai % ambient.length]; S.logActivity(a.k, {}, a.c); S.emit(); ai++; }, 12000);

  /* ---------- boot ---------- */
  renderBadges();
  setView(location.hash.replace("#", "") || "overview");
})();

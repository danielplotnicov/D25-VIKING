/* =========================================================
   VIKING Pulse — landing page interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---- Nav shadow on scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 8 ? "0 6px 24px rgba(10,37,64,.08)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
    io.observe(el);
  });

  /* ---- Stakeholder tabs ---- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  tabBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === id));
    })
  );

  /* ---- Animated count-up in hero meta ---- */
  const counters = document.querySelectorAll("[data-count]");
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        let cur = 0;
        const step = Math.max(1, Math.floor(target / 38));
        const tick = () => {
          cur = Math.min(target, cur + step);
          el.textContent = cur + suffix;
          if (cur < target) requestAnimationFrame(tick);
        };
        tick();
        countIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countIO.observe(c));

  /* =========================================================
     Animated live-fleet map in the hero
     ========================================================= */
  const layer = document.getElementById("vesselLayer");
  if (layer) {
    const SVGNS = "http://www.w3.org/2000/svg";
    // hand-placed points over the stylised continents
    const vessels = [
      { x: 95, y: 150, alert: false },
      { x: 210, y: 95, alert: true },
      { x: 175, y: 130, alert: false },
      { x: 290, y: 200, alert: false },
      { x: 400, y: 120, alert: true },
      { x: 430, y: 205, alert: false },
      { x: 255, y: 110, alert: false },
      { x: 360, y: 160, alert: false },
      { x: 130, y: 175, alert: false },
      { x: 470, y: 150, alert: true },
    ];

    vessels.forEach((v, i) => {
      // expanding ping ring
      const ring = document.createElementNS(SVGNS, "circle");
      ring.setAttribute("cx", v.x);
      ring.setAttribute("cy", v.y);
      ring.setAttribute("r", "3");
      ring.setAttribute("class", "ping " + (v.alert ? "r" : "c"));
      ring.style.animation = `ringPulse 2.6s ${(i * 0.32).toFixed(2)}s infinite ease-out`;
      layer.appendChild(ring);

      // vessel dot
      const dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("cx", v.x);
      dot.setAttribute("cy", v.y);
      dot.setAttribute("r", v.alert ? "3.4" : "2.8");
      dot.setAttribute("class", "vessel" + (v.alert ? " alert" : ""));
      layer.appendChild(dot);
    });

    // a couple of drifting "matching" connection lines
    const conns = [
      [210, 95, 175, 130],
      [400, 120, 360, 160],
    ];
    conns.forEach(([x1, y1, x2, y2], i) => {
      const line = document.createElementNS(SVGNS, "line");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#38bdf8");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("stroke-dasharray", "3 4");
      line.setAttribute("opacity", "0.5");
      const anim = document.createElementNS(SVGNS, "animate");
      anim.setAttribute("attributeName", "stroke-dashoffset");
      anim.setAttribute("from", "0"); anim.setAttribute("to", "-14");
      anim.setAttribute("dur", "1.2s");
      anim.setAttribute("repeatCount", "indefinite");
      line.appendChild(anim);
      layer.insertBefore(line, layer.firstChild);
    });
  }

  /* ---- Footer year ---- */
  const y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = y));

  /* =========================================================
     Pilot request modal + form
     ========================================================= */
  const pilotBg = document.getElementById("pilotBg");
  if (pilotBg) {
    const formWrap = document.getElementById("pilotForm");
    const doneWrap = document.getElementById("pilotDone");
    const formEl = document.getElementById("pilotFormEl");
    const errEl = document.getElementById("pilotErr");

    const openPilot = () => {
      formWrap.style.display = "";
      doneWrap.style.display = "none";
      errEl.textContent = "";
      formEl.reset();
      pilotBg.classList.add("show");
      document.body.style.overflow = "hidden";
    };
    const closePilot = () => {
      pilotBg.classList.remove("show");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-pilot]").forEach((b) =>
      b.addEventListener("click", (e) => { e.preventDefault(); openPilot(); })
    );
    document.getElementById("pilotClose").addEventListener("click", closePilot);
    document.getElementById("pilotDoneClose").addEventListener("click", closePilot);
    pilotBg.addEventListener("click", (e) => { if (e.target === pilotBg) closePilot(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && pilotBg.classList.contains("show")) closePilot();
    });

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formEl).entries());
      // validation
      formEl.querySelectorAll(".bad").forEach((el) => el.classList.remove("bad"));
      const T = (k, p) => (window.I18N ? window.I18N.t(k, p) : k);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");
      if (!data.name.trim()) return fail("name", T("pilot.errname"));
      if (!emailOk) return fail("email", T("pilot.erremail"));
      if (!data.company.trim()) return fail("company", T("pilot.errcompany"));

      // "submit" — persist locally so it's demonstrably functional
      try {
        const key = "viking-pulse-pilot-requests";
        const all = JSON.parse(localStorage.getItem(key) || "[]");
        all.push({ ...data, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(all));
      } catch (_) {}

      document.getElementById("pilotDoneMsg").textContent =
        T("pilot.donemsgp", { name: data.name.split(" ")[0], email: data.email, fleet: data.fleet });
      formWrap.style.display = "none";
      doneWrap.style.display = "block";
    });

    function fail(field, msg) {
      errEl.textContent = msg;
      const el = formEl.querySelector(`[name="${field}"]`);
      if (el) { el.classList.add("bad"); el.focus(); }
    }
  }
})();

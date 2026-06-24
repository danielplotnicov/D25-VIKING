# VIKING Pulse — Automated Booking & Predictive Maintenance Platform

A concept website + interactive prototype exploring an automated booking and predictive-maintenance
platform for **VIKING Life-Saving Equipment**.

> **Innovation question:** *How does the future of maintenance planning at VIKING look like?*

VIKING Pulse is a single connected platform that breaks down VIKING's siloed department
tools. It senses life-raft health from onboard sensors, predicts the optimal service window by
matching live ship position + expiring certificates + port capacity, and **auto-books** the
appointment at the predicted harbour — replacing today's manual, staff-dependent coordination.

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Marketing landing page + working **pilot-request form** (validated, saved locally) |
| `dashboard.html` | **Fully interactive planner app** — six connected views |
| `assets/store.js` | Shared data layer: vessels, stations, parts, bookings — persisted to `localStorage`, pub/sub keeps every view in sync |
| `assets/styles.css` | Design system + landing-page styles + pilot-form modal |
| `assets/dashboard.css` | Dark "control center" dashboard styles (tables, cards, badges, charts) |
| `assets/app.js` | Landing interactions: reveal-on-scroll, tabs, count-ups, animated hero map, pilot form |
| `assets/dashboard.js` | The app: router + all six views, booking lifecycle, exports |

## The dashboard is a real app

Six views in the sidebar, all driven by one persistent store — actions in one view flow to the others:

- **Overview** — live KPIs, fleet map, urgency-sorted certificate queue, station capacity, demand spark, live activity feed
- **Live fleet** — searchable, filterable, **sortable** table of all 22 vessels; click *View* for sensor readings & service history
- **Bookings** — every booking with *Mark complete*, *Reschedule* and *Cancel*; filter by status; create a *New booking* manually
- **Compliance** — SOLAS status per vessel, summary tiles, **export audit as CSV**, download a generated **service certificate** for serviced vessels
- **Spare parts** — inventory with available/reserved split, low-stock alerts, *Reorder*
- **Forecast** — 14-day network demand vs. capacity chart + per-station capacity & routing recommendations

**The connected loop in action:** *Auto-book* a vessel → it reserves the right spare parts (per raft),
appears under **Bookings**, and the **Overview** KPIs update. *Mark complete* → parts are consumed from
stock, a fresh SOLAS certificate is issued (downloadable under **Compliance**). *Cancel* → reserved parts
are released. Everything survives a page reload; **↺ Reset demo data** restores the seed.

## Try the prototype

Open `index.html` directly in a browser, or serve the folder:

```bash
# from the viking-pulse/ directory
python -m http.server 5577
# then visit http://localhost:5577/
```

## Grounded in research

Every figure comes from the project's opportunity brief and stakeholder analysis:
280+ service stations · 800+ technicians · 100,000+ life rafts serviced/year · Esbjerg HQ ·
SOLAS compliance · pilot in Denmark & the Nordics, then scale globally.

**Stakeholders modelled:** ship owners / fleet & safety managers · station planners & technicians ·
authorities & class societies · VIKING administration.

---
*Concept prototype for demonstration only. Not affiliated with or endorsed by VIKING Life-Saving Equipment.*

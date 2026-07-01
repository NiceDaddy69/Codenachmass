"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";

/* =========================================================================
   FRISTEN — Fristentracker für Steuerkanzleien (Prototyp v3)
   Mandanten + gesetzlich berechnete Fristen + Ampel-Dashboard.
   Sachbearbeiter · Status-Lebenszyklus · Notiz/Wiedervorlage ·
   Fristverlängerung · Export · NEU: Einspruchsfrist-Automatik +
   bundeslandspezifische Feiertage.
   ========================================================================= */

const C = {
  bg: "#EEF1F6", panel: "#FFFFFF", ink: "#16223A", muted: "#64708A",
  line: "#E2E7F0", lineSoft: "#EDF1F7", accent: "#0F6E6B", accentSoft: "#E1F0EF",
  redT: "#C0362F", redB: "#FBE9E7", orgT: "#C2410C", orgB: "#FBE9DD",
  ambT: "#9A6207", ambB: "#FBF3DD", sltT: "#475569", sltB: "#EDF1F8",
  grnT: "#1B7A43", grnB: "#E4F2E9",
};
const SANS = '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

/* ---------- Datum-Grundlagen ---------- */
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
    f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
    i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31),
    da = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, mo - 1, da);
}
function addDays(dt, n) { const d = new Date(dt); d.setDate(d.getDate() + n); return d; }
function addMonth(dt) { const d = new Date(dt), day = d.getDate(); d.setMonth(d.getMonth() + 1); if (d.getDate() < day) d.setDate(0); return d; }
function iso(dt) { return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`; }
function fmtDE(s) { if (!s) return "—"; const [y, m, d] = s.split("-"); return `${d}.${m}.${y}`; }
function todayMid() { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
function daysUntil(s) { const [y, m, d] = s.split("-").map(Number); return Math.round((new Date(y, m - 1, d) - todayMid()) / 86400000); }
function relText(s, done) {
  if (done) return "erledigt";
  const n = daysUntil(s);
  if (n < 0) return `${-n} Tag${-n === 1 ? "" : "e"} überfällig`;
  if (n === 0) return "heute fällig";
  if (n === 1) return "morgen fällig";
  return `in ${n} Tagen`;
}

/* ---------- Bundeslandspezifische Feiertage ---------- */
const BUNDESLAENDER = [
  ["BW", "Baden-Württemberg"], ["BY", "Bayern"], ["BE", "Berlin"], ["BB", "Brandenburg"],
  ["HB", "Bremen"], ["HH", "Hamburg"], ["HE", "Hessen"], ["MV", "Meckl.-Vorpommern"],
  ["NI", "Niedersachsen"], ["NW", "Nordrhein-Westfalen"], ["RP", "Rheinland-Pfalz"], ["SL", "Saarland"],
  ["SN", "Sachsen"], ["ST", "Sachsen-Anhalt"], ["SH", "Schleswig-Holstein"], ["TH", "Thüringen"],
];
function bussUndBettag(y) { const d = new Date(y, 10, 22); return addDays(d, -((d.getDay() - 3 + 7) % 7)); } // Mi vor 23.11.
function regio(y) {
  const E = easter(y);
  return [
    { d: new Date(y, 0, 6), bl: ["BW", "BY", "ST"] },                                   // Hl. 3 Könige
    { d: new Date(y, 2, 8), bl: ["BE", "MV"] },                                         // Frauentag
    { d: addDays(E, 60), bl: ["BW", "BY", "HE", "NW", "RP", "SL"] },                     // Fronleichnam
    { d: new Date(y, 7, 15), bl: ["SL"] },                                              // Mariä Himmelfahrt
    { d: new Date(y, 8, 20), bl: ["TH"] },                                              // Weltkindertag
    { d: new Date(y, 9, 31), bl: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"] }, // Reformationstag
    { d: new Date(y, 10, 1), bl: ["BW", "BY", "NW", "RP", "SL"] },                       // Allerheiligen
    { d: bussUndBettag(y), bl: ["SN"] },                                                // Buß- und Bettag
  ];
}
const _hol = {};
function holidaySet(y, bl) {
  const E = easter(y), s = new Set();
  const push = (dt) => s.add(`${dt.getMonth()}-${dt.getDate()}`);
  [new Date(y, 0, 1), addDays(E, -2), addDays(E, 1), new Date(y, 4, 1),
   addDays(E, 39), addDays(E, 50), new Date(y, 9, 3), new Date(y, 11, 25), new Date(y, 11, 26)].forEach(push);
  regio(y).forEach((h) => { if (h.bl.includes(bl)) push(h.d); });
  return s;
}
function isHoliday(dt, bl) { const y = dt.getFullYear(), k = `${y}:${bl}`; if (!_hol[k]) _hol[k] = holidaySet(y, bl); return _hol[k].has(`${dt.getMonth()}-${dt.getDate()}`); }
function nextWorkday(dt, bl) { let d = new Date(dt); while (d.getDay() === 0 || d.getDay() === 6 || isHoliday(d, bl)) d = addDays(d, 1); return d; }
function workdayISO(dt, bl) { return iso(nextWorkday(dt, bl)); }

/* ---------- Gesetzliche Fristen ---------- */
const ANNUAL_BERATEN = {
  2022: "2024-07-31", 2023: "2025-06-02", 2024: "2026-04-30",
  2025: "2027-03-01", 2026: "2028-02-29", 2027: "2029-02-28",
};
function annualDeadline(vz, beraten, bl) {
  if (beraten) { if (ANNUAL_BERATEN[vz]) return ANNUAL_BERATEN[vz]; return workdayISO(new Date(vz + 2, 2, 0), bl); }
  return workdayISO(new Date(vz + 1, 6, 31), bl);
}
function periodDue(year, monthIdxAfter, dfv, bl) { return workdayISO(new Date(year, monthIdxAfter + (dfv ? 1 : 0), 10), bl); }
// Einspruchsfrist: Bescheiddatum + 4 Tage Bekanntgabefiktion (ab 2025) + 1 Monat, auf Werktag
function einspruchDeadline(bescheidISO, bl) {
  const [y, m, d] = bescheidISO.split("-").map(Number);
  const bekannt = nextWorkday(addDays(new Date(y, m - 1, d), 4), bl);
  return workdayISO(addMonth(bekannt), bl);
}

const TYP_LABEL = {
  privatperson: "Privatperson", einzelunternehmen: "Einzelunternehmen",
  personengesellschaft: "Personengesellschaft", kapitalgesellschaft: "Kapitalgesellschaft (GmbH)",
};
const ANNUAL_BY_TYP = {
  privatperson: ["Einkommensteuer"],
  einzelunternehmen: ["Einkommensteuer", "Umsatzsteuer (Jahr)", "Gewerbesteuer"],
  personengesellschaft: ["Feststellungserklärung", "Umsatzsteuer (Jahr)", "Gewerbesteuer"],
  kapitalgesellschaft: ["Körperschaftsteuer", "Umsatzsteuer (Jahr)", "Gewerbesteuer"],
};
const ART_KAT = (art) => art.startsWith("USt-VA") ? "USt-Voranmeldung" : art.startsWith("LSt") ? "Lohnsteuer-Anmeldung" : "Jahreserklärung";

let _seq = 0;
const uid = () => `${Date.now().toString(36)}${(_seq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function generateFristen(m, vzList, vaYear, bl) {
  const out = [];
  const add = (art, faellig) => out.push({
    id: uid(), mandantId: m.id, art, kat: ART_KAT(art), faellig, status: "belege_offen",
    bearbeiter: m.bearbeiter || "", notiz: "", wiedervorlage: null, verlaengertAuf: null,
    erinnertAm: null, bescheidAm: null, parentId: null, auto: true,
  });
  vzList.forEach((vz) => { (ANNUAL_BY_TYP[m.typ] || []).forEach((base) => add(`${base} ${vz}`, annualDeadline(vz, m.beraten, bl))); });
  if (m.ustVa === "monatlich") { for (let mo = 1; mo <= 12; mo++) add(`USt-VA ${String(mo).padStart(2, "0")}/${vaYear}`, periodDue(vaYear, mo, m.dfv, bl)); }
  else if (m.ustVa === "vierteljaehrlich") { [["Q1", 3], ["Q2", 6], ["Q3", 9], ["Q4", 12]].forEach(([q, em]) => add(`USt-VA ${q}/${vaYear}`, periodDue(vaYear, em, m.dfv, bl))); }
  if (m.lohnsteuer === "monatlich") { for (let mo = 1; mo <= 12; mo++) add(`LSt-Anm. ${String(mo).padStart(2, "0")}/${vaYear}`, periodDue(vaYear, mo, false, bl)); }
  else if (m.lohnsteuer === "vierteljaehrlich") { [["Q1", 3], ["Q2", 6], ["Q3", 9], ["Q4", 12]].forEach(([q, em]) => add(`LSt-Anm. ${q}/${vaYear}`, periodDue(vaYear, em, false, bl))); }
  else if (m.lohnsteuer === "jaehrlich") { add(`LSt-Anm. ${vaYear}`, periodDue(vaYear, 12, false, bl)); }
  return out;
}
function makeEinspruch(parent, bescheidISO, bl) {
  return {
    id: uid(), mandantId: parent.mandantId, art: `Einspruchsfrist – ${parent.art}`, kat: "Einspruchsfrist",
    faellig: einspruchDeadline(bescheidISO, bl), status: "in_bearbeitung", bearbeiter: parent.bearbeiter || "",
    notiz: `Automatisch erzeugt nach Bescheid vom ${fmtDE(bescheidISO)} (Bekanntgabefiktion 4 Tage + 1 Monat, § 355 AO).`,
    wiedervorlage: null, verlaengertAuf: null, erinnertAm: null, bescheidAm: bescheidISO, parentId: parent.id, auto: true,
  };
}
function withEinspruch(fristen, frist, bl) {
  if (!frist || frist.status !== "bescheid" || frist.parentId) return fristen;
  if (fristen.some((x) => x.parentId === frist.id)) return fristen;
  return [...fristen, makeEinspruch(frist, frist.bescheidAm || iso(new Date()), bl)];
}

/* ---------- Status & Ampel ---------- */
const STAGES = ["belege_offen", "in_bearbeitung", "review", "eingereicht", "bescheid"];
const STATUS = { belege_offen: "Belege offen", in_bearbeitung: "In Bearbeitung", review: "Review / Freigabe", eingereicht: "Eingereicht", bescheid: "Bescheid erhalten" };
const STATUS_STYLE = {
  belege_offen: { t: "#8A5A00", b: "#FBF0DA" }, in_bearbeitung: { t: "#1D4ED8", b: "#E6ECFB" },
  review: { t: "#6D28D9", b: "#ECE7FB" }, eingereicht: { t: "#1B7A43", b: "#E4F2E9" }, bescheid: { t: "#0F5132", b: "#DCE7DF" },
};
const isDone = (s) => s === "eingereicht" || s === "bescheid";
const nextStatus = (s) => STAGES[(STAGES.indexOf(s) + 1) % STAGES.length];
const effDue = (f) => f.verlaengertAuf || f.faellig;
function urgency(f) {
  if (isDone(f.status)) return { key: "done", t: C.grnT, b: C.grnB, label: "Erledigt" };
  const n = daysUntil(effDue(f));
  if (n < 0) return { key: "over", t: C.redT, b: C.redB, label: "Überfällig" };
  if (n <= 7) return { key: "week", t: C.orgT, b: C.orgB, label: "Diese Woche" };
  if (n <= 30) return { key: "month", t: C.ambT, b: C.ambB, label: "Dieser Monat" };
  return { key: "plan", t: C.sltT, b: C.sltB, label: "Geplant" };
}
const initials = (name) => !name ? "—" : name.replace(/[.]/g, "").split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
const wvFaellig = (f) => f.wiedervorlage && !isDone(f.status) && daysUntil(f.wiedervorlage) <= 0;

/* ---------- Demo-Seed ---------- */
function seed() {
  const BL = "NW";
  const staff = ["A. Berger", "C. Mertens", "L. Weiß"];
  const mk = (name, nr, typ, sb, opts = {}) => ({
    id: uid(), name, mandantNr: nr, typ, beraten: true, bearbeiter: sb,
    ustVa: opts.ustVa || "keine", dfv: !!opts.dfv, lohnsteuer: opts.lohnsteuer || "keine",
  });
  const mandanten = [
    mk("Sandra Brinkmann", "10042", "privatperson", "A. Berger"),
    mk("Novak Elektrotechnik e.K.", "10043", "einzelunternehmen", "C. Mertens", { ustVa: "monatlich", dfv: true, lohnsteuer: "monatlich" }),
    mk("Höffner & Partner GbR", "10044", "personengesellschaft", "L. Weiß", { ustVa: "vierteljaehrlich" }),
    mk("Lindner Logistik GmbH", "10045", "kapitalgesellschaft", "C. Mertens", { ustVa: "monatlich", dfv: true, lohnsteuer: "monatlich" }),
    mk("Dr. Marwitz Zahnarztpraxis", "10046", "einzelunternehmen", "A. Berger", { lohnsteuer: "vierteljaehrlich" }),
  ];
  let fristen = [];
  mandanten.forEach((m) => { fristen = fristen.concat(generateFristen(m, [2024, 2025], 2026, BL)); });
  let leaveOpen = 3;
  fristen = fristen.map((f) => {
    const n = daysUntil(f.faellig);
    if (n < 0) {
      if (leaveOpen > 0 && Math.random() < 0.32) { leaveOpen--; return { ...f, status: "belege_offen", erinnertAm: iso(addDays(todayMid(), -9)), notiz: "Mandant 2× erinnert – BWA/Belege fehlen noch." }; }
      return { ...f, status: Math.random() < 0.5 ? "bescheid" : "eingereicht", bescheidAm: Math.random() < 0.5 ? iso(addDays(todayMid(), -20)) : null };
    }
    if (n <= 30) return { ...f, status: Math.random() < 0.5 ? "in_bearbeitung" : "review" };
    return f;
  });
  // Beispiel Fristverlängerung
  const annual = fristen.find((f) => f.art.startsWith("Körperschaftsteuer") && !isDone(f.status));
  if (annual) { const p = annual.faellig.split("-").map(Number); annual.verlaengertAuf = workdayISO(addDays(new Date(p[0], p[1] - 1, p[2]), 60), BL); annual.notiz = "Fristverlängerung beim FA beantragt und gewährt."; }
  // Beispiel Wiedervorlage
  const upcoming = fristen.find((f) => !isDone(f.status) && daysUntil(f.faellig) > 0 && daysUntil(f.faellig) < 25);
  if (upcoming) upcoming.wiedervorlage = iso(addDays(todayMid(), 3));
  // Showcase: Bescheid -> automatische Einspruchsfrist
  const est = fristen.find((f) => f.art.startsWith("Einkommensteuer 2024"));
  if (est) { est.status = "bescheid"; est.bescheidAm = iso(addDays(todayMid(), -8)); fristen.push(makeEinspruch(est, est.bescheidAm, BL)); }
  return { bundesland: BL, staff, mandanten, fristen };
}

/* ====================================================================== */
export default function FristenTracker() {
  const [state, setState] = useState(null);
  const [tab, setTab] = useState("fristen");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [mandantFilter, setMandantFilter] = useState("alle");
  const [sbFilter, setSbFilter] = useState("alle");
  const [urgFilter, setUrgFilter] = useState("alle");
  const [wvOnly, setWvOnly] = useState(false);
  const [showMandant, setShowMandant] = useState(false);
  const [editFrist, setEditFrist] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      let loaded = null;
      try { const r = typeof window !== "undefined" ? window.localStorage.getItem("cnm_fristen_v1") : null; if (r) loaded = JSON.parse(r); } catch (e) {}
      if (live) setState(loaded && loaded.mandanten ? loaded : seed());
    })();
    return () => { live = false; };
  }, []);
  useEffect(() => { if (!state) return; try { if (typeof window !== "undefined") window.localStorage.setItem("cnm_fristen_v1", JSON.stringify(state)); } catch (e) {} }, [state]);

  const mandantById = useMemo(() => { const map = {}; (state?.mandanten || []).forEach((m) => (map[m.id] = m)); return map; }, [state]);

  const counts = useMemo(() => {
    const c = { over: 0, week: 0, month: 0, done: 0, total: 0, wv: 0 };
    (state?.fristen || []).forEach((f) => {
      const u = urgency(f); c.total++;
      if (u.key === "done") c.done++; else if (u.key === "over") c.over++; else if (u.key === "week") c.week++; else if (u.key === "month") c.month++;
      if (wvFaellig(f)) c.wv++;
    });
    return c;
  }, [state]);

  const visible = useMemo(() => {
    let list = (state?.fristen || []).slice();
    if (q.trim()) { const s = q.toLowerCase(); list = list.filter((f) => f.art.toLowerCase().includes(s) || (mandantById[f.mandantId]?.name || "").toLowerCase().includes(s)); }
    if (statusFilter !== "alle") list = list.filter((f) => f.status === statusFilter);
    if (mandantFilter !== "alle") list = list.filter((f) => f.mandantId === mandantFilter);
    if (sbFilter !== "alle") list = list.filter((f) => (f.bearbeiter || "") === (sbFilter === "none" ? "" : sbFilter));
    if (urgFilter !== "alle") list = list.filter((f) => urgency(f).key === urgFilter);
    if (wvOnly) list = list.filter(wvFaellig);
    list.sort((a, b) => { const ad = isDone(a.status), bd = isDone(b.status); if (ad !== bd) return ad ? 1 : -1; return effDue(a) < effDue(b) ? -1 : effDue(a) > effDue(b) ? 1 : 0; });
    return list;
  }, [state, q, statusFilter, mandantFilter, sbFilter, urgFilter, wvOnly, mandantById]);

  const cycleStatus = useCallback((id) => setState((s) => {
    let fristen = s.fristen.map((f) => {
      if (f.id !== id) return f;
      const ns = nextStatus(f.status);
      return { ...f, status: ns, bescheidAm: ns === "bescheid" ? (f.bescheidAm || iso(new Date())) : f.bescheidAm };
    });
    fristen = withEinspruch(fristen, fristen.find((f) => f.id === id), s.bundesland);
    return { ...s, fristen };
  }), []);
  const updateFrist = useCallback((upd) => setState((s) => {
    let fristen = s.fristen.map((f) => (f.id === upd.id ? upd : f));
    fristen = withEinspruch(fristen, upd, s.bundesland);
    return { ...s, fristen };
  }), []);
  const delFrist = useCallback((id) => setState((s) => ({ ...s, fristen: s.fristen.filter((f) => f.id !== id && f.parentId !== id) })), []);
  const delMandant = useCallback((id) => setState((s) => ({ ...s, mandanten: s.mandanten.filter((m) => m.id !== id), fristen: s.fristen.filter((f) => f.mandantId !== id) })), []);
  const addMandant = useCallback((m, vzList, vaYear) => setState((s) => ({ ...s, mandanten: [...s.mandanten, m], fristen: [...s.fristen, ...generateFristen(m, vzList, vaYear, s.bundesland)] })), []);
  const setBundesland = useCallback((bl) => setState((s) => ({ ...s, bundesland: bl })), []);

  function exportCSV() {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Mandant", "Mandant-Nr", "Typ", "Frist", "Kategorie", "Fällig", "Original-Frist", "Status", "Sachbearbeiter", "Wiedervorlage", "Notiz"];
    const lines = [head.join(";")];
    visible.forEach((f) => {
      const m = mandantById[f.mandantId] || {};
      lines.push([m.name, m.mandantNr, TYP_LABEL[m.typ] || "", f.art, f.kat, fmtDE(effDue(f)),
        f.verlaengertAuf ? fmtDE(f.faellig) : "", STATUS[f.status], f.bearbeiter || "", f.wiedervorlage ? fmtDE(f.wiedervorlage) : "", f.notiz || ""].map(esc).join(";"));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `Fristen_${iso(new Date())}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  if (!state) return <div style={{ fontFamily: SANS, padding: 40, color: C.muted }}>Lädt…</div>;

  const summary = [
    { key: "over", label: "Überfällig", n: counts.over, t: C.redT, b: C.redB },
    { key: "week", label: "Diese Woche", n: counts.week, t: C.orgT, b: C.orgB },
    { key: "month", label: "Dieser Monat", n: counts.month, t: C.ambT, b: C.ambB },
    { key: "done", label: "Erledigt", n: counts.done, t: C.grnT, b: C.grnB },
  ];

  return (
    <div style={{ fontFamily: SANS, background: C.bg, color: C.ink, minHeight: 640, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .ft-btn{cursor:pointer;border:none;font-family:${SANS};transition:all .14s ease}
        .ft-btn:focus-visible{outline:2px solid ${C.accent};outline-offset:2px}
        .ft-row{transition:background .12s ease;cursor:pointer}
        .ft-row:hover{background:${C.lineSoft}}
        .ft-chip:hover{filter:brightness(0.97)}
        .ft-input{font-family:${SANS};font-size:14px;color:${C.ink};background:${C.panel};border:1px solid ${C.line};border-radius:9px;padding:10px 12px;outline:none;width:100%;box-sizing:border-box}
        .ft-input:focus{border-color:${C.accent};box-shadow:0 0 0 3px ${C.accentSoft}}
        .ft-x{opacity:0;transition:opacity .12s}
        .ft-row:hover .ft-x{opacity:1}
        textarea.ft-input{resize:vertical;min-height:64px}
        @media (max-width:760px){ .ft-hidesm{display:none!important} .ft-sumgrid{grid-template-columns:1fr 1fr!important} .ft-cols{grid-template-columns:1.4fr 1fr 70px!important} }
      `}</style>

      <div style={{ background: C.panel, borderBottom: `1px solid ${C.line}`, padding: "18px 22px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, border: "2.5px solid #fff", borderRadius: "50%", borderTopColor: "transparent", transform: "rotate(35deg)" }} />
        </div>
        <div style={{ marginRight: "auto" }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>Fristen<span style={{ color: C.accent }}>.</span></div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Fristenkontrolle für Steuerkanzleien</div>
        </div>
        <select className="ft-input" value={state.bundesland} onChange={(e) => setBundesland(e.target.value)} title="Bundesland der Kanzlei – maßgeblich für Feiertage bei der Fristberechnung" style={{ width: "auto", cursor: "pointer", fontSize: 13, padding: "8px 10px" }}>
          {BUNDESLAENDER.map(([k, l]) => <option key={k} value={k}>{k} · {l}</option>)}
        </select>
        <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 3, gap: 2 }}>
          {[["fristen", "Fristen"], ["mandanten", "Mandanten"]].map(([k, l]) => (
            <button key={k} className="ft-btn" onClick={() => setTab(k)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13.5, fontWeight: 600, background: tab === k ? C.panel : "transparent", color: tab === k ? C.ink : C.muted, boxShadow: tab === k ? "0 1px 2px rgba(16,34,58,.08)" : "none" }}>{l}</button>
          ))}
        </div>
        <button className="ft-btn" onClick={() => setShowMandant(true)} style={{ padding: "9px 15px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, background: C.accent, color: "#fff" }}>+ Mandant</button>
      </div>

      <div style={{ padding: 22 }}>
        {tab === "fristen" ? (
          <>
            <div className="ft-sumgrid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
              {summary.map((s) => {
                const active = urgFilter === s.key;
                return (
                  <button key={s.key} className="ft-btn ft-chip" onClick={() => setUrgFilter(active ? "alle" : s.key)} style={{ textAlign: "left", background: C.panel, border: `1px solid ${active ? s.t : C.line}`, borderRadius: 12, padding: "14px 16px", boxShadow: active ? `0 0 0 3px ${s.b}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.t }} />
                      <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, color: s.n > 0 ? s.t : C.muted, lineHeight: 1 }}>{s.n}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <input className="ft-input" placeholder="Suche Mandant oder Frist…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: "1 1 180px", minWidth: 0 }} />
              <select className="ft-input" value={mandantFilter} onChange={(e) => setMandantFilter(e.target.value)} style={{ flex: "0 1 170px", cursor: "pointer" }}>
                <option value="alle">Alle Mandanten</option>
                {state.mandanten.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select className="ft-input" value={sbFilter} onChange={(e) => setSbFilter(e.target.value)} style={{ flex: "0 1 150px", cursor: "pointer" }}>
                <option value="alle">Alle Sachbearbeiter</option>
                {state.staff.map((sb) => <option key={sb} value={sb}>{sb}</option>)}
                <option value="none">— nicht zugewiesen</option>
              </select>
              <select className="ft-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: "0 1 150px", cursor: "pointer" }}>
                <option value="alle">Jeder Status</option>
                {STAGES.map((k) => <option key={k} value={k}>{STATUS[k]}</option>)}
              </select>
              <button className="ft-btn" onClick={() => setWvOnly((v) => !v)} title="Nur fällige Wiedervorlagen" style={{ padding: "10px 12px", borderRadius: 9, fontSize: 13, fontWeight: 600, border: `1px solid ${wvOnly ? C.accent : C.line}`, background: wvOnly ? C.accentSoft : C.panel, color: wvOnly ? C.accent : C.muted }}>
                Wiedervorlage{counts.wv ? ` (${counts.wv})` : ""}
              </button>
              <button className="ft-btn" onClick={exportCSV} title="Sichtbare Liste als Excel/CSV" style={{ padding: "10px 12px", borderRadius: 9, fontSize: 13, fontWeight: 600, border: `1px solid ${C.line}`, background: C.panel, color: C.ink }}>↓ Excel</button>
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
              <div className="ft-hidesm" style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 0.9fr 52px 1fr 44px", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.line}`, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: C.muted }}>
                <div>Mandant</div><div>Frist</div><div>Fälligkeit</div><div>SB</div><div>Status</div><div></div>
              </div>
              {visible.length === 0 ? (
                <div style={{ padding: "44px 16px", textAlign: "center", color: C.muted, fontSize: 14 }}>Keine Fristen für diese Auswahl. Filter zurücksetzen oder Mandant anlegen.</div>
              ) : visible.map((f) => {
                const u = urgency(f), m = mandantById[f.mandantId], done = isDone(f.status), st = STATUS_STYLE[f.status];
                const isEin = f.kat === "Einspruchsfrist";
                return (
                  <div key={f.id} className="ft-row ft-cols" onClick={() => setEditFrist(f)} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 0.9fr 52px 1fr 44px", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.lineSoft}`, alignItems: "center", borderLeft: `3px solid ${u.t}` }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 6 }}>
                        {m ? m.name : "—"}
                        {f.notiz ? <span title="Notiz" style={{ color: C.muted, fontSize: 12 }}>✎</span> : null}
                        {wvFaellig(f) ? <span title="Wiedervorlage fällig" style={{ width: 7, height: 7, borderRadius: "50%", background: C.redT }} /> : null}
                      </div>
                      <div className="ft-hidesm" style={{ fontSize: 12, color: C.muted }}>{m ? TYP_LABEL[m.typ] : ""}</div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 6 }}>
                        {isEin ? <span title="Einspruchsfrist" style={{ fontSize: 9.5, fontWeight: 800, color: "#6D28D9", background: "#ECE7FB", borderRadius: 5, padding: "1px 5px", flexShrink: 0 }}>§</span> : null}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{f.art}</span>
                      </div>
                      <div className="ft-hidesm" style={{ fontSize: 11.5, color: C.muted }}>{f.kat}</div>
                    </div>
                    <div className="ft-hidesm">
                      <div style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                        {fmtDE(effDue(f))}
                        {f.verlaengertAuf ? <span title={`verlängert (ursprl. ${fmtDE(f.faellig)})`} style={{ fontSize: 10, fontWeight: 700, color: C.accent, background: C.accentSoft, borderRadius: 5, padding: "1px 5px" }}>verl.</span> : null}
                      </div>
                      <div style={{ fontSize: 11.5, color: u.key === "plan" || done ? C.muted : u.t, fontWeight: 600 }}>{relText(effDue(f), done)}</div>
                    </div>
                    <div className="ft-hidesm" title={f.bearbeiter || "nicht zugewiesen"}>
                      <span style={{ display: "inline-grid", placeItems: "center", width: 28, height: 28, borderRadius: "50%", fontSize: 11, fontWeight: 700, background: f.bearbeiter ? C.accentSoft : C.bg, color: f.bearbeiter ? C.accent : C.muted }}>{initials(f.bearbeiter)}</span>
                    </div>
                    <div>
                      <button className="ft-btn ft-chip" onClick={(e) => { e.stopPropagation(); cycleStatus(f.id); }} title="Status weiterschalten" style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 20, background: st.b, color: st.t, whiteSpace: "nowrap" }}>{STATUS[f.status]}</button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <button className="ft-btn ft-x" onClick={(e) => { e.stopPropagation(); delFrist(f.id); }} title="Frist löschen" style={{ background: "transparent", color: C.muted, fontSize: 17, padding: "2px 8px", borderRadius: 7 }}>×</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: C.muted }}>{visible.length} von {counts.total} Fristen · Zeile anklicken zum Bearbeiten · „Bescheid erhalten" erzeugt automatisch die Einspruchsfrist</div>
          </>
        ) : (
          <MandantenView mandanten={state.mandanten} fristen={state.fristen} onDelete={delMandant} onAdd={() => setShowMandant(true)} />
        )}
      </div>

      {showMandant && <MandantModal staff={state.staff} onClose={() => setShowMandant(false)} onSave={addMandant} />}
      {editFrist && <FristModal frist={editFrist} mandant={mandantById[editFrist.mandantId]} staff={state.staff} onSave={(u) => { updateFrist(u); setEditFrist(null); }} onClose={() => setEditFrist(null)} />}
    </div>
  );
}

/* ---------- Mandanten-Übersicht ---------- */
function MandantenView({ mandanten, fristen, onDelete, onAdd }) {
  const open = (id) => fristen.filter((f) => f.mandantId === id && !isDone(f.status)).length;
  const over = (id) => fristen.filter((f) => f.mandantId === id && !isDone(f.status) && daysUntil(effDue(f)) < 0).length;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
      {mandanten.map((m) => {
        const o = open(m.id), ov = over(m.id);
        return (
          <div key={m.id} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Nr. <span style={{ fontFamily: MONO }}>{m.mandantNr}</span> · {TYP_LABEL[m.typ]}</div>
              </div>
              <button className="ft-btn" onClick={() => onDelete(m.id)} title="Mandant löschen" style={{ background: "transparent", color: C.muted, fontSize: 16, padding: "0 6px" }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Tag>SB: {m.bearbeiter || "—"}</Tag>
              {m.ustVa !== "keine" && <Tag>USt-VA {m.ustVa === "monatlich" ? "monatl." : "viertelj."}{m.dfv ? " · DFV" : ""}</Tag>}
              {m.lohnsteuer !== "keine" && <Tag>LSt {m.lohnsteuer === "jaehrlich" ? "jährl." : m.lohnsteuer === "monatlich" ? "monatl." : "viertelj."}</Tag>}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.lineSoft}` }}>
              <Stat n={o} label="offen" color={C.ink} />
              <Stat n={ov} label="überfällig" color={ov > 0 ? C.redT : C.muted} />
            </div>
          </div>
        );
      })}
      <button className="ft-btn" onClick={onAdd} style={{ border: `1.5px dashed ${C.line}`, borderRadius: 12, padding: 16, background: "transparent", color: C.accent, fontSize: 14, fontWeight: 600, minHeight: 120 }}>+ Mandant anlegen</button>
    </div>
  );
}
const Tag = ({ children }) => <span style={{ fontSize: 11.5, fontWeight: 600, color: C.accent, background: C.accentSoft, borderRadius: 6, padding: "3px 8px" }}>{children}</span>;
const Stat = ({ n, label, color }) => (<div><span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 18, color }}>{n}</span><span style={{ fontSize: 12, color: C.muted, marginLeft: 5 }}>{label}</span></div>);

/* ---------- Frist bearbeiten ---------- */
function FristModal({ frist, mandant, staff, onSave, onClose }) {
  const [f, setF] = useState({ ...frist });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const lbl = { fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, display: "block" };
  const st = STATUS_STYLE[f.status];
  const save = () => { const out = { ...f }; if (out.status === "bescheid" && !out.parentId && !out.bescheidAm) out.bescheidAm = iso(new Date()); onSave(out); };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(16,34,58,.42)", display: "grid", placeItems: "center", padding: 16, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ fontFamily: SANS, background: C.panel, borderRadius: 16, width: "min(540px,100%)", maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 60px rgba(16,34,58,.32)" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 12, color: C.muted }}>{mandant ? mandant.name : ""} · {mandant ? TYP_LABEL[mandant.typ] : ""}</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.ink, marginTop: 2 }}>{f.art}</div>
        </div>
        <div style={{ padding: 22, display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Status</label>
              <select className="ft-input" value={f.status} onChange={(e) => set("status", e.target.value)} style={{ cursor: "pointer" }}>
                {STAGES.map((k) => <option key={k} value={k}>{STATUS[k]}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Sachbearbeiter</label>
              <select className="ft-input" value={f.bearbeiter || ""} onChange={(e) => set("bearbeiter", e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">— nicht zugewiesen</option>
                {staff.map((sb) => <option key={sb} value={sb}>{sb}</option>)}
              </select>
            </div>
          </div>
          {f.status === "bescheid" && !f.parentId && (
            <div style={{ background: "#F6F3FC", border: "1px solid #E4DCF7", borderRadius: 10, padding: 14 }}>
              <label style={lbl}>Bescheid vom</label>
              <input type="date" className="ft-input" value={f.bescheidAm || iso(new Date())} onChange={(e) => set("bescheidAm", e.target.value)} />
              <div style={{ fontSize: 11.5, color: "#6D28D9", marginTop: 8, fontWeight: 600 }}>↳ Beim Speichern wird automatisch eine Einspruchsfrist (Bekanntgabefiktion 4 Tage + 1 Monat) erzeugt.</div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Gesetzliche Frist</label>
              <div className="ft-input" style={{ background: C.bg, fontFamily: MONO }}>{fmtDE(f.faellig)}</div>
            </div>
            <div><label style={lbl}>Fristverlängerung bis</label>
              <input type="date" className="ft-input" value={f.verlaengertAuf || ""} onChange={(e) => set("verlaengertAuf", e.target.value || null)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Wiedervorlage</label>
              <input type="date" className="ft-input" value={f.wiedervorlage || ""} onChange={(e) => set("wiedervorlage", e.target.value || null)} />
            </div>
            <div><label style={lbl}>Belege angefordert am</label>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="date" className="ft-input" value={f.erinnertAm || ""} onChange={(e) => set("erinnertAm", e.target.value || null)} />
                <button className="ft-btn" onClick={() => set("erinnertAm", iso(new Date()))} title="Heute" style={{ flexShrink: 0, padding: "0 12px", borderRadius: 9, border: `1px solid ${C.line}`, background: C.panel, color: C.accent, fontWeight: 700, fontSize: 13 }}>heute</button>
              </div>
            </div>
          </div>
          <div><label style={lbl}>Notiz</label>
            <textarea className="ft-input" value={f.notiz || ""} onChange={(e) => set("notiz", e.target.value)} placeholder="z. B. fehlende Unterlagen, Absprachen, Besonderheiten…" />
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.muted }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: st.t }} /> {STATUS[f.status]}{f.verlaengertAuf ? ` · effektive Frist ${fmtDE(f.verlaengertAuf)}` : ""}
          </div>
        </div>
        <div style={{ padding: "16px 22px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="ft-btn" onClick={onClose} style={{ padding: "10px 16px", borderRadius: 9, fontWeight: 600, fontSize: 14, background: C.bg, color: C.ink }}>Abbrechen</button>
          <button className="ft-btn" onClick={save} style={{ padding: "10px 18px", borderRadius: 9, fontWeight: 600, fontSize: 14, background: C.accent, color: "#fff" }}>Speichern</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mandant anlegen ---------- */
function MandantModal({ staff, onClose, onSave }) {
  const [name, setName] = useState("");
  const [nr, setNr] = useState("");
  const [typ, setTyp] = useState("einzelunternehmen");
  const [bearbeiter, setBearbeiter] = useState(staff[0] || "");
  const [ustVa, setUstVa] = useState("keine");
  const [dfv, setDfv] = useState(false);
  const [lohnsteuer, setLohnsteuer] = useState("keine");
  const thisYear = new Date().getFullYear();
  const [vz1, setVz1] = useState(thisYear - 2);
  const [vz2, setVz2] = useState(thisYear - 1);

  const save = () => {
    if (!name.trim()) return;
    const m = { id: uid(), name: name.trim(), mandantNr: nr.trim() || "—", typ, beraten: true, bearbeiter, ustVa, dfv: ustVa !== "keine" && dfv, lohnsteuer };
    onSave(m, Array.from(new Set([vz1, vz2])).sort(), thisYear);
    onClose();
  };
  const lbl = { fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, display: "block" };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(16,34,58,.42)", display: "grid", placeItems: "center", padding: 16, zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ fontFamily: SANS, background: C.panel, borderRadius: 16, width: "min(560px,100%)", maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 60px rgba(16,34,58,.32)" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>Mandant anlegen</div>
          <button className="ft-btn" onClick={onClose} style={{ background: "transparent", color: C.muted, fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: 22, display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
            <div><label style={lbl}>Name</label><input className="ft-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Mustermann GmbH" autoFocus /></div>
            <div><label style={lbl}>Mandant-Nr.</label><input className="ft-input" value={nr} onChange={(e) => setNr(e.target.value)} placeholder="10047" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Mandantentyp</label>
              <select className="ft-input" value={typ} onChange={(e) => setTyp(e.target.value)} style={{ cursor: "pointer" }}>
                {Object.entries(TYP_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Sachbearbeiter</label>
              <select className="ft-input" value={bearbeiter} onChange={(e) => setBearbeiter(e.target.value)} style={{ cursor: "pointer" }}>
                {staff.map((sb) => <option key={sb} value={sb}>{sb}</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: -6 }}>Erzeugt automatisch: {(ANNUAL_BY_TYP[typ] || []).join(", ")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>USt-Voranmeldung</label>
              <select className="ft-input" value={ustVa} onChange={(e) => setUstVa(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="keine">keine</option><option value="monatlich">monatlich</option><option value="vierteljaehrlich">vierteljährlich</option>
              </select>
            </div>
            <div><label style={lbl}>Lohnsteuer-Anmeldung</label>
              <select className="ft-input" value={lohnsteuer} onChange={(e) => setLohnsteuer(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="keine">keine</option><option value="monatlich">monatlich</option><option value="vierteljaehrlich">vierteljährlich</option><option value="jaehrlich">jährlich</option>
              </select>
            </div>
          </div>
          {ustVa !== "keine" && (
            <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: C.ink, cursor: "pointer" }}>
              <input type="checkbox" checked={dfv} onChange={(e) => setDfv(e.target.checked)} style={{ width: 16, height: 16, accentColor: C.accent }} />
              Dauerfristverlängerung (USt-VA + 1 Monat)
            </label>
          )}
          <div><label style={lbl}>Jahreserklärungen für Veranlagungsjahre</label>
            <div style={{ display: "flex", gap: 10 }}>
              {[[vz1, setVz1], [vz2, setVz2]].map(([v, set], i) => (
                <select key={i} className="ft-input" value={v} onChange={(e) => set(Number(e.target.value))} style={{ cursor: "pointer" }}>
                  {[thisYear - 3, thisYear - 2, thisYear - 1, thisYear].map((y) => <option key={y} value={y}>VZ {y}</option>)}
                </select>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>Fristen werden gesetzlich berechnet (beratene Fälle, Wochenend-/Feiertagsregel je Bundesland).</div>
          </div>
        </div>
        <div style={{ padding: "16px 22px", borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="ft-btn" onClick={onClose} style={{ padding: "10px 16px", borderRadius: 9, fontWeight: 600, fontSize: 14, background: C.bg, color: C.ink }}>Abbrechen</button>
          <button className="ft-btn" onClick={save} disabled={!name.trim()} style={{ padding: "10px 18px", borderRadius: 9, fontWeight: 600, fontSize: 14, background: name.trim() ? C.accent : C.line, color: "#fff" }}>Anlegen & Fristen erzeugen</button>
        </div>
      </div>
    </div>
  );
}

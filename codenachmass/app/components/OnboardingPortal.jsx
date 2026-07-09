"use client";
import React, { useState, useEffect, useMemo } from "react";

/* =========================================================================
   ONBOARDING — Digitales Mandanten-Onboarding für Steuerkanzleien (Demo)
   Zwei Ansichten: Kanzlei-Dashboard (Fortschritt live) und Mandanten-Sicht
   (Stammdaten → Unterlagen → Bank/SEPA → Vollmacht → Absenden).
   Demo: Eingaben bleiben lokal im Browser, keine Datenübertragung.
   ========================================================================= */

const C = {
  bg: "#EEF1F6", panel: "#FFFFFF", ink: "#16223A", muted: "#64708A",
  line: "#E2E7F0", lineSoft: "#EDF1F7", accent: "#0F6E6B", accentSoft: "#E1F0EF",
  grnT: "#1B7A43", grnB: "#E4F2E9", ambT: "#9A6207", ambB: "#FBF3DD",
  sltT: "#475569", sltB: "#EDF1F8",
};
const SANS = '"Inter Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = '"JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace';

const TYP_LABEL = {
  privatperson: "Privatperson",
  einzelunternehmen: "Einzelunternehmen",
  kapitalgesellschaft: "Kapitalgesellschaft (GmbH)",
};
const DOCS_BY_TYP = {
  privatperson: ["Personalausweis (Kopie)", "Letzte Lohnsteuerbescheinigung", "Letzter Steuerbescheid"],
  einzelunternehmen: ["Personalausweis (Kopie)", "Letzter Jahresabschluss / EÜR", "Letzter Steuerbescheid", "Fragebogen zur steuerlichen Erfassung"],
  kapitalgesellschaft: ["Handelsregisterauszug", "Gesellschaftsvertrag", "Letzter Jahresabschluss", "Personalausweis Geschäftsführer:in"],
};

let _seq = 0;
const uid = () => `${Date.now().toString(36)}${(_seq++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const iso = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtDE = (s) => { if (!s) return "—"; const [y, m, d] = s.split("-"); return `${d}.${m}.${y}`; };

function newMandant(name, email, typ) {
  return {
    id: uid(), name, email, typ, eingeladen: iso(),
    stammdaten: { anschrift: "", plz: "", ort: "", telefon: "", steuerId: "" },
    docs: Object.fromEntries((DOCS_BY_TYP[typ] || []).map((label) => [label, null])),
    bank: { iban: "", inhaber: "", sepa: false },
    vollmacht: { ok: false, unterschrift: "" },
    submitted: false,
  };
}
function sectionsDone(m) {
  const s = m.stammdaten;
  const stamm = !!(s.anschrift && s.plz && s.ort);
  const docs = Object.values(m.docs).every(Boolean);
  const bank = !!(m.bank.iban && m.bank.inhaber && m.bank.sepa);
  const voll = !!(m.vollmacht.ok && m.vollmacht.unterschrift);
  return { stamm, docs, bank, voll };
}
function progress(m) {
  const d = sectionsDone(m);
  const parts = [d.stamm, d.docs, d.bank, d.voll];
  return Math.round((parts.filter(Boolean).length / parts.length) * 100);
}
function statusOf(m) {
  if (m.submitted) return { label: "Vollständig", t: C.grnT, b: C.grnB };
  if (progress(m) === 0) return { label: "Eingeladen", t: C.sltT, b: C.sltB };
  return { label: "In Bearbeitung", t: C.ambT, b: C.ambB };
}

function seed() {
  const a = newMandant("Weber Consulting GmbH", "info@weber-consulting.de", "kapitalgesellschaft");
  a.stammdaten = { anschrift: "Kaiserswerther Str. 12", plz: "40477", ort: "Düsseldorf", telefon: "0211 555 010", steuerId: "" };
  a.docs["Handelsregisterauszug"] = "HRB-Auszug_Weber.pdf";
  a.docs["Gesellschaftsvertrag"] = "Gesellschaftsvertrag_2019.pdf";
  const b = newMandant("Miriam Kessler", "m.kessler@mail.de", "privatperson");
  const c = newMandant("Fahrschule Brandt e.K.", "kontakt@fahrschule-brandt.de", "einzelunternehmen");
  c.stammdaten = { anschrift: "Lindenstr. 44", plz: "40233", ort: "Düsseldorf", telefon: "0211 44 55 66", steuerId: "" };
  Object.keys(c.docs).forEach((k) => (c.docs[k] = k.split(" ")[0] + "_Brandt.pdf"));
  c.bank = { iban: "DE89 3704 0044 0532 0130 00", inhaber: "Fahrschule Brandt e.K.", sepa: true };
  c.vollmacht = { ok: true, unterschrift: "Jürgen Brandt" };
  c.submitted = true;
  return { view: "kanzlei", activeId: null, mandanten: [a, b, c] };
}

export default function OnboardingPortal() {
  const [state, setState] = useState(null);
  const [step, setStep] = useState(0);
  const [invite, setInvite] = useState(false);

  useEffect(() => {
    let loaded = null;
    try { const r = window.localStorage.getItem("cnm_onboarding_v1"); if (r) loaded = JSON.parse(r); } catch (e) {}
    setState(loaded && loaded.mandanten ? loaded : seed());
  }, []);
  useEffect(() => {
    if (!state) return;
    try { window.localStorage.setItem("cnm_onboarding_v1", JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const active = useMemo(() => state?.mandanten.find((m) => m.id === state.activeId) || null, [state]);
  const patchActive = (fn) => setState((s) => ({ ...s, mandanten: s.mandanten.map((m) => (m.id === s.activeId ? fn(m) : m)) }));

  if (!state) return <div style={{ fontFamily: SANS, padding: 40, color: C.muted }}>Lädt…</div>;

  return (
    <div style={{ fontFamily: SANS, background: C.bg, color: C.ink, minHeight: 560, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}` }}>
      <style>{`
        .ob-btn{cursor:pointer;border:none;font-family:${SANS};transition:all .14s ease}
        .ob-btn:focus-visible{outline:2px solid ${C.accent};outline-offset:2px}
        .ob-input{font-family:${SANS};font-size:14px;color:${C.ink};background:${C.panel};border:1px solid ${C.line};border-radius:9px;padding:10px 12px;outline:none;width:100%;box-sizing:border-box}
        .ob-input:focus{border-color:${C.accent};box-shadow:0 0 0 3px ${C.accentSoft}}
        .ob-card{transition:transform .14s ease, box-shadow .14s ease}
        .ob-card:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(22,34,58,.10)}
        @media (max-width:720px){ .ob-grid{grid-template-columns:1fr!important} .ob-two{grid-template-columns:1fr!important} }
      `}</style>

      {/* Kopf mit Ansichts-Umschalter */}
      <div style={{ background: C.panel, borderBottom: `1px solid ${C.line}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: C.accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <div style={{ width: 13, height: 9, border: "2.5px solid #fff", borderTop: "none", borderRadius: "0 0 4px 4px" }} />
        </div>
        <div style={{ marginRight: "auto" }}>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>Onboarding<span style={{ color: C.accent }}>.</span></div>
          <div style={{ fontSize: 12, color: C.muted }}>Digitale Mandanten-Aufnahme</div>
        </div>
        <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 3, gap: 2 }}>
          {[["kanzlei", "Kanzlei-Ansicht"], ["mandant", "Mandanten-Ansicht"]].map(([k, l]) => (
            <button key={k} className="ob-btn"
              onClick={() => setState((s) => ({ ...s, view: k, activeId: k === "mandant" ? (s.activeId || s.mandanten[0]?.id || null) : s.activeId }))}
              style={{ padding: "7px 13px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: state.view === k ? C.panel : "transparent", color: state.view === k ? C.ink : C.muted, boxShadow: state.view === k ? "0 1px 2px rgba(16,34,58,.08)" : "none" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {state.view === "kanzlei" ? (
          <KanzleiView
            mandanten={state.mandanten}
            onOpen={(id) => { setStep(0); setState((s) => ({ ...s, view: "mandant", activeId: id })); }}
            invite={invite} setInvite={setInvite}
            onInvite={(name, email, typ) => { setState((s) => ({ ...s, mandanten: [...s.mandanten, newMandant(name, email, typ)] })); setInvite(false); }}
            onDelete={(id) => setState((s) => ({ ...s, mandanten: s.mandanten.filter((m) => m.id !== id), activeId: s.activeId === id ? null : s.activeId }))}
          />
        ) : active ? (
          <MandantView m={active} step={step} setStep={setStep} patch={patchActive}
            onBack={() => setState((s) => ({ ...s, view: "kanzlei" }))} />
        ) : (
          <div style={{ padding: 30, color: C.muted, fontSize: 14 }}>Kein Mandant ausgewählt — in die Kanzlei-Ansicht wechseln und einen Mandanten öffnen.</div>
        )}
      </div>
    </div>
  );
}

/* ---------- Kanzlei-Dashboard ---------- */
function KanzleiView({ mandanten, onOpen, invite, setInvite, onInvite, onDelete }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [typ, setTyp] = useState("privatperson");
  const counts = {
    offen: mandanten.filter((m) => statusOf(m).label === "Eingeladen").length,
    aktiv: mandanten.filter((m) => statusOf(m).label === "In Bearbeitung").length,
    fertig: mandanten.filter((m) => m.submitted).length,
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {[["Eingeladen", counts.offen, C.sltT, C.sltB], ["In Bearbeitung", counts.aktiv, C.ambT, C.ambB], ["Vollständig", counts.fertig, C.grnT, C.grnB]].map(([l, n, t, b]) => (
          <div key={l} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 11, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: t }} />
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{l}</span>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 17, color: n > 0 ? t : C.muted }}>{n}</span>
          </div>
        ))}
        <button className="ob-btn" onClick={() => setInvite(!invite)}
          style={{ marginLeft: "auto", padding: "10px 15px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, background: C.accent, color: "#fff" }}>
          + Mandant einladen
        </button>
      </div>

      {invite && (
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr auto", gap: 10, alignItems: "end" }} className="ob-grid">
          <div><label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Name</label>
            <input className="ob-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Muster GmbH" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>E-Mail</label>
            <input className="ob-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kontakt@muster.de" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 5 }}>Typ</label>
            <select className="ob-input" value={typ} onChange={(e) => setTyp(e.target.value)} style={{ cursor: "pointer" }}>
              {Object.entries(TYP_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select></div>
          <button className="ob-btn" disabled={!name.trim()} onClick={() => { onInvite(name.trim(), email.trim(), typ); setName(""); setEmail(""); }}
            style={{ padding: "11px 16px", borderRadius: 9, fontWeight: 600, fontSize: 13.5, background: name.trim() ? C.accent : C.line, color: "#fff" }}>
            Einladen
          </button>
        </div>
      )}

      <div className="ob-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
        {mandanten.map((m) => {
          const st = statusOf(m), p = progress(m), d = sectionsDone(m);
          const missing = [!d.stamm && "Stammdaten", !d.docs && "Unterlagen", !d.bank && "Bank/SEPA", !d.voll && "Vollmacht"].filter(Boolean);
          return (
            <div key={m.id} className="ob-card" style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{TYP_LABEL[m.typ]} · eingeladen {fmtDE(m.eingeladen)}</div>
                </div>
                <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 600, padding: "4px 9px", borderRadius: 20, background: st.b, color: st.t }}>{st.label}</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 5 }}>
                  <span>Fortschritt</span><span style={{ fontFamily: MONO, fontWeight: 600, color: p === 100 ? C.grnT : C.ink }}>{p}%</span>
                </div>
                <div style={{ height: 7, background: C.lineSoft, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${p}%`, height: "100%", background: p === 100 ? C.grnT : C.accent, borderRadius: 4, transition: "width .3s ease" }} />
                </div>
              </div>
              {missing.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                  {missing.map((x) => <span key={x} style={{ fontSize: 11, fontWeight: 600, color: C.ambT, background: C.ambB, borderRadius: 6, padding: "3px 8px" }}>fehlt: {x}</span>)}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.lineSoft}` }}>
                <button className="ob-btn" onClick={() => onOpen(m.id)}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: C.accentSoft, color: C.accent }}>
                  Mandanten-Ansicht öffnen
                </button>
                <button className="ob-btn" onClick={() => onDelete(m.id)} title="Entfernen"
                  style={{ padding: "9px 11px", borderRadius: 8, fontSize: 14, background: "transparent", color: C.muted, border: `1px solid ${C.line}` }}>×</button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 12, color: C.muted }}>
        In der echten Version: Mandant erhält einen persönlichen Link per E-Mail — die Kanzlei sieht jeden Fortschritt live.
      </div>
    </div>
  );
}

/* ---------- Mandanten-Sicht (Wizard) ---------- */
const STEPS = ["Stammdaten", "Unterlagen", "Bank & SEPA", "Vollmacht", "Absenden"];

function MandantView({ m, step, setStep, patch, onBack }) {
  const d = sectionsDone(m);
  const stepDone = [d.stamm, d.docs, d.bank, d.voll, m.submitted];
  const lbl = { fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 5, display: "block" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <button className="ob-btn" onClick={onBack}
          style={{ padding: "8px 13px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: C.panel, color: C.muted, border: `1px solid ${C.line}` }}>
          ← Kanzlei-Ansicht
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{TYP_LABEL[m.typ]} · So sieht es Ihr Mandant</div>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <button key={s} className="ob-btn" onClick={() => setStep(i)}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
              background: step === i ? C.ink : stepDone[i] ? C.grnB : C.panel,
              color: step === i ? "#fff" : stepDone[i] ? C.grnT : C.muted,
              border: `1px solid ${step === i ? C.ink : stepDone[i] ? "transparent" : C.line}` }}>
            <span style={{ fontFamily: MONO }}>{stepDone[i] && step !== i ? "✓" : i + 1}</span> {s}
          </button>
        ))}
      </div>

      <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20 }}>
        {step === 0 && (
          <div style={{ display: "grid", gap: 14 }}>
            <div className="ob-two" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr", gap: 12 }}>
              <div><label style={lbl}>Straße & Hausnummer *</label>
                <input className="ob-input" value={m.stammdaten.anschrift} onChange={(e) => patch((x) => ({ ...x, stammdaten: { ...x.stammdaten, anschrift: e.target.value } }))} /></div>
              <div><label style={lbl}>PLZ *</label>
                <input className="ob-input" value={m.stammdaten.plz} onChange={(e) => patch((x) => ({ ...x, stammdaten: { ...x.stammdaten, plz: e.target.value } }))} /></div>
              <div><label style={lbl}>Ort *</label>
                <input className="ob-input" value={m.stammdaten.ort} onChange={(e) => patch((x) => ({ ...x, stammdaten: { ...x.stammdaten, ort: e.target.value } }))} /></div>
            </div>
            <div className="ob-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={lbl}>Telefon</label>
                <input className="ob-input" value={m.stammdaten.telefon} onChange={(e) => patch((x) => ({ ...x, stammdaten: { ...x.stammdaten, telefon: e.target.value } }))} /></div>
              <div><label style={lbl}>Steuer-ID (falls vorhanden)</label>
                <input className="ob-input" value={m.stammdaten.steuerId} onChange={(e) => patch((x) => ({ ...x, stammdaten: { ...x.stammdaten, steuerId: e.target.value } }))} /></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "grid", gap: 10 }}>
            {Object.entries(m.docs).map(([label, file]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${file ? C.grnB : C.line}`, flexWrap: "wrap" }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, display: "grid", placeItems: "center", background: file ? C.grnB : C.lineSoft, color: file ? C.grnT : C.muted, fontFamily: MONO, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{file ? "✓" : "•"}</span>
                <div style={{ marginRight: "auto", minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{label}</div>
                  {file && <div style={{ fontFamily: MONO, fontSize: 11.5, color: C.grnT }}>{file}</div>}
                </div>
                <button className="ob-btn"
                  onClick={() => patch((x) => ({ ...x, docs: { ...x.docs, [label]: file ? null : label.split(" ")[0].replace(/[^A-Za-zÄÖÜäöüß]/g, "") + "_" + m.name.split(" ")[0] + ".pdf" } }))}
                  style={{ padding: "8px 13px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: file ? C.panel : C.accent, color: file ? C.muted : "#fff", border: file ? `1px solid ${C.line}` : "none" }}>
                  {file ? "Entfernen" : "Datei hochladen"}
                </button>
              </div>
            ))}
            <div style={{ fontFamily: MONO, fontSize: 11.5, color: C.muted }}>Demo: Der Upload wird simuliert — es wird keine echte Datei übertragen.</div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gap: 14, maxWidth: 560 }}>
            <div><label style={lbl}>Kontoinhaber *</label>
              <input className="ob-input" value={m.bank.inhaber} onChange={(e) => patch((x) => ({ ...x, bank: { ...x.bank, inhaber: e.target.value } }))} /></div>
            <div><label style={lbl}>IBAN *</label>
              <input className="ob-input" style={{ fontFamily: MONO }} value={m.bank.iban} placeholder="DE.." onChange={(e) => patch((x) => ({ ...x, bank: { ...x.bank, iban: e.target.value } }))} /></div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, cursor: "pointer", background: C.bg, padding: "12px 14px", borderRadius: 10 }}>
              <input type="checkbox" checked={m.bank.sepa} onChange={(e) => patch((x) => ({ ...x, bank: { ...x.bank, sepa: e.target.checked } }))} style={{ width: 16, height: 16, accentColor: C.accent, marginTop: 2 }} />
              <span>Ich erteile ein <strong>SEPA-Lastschriftmandat</strong> für die Honorarabrechnung der Kanzlei. *</span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "grid", gap: 14, maxWidth: 640 }}>
            <div style={{ background: C.bg, borderRadius: 10, padding: "14px 16px", fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>
              Hiermit bevollmächtige ich die Kanzlei, mich in allen steuerlichen Angelegenheiten gegenüber
              den Finanzbehörden zu vertreten (Vollmacht nach § 80 AO), Bescheide entgegenzunehmen und
              Einsicht in die bei den Finanzbehörden gespeicherten Daten zu nehmen.
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, cursor: "pointer" }}>
              <input type="checkbox" checked={m.vollmacht.ok} onChange={(e) => patch((x) => ({ ...x, vollmacht: { ...x.vollmacht, ok: e.target.checked } }))} style={{ width: 16, height: 16, accentColor: C.accent, marginTop: 2 }} />
              <span>Ich habe die Vollmacht gelesen und stimme zu. *</span>
            </label>
            <div style={{ maxWidth: 380 }}>
              <label style={lbl}>Unterschrift (Vor- und Nachname eintippen) *</label>
              <input className="ob-input" style={{ fontFamily: '"Segoe Script","Bradley Hand",cursive', fontSize: 19 }} value={m.vollmacht.unterschrift}
                onChange={(e) => patch((x) => ({ ...x, vollmacht: { ...x.vollmacht, unterschrift: e.target.value } }))} placeholder="Max Mustermann" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
              {[["Stammdaten", d.stamm], ["Unterlagen", d.docs], ["Bank & SEPA", d.bank], ["Vollmacht", d.voll]].map(([l, ok]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: ok ? C.grnB : C.ambB, borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: ok ? C.grnT : C.ambT }}>
                  <span style={{ fontFamily: MONO }}>{ok ? "✓" : "!"}</span> {l} {ok ? "vollständig" : "— noch unvollständig"}
                </div>
              ))}
            </div>
            {m.submitted ? (
              <div style={{ padding: "16px 18px", background: C.grnB, color: C.grnT, borderRadius: 10, fontWeight: 600, fontSize: 14.5 }}>
                ✓ Übermittelt — Ihre Kanzlei wurde benachrichtigt und meldet sich bei Ihnen.
              </div>
            ) : (
              <button className="ob-btn" disabled={!(d.stamm && d.docs && d.bank && d.voll)}
                onClick={() => patch((x) => ({ ...x, submitted: true }))}
                style={{ padding: "13px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14.5, background: d.stamm && d.docs && d.bank && d.voll ? C.accent : C.line, color: "#fff" }}>
                An Kanzlei übermitteln
              </button>
            )}
          </div>
        )}
      </div>

      {/* Weiter/Zurück */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        <button className="ob-btn" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
          style={{ padding: "10px 16px", borderRadius: 9, fontWeight: 600, fontSize: 13.5, background: C.panel, color: step === 0 ? C.line : C.ink, border: `1px solid ${C.line}` }}>
          ← Zurück
        </button>
        {step < STEPS.length - 1 && (
          <button className="ob-btn" onClick={() => setStep(step + 1)}
            style={{ padding: "10px 18px", borderRadius: 9, fontWeight: 600, fontSize: 13.5, background: C.accent, color: "#fff" }}>
            Weiter →
          </button>
        )}
      </div>
    </div>
  );
}

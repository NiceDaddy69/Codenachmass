"use client";
import { useMemo, useState } from "react";

/* Muster-Produkt: Meal-Prep-Planer, wie er für eine Food-Community aussehen könnte.
   Läuft komplett im Browser, es wird nichts gespeichert oder übertragen.
   Nährwerte sind Beispielwerte pro Portion. */

// t: "f" = Frühstück, "h" = Hauptgericht (Mittag/Abend) · z: [Zutat, Menge pro Portion, Einheit]
const RECIPES = [
  { t: "f", name: "Skyr-Bowl mit Beeren", min: 5, kcal: 320, p: 30, c: 34, f: 6,
    d: "Cremig, frisch und in fünf Minuten fertig – der Klassiker für eilige Morgen.",
    z: [["Skyr", 250, "g"], ["Beeren", 100, "g"], ["Haferflocken", 30, "g"], ["Honig", 1, "TL"]],
    s: ["Skyr in eine Schale geben.", "Beeren und Haferflocken darauf verteilen.", "Mit Honig abrunden."] },
  { t: "f", name: "Protein-Porridge", min: 10, kcal: 410, p: 28, c: 48, f: 10,
    d: "Warm, sättigend und hält bis zum Mittag – ideal an Trainingstagen.",
    z: [["Haferflocken", 60, "g"], ["Milch", 200, "ml"], ["Proteinpulver", 20, "g"], ["Banane", 0.5, "Stk"]],
    s: ["Haferflocken mit Milch aufkochen und 3 Minuten quellen lassen.", "Proteinpulver einrühren.", "Mit Bananenscheiben servieren."] },
  { t: "f", name: "Rührei auf Vollkornbrot", min: 10, kcal: 390, p: 24, c: 28, f: 19,
    d: "Herzhaft in den Tag: fluffiges Rührei mit Tomate auf knusprigem Brot.",
    z: [["Eier", 3, "Stk"], ["Vollkornbrot", 2, "Scheiben"], ["Tomate", 1, "Stk"], ["Butter", 1, "TL"]],
    s: ["Eier verquirlen und in Butter bei mittlerer Hitze stocken lassen.", "Brot toasten, Tomate würfeln.", "Rührei auf dem Brot anrichten."] },
  { t: "f", name: "Overnight Oats", min: 5, kcal: 380, p: 18, c: 52, f: 10,
    d: "Am Abend angesetzt, morgens nur noch aus dem Kühlschrank nehmen.",
    z: [["Haferflocken", 60, "g"], ["Milch", 150, "ml"], ["Joghurt", 100, "g"], ["Apfel", 0.5, "Stk"], ["Chiasamen", 1, "EL"]],
    s: ["Haferflocken, Milch, Joghurt und Chiasamen verrühren.", "Über Nacht kalt stellen.", "Morgens mit geriebenem Apfel toppen."] },
  { t: "f", name: "Bananen-Pancakes", min: 15, kcal: 430, p: 22, c: 50, f: 14,
    d: "Süßes Frühstück ohne Zucker – nur vier Zutaten.",
    z: [["Banane", 1, "Stk"], ["Eier", 2, "Stk"], ["Haferflocken", 40, "g"], ["Joghurt", 50, "g"]],
    s: ["Banane zerdrücken, mit Eiern und Haferflocken verrühren.", "Kleine Pancakes von beiden Seiten goldbraun backen.", "Mit Joghurt servieren."] },
  { t: "h", name: "Hähnchen-Reis-Bowl", min: 25, kcal: 560, p: 45, c: 62, f: 11,
    d: "Der Meal-Prep-Klassiker: viel Protein, lässt sich perfekt vorkochen.",
    z: [["Hähnchenbrust", 150, "g"], ["Reis", 80, "g"], ["Brokkoli", 150, "g"], ["Sojasauce", 1, "EL"]],
    s: ["Reis kochen, Brokkoli 5 Minuten dämpfen.", "Hähnchen würfeln und scharf anbraten.", "Alles mit Sojasauce in Boxen verteilen."] },
  { t: "h", name: "Rotes Linsen-Dal", min: 30, kcal: 520, p: 24, c: 70, f: 15,
    d: "Würzig, cremig, vegan – schmeckt am zweiten Tag noch besser.",
    z: [["Rote Linsen", 80, "g"], ["Kokosmilch", 100, "ml"], ["Tomaten (Dose)", 100, "g"], ["Zwiebel", 0.5, "Stk"], ["Reis", 50, "g"]],
    s: ["Zwiebel anschwitzen, Linsen und Tomaten zugeben.", "Mit Kokosmilch 15 Minuten köcheln.", "Mit Reis servieren."] },
  { t: "h", name: "Pasta mit Ofengemüse", min: 35, kcal: 610, p: 24, c: 82, f: 19,
    d: "Ein Blech, ein Topf – und das Gemüse macht die Arbeit im Ofen allein.",
    z: [["Vollkornpasta", 100, "g"], ["Zucchini", 0.5, "Stk"], ["Paprika", 0.5, "Stk"], ["Feta", 50, "g"]],
    s: ["Gemüse würfeln und 20 Minuten bei 200 °C rösten.", "Pasta kochen.", "Alles mischen und Feta darüberbröseln."] },
  { t: "h", name: "Chili sin Carne", min: 40, kcal: 450, p: 22, c: 62, f: 8,
    d: "Großer Topf, kleine Mühe – reicht locker für mehrere Tage.",
    z: [["Kidneybohnen", 120, "g"], ["Mais", 50, "g"], ["Tomaten (Dose)", 150, "g"], ["Zwiebel", 0.5, "Stk"], ["Paprika", 0.5, "Stk"]],
    s: ["Zwiebel und Paprika anbraten.", "Tomaten, Bohnen und Mais zugeben.", "25 Minuten köcheln und abschmecken."] },
  { t: "h", name: "Lachs mit Ofenkartoffeln", min: 35, kcal: 590, p: 36, c: 42, f: 29,
    d: "Gesunde Fette und alles von einem Blech.",
    z: [["Lachsfilet", 130, "g"], ["Kartoffeln", 200, "g"], ["Brokkoli", 150, "g"], ["Olivenöl", 1, "TL"]],
    s: ["Kartoffeln in Spalten 15 Minuten bei 200 °C vorbacken.", "Lachs und Brokkoli dazulegen.", "Weitere 15 Minuten backen."] },
  { t: "h", name: "Couscous-Salat", min: 15, kcal: 480, p: 20, c: 62, f: 15,
    d: "Kalt genießbar – perfekt fürs Büro oder unterwegs.",
    z: [["Couscous", 80, "g"], ["Kichererbsen", 80, "g"], ["Gurke", 0.5, "Stk"], ["Feta", 50, "g"]],
    s: ["Couscous mit heißem Wasser quellen lassen.", "Gurke würfeln, Kichererbsen abspülen.", "Alles mischen und Feta unterheben."] },
  { t: "h", name: "Hähnchen-Wraps", min: 20, kcal: 540, p: 38, c: 56, f: 16,
    d: "Schnell gerollt und gut mitzunehmen.",
    z: [["Tortilla-Wraps", 2, "Stk"], ["Hähnchenbrust", 100, "g"], ["Paprika", 0.5, "Stk"], ["Mais", 40, "g"], ["Joghurt", 30, "g"]],
    s: ["Hähnchen in Streifen braten.", "Paprika schneiden, Wraps kurz erwärmen.", "Mit Joghurt bestreichen, füllen und rollen."] },
  { t: "h", name: "Puten-Gemüse-Pfanne", min: 20, kcal: 420, p: 42, c: 30, f: 13,
    d: "Leicht, proteinreich und in 20 Minuten auf dem Tisch.",
    z: [["Putenbrust", 150, "g"], ["Paprika", 1, "Stk"], ["Zucchini", 0.5, "Stk"], ["Reis", 40, "g"], ["Sojasauce", 1, "EL"]],
    s: ["Reis kochen.", "Pute anbraten, Gemüse zugeben und 5 Minuten mitbraten.", "Mit Sojasauce ablöschen."] },
  { t: "h", name: "Tofu-Erdnuss-Nudeln", min: 25, kcal: 630, p: 30, c: 68, f: 25,
    d: "Cremige Erdnusssauce, knuspriger Tofu – vegan und richtig sättigend.",
    z: [["Tofu", 150, "g"], ["Reisnudeln", 70, "g"], ["Erdnussmus", 1, "EL"], ["Brokkoli", 100, "g"], ["Sojasauce", 1, "EL"]],
    s: ["Tofu würfeln und knusprig braten.", "Nudeln und Brokkoli garen.", "Erdnussmus mit Sojasauce und etwas Wasser verrühren, alles mischen."] },
  { t: "h", name: "Thunfisch-Kartoffel-Salat", min: 20, kcal: 440, p: 34, c: 40, f: 14,
    d: "Ohne Mayo, dafür mit viel Protein – hält sich drei Tage.",
    z: [["Thunfisch (Dose)", 120, "g"], ["Kartoffeln", 200, "g"], ["Gurke", 0.5, "Stk"], ["Joghurt", 50, "g"], ["Zwiebel", 0.25, "Stk"]],
    s: ["Kartoffeln kochen und in Scheiben schneiden.", "Gurke und Zwiebel fein schneiden.", "Mit Thunfisch und Joghurt vermengen."] },
];
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOTS = [["f", "Frühstück"], ["m", "Mittag"], ["a", "Abend"]];
const SLOT_LABEL = Object.fromEntries(SLOTS);
const typeOf = (slot) => (slot === "f" ? "f" : "h");
const fmt = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });
const fits = (r, g) => r.kcal <= g.kcal && r.p >= g.prot;

function autoFill(g) {
  const pool = (t) => {
    const all = RECIPES.map((r, i) => ({ r, i })).filter((x) => x.r.t === t);
    const ok = all.filter((x) => fits(x.r, g));
    // Passt nichts genau, nimm die Gerichte, die dem Ziel am nächsten kommen.
    const use = ok.length ? ok : [...all].sort((a, b) =>
      (Math.max(0, a.r.kcal - g.kcal) + Math.max(0, g.prot - a.r.p) * 10) -
      (Math.max(0, b.r.kcal - g.kcal) + Math.max(0, g.prot - b.r.p) * 10)).slice(0, 2);
    return use.map((x) => x.i);
  };
  const f = pool("f"), h = pool("h");
  return DAYS.map((_, d) => ({ f: f[d % f.length], m: h[(2 * d) % h.length], a: h[(2 * d + 1) % h.length] }));
}
const START = { kcal: 600, prot: 20 };

export default function MealPrepDemo() {
  const [tab, setTab] = useState("plan");
  const [goal, setGoal] = useState(START);
  const [plan, setPlan] = useState(() => autoFill(START));
  const [day, setDay] = useState(0);
  const [portions, setPortions] = useState(1);
  const [pick, setPick] = useState(null);      // { d, slot } – Slot, für den gerade ein Gericht gewählt wird
  const [detail, setDetail] = useState(null);  // { id, d, slot }
  const [filter, setFilter] = useState("alle");
  const [only, setOnly] = useState(false);
  const [done, setDone] = useState({});

  const list = useMemo(() => {
    const m = new Map();
    plan.forEach((dd) => SLOTS.forEach(([s]) => RECIPES[dd[s]].z.forEach(([n, q, u]) => {
      const cur = m.get(n) || { n, q: 0, u };
      cur.q += q * portions; m.set(n, cur);
    })));
    return [...m.values()].sort((a, b) => a.n.localeCompare(b.n, "de"));
  }, [plan, portions]);
  const checked = list.filter((x) => done[x.n]).length;

  const assign = (d, slot, id) => {
    setPlan((p) => p.map((dd, i) => (i === d ? { ...dd, [slot]: id } : dd)));
    setPick(null); setDetail(null); setDay(d); setTab("plan");
  };
  const openDetail = (id) => {
    const t = RECIPES[id].t;
    const slot = pick ? pick.slot : t === "f" ? "f" : "m";
    setDetail({ id, d: pick ? pick.d : day, slot });
  };
  const startPick = (slot) => { setPick({ d: day, slot }); setFilter(typeOf(slot)); setTab("rezepte"); };
  const go = (t) => { setTab(t); setDetail(null); if (t !== "rezepte") setPick(null); };
  const step = (key, delta, lo, hi) => setGoal((g) => ({ ...g, [key]: Math.min(hi, Math.max(lo, g[key] + delta)) }));

  const today = plan[day];
  const sum = SLOTS.reduce((a, [s]) => ({ kcal: a.kcal + RECIPES[today[s]].kcal, p: a.p + RECIPES[today[s]].p }), { kcal: 0, p: 0 });
  const shown = RECIPES.map((r, i) => ({ r, i })).filter(({ r }) => (filter === "alle" || r.t === filter) && (!only || fits(r, goal)));
  const R = detail ? RECIPES[detail.id] : null;

  return (
    <div className="phone">
      <div className="top">
        <span className="hi">Meal Prep mit</span>
        <strong>[Dein Name]</strong>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "plan"} className={tab === "plan" ? "on" : ""} onClick={() => go("plan")}>Wochenplan</button>
          <button role="tab" aria-selected={tab === "rezepte"} className={tab === "rezepte" ? "on" : ""} onClick={() => go("rezepte")}>Rezepte</button>
          <button role="tab" aria-selected={tab === "list"} className={tab === "list" ? "on" : ""} onClick={() => go("list")}>
            Einkauf <span className="badge">{list.length - checked}</span>
          </button>
        </div>
      </div>

      <div className="body">
        {tab === "plan" && (
          <>
            <div className="goal">
              <span className="gT">Dein Ziel pro Mahlzeit</span>
              <div className="gRow">
                <span>Kalorien max.</span>
                <div className="stepper">
                  <button onClick={() => step("kcal", -50, 300, 900)} aria-label="Weniger Kalorien">–</button>
                  <output>{goal.kcal} kcal</output>
                  <button onClick={() => step("kcal", 50, 300, 900)} aria-label="Mehr Kalorien">+</button>
                </div>
              </div>
              <div className="gRow">
                <span>Protein mind.</span>
                <div className="stepper">
                  <button onClick={() => step("prot", -5, 10, 45)} aria-label="Weniger Protein">–</button>
                  <output>{goal.prot} g</output>
                  <button onClick={() => step("prot", 5, 10, 45)} aria-label="Mehr Protein">+</button>
                </div>
              </div>
              <button className="fill" onClick={() => setPlan(autoFill(goal))}>Woche passend füllen</button>
            </div>

            <div className="days">
              {DAYS.map((d, i) => (
                <button key={d} className={i === day ? "on" : ""} onClick={() => setDay(i)} aria-pressed={i === day}>{d}</button>
              ))}
            </div>
            {SLOTS.map(([s, label]) => {
              const r = RECIPES[today[s]];
              return (
                <div className="meal" key={s}>
                  <button className="mMain" onClick={() => setDetail({ id: today[s], d: day, slot: s })}>
                    <span className="mSlot">{label}{!fits(r, goal) && <em> · außerhalb Ziel</em>}</span>
                    <strong>{r.name}</strong>
                    <span className="mMeta">{r.kcal} kcal · {r.p} g Protein · {r.min} Min</span>
                  </button>
                  <button className="chip" onClick={() => startPick(s)} aria-label={`${label} am ${DAYS[day]} ändern`}>ändern</button>
                </div>
              );
            })}
            <p className="sum">{DAYS[day]} gesamt: <strong>{sum.kcal} kcal</strong> · <strong>{sum.p} g Protein</strong></p>
          </>
        )}

        {tab === "rezepte" && (
          <>
            {pick && <p className="banner">Wähle ein Gericht für <strong>{DAYS[pick.d]} · {SLOT_LABEL[pick.slot]}</strong></p>}
            {!pick && (
              <div className="filters">
                {[["alle", "Alle"], ["f", "Frühstück"], ["h", "Mittag & Abend"]].map(([k, l]) => (
                  <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
            )}
            <label className="only">
              <input type="checkbox" checked={only} onChange={() => setOnly((o) => !o)} />
              Nur passend zu meinem Ziel (≤ {goal.kcal} kcal, ≥ {goal.prot} g Protein)
            </label>
            {shown.length === 0 && <p className="empty">Kein Gericht passt zu diesem Ziel. Passe es im Wochenplan an.</p>}
            {shown.map(({ r, i }) => (
              <div className="rec" key={r.name}>
                <button className="mMain" onClick={() => openDetail(i)}>
                  <strong>{r.name}</strong>
                  <span className="mMeta">{r.kcal} kcal · {r.p} g Protein · {r.min} Min</span>
                </button>
                {fits(r, goal) && <span className="ok">passt</span>}
                {pick && <button className="chip solid" onClick={() => assign(pick.d, pick.slot, i)}>wählen</button>}
              </div>
            ))}
          </>
        )}

        {tab === "list" && (
          <>
            <div className="gRow port">
              <span>Portionen pro Gericht</span>
              <div className="stepper">
                <button onClick={() => setPortions((p) => Math.max(1, p - 1))} aria-label="Weniger Portionen">–</button>
                <output>{portions}</output>
                <button onClick={() => setPortions((p) => Math.min(6, p + 1))} aria-label="Mehr Portionen">+</button>
              </div>
            </div>
            <p className="prog">Für die ganze Woche · {checked} von {list.length} erledigt</p>
            {list.map((x) => (
              <label className={"item" + (done[x.n] ? " done" : "")} key={x.n}>
                <input type="checkbox" checked={!!done[x.n]} onChange={() => setDone((d) => ({ ...d, [x.n]: !d[x.n] }))} />
                <span className="n">{x.n}</span>
                <span className="q">{fmt(x.q)} {x.u}</span>
              </label>
            ))}
          </>
        )}

        {R && (
          <div className="sheet" role="dialog" aria-label={R.name}>
            <button className="back" onClick={() => setDetail(null)}>← zurück</button>
            <h4>{R.name}</h4>
            <p className="desc">{R.d}</p>
            <div className="macros">
              <div><strong>{R.kcal}</strong><span>kcal</span></div>
              <div><strong>{R.p} g</strong><span>Protein</span></div>
              <div><strong>{R.c} g</strong><span>Kohlenhydr.</span></div>
              <div><strong>{R.f} g</strong><span>Fett</span></div>
            </div>
            <p className="note">Pro Portion · {R.min} Minuten{fits(R, goal) ? " · passt zu deinem Ziel" : ""}</p>
            <h5>Zutaten {portions > 1 ? `für ${portions} Portionen` : "für 1 Portion"}</h5>
            <ul className="zut">
              {R.z.map(([n, q, u]) => <li key={n}><span>{n}</span><span>{fmt(q * portions)} {u}</span></li>)}
            </ul>
            <h5>Zubereitung</h5>
            <ol className="steps">{R.s.map((s) => <li key={s}>{s}</li>)}</ol>
            <h5>Einplanen</h5>
            <div className="days small">
              {DAYS.map((d, i) => (
                <button key={d} className={i === detail.d ? "on" : ""} onClick={() => setDetail((x) => ({ ...x, d: i }))}>{d}</button>
              ))}
            </div>
            {R.t === "h" && (
              <div className="filters">
                {[["m", "Mittag"], ["a", "Abend"]].map(([k, l]) => (
                  <button key={k} className={detail.slot === k ? "on" : ""} onClick={() => setDetail((x) => ({ ...x, slot: k }))}>{l}</button>
                ))}
              </div>
            )}
            <button className="fill dark" onClick={() => assign(detail.d, R.t === "f" ? "f" : (detail.slot === "f" ? "m" : detail.slot), detail.id)}>
              Für {DAYS[detail.d]} · {SLOT_LABEL[R.t === "f" ? "f" : (detail.slot === "f" ? "m" : detail.slot)]} übernehmen
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .phone{width:100%;max-width:380px;margin:0 auto;background:#fff;border:8px solid var(--ink);border-radius:36px;overflow:hidden;box-shadow:0 30px 60px rgba(42,29,23,.22);font-family:var(--sans);color:var(--ink)}
        .top{background:linear-gradient(140deg,#F6A66B,#E4683B);color:#fff;padding:20px 16px 0}
        .hi{display:block;font-size:13px;opacity:.9}
        .top strong{display:block;font-family:var(--disp);font-size:23px;letter-spacing:-0.01em;line-height:1.2}
        .tabs{display:flex;gap:4px;margin-top:14px}
        .tabs button{flex:1;border:0;background:rgba(255,255,255,.22);color:#fff;font:600 13px var(--sans);padding:10px 4px;border-radius:12px 12px 0 0;cursor:pointer;white-space:nowrap}
        .tabs button.on{background:#fff;color:var(--ink)}
        .badge{display:inline-block;min-width:20px;padding:0 5px;border-radius:10px;background:var(--ink);color:#fff;font-size:11px;line-height:19px;margin-left:2px}
        .body{position:relative;padding:14px 14px 18px;height:540px;overflow-y:auto}
        button{font-family:var(--sans);color:var(--ink)}

        .goal{background:var(--paper);border-radius:16px;padding:12px 12px 12px;margin-bottom:12px}
        .gT{display:block;font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--accent);margin-bottom:4px}
        .gRow{display:flex;align-items:center;justify-content:space-between;font-size:14px;padding:5px 0}
        .port{background:var(--paper);border-radius:14px;padding:9px 12px;margin-bottom:10px}
        .stepper{display:flex;align-items:center;gap:8px}
        .stepper button{width:30px;height:30px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:17px;line-height:1;cursor:pointer}
        .stepper output{font-weight:700;min-width:64px;text-align:center;font-size:14px}
        .port .stepper output{min-width:16px}
        .fill{width:100%;margin-top:8px;border:0;border-radius:12px;background:var(--accent);color:#fff;font-weight:600;font-size:14px;padding:11px;cursor:pointer}
        .fill.dark{background:var(--ink);margin-top:12px}

        .days{display:flex;gap:5px;margin-bottom:8px}
        .days button{flex:1;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:700;font-size:12.5px;padding:8px 0;cursor:pointer}
        .days button.on{background:var(--ink);border-color:var(--ink);color:#fff}
        .days.small button{padding:6px 0;font-size:12px}

        .meal,.rec{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--lineSoft)}
        .mMain{flex:1;min-width:0;text-align:left;background:none;border:0;padding:0;cursor:pointer}
        .mSlot{display:block;font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--accent)}
        .mSlot em{font-style:normal;color:var(--muted);text-transform:none;letter-spacing:0;font-weight:500}
        .mMain strong{display:block;font-size:14.5px;line-height:1.3}
        .mMain:hover strong{text-decoration:underline}
        .mMeta{display:block;font-size:12.5px;color:var(--muted)}
        .chip{flex-shrink:0;border:1px solid var(--line);background:#fff;border-radius:999px;font-weight:600;font-size:12px;color:var(--accent);padding:7px 11px;cursor:pointer}
        .chip:hover{border-color:var(--accent)}
        .chip.solid{background:var(--accent);border-color:var(--accent);color:#fff}
        .ok{flex-shrink:0;font-size:11px;font-weight:700;color:#1B7A43;background:#E4F2E9;border-radius:999px;padding:3px 8px}
        .sum{margin-top:12px;font-size:13.5px;color:var(--muted);text-align:center}
        .sum strong{color:var(--ink)}

        .banner{background:var(--accentSoft);border-radius:12px;padding:10px 12px;font-size:13.5px;margin-bottom:8px}
        .filters{display:flex;gap:6px;margin:0 0 8px;flex-wrap:wrap}
        .filters button{border:1px solid var(--line);background:#fff;border-radius:999px;font-weight:600;font-size:12.5px;padding:7px 12px;cursor:pointer}
        .filters button.on{background:var(--ink);border-color:var(--ink);color:#fff}
        .only{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;color:var(--muted);padding:4px 0 6px;cursor:pointer}
        .only input{accent-color:var(--accent);margin:2px 0 0;flex-shrink:0}
        .empty{font-size:13.5px;color:var(--muted);padding:16px 0}

        .prog{font-size:13px;color:var(--muted);margin-bottom:4px}
        .item{display:flex;align-items:center;gap:11px;padding:10px 2px;border-bottom:1px solid var(--lineSoft);font-size:14.5px;cursor:pointer}
        .item input{width:19px;height:19px;accent-color:var(--accent);margin:0;flex-shrink:0}
        .n{flex:1}
        .q{color:var(--muted);font-size:13.5px;white-space:nowrap}
        .done .n{text-decoration:line-through;color:var(--muted)}

        .sheet{position:absolute;inset:0;background:#fff;padding:12px 16px 20px;overflow-y:auto;z-index:2}
        .back{background:none;border:0;padding:4px 0;font-weight:600;font-size:13.5px;color:var(--accent);cursor:pointer}
        .sheet h4{font-family:var(--disp);font-size:21px;font-weight:600;letter-spacing:-0.01em;margin:6px 0 0;line-height:1.2}
        .desc{font-size:14px;color:var(--muted);margin-top:6px}
        .macros{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px}
        .macros div{background:var(--paper);border-radius:12px;padding:9px 4px;text-align:center}
        .macros strong{display:block;font-family:var(--disp);font-size:16px}
        .macros span{font-size:10.5px;color:var(--muted)}
        .note{font-size:12px;color:var(--muted);margin-top:8px}
        .sheet h5{font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--accent);margin:16px 0 6px}
        .zut{list-style:none;padding:0;margin:0}
        .zut li{display:flex;justify-content:space-between;font-size:14px;padding:6px 0;border-bottom:1px solid var(--lineSoft)}
        .zut li span:last-child{color:var(--muted)}
        .steps{margin:0;padding-left:18px;font-size:14px}
        .steps li{padding:3px 0}
      `}</style>
    </div>
  );
}

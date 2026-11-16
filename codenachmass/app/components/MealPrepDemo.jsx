"use client";
import { useMemo, useState } from "react";

/* Muster-Produkt: Meal-Prep-Planer, wie er für eine Food-Community aussehen könnte.
   Läuft komplett im Browser, es wird nichts gespeichert oder übertragen. */

const RECIPES = [
  { name: "Hähnchen-Reis-Bowl", min: 25, z: [["Hähnchenbrust", 150, "g"], ["Reis", 80, "g"], ["Brokkoli", 150, "g"], ["Sojasauce", 1, "EL"]] },
  { name: "Rotes Linsen-Dal", min: 30, z: [["Rote Linsen", 80, "g"], ["Kokosmilch", 100, "ml"], ["Tomaten (Dose)", 100, "g"], ["Zwiebel", 0.5, "Stk"], ["Reis", 60, "g"]] },
  { name: "Pasta mit Ofengemüse", min: 35, z: [["Vollkornpasta", 100, "g"], ["Zucchini", 0.5, "Stk"], ["Paprika", 0.5, "Stk"], ["Feta", 50, "g"]] },
  { name: "Chili sin Carne", min: 40, z: [["Kidneybohnen", 100, "g"], ["Mais", 50, "g"], ["Tomaten (Dose)", 150, "g"], ["Zwiebel", 0.5, "Stk"], ["Paprika", 0.5, "Stk"]] },
  { name: "Lachs mit Ofenkartoffeln", min: 35, z: [["Lachsfilet", 130, "g"], ["Kartoffeln", 200, "g"], ["Brokkoli", 150, "g"]] },
  { name: "Couscous-Salat", min: 15, z: [["Couscous", 80, "g"], ["Kichererbsen", 80, "g"], ["Gurke", 0.5, "Stk"], ["Feta", 50, "g"]] },
  { name: "Hähnchen-Wraps", min: 20, z: [["Tortilla-Wraps", 2, "Stk"], ["Hähnchenbrust", 100, "g"], ["Paprika", 0.5, "Stk"], ["Mais", 40, "g"]] },
];
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr"];
const fmt = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });

export default function MealPrepDemo() {
  const [tab, setTab] = useState("plan");
  const [plan, setPlan] = useState([0, 1, 2, 3, 4]);
  const [portions, setPortions] = useState(2);
  const [done, setDone] = useState({});

  const list = useMemo(() => {
    const m = new Map();
    plan.forEach((r) => RECIPES[r].z.forEach(([n, q, u]) => {
      const cur = m.get(n) || { n, q: 0, u };
      cur.q += q * portions; m.set(n, cur);
    }));
    return [...m.values()].sort((a, b) => a.n.localeCompare(b.n, "de"));
  }, [plan, portions]);

  const swap = (i) => setPlan((p) => {
    const next = [...p];
    let r = next[i];
    do { r = (r + 1) % RECIPES.length; } while (next.includes(r));
    next[i] = r;
    return next;
  });
  const checked = list.filter((x) => done[x.n]).length;

  return (
    <div className="phone">
      <div className="top">
        <span className="hi">Meal Prep mit</span>
        <strong>[Dein Name]</strong>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "plan"} className={tab === "plan" ? "on" : ""} onClick={() => setTab("plan")}>Wochenplan</button>
          <button role="tab" aria-selected={tab === "list"} className={tab === "list" ? "on" : ""} onClick={() => setTab("list")}>
            Einkaufsliste <span className="badge">{list.length - checked}</span>
          </button>
        </div>
      </div>

      {tab === "plan" ? (
        <div className="body">
          <div className="portions">
            <span>Portionen pro Gericht</span>
            <div className="stepper">
              <button onClick={() => setPortions((p) => Math.max(1, p - 1))} aria-label="Weniger Portionen">–</button>
              <output>{portions}</output>
              <button onClick={() => setPortions((p) => Math.min(6, p + 1))} aria-label="Mehr Portionen">+</button>
            </div>
          </div>
          {plan.map((r, i) => (
            <div className="day" key={DAYS[i]}>
              <span className="d">{DAYS[i]}</span>
              <div className="meal">
                <strong>{RECIPES[r].name}</strong>
                <span>{RECIPES[r].min} Min · {RECIPES[r].z.length} Zutaten</span>
              </div>
              <button className="swap" onClick={() => swap(i)} aria-label={`Gericht für ${DAYS[i]} tauschen`}>tauschen</button>
            </div>
          ))}
          <button className="go" onClick={() => setTab("list")}>Einkaufsliste erstellen →</button>
        </div>
      ) : (
        <div className="body">
          <p className="prog">{checked} von {list.length} erledigt · für {portions} {portions === 1 ? "Portion" : "Portionen"}</p>
          {list.map((x) => (
            <label className={"item" + (done[x.n] ? " ok" : "")} key={x.n}>
              <input type="checkbox" checked={!!done[x.n]} onChange={() => setDone((d) => ({ ...d, [x.n]: !d[x.n] }))} />
              <span className="n">{x.n}</span>
              <span className="q">{fmt(x.q)} {x.u}</span>
            </label>
          ))}
        </div>
      )}

      <style jsx>{`
        .phone{width:100%;max-width:360px;margin:0 auto;background:#fff;border:8px solid var(--ink);border-radius:36px;overflow:hidden;box-shadow:0 30px 60px rgba(42,29,23,.22);font-family:var(--sans);color:var(--ink)}
        .top{background:linear-gradient(140deg,#F6A66B,#E4683B);color:#fff;padding:22px 18px 0}
        .hi{display:block;font-size:13px;opacity:.9}
        .top strong{display:block;font-family:var(--disp);font-size:24px;letter-spacing:-0.01em;line-height:1.2}
        .tabs{display:flex;gap:4px;margin-top:16px}
        .tabs button{flex:1;border:0;background:rgba(255,255,255,.22);color:#fff;font:600 13.5px var(--sans);padding:10px 6px;border-radius:12px 12px 0 0;cursor:pointer}
        .tabs button.on{background:#fff;color:var(--ink)}
        .badge{display:inline-block;min-width:20px;padding:0 6px;border-radius:10px;background:var(--ink);color:#fff;font-size:11.5px;line-height:20px;margin-left:4px}
        .body{padding:14px 14px 18px;height:430px;overflow-y:auto}
        .portions{display:flex;align-items:center;justify-content:space-between;background:var(--paper);border-radius:14px;padding:10px 12px;font-size:14px;margin-bottom:10px}
        .stepper{display:flex;align-items:center;gap:10px}
        .stepper button{width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:18px;line-height:1;cursor:pointer;color:var(--ink)}
        .stepper output{font-weight:700;min-width:14px;text-align:center}
        .day{display:flex;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid var(--lineSoft)}
        .d{flex-shrink:0;width:38px;height:38px;border-radius:12px;background:var(--accentSoft);color:var(--accent);font-weight:700;font-size:13.5px;display:grid;place-items:center}
        .meal{flex:1;min-width:0}
        .meal strong{display:block;font-size:14.5px;line-height:1.3}
        .meal span{font-size:12.5px;color:var(--muted)}
        .swap{border:1px solid var(--line);background:#fff;border-radius:999px;font:600 12px var(--sans);color:var(--accent);padding:7px 11px;cursor:pointer}
        .swap:hover{border-color:var(--accent)}
        .go{width:100%;margin-top:14px;border:0;border-radius:14px;background:var(--ink);color:#fff;font:600 14.5px var(--sans);padding:13px;cursor:pointer}
        .prog{font-size:13px;color:var(--muted);margin-bottom:6px}
        .item{display:flex;align-items:center;gap:11px;padding:10px 2px;border-bottom:1px solid var(--lineSoft);font-size:14.5px;cursor:pointer}
        .item input{width:19px;height:19px;accent-color:var(--accent);margin:0;flex-shrink:0}
        .n{flex:1}
        .q{color:var(--muted);font-size:13.5px;white-space:nowrap}
        .ok .n{text-decoration:line-through;color:var(--muted)}
      `}</style>
    </div>
  );
}

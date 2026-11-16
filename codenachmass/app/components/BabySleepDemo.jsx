"use client";
import { useEffect, useState } from "react";

/* Muster-Produkt: Baby-Schlaf-Kompass für eine Eltern-Community (Papa-Perspektive).
   Läuft komplett im Browser. Alle Zeiten und Tipps sind Orientierungs- und Beispielwerte;
   im echten Produkt kommen die Inhalte vom Creator und werden fachlich geprüft. */

// ww = Wachphase in Minuten, naps = Schläfchen-Längen, last = letzte Wachphase vor der Nacht
const AGES = [
  { k: "0-3", label: "0–3 Mon.", ww: 75, naps: [60, 60, 60, 60, 60], last: 75, wach: "45–90 Min", n: "4–5", ges: "14–17 Std",
    info: "In den ersten Wochen gibt es noch keinen festen Rhythmus. Achte auf Müdigkeitszeichen statt auf die Uhr: Gähnen, Wegschauen, Augenreiben." },
  { k: "4-6", label: "4–6 Mon.", ww: 120, naps: [90, 90, 45], last: 135, wach: "1,5–2,5 Std", n: "3", ges: "12–16 Std",
    info: "Jetzt entsteht langsam ein Rhythmus. Viele Babys schlafen um den vierten Monat herum plötzlich unruhiger – das ist eine normale Entwicklungsphase und geht vorbei." },
  { k: "7-9", label: "7–9 Mon.", ww: 180, naps: [90, 75], last: 210, wach: "2,5–3,5 Std", n: "2–3", ges: "12–16 Std",
    info: "Meist fällt das dritte Schläfchen weg. Krabbeln, Hochziehen und Fremdeln können den Schlaf vorübergehend durcheinanderbringen." },
  { k: "10-12", label: "10–12 Mon.", ww: 210, naps: [75, 60], last: 225, wach: "3–4 Std", n: "2", ges: "12–16 Std",
    info: "Zwei feste Schläfchen und eine klare Abendroutine geben jetzt viel Sicherheit. Trennungsangst am Abend ist in diesem Alter häufig." },
];
const ROUTINE = [
  ["Licht dimmen, Bildschirme aus", "Etwa 30 Minuten vor dem Schlafen. Das signalisiert: Der Tag ist vorbei."],
  ["Waschen oder baden", "Muss nicht täglich sein – ein warmer Waschlappen reicht als Ritual."],
  ["Frische Windel und Schlafsack", "Papa-Aufgabe par excellence: Immer derselbe Ablauf, immer derselbe Ort."],
  ["Stillen oder Fläschchen", "Einschlafstillen ist völlig in Ordnung. An anderen Abenden übernimmst du – Nähe geht auch mit Papa."],
  ["Lied, Summen oder kurze Geschichte", "Immer dasselbe. Deine tiefe Stimme wirkt oft besonders beruhigend."],
  ["In den Schlaf begleiten", "Im Arm, in der Trage oder dicht neben ihm: Bleib, bis dein Baby schläft. Nähe ist kein Verwöhnen."],
];
const SOS = [
  ["Hunger?", "Letzte Mahlzeit länger als 2–3 Stunden her? Dann zuerst füttern. In Wachstumsphasen kommt der Hunger öfter."],
  ["Windel und Kleidung?", "Volle Windel, kratzendes Etikett, zu warm oder zu kalt? Fühl im Nacken: warm und trocken ist richtig."],
  ["Luft im Bauch?", "Hochnehmen, an die Schulter legen, sanft den Rücken klopfen. Fliegergriff hilft vielen Babys."],
  ["Übermüdet?", "Zu lange wach macht das Einschlafen schwerer. Reize runter: dunkler Raum, wenig Ansprache, ruhige Stimme, viel Körperkontakt."],
  ["Nähe tanken", "Ab in die Trage oder eng an die Brust und ruhig durch den Raum gehen. Weinen ist Kommunikation – du darfst immer trösten."],
  ["Gleichmäßiges Geräusch", "Leises Rauschen oder Summen kann helfen – leise und nicht direkt am Bett."],
  ["Durchatmen", "Du machst nichts falsch. Dein Baby spürt deine Ruhe. Wenn du an deine Grenze kommst: Wechselt euch ab – oder leg es kurz sicher ab, atme zwei Minuten durch und komm zurück."],
];
const SAFE = ["Immer in Rückenlage schlafen legen", "Nah bei euch: eigenes Bett oder Beistellbett im Elternschlafzimmer", "Schlafsack statt Decke, kein Kissen, kein Nestchen", "Rauchfreie Umgebung", "Raumtemperatur etwa 16–18 °C"];

const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const hhmm = (min) => { const m = ((min % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };

export default function BabySleepDemo() {
  const [name, setName] = useState("[Dein Name]");
  const [tab, setTab] = useState("heute");
  const [age, setAge] = useState(1);
  const [wake, setWake] = useState("07:00");
  const [done, setDone] = useState({});
  const [sos, setSos] = useState(0);

  // Personalisierung über die Adresse: /muster/babyschlaf?fuer=kanalname
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("fuer");
    if (f) setName(f.slice(0, 30));
  }, []);

  const A = AGES[age];
  const plan = [];
  let t = toMin(wake || "07:00");
  plan.push({ k: "wake", time: hhmm(t), label: "Aufwachen", sub: "Start in den Tag" });
  A.naps.forEach((len, i) => {
    const start = t + A.ww;
    plan.push({ k: "nap" + i, time: `${hhmm(start)} – ${hhmm(start + len)}`, label: `Schläfchen ${i + 1}`, sub: `ca. ${len} Min` });
    t = start + len;
  });
  const bed = t + A.last;
  plan.push({ k: "routine", time: hhmm(bed - 30), label: "Abendroutine starten", sub: "Licht dimmen, runterfahren" });
  plan.push({ k: "bed", time: hhmm(bed), label: "Schlafenszeit", sub: "Gute Nacht" });
  const rDone = ROUTINE.filter(([s]) => done[s]).length;

  return (
    <div className="phone">
      <div className="top">
        <span className="hi">Schlaf-Kompass mit</span>
        <strong>{name}</strong>
        <div className="tabs" role="tablist">
          {[["heute", "Heute"], ["routine", "Routine"], ["sos", "SOS"], ["wissen", "Wissen"]].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="body">
        {tab === "heute" && (
          <>
            <span className="cap">Wie alt ist dein Baby?</span>
            <div className="chips">
              {AGES.map((a, i) => <button key={a.k} className={i === age ? "on" : ""} onClick={() => setAge(i)}>{a.label}</button>)}
            </div>
            <label className="wake">
              <span>Heute aufgewacht um</span>
              <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} />
            </label>
            <span className="cap">Euer Tag · grobe Orientierung</span>
            <ol className="plan">
              {plan.map((p) => (
                <li key={p.k} className={p.k === "bed" ? "bed" : p.k.startsWith("nap") ? "nap" : ""}>
                  <span className="time">{p.time}</span>
                  <span className="what"><strong>{p.label}</strong><em>{p.sub}</em></span>
                </li>
              ))}
            </ol>
            <p className="hint">Kein Stundenplan: Dein Baby gibt den Takt vor. Achte auf seine Müdigkeitszeichen – die Zeiten helfen dir nur, sie nicht zu verpassen.</p>
          </>
        )}

        {tab === "routine" && (
          <>
            <span className="cap">Abendroutine · {rDone} von {ROUTINE.length} erledigt</span>
            <div className="bar"><div style={{ width: `${(rDone / ROUTINE.length) * 100}%` }} /></div>
            {ROUTINE.map(([s, d]) => (
              <label className={"item" + (done[s] ? " done" : "")} key={s}>
                <input type="checkbox" checked={!!done[s]} onChange={() => setDone((x) => ({ ...x, [s]: !x[s] }))} />
                <span><strong>{s}</strong><em>{d}</em></span>
              </label>
            ))}
            {rDone === ROUTINE.length && <p className="yay">Geschafft. Gute Nacht euch beiden!</p>}
          </>
        )}

        {tab === "sos" && (
          <>
            <span className="cap">Baby schläft nicht ein · Schritt {sos + 1} von {SOS.length}</span>
            <div className="bar"><div style={{ width: `${((sos + 1) / SOS.length) * 100}%` }} /></div>
            <div className="sosCard">
              <h4>{SOS[sos][0]}</h4>
              <p>{SOS[sos][1]}</p>
            </div>
            <div className="sosNav">
              <button className="ghost" disabled={sos === 0} onClick={() => setSos((s) => s - 1)}>← zurück</button>
              {sos < SOS.length - 1
                ? <button className="solid" onClick={() => setSos((s) => s + 1)}>Geprüft, weiter →</button>
                : <button className="solid" onClick={() => setSos(0)}>Von vorn</button>}
            </div>
            <p className="hint">Fieber, Trinkschwäche oder ungewöhnliches Schreien? Dann bitte die Kinderarztpraxis oder Hebamme anrufen.</p>
          </>
        )}

        {tab === "wissen" && (
          <>
            <span className="cap">Schlaf mit {A.label.replace("Mon.", "Monaten")}</span>
            <div className="chips">
              {AGES.map((a, i) => <button key={a.k} className={i === age ? "on" : ""} onClick={() => setAge(i)}>{a.label}</button>)}
            </div>
            <div className="stats">
              <div><strong>{A.wach}</strong><span>Wachphase</span></div>
              <div><strong>{A.n}</strong><span>Schläfchen</span></div>
              <div><strong>{A.ges}</strong><span>Schlaf pro Tag</span></div>
            </div>
            <p className="info">{A.info}</p>
            <div className="stance">
              <strong>Unsere Haltung</strong>
              <p>Kein Schlaftraining, kein Schreienlassen. Nächtliches Aufwachen ist im ersten Jahr normal – wir begleiten, statt zu trainieren.</p>
            </div>
            <span className="cap">Sicher schlafen</span>
            <ul className="safe">{SAFE.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="hint">Orientierungswerte – jedes Baby ist anders.</p>
          </>
        )}
      </div>

      <style jsx>{`
        .phone{width:100%;max-width:380px;margin:0 auto;background:#fff;border:8px solid var(--ink);border-radius:36px;overflow:hidden;box-shadow:0 30px 60px rgba(42,29,23,.22);font-family:var(--sans);color:var(--ink)}
        .top{background:linear-gradient(140deg,#3E4C7A,#232B4D);color:#fff;padding:20px 16px 0}
        .hi{display:block;font-size:13px;opacity:.85}
        .top strong{display:block;font-family:var(--disp);font-size:23px;letter-spacing:-0.01em;line-height:1.2;overflow-wrap:anywhere}
        .tabs{display:flex;gap:4px;margin-top:14px}
        .tabs button{flex:1;border:0;background:rgba(255,255,255,.16);color:#fff;font:600 13px var(--sans);padding:10px 2px;border-radius:12px 12px 0 0;cursor:pointer}
        .tabs button.on{background:#fff;color:var(--ink)}
        .body{padding:16px 14px 18px;height:540px;overflow-y:auto}
        button{font-family:var(--sans);color:var(--ink)}
        .cap{display:block;font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#3E4C7A;margin:0 0 8px}
        .chips{display:flex;gap:5px;margin-bottom:14px}
        .chips button{flex:1;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:700;font-size:12px;padding:9px 0;cursor:pointer;white-space:nowrap}
        .chips button.on{background:#232B4D;border-color:#232B4D;color:#fff}
        .wake{display:flex;align-items:center;justify-content:space-between;background:#EEF0F8;border-radius:14px;padding:10px 12px;font-size:14px;margin-bottom:16px}
        .wake input{font:700 15px var(--sans);color:var(--ink);border:1px solid #D5D9EA;border-radius:9px;padding:6px 8px;background:#fff}
        .plan{list-style:none;margin:0;padding:0}
        .plan li{display:flex;gap:12px;align-items:center;padding:9px 0;border-bottom:1px solid var(--lineSoft)}
        .time{flex:0 0 108px;font-weight:700;font-size:13.5px;font-variant-numeric:tabular-nums}
        .what strong{display:block;font-size:14.5px;line-height:1.3}
        .what em,.item em{display:block;font-style:normal;font-size:12.5px;color:var(--muted)}
        .plan li.nap .time{color:#3E4C7A}
        .plan li.bed{background:#232B4D;color:#fff;border-radius:12px;padding:10px 12px;border:0;margin-top:8px}
        .plan li.bed em{color:#C3C9E4}
        .hint{font-size:12px;color:var(--muted);margin-top:12px}
        .bar{height:6px;background:#EEF0F8;border-radius:3px;overflow:hidden;margin-bottom:8px}
        .bar div{height:100%;background:#3E4C7A;transition:width .2s}
        .item{display:flex;gap:11px;align-items:flex-start;padding:10px 2px;border-bottom:1px solid var(--lineSoft);cursor:pointer}
        .item input{width:19px;height:19px;accent-color:#3E4C7A;margin:2px 0 0;flex-shrink:0}
        .item strong{display:block;font-size:14.5px;line-height:1.3}
        .done strong{text-decoration:line-through;color:var(--muted)}
        .yay{margin-top:14px;text-align:center;font-weight:600;color:#3E4C7A}
        .sosCard{background:#EEF0F8;border-radius:18px;padding:22px 18px;margin-top:10px;min-height:190px}
        .sosCard h4{font-family:var(--disp);font-size:22px;font-weight:600;margin:0;letter-spacing:-0.01em}
        .sosCard p{margin-top:10px;font-size:15px;line-height:1.55}
        .sosNav{display:flex;gap:8px;margin-top:12px}
        .sosNav button{border-radius:12px;font-weight:600;font-size:14px;padding:12px;cursor:pointer}
        .ghost{flex:0 0 96px;background:#fff;border:1px solid var(--line)}
        .ghost:disabled{opacity:.4;cursor:default}
        .solid{flex:1;background:#232B4D;border:0;color:#fff}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
        .stats div{background:#EEF0F8;border-radius:12px;padding:10px 4px;text-align:center}
        .stats strong{display:block;font-family:var(--disp);font-size:15px}
        .stats span{font-size:11px;color:var(--muted)}
        .info{font-size:14px;margin:12px 0 14px;line-height:1.55}
        .stance{background:#232B4D;color:#fff;border-radius:14px;padding:12px 14px;margin-bottom:18px}
        .stance strong{font-size:13.5px}
        .stance p{font-size:13.5px;color:#D5DAEE;margin-top:3px;line-height:1.5}
        .safe{list-style:none;margin:0;padding:0}
        .safe li{position:relative;padding:7px 0 7px 24px;font-size:14px;border-bottom:1px solid var(--lineSoft)}
        .safe li::before{content:"✓";position:absolute;left:2px;color:#3E4C7A;font-weight:700}
      `}</style>
    </div>
  );
}

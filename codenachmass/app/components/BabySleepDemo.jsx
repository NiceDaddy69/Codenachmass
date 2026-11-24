"use client";
import { useEffect, useState } from "react";

/* Muster-Produkt: Baby-Schlaf-Kompass für eine Eltern-Community (Papa-Perspektive)
   mit Schlaf- und Ess-Tracker. Läuft komplett im Browser, nichts wird gespeichert oder übertragen. Alle Zeiten und Tipps sind Orientierungs- und Beispielwerte;
   im echten Produkt kommen die Inhalte vom Creator und werden fachlich geprüft. */

const AGES = [
  { k: "0-3", label: "0–3 Mon.", wach: "45–90 Min", n: "4–5", ges: "14–17 Std",
    info: "In den ersten Wochen gibt es noch keinen festen Rhythmus. Achte auf Müdigkeitszeichen statt auf die Uhr: Gähnen, Wegschauen, Augenreiben." },
  { k: "4-6", label: "4–6 Mon.", wach: "1,5–2,5 Std", n: "3", ges: "12–16 Std",
    info: "Jetzt entsteht langsam ein Rhythmus. Viele Babys schlafen um den vierten Monat herum plötzlich unruhiger – das ist eine normale Entwicklungsphase und geht vorbei." },
  { k: "7-9", label: "7–9 Mon.", wach: "2,5–3,5 Std", n: "2–3", ges: "12–16 Std",
    info: "Meist fällt das dritte Schläfchen weg. Krabbeln, Hochziehen und Fremdeln können den Schlaf vorübergehend durcheinanderbringen." },
  { k: "10-12", label: "10–12 Mon.", wach: "3–4 Std", n: "2", ges: "12–16 Std",
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

// c = Kategorie, a = Altersgruppen (Index in AGES), für die der Tipp passt
const CATS = [["alle", "Alle"], ["ein", "Einschlafen"], ["nacht", "Nachts"], ["tag", "Tagsüber"], ["papa", "Für Papa"]];
const TIPS = [
  { c: "ein", a: [0, 1, 2, 3], t: "Müdigkeitszeichen lesen", s: "Das Zeitfenster erwischen, bevor es kippt",
    x: "Gähnen, glasiger Blick, Wegdrehen, Zupfen am Ohr: Jetzt ist der Moment. Wer wartet, bis das Baby weint, hat es meist mit einem übermüdeten Baby zu tun – und das schläft schwerer ein." },
  { c: "ein", a: [0, 1, 2, 3], t: "Immer derselbe Ablauf", s: "Die Reihenfolge zählt mehr als die Uhrzeit",
    x: "Babys lieben Vorhersehbarkeit. Wenn auf Schlafsack immer Lied und dann Kuscheln folgt, weiß dein Baby nach ein paar Tagen, was kommt – ganz gleich, ob es 18:30 oder 19:30 Uhr ist." },
  { c: "ein", a: [0, 1], t: "Tragen wirkt", s: "Nähe und Bewegung beruhigen am schnellsten",
    x: "In der Trage oder im Tuch, eng an deiner Brust, mit gleichmäßigen Schritten. Dein Herzschlag und deine Wärme tun den Rest. Tragen ist kein Verwöhnen, sondern genau das, worauf Babys eingestellt sind." },
  { c: "ein", a: [0, 1, 2, 3], t: "Dunkel und reizarm", s: "Die letzte halbe Stunde gehört der Ruhe",
    x: "Licht dimmen, Fernseher aus, leise sprechen. Je weniger Neues dein Baby am Abend verarbeiten muss, desto leichter findet es in den Schlaf." },
  { c: "ein", a: [2, 3], t: "Abends nicht überdrehen", s: "Toben ja – aber früher",
    x: "Wildes Spielen mit Papa ist großartig, nur nicht in der letzten Stunde vor dem Schlafen. Dann lieber Bücher anschauen, kuscheln, leise singen." },
  { c: "nacht", a: [0, 1, 2, 3], t: "Aufwachen ist normal", s: "Kein Zeichen, dass ihr etwas falsch macht",
    x: "Die meisten Babys wachen im ersten Jahr mehrmals pro Nacht auf. Das schützt sie und gehört zur Entwicklung. Durchschlafen ist ein Reifungsschritt, kein Erziehungserfolg." },
  { c: "nacht", a: [0, 1, 2, 3], t: "Nachts langweilig bleiben", s: "So lernt dein Baby den Unterschied zum Tag",
    x: "Wenig Licht, kaum sprechen, kein Spielen. Trösten, wickeln, füttern, kuscheln – alles ruhig und liebevoll, aber ohne Programm." },
  { c: "nacht", a: [1, 2], t: "Unruhige Phasen", s: "Um den 4. und um den 8.–10. Monat",
    x: "Dein Baby lernt gerade enorm viel: drehen, krabbeln, fremdeln. Das verarbeitet es nachts. Diese Phasen gehen vorbei. Bis dahin hilft vor allem eins: mehr Nähe, nicht weniger." },
  { c: "nacht", a: [0, 1, 2, 3], t: "Schichten teilen", s: "Jeder bekommt ein Stück Schlaf am Stück",
    x: "Zum Beispiel: Du übernimmst bis Mitternacht oder ab fünf Uhr morgens. In der Stillzeit bringst du das Baby, wickelst und trägst es danach – so muss Mama nur zum Stillen wach sein." },
  { c: "tag", a: [0, 1, 2, 3], t: "Tageslicht am Morgen", s: "Die innere Uhr braucht Licht",
    x: "Ein Spaziergang am Vormittag hilft deinem Baby, Tag und Nacht zu unterscheiden. Tagsüber darf es hell und lebendig sein, auch bei den Schläfchen." },
  { c: "tag", a: [0, 1], t: "Schläfchen dürfen unterwegs sein", s: "Trage und Kinderwagen zählen",
    x: "Ein Schläfchen muss nicht im Bett stattfinden. Hauptsache, dein Baby bekommt tagsüber genug Schlaf – ein ausgeruhtes Baby schläft abends leichter ein." },
  { c: "papa", a: [0, 1, 2, 3], t: "Dein eigenes Ritual", s: "Du musst es nicht machen wie Mama",
    x: "Dein Lied, deine Art zu tragen, dein Brummen. Babys können mit verschiedenen Bezugspersonen verschiedene Wege in den Schlaf finden. Deiner darf anders sein." },
  { c: "papa", a: [0, 1], t: "Stillzeit: dein Part", s: "Du kannst nicht stillen – aber alles drumherum",
    x: "Wasser und Kissen bringen, Bäuerchen machen, wickeln, danach tragen. Und: Einschlafstillen ist völlig in Ordnung. Du baust eure Bindung in allem auf, was davor und danach passiert." },
  { c: "papa", a: [0, 1, 2, 3], t: "Wenn es gerade nur Mama will", s: "Normal – und kein Urteil über dich",
    x: "Nimm es nicht persönlich und bleib dran. Übe in ruhigen Momenten am Tag: tragen, kuscheln, das Schläfchen begleiten. Vertrauen wächst durch viele kleine Male." },
  { c: "papa", a: [0, 1, 2, 3], t: "Auf euch achten", s: "Schlafmangel ist kein Wettbewerb",
    x: "Wechselt euch ab, nehmt Hilfe an, schlaft, wenn das Baby schläft. Wer selbst am Limit ist, kann schlechter beruhigen. Für dich zu sorgen ist auch Fürsorge für dein Baby." },
];

// Typische Wachphasen in Minuten je Altersgruppe (Index wie AGES) – Orientierungswerte
const WW = [[45, 90], [90, 150], [150, 210], [180, 240]];
const FEED = { L: "Stillen links", R: "Stillen rechts", F: "Fläschchen", B: "Beikost" };
const BREI = ["Gemüsebrei", "Obstbrei", "Getreidebrei", "Fingerfood"];
const WEEK_SAMPLE = [13.1, 12.4, 14.0, 12.8, 13.5, 12.2]; // Vortage, Beispieldaten in Stunden
const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MIN = 60000;
const DAY = 24 * 60 * MIN;
const pad = (n) => String(n).padStart(2, "0");
const clock = (ts) => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dur = (ms) => {
  const m = Math.round(Math.max(0, ms) / MIN);
  if (m < 1) return "< 1 Min";
  const h = Math.floor(m / 60);
  return h ? `${h} Std ${pad(m % 60)} Min` : `${m} Min`;
};
const hm = (ms) => { const m = Math.round(Math.max(0, ms) / MIN); return m < 60 ? `${m} Min` : `${Math.floor(m / 60)}:${pad(m % 60)} Std`; };
const stopwatch = (ms) => {
  const s = Math.floor(Math.max(0, ms) / 1000), h = Math.floor(s / 3600);
  return `${h ? h + ":" : ""}${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};
const hours = (ms) => (ms / 3600000).toLocaleString("de-DE", { maximumFractionDigits: 1 });
const at = (base, dayOffset, h, m) => { const d = new Date(base); d.setDate(d.getDate() + dayOffset); d.setHours(h, m, 0, 0); return d.getTime(); };
let _id = 0;
const uid = () => `e${++_id}`;

// Beispieldaten für einen realistischen Tag, relativ zur aktuellen Uhrzeit
function sampleData(now) {
  const sl = [[-1, 9, 40, -1, 10, 50], [-1, 13, 20, -1, 14, 30], [-1, 17, 0, -1, 17, 30], [-1, 19, 30, 0, 6, 45], [0, 9, 20, 0, 10, 35], [0, 13, 5, 0, 13, 55], [0, 16, 30, 0, 17, 5]]
    .map(([d1, h1, m1, d2, h2, m2]) => ({ id: uid(), s: at(now, d1, h1, m1), e: at(now, d2, h2, m2) }))
    .filter((x) => x.s <= now);
  let running = null;
  const sleeps = sl.filter((x) => { if (x.e > now) { running = x.s; return false; } return true; });
  const feeds = [
    { k: "R", t: at(now, -1, 22, 40), d: 11 }, { k: "L", t: at(now, 0, 6, 50), d: 14 },
    { k: "F", t: at(now, 0, 10, 45), ml: 150 }, { k: "B", t: at(now, 0, 12, 30), g: 120, food: "Gemüsebrei" },
    { k: "R", t: at(now, 0, 14, 10), d: 12 }, { k: "L", t: at(now, 0, 17, 20), d: 15 },
  ].map((f) => ({ ...f, id: uid(), d: f.d ? f.d * MIN : 0 })).filter((f) => f.t + f.d <= now);
  return { sleeps, running, feeds };
}

export default function BabySleepDemo() {
  const [name, setName] = useState("[Dein Name]");
  const [tab, setTab] = useState("schlaf");
  const [age, setAge] = useState(1);
  const [now, setNow] = useState(null);
  // Schlaf
  const [sleeps, setSleeps] = useState([]);
  const [sleepStart, setSleepStart] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addS, setAddS] = useState("13:00");
  const [addE, setAddE] = useState("14:00");
  const [routineOpen, setRoutineOpen] = useState(false);
  const [done, setDone] = useState({});
  // Essen
  const [feeds, setFeeds] = useState([]);
  const [feedRun, setFeedRun] = useState(null); // { k: "L" | "R", start }
  const [mode, setMode] = useState("still");
  const [ml, setMl] = useState(120);
  const [brei, setBrei] = useState(0);
  const [gram, setGram] = useState(80);
  // Tipps & SOS
  const [cat, setCat] = useState("alle");
  const [open, setOpen] = useState(null);
  const [fav, setFav] = useState({});
  const [safe, setSafe] = useState(false);
  const [sos, setSos] = useState(0);

  // Start: Personalisierung über die Adresse (/muster/babyschlaf?fuer=kanalname) und Beispieldaten
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("fuer");
    if (f) setName(f.slice(0, 30));
    const t = Date.now();
    const d = sampleData(t);
    setSleeps(d.sleeps); setSleepStart(d.running); setFeeds(d.feeds); setNow(t);
  }, []);
  // Uhr: sekündlich, solange ein Timer läuft, sonst alle 20 Sekunden
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), sleepStart || feedRun ? 1000 : 20000);
    return () => clearInterval(iv);
  }, [sleepStart, feedRun]);

  const A = AGES[age];
  const ageSelect = (
    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>
      Alter
      <select style={{ font: "600 12.5px var(--sans)", color: "var(--ink)", border: "1px solid #D5D9EA", borderRadius: 8, padding: "4px 6px", background: "#fff" }} value={age} onChange={(e) => { setAge(+e.target.value); setOpen(null); }}>
        {AGES.map((a, i) => <option key={a.k} value={i}>{a.label}</option>)}
      </select>
    </label>
  );

  // ---------- Schlaf: Kennzahlen ----------
  let sleep24 = 0, naps = 0, longest = 0, lastEnd = null;
  if (now) {
    const from = now - DAY;
    sleeps.forEach((x) => {
      sleep24 += Math.max(0, Math.min(x.e, now) - Math.max(x.s, from));
      if (x.e >= from) { longest = Math.max(longest, x.e - x.s); if (x.e - x.s < 4 * 3600000) naps++; }
      lastEnd = lastEnd === null ? x.e : Math.max(lastEnd, x.e);
    });
    if (sleepStart) { sleep24 += now - Math.max(sleepStart, from); longest = Math.max(longest, now - sleepStart); }
  }
  const sleepList = now ? sleeps.filter((x) => x.e >= now - DAY).sort((a, b) => b.s - a.s) : [];
  const week = now ? WEEK_SAMPLE.map((h, i) => ({ l: WD[new Date(now - (6 - i) * DAY).getDay()], h }))
    .concat([{ l: "Heute", h: sleep24 / 3600000, today: true }]) : [];
  const awake = now && !sleepStart && lastEnd ? (now - lastEnd) / MIN : null;
  const [w1, w2] = WW[age];
  let hint;
  if (sleepStart) hint = { c: "calm", t: "Psst, dein Baby schläft.", x: "Nutz die Zeit auch für dich: kurz hinlegen, etwas essen, durchatmen." };
  else if (awake === null) hint = { c: "calm", t: "Noch kein Schlaf eingetragen.", x: `Typisch für ${A.label}: ${A.wach} wach am Stück.` };
  else if (awake < w1) hint = { c: "ok", t: "Alles im grünen Bereich.", x: `Typisch für ${A.label}: ${A.wach} wach am Stück. Zeit zum Spielen und Kuscheln.` };
  else if (awake <= w2) hint = { c: "warn", t: "Bald Zeit für eine Pause.", x: "Achte jetzt auf Müdigkeitszeichen: Gähnen, Augenreiben, Wegschauen, Quengeln." };
  else hint = { c: "alert", t: "Schon länger wach als üblich.", x: "Reize runter, Licht dimmen, Nähe anbieten. Übermüdete Babys brauchen oft mehr Begleitung beim Einschlafen." };

  const stopSleep = () => { setSleeps((x) => [...x, { id: uid(), s: sleepStart, e: Date.now() }]); setSleepStart(null); };
  const parseTime = (v) => { const [h, m] = v.split(":").map(Number); return at(now, 0, h, m); };
  let addStart = null, addEnd = null, addOk = false;
  if (now && addS && addE) {
    addEnd = parseTime(addE); addStart = parseTime(addS);
    if (addStart >= addEnd) addStart -= DAY; // Start vor Mitternacht
    addOk = addEnd <= now;
  }
  const saveAdd = () => { setSleeps((x) => [...x, { id: uid(), s: addStart, e: addEnd }]); setAddOpen(false); };
  const rDone = ROUTINE.filter(([s]) => done[s]).length;

  // ---------- Essen: Kennzahlen ----------
  const feed24 = now ? feeds.filter((f) => f.t >= now - DAY).sort((a, b) => b.t - a.t) : [];
  const lastFeed = feeds.reduce((a, f) => (!a || f.t + f.d > a.t + a.d ? f : a), null);
  const lastStill = feeds.filter((f) => f.k === "L" || f.k === "R").sort((a, b) => b.t - a.t)[0];
  const nextSide = feedRun ? null : lastStill ? (lastStill.k === "L" ? "rechts" : "links") : null;
  const stillMin = feed24.filter((f) => f.k === "L" || f.k === "R").reduce((s, f) => s + f.d, 0);
  const bottleMl = feed24.filter((f) => f.k === "F").reduce((s, f) => s + f.ml, 0);
  const breiG = feed24.filter((f) => f.k === "B").reduce((s, f) => s + f.g, 0);
  const startStill = (k) => {
    const t = Date.now();
    if (feedRun) setFeeds((x) => [...x, { id: uid(), k: feedRun.k, t: feedRun.start, d: t - feedRun.start }]);
    setFeedRun({ k, start: t });
  };
  const stopStill = () => { setFeeds((x) => [...x, { id: uid(), k: feedRun.k, t: feedRun.start, d: Date.now() - feedRun.start }]); setFeedRun(null); };
  const feedText = (f) => f.k === "F" ? `${f.ml} ml` : f.k === "B" ? `${f.food} · ${f.g} g` : dur(f.d);

  // ---------- Tipps ----------
  const favCount = TIPS.filter((x) => fav[x.t]).length;
  const tips = TIPS.filter((x) => x.a.includes(age) && (cat === "alle" || (cat === "fav" ? fav[x.t] : x.c === cat)));

  return (
    <div className="phone">
      <div className="top">
        <span className="hi">Schlaf-Kompass mit</span>
        <strong>{name}</strong>
        <div className="tabs" role="tablist">
          {[["schlaf", "Schlaf"], ["essen", "Essen"], ["tipps", "Tipps"], ["sos", "SOS"]].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="body">
        {!now && (tab === "schlaf" || tab === "essen") && <p className="hint">Wird geladen …</p>}

        {now && tab === "schlaf" && (
          <>
            <div className={"card" + (sleepStart ? " night" : "")}>
              <span className="lbl">{sleepStart ? `Schläft seit ${clock(sleepStart)}` : lastEnd ? `Wach seit ${clock(lastEnd)}` : "Bereit"}</span>
              <strong className="big">{sleepStart ? stopwatch(now - sleepStart) : lastEnd ? hm(now - lastEnd) : "–"}</strong>
              {sleepStart
                ? <button className="act light" onClick={stopSleep}>☀ Aufgewacht</button>
                : <button className="act" onClick={() => setSleepStart(Date.now())}>☾ Schlaf starten</button>}
            </div>

            <div className={"hintBox " + hint.c}>
              <div className="hintTop"><strong>{hint.t}</strong>{ageSelect}</div>
              <p>{hint.x}</p>
              <button className="link" onClick={() => { setCat("ein"); setTab("tipps"); }}>Passende Tipps →</button>
            </div>

            <div className="kpis">
              <div><strong>{hours(sleep24)} Std</strong><span>Schlaf (24 Std)</span></div>
              <div><strong>{naps}</strong><span>Schläfchen</span></div>
              <div><strong>{hm(longest)}</strong><span>längste Phase</span></div>
            </div>

            <span className="cap sp">Schlaf pro Tag</span>
            <div className="week" aria-label="Schlaf pro Tag der letzten Woche">
              {week.map((d) => (
                <div className={"wk" + (d.today ? " today" : "")} key={d.l}>
                  <span className="wv">{d.h.toLocaleString("de-DE", { maximumFractionDigits: 1 })}</span>
                  <div className="wb"><div style={{ height: `${Math.min(100, (d.h / 16) * 100)}%` }} /></div>
                  <span className="wl">{d.l}</span>
                </div>
              ))}
            </div>
            <p className="hint small">Vortage: Beispieldaten. Typisch für {A.label}: {A.ges}.</p>

            <div className="listHead">
              <span className="cap">Letzte 24 Stunden</span>
              <button className="link" onClick={() => setAddOpen((o) => !o)}>{addOpen ? "Abbrechen" : "+ Nachtragen"}</button>
            </div>
            {addOpen && (
              <div className="addForm">
                <label>Eingeschlafen<input type="time" value={addS} onChange={(e) => setAddS(e.target.value)} /></label>
                <label>Aufgewacht<input type="time" value={addE} onChange={(e) => setAddE(e.target.value)} /></label>
                <button className="act small" disabled={!addOk} onClick={saveAdd}>{addOk ? `Speichern · ${dur(addEnd - addStart)}` : "Aufwachzeit liegt in der Zukunft"}</button>
              </div>
            )}
            {sleepStart && (
              <div className="row live"><span className="rt">{clock(sleepStart)} – jetzt</span><span className="rw">läuft · {dur(now - sleepStart)}</span></div>
            )}
            {sleepList.map((x) => (
              <div className="row" key={x.id}>
                <span className="rt">{clock(x.s)} – {clock(x.e)}</span>
                <span className="rw">{x.e - x.s >= 4 * 3600000 ? "Nacht" : "Schläfchen"} · {dur(x.e - x.s)}</span>
                <button className="del" onClick={() => setSleeps((s) => s.filter((i) => i.id !== x.id))} aria-label="Eintrag löschen">×</button>
              </div>
            ))}

            <button className="fold" onClick={() => setRoutineOpen((o) => !o)} aria-expanded={routineOpen}>
              Abendroutine · {rDone} von {ROUTINE.length} <span>{routineOpen ? "–" : "+"}</span>
            </button>
            {routineOpen && ROUTINE.map(([s, d]) => (
              <label className={"item" + (done[s] ? " done" : "")} key={s}>
                <input type="checkbox" checked={!!done[s]} onChange={() => setDone((x) => ({ ...x, [s]: !x[s] }))} />
                <span><strong>{s}</strong><em>{d}</em></span>
              </label>
            ))}
            {routineOpen && rDone === ROUTINE.length && <p className="yay">Geschafft. Gute Nacht euch beiden!</p>}
          </>
        )}

        {now && tab === "essen" && (
          <>
            <div className={"card" + (feedRun ? " live" : "")}>
              {feedRun ? (
                <>
                  <span className="lbl">{FEED[feedRun.k]} seit {clock(feedRun.start)}</span>
                  <strong className="big">{stopwatch(now - feedRun.start)}</strong>
                  <div className="two">
                    <button className="act light" onClick={() => startStill(feedRun.k === "L" ? "R" : "L")}>Seite wechseln</button>
                    <button className="act light" onClick={stopStill}>Fertig</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="lbl">Zuletzt gegessen</span>
                  <strong className="big">{lastFeed ? `vor ${hm(now - lastFeed.t - lastFeed.d)}` : "–"}</strong>
                  <span className="sub">{lastFeed ? `${FEED[lastFeed.k]} · ${feedText(lastFeed)} · ${clock(lastFeed.t)} Uhr` : "Noch nichts eingetragen"}</span>
                </>
              )}
            </div>

            <div className="seg" role="tablist">
              {[["still", "Stillen"], ["flasche", "Fläschchen"], ["brei", "Beikost"]].map(([k, l]) => (
                <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>{l}</button>
              ))}
            </div>

            {mode === "still" && (
              <div className="panel">
                {nextSide && <p className="side">Nächstes Mal: <strong>{nextSide}</strong> beginnen</p>}
                <div className="two">
                  <button className={"act" + (feedRun?.k === "L" ? " ghostAct" : "")} disabled={feedRun?.k === "L"} onClick={() => startStill("L")}>Links starten</button>
                  <button className={"act" + (feedRun?.k === "R" ? " ghostAct" : "")} disabled={feedRun?.k === "R"} onClick={() => startStill("R")}>Rechts starten</button>
                </div>
              </div>
            )}
            {mode === "flasche" && (
              <div className="panel">
                <div className="stepRow">
                  <span>Menge</span>
                  <div className="stepper">
                    <button onClick={() => setMl((m) => Math.max(10, m - 10))} aria-label="10 ml weniger">–</button>
                    <output>{ml} ml</output>
                    <button onClick={() => setMl((m) => Math.min(300, m + 10))} aria-label="10 ml mehr">+</button>
                  </div>
                </div>
                <button className="act" onClick={() => setFeeds((x) => [...x, { id: uid(), k: "F", t: Date.now(), d: 0, ml }])}>Fläschchen speichern</button>
              </div>
            )}
            {mode === "brei" && (
              <div className="panel">
                {age === 0 ? (
                  <p className="side">Beikost ist meist erst ab dem 5. bis 7. Monat ein Thema. Stell das Alter um, um es auszuprobieren.</p>
                ) : (
                  <>
                    <div className="chips wrapChips">
                      {BREI.map((b, i) => <button key={b} className={i === brei ? "on" : ""} onClick={() => setBrei(i)}>{b}</button>)}
                    </div>
                    <div className="stepRow">
                      <span>Menge</span>
                      <div className="stepper">
                        <button onClick={() => setGram((g) => Math.max(10, g - 10))} aria-label="10 g weniger">–</button>
                        <output>{gram} g</output>
                        <button onClick={() => setGram((g) => Math.min(300, g + 10))} aria-label="10 g mehr">+</button>
                      </div>
                    </div>
                    <button className="act" onClick={() => setFeeds((x) => [...x, { id: uid(), k: "B", t: Date.now(), d: 0, g: gram, food: BREI[brei] }])}>Beikost speichern</button>
                  </>
                )}
              </div>
            )}

            <div className="kpis">
              <div><strong>{feed24.length}</strong><span>Mahlzeiten (24 Std)</span></div>
              <div><strong>{Math.round(stillMin / MIN)} Min</strong><span>gestillt</span></div>
              <div><strong>{bottleMl} ml</strong><span>Fläschchen</span></div>
            </div>
            {breiG > 0 && <p className="hint small">Dazu {breiG} g Beikost.</p>}

            <div className="listHead"><span className="cap">Letzte 24 Stunden</span></div>
            {feedRun && (
              <div className="row live"><span className="rt">{clock(feedRun.start)}</span><span className="rw">{FEED[feedRun.k]} · läuft</span></div>
            )}
            {feed24.map((f) => (
              <div className="row" key={f.id}>
                <span className="rt">{clock(f.t)}</span>
                <span className="rw"><b className={"dot " + f.k} />{FEED[f.k]} · {feedText(f)}</span>
                <button className="del" onClick={() => setFeeds((s) => s.filter((i) => i.id !== f.id))} aria-label="Eintrag löschen">×</button>
              </div>
            ))}
            <p className="hint small">Jedes Baby isst anders. Bei Sorgen wegen Trinkmenge oder Gewicht: Hebamme oder Kinderarztpraxis fragen.</p>
          </>
        )}

        {tab === "tipps" && (
          <>
            <span className="cap">Wie alt ist dein Baby?</span>
            <div className="chips">
              {AGES.map((a, i) => <button key={a.k} className={i === age ? "on" : ""} onClick={() => { setAge(i); setOpen(null); }}>{a.label}</button>)}
            </div>
            <div className="ageBox">
              <p>{A.info}</p>
              <div className="stats">
                <div><strong>{A.wach}</strong><span>meist wach am Stück</span></div>
                <div><strong>{A.n}</strong><span>Schläfchen</span></div>
                <div><strong>{A.ges}</strong><span>Schlaf pro Tag</span></div>
              </div>
            </div>

            <div className="cats">
              {CATS.map(([k, l]) => <button key={k} className={cat === k ? "on" : ""} onClick={() => setCat(k)}>{l}</button>)}
              <button className={cat === "fav" ? "on" : ""} onClick={() => setCat("fav")}>♥ {favCount}</button>
            </div>
            {tips.length === 0 && <p className="hint">Noch nichts gemerkt. Tippe bei einem Tipp auf das Herz.</p>}
            {tips.map((x) => (
              <div className={"tip" + (open === x.t ? " open" : "")} key={x.t}>
                <div className="tipHead">
                  <button className="tipMain" onClick={() => setOpen(open === x.t ? null : x.t)} aria-expanded={open === x.t}>
                    <strong>{x.t}</strong><em>{x.s}</em>
                  </button>
                  <button className={"heart" + (fav[x.t] ? " on" : "")} onClick={() => setFav((f) => ({ ...f, [x.t]: !f[x.t] }))} aria-label={fav[x.t] ? "Nicht mehr merken" : "Tipp merken"} aria-pressed={!!fav[x.t]}>♥</button>
                </div>
                {open === x.t && <p className="tipTxt">{x.x}</p>}
              </div>
            ))}

            <div className="stance">
              <strong>Unsere Haltung</strong>
              <p>Kein Schlaftraining, kein Schreienlassen. Wir begleiten, statt zu trainieren.</p>
            </div>
            <button className="fold" onClick={() => setSafe((s) => !s)} aria-expanded={safe}>Sicher schlafen: die 5 Grundregeln <span>{safe ? "–" : "+"}</span></button>
            {safe && <ul className="safe">{SAFE.map((s) => <li key={s}>{s}</li>)}</ul>}
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
      </div>

      <style jsx>{`
        .phone{width:100%;max-width:380px;margin:0 auto;background:#fff;border:8px solid var(--ink);border-radius:36px;overflow:hidden;box-shadow:0 30px 60px rgba(42,29,23,.22);font-family:var(--sans);color:var(--ink)}
        .top{background:linear-gradient(140deg,#3E4C7A,#232B4D);color:#fff;padding:20px 16px 0}
        .hi{display:block;font-size:13px;opacity:.85}
        .top strong{display:block;font-family:var(--disp);font-size:23px;letter-spacing:-0.01em;line-height:1.2;overflow-wrap:anywhere}
        .tabs{display:flex;gap:4px;margin-top:14px}
        .tabs button{flex:1;border:0;background:rgba(255,255,255,.16);color:#fff;font:600 13px var(--sans);padding:10px 2px;border-radius:12px 12px 0 0;cursor:pointer;white-space:nowrap}
        .tabs button.on{background:#fff;color:var(--ink)}
        .body{padding:14px 14px 18px;height:580px;overflow-y:auto}
        button{font-family:var(--sans);color:var(--ink)}
        .cap{display:block;font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#3E4C7A;margin:0 0 8px}
        .cap.sp{margin-top:16px}
        .hint{font-size:12px;color:var(--muted);margin-top:12px}
        .hint.small{margin-top:6px;font-size:11.5px}

        .card{background:#EEF0F8;border-radius:20px;padding:16px;text-align:center}
        .card.night,.card.live{background:linear-gradient(140deg,#3E4C7A,#232B4D);color:#fff}
        .lbl{display:block;font-size:13px;font-weight:600;opacity:.85}
        .big{display:block;font-family:var(--disp);font-size:40px;font-weight:600;letter-spacing:-0.02em;line-height:1.15;margin:2px 0 12px;font-variant-numeric:tabular-nums}
        .sub{display:block;font-size:13px;color:var(--muted);margin-top:-6px}
        .act{width:100%;border:0;border-radius:14px;background:#232B4D;color:#fff;font-weight:700;font-size:15px;padding:13px;cursor:pointer}
        .act:disabled{opacity:.45;cursor:default}
        .act.light{background:#fff;color:#232B4D}
        .act.small{font-size:13.5px;padding:11px}
        .act.ghostAct{background:#EEF0F8;color:#3E4C7A}
        .two{display:flex;gap:8px}
        .two .act{flex:1}

        .hintBox{border-radius:16px;padding:12px 14px;margin-top:12px;border:1px solid}
        .hintBox.ok{background:#EEF7F1;border-color:#CFE8D8}
        .hintBox.warn{background:#FFF6E5;border-color:#F4DDAE}
        .hintBox.alert{background:#FDEEEE;border-color:#F3CACA}
        .hintBox.calm{background:#F3F4FA;border-color:#E1E4F0}
        .hintTop{display:flex;justify-content:space-between;align-items:center;gap:8px}
        .hintTop strong{font-size:14.5px}
        .hintBox p{font-size:13.5px;line-height:1.5;margin-top:4px}
        .link{background:none;border:0;padding:6px 0 0;font-weight:700;font-size:13px;color:#3E4C7A;cursor:pointer}

        .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}
        .kpis div{background:#F3F4FA;border-radius:12px;padding:10px 4px;text-align:center}
        .kpis strong{display:block;font-family:var(--disp);font-size:16px}
        .kpis span{display:block;font-size:10.5px;color:var(--muted);line-height:1.25}

        .week{display:flex;gap:6px;align-items:flex-end;height:118px}
        .wk{flex:1;display:flex;flex-direction:column;align-items:center;height:100%}
        .wv{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
        .wb{flex:1;width:100%;display:flex;align-items:flex-end;margin:3px 0}
        .wb div{width:100%;background:#C9CFE6;border-radius:6px 6px 3px 3px}
        .wl{font-size:11px;font-weight:600;color:var(--muted)}
        .today .wb div{background:#3E4C7A}
        .today .wl,.today .wv{color:#232B4D;font-weight:700}

        .listHead{display:flex;justify-content:space-between;align-items:center;margin-top:16px}
        .listHead .cap{margin:0}
        .listHead .link{padding:0}
        .row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--lineSoft);font-size:14px}
        .rt{flex:0 0 auto;font-weight:700;font-variant-numeric:tabular-nums;min-width:48px}
        .rw{flex:1;color:var(--muted);font-size:13px}
        .row.live .rw{color:#3E4C7A;font-weight:600}
        .del{flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--muted);font-size:15px;line-height:1;cursor:pointer}
        .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:1px}
        .dot.L,.dot.R{background:#E0527A}
        .dot.F{background:#3E4C7A}
        .dot.B{background:#E4A23B}
        .addForm{background:#F3F4FA;border-radius:14px;padding:12px;margin:8px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .addForm label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--muted)}
        .addForm input{font:600 14px var(--sans);color:var(--ink);border:1px solid #D5D9EA;border-radius:9px;padding:7px;background:#fff}
        .addForm .act{grid-column:1/-1}

        .seg{display:flex;gap:4px;background:#F3F4FA;border-radius:12px;padding:4px;margin-top:12px}
        .seg button{flex:1;border:0;background:none;border-radius:9px;font-weight:600;font-size:13px;padding:8px 2px;cursor:pointer;color:var(--muted)}
        .seg button.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.08)}
        .panel{padding:10px 0 2px}
        .side{font-size:13.5px;margin-bottom:10px;color:var(--muted)}
        .side strong{color:#232B4D}
        .stepRow{display:flex;align-items:center;justify-content:space-between;font-size:14px;margin-bottom:10px}
        .stepper{display:flex;align-items:center;gap:8px}
        .stepper button{width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:17px;line-height:1;cursor:pointer}
        .stepper output{font-weight:700;min-width:58px;text-align:center}

        .chips{display:flex;gap:5px;margin-bottom:10px}
        .chips button{flex:1;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:700;font-size:12px;padding:9px 0;cursor:pointer;white-space:nowrap}
        .chips button.on{background:#232B4D;border-color:#232B4D;color:#fff}
        .wrapChips{flex-wrap:wrap}
        .wrapChips button{flex:1 1 40%}
        .ageBox{background:#EEF0F8;border-radius:16px;padding:12px}
        .ageBox p{font-size:13.5px;line-height:1.5}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}
        .stats div{background:#fff;border-radius:10px;padding:8px 4px;text-align:center}
        .stats strong{display:block;font-family:var(--disp);font-size:14.5px}
        .stats span{display:block;font-size:10.5px;color:var(--muted);line-height:1.25}
        .cats{display:flex;gap:6px;overflow-x:auto;margin:14px -14px 6px;padding:0 14px 4px;scrollbar-width:none}
        .cats::-webkit-scrollbar{display:none}
        .cats button{flex-shrink:0;border:1px solid var(--line);background:#fff;border-radius:999px;font-weight:600;font-size:12.5px;padding:7px 12px;cursor:pointer}
        .cats button.on{background:#232B4D;border-color:#232B4D;color:#fff}
        .tip{border-bottom:1px solid var(--lineSoft)}
        .tipHead{display:flex;align-items:center;gap:6px}
        .tipMain{flex:1;min-width:0;text-align:left;background:none;border:0;padding:11px 0;cursor:pointer}
        .tipMain strong{display:block;font-size:14.5px;line-height:1.3}
        .tipMain em,.item em{display:block;font-style:normal;font-size:12.5px;color:var(--muted)}
        .heart{flex-shrink:0;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:15px;color:#C9CCDA;cursor:pointer}
        .heart.on{color:#E0527A;border-color:#F3C1CF;background:#FDF0F4}
        .tipTxt{font-size:14px;line-height:1.55;padding:0 0 13px}
        .tip.open .tipMain strong{color:#3E4C7A}
        .stance{background:#232B4D;color:#fff;border-radius:14px;padding:12px 14px;margin-top:16px}
        .stance strong{font-size:13.5px}
        .stance p{font-size:13.5px;color:#D5DAEE;margin-top:3px;line-height:1.5}
        .fold{width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:14px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 14px;font-weight:600;font-size:14px;cursor:pointer;text-align:left}
        .fold span{color:#3E4C7A;font-size:18px}
        .safe{list-style:none;margin:6px 0 0;padding:0}
        .safe li{position:relative;padding:7px 0 7px 24px;font-size:14px;border-bottom:1px solid var(--lineSoft)}
        .safe li::before{content:"✓";position:absolute;left:2px;color:#3E4C7A;font-weight:700}
        .item{display:flex;gap:11px;align-items:flex-start;padding:10px 2px;border-bottom:1px solid var(--lineSoft);cursor:pointer}
        .item input{width:19px;height:19px;accent-color:#3E4C7A;margin:2px 0 0;flex-shrink:0}
        .item strong{display:block;font-size:14.5px;line-height:1.3}
        .done strong{text-decoration:line-through;color:var(--muted)}
        .yay{margin-top:14px;text-align:center;font-weight:600;color:#3E4C7A}
        .bar{height:6px;background:#EEF0F8;border-radius:3px;overflow:hidden;margin-bottom:8px}
        .bar div{height:100%;background:#3E4C7A;transition:width .2s}
        .sosCard{background:#EEF0F8;border-radius:18px;padding:22px 18px;margin-top:10px;min-height:190px}
        .sosCard h4{font-family:var(--disp);font-size:22px;font-weight:600;margin:0;letter-spacing:-0.01em}
        .sosCard p{margin-top:10px;font-size:15px;line-height:1.55}
        .sosNav{display:flex;gap:8px;margin-top:12px}
        .sosNav button{border-radius:12px;font-weight:600;font-size:14px;padding:12px;cursor:pointer}
        .ghost{flex:0 0 96px;background:#fff;border:1px solid var(--line)}
        .ghost:disabled{opacity:.4;cursor:default}
        .solid{flex:1;background:#232B4D;border:0;color:#fff}
      `}</style>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";

/* Muster-Produkt: Baby-Schlaf-Kompass für eine Eltern-Community (Papa-Perspektive).
   Läuft komplett im Browser. Alle Zeiten und Tipps sind Orientierungs- und Beispielwerte;
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

export default function BabySleepDemo() {
  const [name, setName] = useState("[Dein Name]");
  const [tab, setTab] = useState("tipps");
  const [age, setAge] = useState(1);
  const [cat, setCat] = useState("alle");
  const [open, setOpen] = useState(null);
  const [fav, setFav] = useState({});
  const [safe, setSafe] = useState(false);
  const [done, setDone] = useState({});
  const [sos, setSos] = useState(0);

  // Personalisierung über die Adresse: /muster/babyschlaf?fuer=kanalname
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("fuer");
    if (f) setName(f.slice(0, 30));
  }, []);

  const A = AGES[age];
  const favCount = TIPS.filter((x) => fav[x.t]).length;
  const tips = TIPS.filter((x) => x.a.includes(age) && (cat === "alle" || (cat === "fav" ? fav[x.t] : x.c === cat)));
  const rDone = ROUTINE.filter(([s]) => done[s]).length;

  return (
    <div className="phone">
      <div className="top">
        <span className="hi">Schlaf-Kompass mit</span>
        <strong>{name}</strong>
        <div className="tabs" role="tablist">
          {[["tipps", "Tipps"], ["routine", "Abendroutine"], ["sos", "SOS"]].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="body">
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
            <button className="safeBtn" onClick={() => setSafe((s) => !s)} aria-expanded={safe}>Sicher schlafen: die 5 Grundregeln <span>{safe ? "–" : "+"}</span></button>
            {safe && <ul className="safe">{SAFE.map((s) => <li key={s}>{s}</li>)}</ul>}
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
      </div>

      <style jsx>{`
        .phone{width:100%;max-width:380px;margin:0 auto;background:#fff;border:8px solid var(--ink);border-radius:36px;overflow:hidden;box-shadow:0 30px 60px rgba(42,29,23,.22);font-family:var(--sans);color:var(--ink)}
        .top{background:linear-gradient(140deg,#3E4C7A,#232B4D);color:#fff;padding:20px 16px 0}
        .hi{display:block;font-size:13px;opacity:.85}
        .top strong{display:block;font-family:var(--disp);font-size:23px;letter-spacing:-0.01em;line-height:1.2;overflow-wrap:anywhere}
        .tabs{display:flex;gap:4px;margin-top:14px}
        .tabs button{flex:1;border:0;background:rgba(255,255,255,.16);color:#fff;font:600 13px var(--sans);padding:10px 2px;border-radius:12px 12px 0 0;cursor:pointer;white-space:nowrap}
        .tabs button.on{background:#fff;color:var(--ink)}
        .body{padding:16px 14px 18px;height:560px;overflow-y:auto}
        button{font-family:var(--sans);color:var(--ink)}
        .cap{display:block;font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#3E4C7A;margin:0 0 8px}
        .chips{display:flex;gap:5px;margin-bottom:10px}
        .chips button{flex:1;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:700;font-size:12px;padding:9px 0;cursor:pointer;white-space:nowrap}
        .chips button.on{background:#232B4D;border-color:#232B4D;color:#fff}
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
        .hint{font-size:12px;color:var(--muted);margin-top:12px}
        .stance{background:#232B4D;color:#fff;border-radius:14px;padding:12px 14px;margin-top:16px}
        .stance strong{font-size:13.5px}
        .stance p{font-size:13.5px;color:#D5DAEE;margin-top:3px;line-height:1.5}
        .safeBtn{width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:10px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 14px;font-weight:600;font-size:14px;cursor:pointer;text-align:left}
        .safeBtn span{color:#3E4C7A;font-size:18px}
        .safe{list-style:none;margin:6px 0 0;padding:0}
        .safe li{position:relative;padding:7px 0 7px 24px;font-size:14px;border-bottom:1px solid var(--lineSoft)}
        .safe li::before{content:"✓";position:absolute;left:2px;color:#3E4C7A;font-weight:700}
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
      `}</style>
    </div>
  );
}

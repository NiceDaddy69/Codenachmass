"use client";
import { useEffect, useState } from "react";
import BabytaktLogo from "./BabytaktLogo";

/* Muster-Produkt „Babytakt“: Schlaf- und Ess-Tracker mit passenden Tipps, Soforthilfe und Bericht
   für Eltern im ersten Jahr. Läuft komplett im Browser: Einträge werden nur auf diesem Gerät gespeichert
   (localStorage) und nie übertragen.
   Alle Zeiten, Tipps und Daten sind Orientierungs- bzw. Beispielwerte; im echten Produkt kommen
   die Inhalte vom Creator und werden fachlich geprüft. */

// ---------------------------------------------------------------- Inhalte
// ww = typische Wachphase in Minuten (Orientierung)
const AGES = [
  { label: "0–3 Mon.", ww: [45, 90], wach: "45–90 Min", n: "4–5", ges: "14–17 Std",
    info: "In den ersten Wochen gibt es noch keinen festen Rhythmus. Achte auf Müdigkeitszeichen statt auf die Uhr: Gähnen, Wegschauen, Augenreiben.",
    feed: "In den ersten Monaten trinken Babys oft 8 bis 12 Mal in 24 Stunden – nach Bedarf, auch nachts." },
  { label: "4–6 Mon.", ww: [90, 150], wach: "1,5–2,5 Std", n: "3", ges: "12–16 Std",
    info: "Jetzt entsteht langsam ein Rhythmus. Viele Babys schlafen um den vierten Monat herum plötzlich unruhiger – das ist eine normale Entwicklungsphase und geht vorbei.",
    feed: "Viele Babys trinken jetzt etwas seltener, dafür effektiver. Beikost kann starten, sobald dein Baby bereit ist – meist zwischen dem 5. und 7. Monat." },
  { label: "7–9 Mon.", ww: [150, 210], wach: "2,5–3,5 Std", n: "2–3", ges: "12–16 Std",
    info: "Meist fällt das dritte Schläfchen weg. Krabbeln, Hochziehen und Fremdeln können den Schlaf vorübergehend durcheinanderbringen.",
    feed: "Die Beikost wird mehr, Milch bleibt aber eine wichtige Quelle. Nach und nach ersetzt ein Brei eine Milchmahlzeit." },
  { label: "10–12 Mon.", ww: [180, 240], wach: "3–4 Std", n: "2", ges: "12–16 Std",
    info: "Zwei feste Schläfchen und eine klare Abendroutine geben jetzt viel Sicherheit. Trennungsangst am Abend ist in diesem Alter häufig.",
    feed: "Das Familienessen rückt näher. Milch bleibt bis zum ersten Geburtstag ein wichtiger Teil der Ernährung." },
];
const ageGroup = (months) => (months < 4 ? 0 : months < 7 ? 1 : months < 10 ? 2 : 3);

const ROUTINE = [
  ["Licht dimmen, Bildschirme aus", "Etwa 30 Minuten vor dem Schlafen. Das signalisiert: Der Tag ist vorbei."],
  ["Waschen oder baden", "Muss nicht täglich sein – ein warmer Waschlappen reicht als Ritual."],
  ["Frische Windel und Schlafsack", "Papa-Aufgabe par excellence: Immer derselbe Ablauf, immer derselbe Ort."],
  ["Stillen oder Fläschchen", "Einschlafstillen ist völlig in Ordnung. An anderen Abenden übernimmst du – Nähe geht auch mit Papa."],
  ["Lied, Summen oder kurze Geschichte", "Immer dasselbe. Deine tiefe Stimme wirkt oft besonders beruhigend."],
  ["In den Schlaf begleiten", "Im Arm, in der Trage oder dicht daneben: Bleib, bis dein Baby schläft. Nähe ist kein Verwöhnen."],
];

const SCENARIOS = [
  { t: "Schläft nicht ein", steps: [
    ["Hunger?", "Letzte Mahlzeit länger als 2–3 Stunden her? Dann zuerst füttern. In Wachstumsphasen kommt der Hunger öfter."],
    ["Windel und Kleidung?", "Volle Windel, kratzendes Etikett, zu warm oder zu kalt? Fühl im Nacken: warm und trocken ist richtig."],
    ["Luft im Bauch?", "Hochnehmen, an die Schulter legen, sanft den Rücken klopfen. Der Fliegergriff hilft vielen Babys."],
    ["Übermüdet?", "Zu lange wach macht das Einschlafen schwerer. Reize runter: dunkler Raum, wenig Ansprache, ruhige Stimme, viel Körperkontakt."],
    ["Nähe tanken", "Ab in die Trage oder eng an die Brust und ruhig durch den Raum gehen. Weinen ist Kommunikation – du darfst immer trösten."],
    ["Gleichmäßiges Geräusch", "Leises Rauschen oder Summen kann helfen – leise und nicht direkt am Bett."],
    ["Durchatmen", "Du machst nichts falsch. Dein Baby spürt deine Ruhe. Wenn du an deine Grenze kommst: Wechselt euch ab – oder leg es kurz sicher ab, atme zwei Minuten durch und komm zurück."],
  ] },
  { t: "Wacht nachts oft auf", steps: [
    ["Erst hinhören", "Babys sind im Schlaf oft laut: Seufzen, Grunzen, kurzes Quengeln. Hör einen Moment hin, ob dein Baby wirklich wach ist."],
    ["Hunger ist erlaubt", "Nächtliches Trinken ist im ersten Jahr normal, besonders in Wachstumsschüben. Füttern ist kein Fehler."],
    ["Temperatur prüfen", "Nacken fühlen: Ist er verschwitzt, ist es zu warm. Ideal sind etwa 16–18 °C im Schlafzimmer."],
    ["Zähne oder Entwicklungsschub?", "Rote Wangen, viel Sabbern, neue Fähigkeiten wie Drehen oder Krabbeln? Das kann den Schlaf ein paar Nächte stören."],
    ["Ruhig und dunkel bleiben", "Kein helles Licht, wenig reden, kein Spielen. Trösten, wickeln, füttern – alles leise und liebevoll."],
    ["Schichten teilen", "Wechselt euch ab, damit jeder ein paar Stunden am Stück schläft. In der Stillzeit bringst du das Baby und übernimmst danach."],
  ] },
  { t: "Weint und ist kaum zu beruhigen", steps: [
    ["Grundbedürfnisse checken", "Hunger, Windel, zu warm oder zu kalt, Luft im Bauch? Geh die Basics einmal ruhig durch."],
    ["Körperkontakt", "Eng am Körper tragen, am besten Haut an Haut. Dein Herzschlag und deine Wärme beruhigen."],
    ["Rhythmus", "Sanft wiegen, gleichmäßig gehen, leise „schhh“. Babys kennen Bewegung und Rauschen aus dem Bauch."],
    ["Reize raus", "Ruhiger, abgedunkelter Raum, keine wechselnden Gesichter, kein Hin- und Herreichen."],
    ["Bauch entspannen", "Fliegergriff oder sanfte Bauchmassage im Uhrzeigersinn können bei Blähungen helfen."],
    ["Niemals schütteln", "Wenn du an deine Grenze kommst: Baby sicher in sein Bett legen, den Raum verlassen, durchatmen, jemanden anrufen. Schütteln kann lebensgefährlich sein."],
    ["Hilfe holen", "Hebamme, Kinderarztpraxis oder eine Schreibabyambulanz helfen weiter. Bei Fieber, Trinkschwäche oder Teilnahmslosigkeit sofort ärztlich abklären lassen – nachts unter 116 117, im Notfall 112."],
  ] },
];
const SAFE = ["Immer in Rückenlage schlafen legen", "Nah bei euch: eigenes Bett oder Beistellbett im Elternschlafzimmer", "Schlafsack statt Decke, kein Kissen, kein Nestchen", "Rauchfreie Umgebung", "Raumtemperatur etwa 16–18 °C"];

// c = Kategorie, a = Altersgruppen (Index in AGES), für die der Tipp passt
const CATS = [["alle", "Alle"], ["ein", "Einschlafen"], ["nacht", "Nachts"], ["tag", "Tagsüber"], ["essen", "Essen"], ["papa", "Für Papa"]];
const ALL = [0, 1, 2, 3];
const TIPS = [
  { c: "ein", a: ALL, t: "Müdigkeitszeichen lesen", s: "Das Zeitfenster erwischen, bevor es kippt",
    x: "Gähnen, glasiger Blick, Wegdrehen, Zupfen am Ohr: Jetzt ist der Moment. Wer wartet, bis das Baby weint, hat es meist mit einem übermüdeten Baby zu tun – und das schläft schwerer ein." },
  { c: "ein", a: ALL, t: "Immer derselbe Ablauf", s: "Die Reihenfolge zählt mehr als die Uhrzeit",
    x: "Babys lieben Vorhersehbarkeit. Wenn auf Schlafsack immer Lied und dann Kuscheln folgt, weiß dein Baby nach ein paar Tagen, was kommt – ganz gleich, ob es 18:30 oder 19:30 Uhr ist." },
  { c: "ein", a: [0, 1], t: "Tragen wirkt", s: "Nähe und Bewegung beruhigen am schnellsten",
    x: "In der Trage oder im Tuch, eng an deiner Brust, mit gleichmäßigen Schritten. Dein Herzschlag und deine Wärme tun den Rest. Tragen ist kein Verwöhnen, sondern genau das, worauf Babys eingestellt sind." },
  { c: "ein", a: ALL, t: "Dunkel und reizarm", s: "Wenn dein Baby schon lange wach ist",
    x: "Licht dimmen, Fernseher aus, leise sprechen. Je weniger Neues dein Baby verarbeiten muss, desto leichter findet es in den Schlaf – besonders, wenn es schon übermüdet ist." },
  { c: "ein", a: [2, 3], t: "Abends nicht überdrehen", s: "Toben ja – aber früher",
    x: "Wildes Spielen mit Papa ist großartig, nur nicht in der letzten Stunde vor dem Schlafen. Dann lieber Bücher anschauen, kuscheln, leise singen." },
  { c: "nacht", a: ALL, t: "Aufwachen ist normal", s: "Kein Zeichen, dass ihr etwas falsch macht",
    x: "Die meisten Babys wachen im ersten Jahr mehrmals pro Nacht auf. Das schützt sie und gehört zur Entwicklung. Durchschlafen ist ein Reifungsschritt, kein Erziehungserfolg." },
  { c: "nacht", a: ALL, t: "Nachts langweilig bleiben", s: "So lernt dein Baby den Unterschied zum Tag",
    x: "Wenig Licht, kaum sprechen, kein Spielen. Trösten, wickeln, füttern, kuscheln – alles ruhig und liebevoll, aber ohne Programm." },
  { c: "nacht", a: [1, 2], t: "Unruhige Phasen", s: "Um den 4. und um den 8.–10. Monat",
    x: "Dein Baby lernt gerade enorm viel: drehen, krabbeln, fremdeln. Das verarbeitet es nachts. Diese Phasen gehen vorbei. Bis dahin hilft vor allem eins: mehr Nähe, nicht weniger." },
  { c: "nacht", a: ALL, t: "Schichten teilen", s: "Jeder bekommt ein Stück Schlaf am Stück",
    x: "Zum Beispiel: Du übernimmst bis Mitternacht oder ab fünf Uhr morgens. In der Stillzeit bringst du das Baby, wickelst und trägst es danach – so muss Mama nur zum Stillen wach sein." },
  { c: "tag", a: ALL, t: "Tageslicht am Morgen", s: "Die innere Uhr braucht Licht",
    x: "Ein Spaziergang am Vormittag hilft deinem Baby, Tag und Nacht zu unterscheiden. Tagsüber darf es hell und lebendig sein, auch bei den Schläfchen." },
  { c: "tag", a: [0, 1], t: "Schläfchen dürfen unterwegs sein", s: "Trage und Kinderwagen zählen",
    x: "Ein Schläfchen muss nicht im Bett stattfinden. Hauptsache, dein Baby bekommt tagsüber genug Schlaf – ein ausgeruhtes Baby schläft abends leichter ein." },
  { c: "tag", a: [1, 2, 3], t: "Kurze Schläfchen verlängern", s: "Wenn dein Baby nach 30–45 Minuten aufwacht",
    x: "Viele Babys wachen nach einem Schlafzyklus auf. Bleib nah dran: Hand auflegen, leise summen oder in der Trage weiterschlafen lassen. Oft gelingt so noch ein zweiter Zyklus." },
  { c: "essen", a: ALL, t: "Hungerzeichen früh erkennen", s: "Weinen ist das späte Signal",
    x: "Schmatzen, mit dem Mund suchen, Hand zum Mund führen: Das sind frühe Hungerzeichen. Wer hier reagiert, hat ein entspannteres Baby an der Brust oder am Fläschchen." },
  { c: "essen", a: [0, 1], t: "Cluster-Feeding am Abend", s: "Ständiges Trinken ist normal",
    x: "Viele Babys wollen abends fast stündlich trinken. Das heißt nicht, dass die Milch nicht reicht. Dein Job: Mama versorgen – Getränk, Snack, Kissen, Fernbedienung." },
  { c: "essen", a: [0, 1, 2], t: "Wachstumsschübe", s: "Plötzlich mehr Hunger",
    x: "In Schüben trinken Babys ein paar Tage lang häufiger. Nach Bedarf füttern regelt das von allein. Im Verlauf siehst du, wenn sich der Rhythmus ändert." },
  { c: "essen", a: ALL, t: "Papa gibt das Fläschchen", s: "Mahlzeit mit Nähe",
    x: "Baby nah am Körper, Blickkontakt, zwischendurch Pausen und die Seite wechseln. So wird die Mahlzeit zu eurer gemeinsamen Zeit." },
  { c: "essen", a: [1, 2], t: "Bereit für Beikost?", s: "Auf die Reifezeichen achten",
    x: "Dein Baby sitzt mit Unterstützung aufrecht, interessiert sich für euer Essen und schiebt den Löffel nicht mehr reflexartig mit der Zunge heraus? Dann ist es meist bereit – oft zwischen dem 5. und 7. Monat." },
  { c: "essen", a: [1, 2, 3], t: "Neues einzeln einführen", s: "Ein Lebensmittel nach dem anderen",
    x: "Neue Lebensmittel am besten einzeln anbieten und ein paar Tage dabei bleiben. So siehst du, was dein Baby gut verträgt. Babytakt merkt sich, was schon probiert wurde." },
  { c: "essen", a: [1, 2, 3], t: "Essen ohne Druck", s: "Dein Baby bestimmt die Menge",
    x: "Abwenden, Mund zu, Löffel wegschieben heißt: satt. Kleine Mengen sind am Anfang völlig normal – es geht ums Kennenlernen." },
  { c: "papa", a: ALL, t: "Dein eigenes Ritual", s: "Du musst es nicht machen wie Mama",
    x: "Dein Lied, deine Art zu tragen, dein Brummen. Babys finden mit verschiedenen Bezugspersonen verschiedene Wege in den Schlaf. Deiner darf anders sein." },
  { c: "papa", a: [0, 1], t: "Stillzeit: dein Part", s: "Du kannst nicht stillen – aber alles drumherum",
    x: "Wasser und Kissen bringen, Bäuerchen machen, wickeln, danach tragen. Einschlafstillen ist völlig in Ordnung. Eure Bindung wächst in allem, was davor und danach passiert." },
  { c: "papa", a: ALL, t: "Wenn es gerade nur Mama will", s: "Normal – und kein Urteil über dich",
    x: "Nimm es nicht persönlich und bleib dran. Übe in ruhigen Momenten am Tag: tragen, kuscheln, das Schläfchen begleiten. Vertrauen wächst durch viele kleine Male." },
  { c: "papa", a: ALL, t: "Auf euch achten", s: "Schlafmangel ist kein Wettbewerb",
    x: "Wechselt euch ab, nehmt Hilfe an, schlaft, wenn das Baby schläft. Wer selbst am Limit ist, kann schlechter beruhigen. Für dich zu sorgen ist auch Fürsorge für dein Baby." },
];
const tipByTitle = (t) => TIPS.find((x) => x.t === t);

const FEED = { L: "Stillen links", R: "Stillen rechts", F: "Fläschchen", B: "Beikost" };
const FOODS = ["Karotte", "Pastinake", "Kürbis", "Kartoffel", "Banane", "Apfel", "Hirse", "Haferbrei"];
const DIAPER = { nass: "Windel nass", voll: "Windel voll", beides: "Windel nass + voll" };
const WHO = { papa: "Papa", mama: "Mama", beide: "Beide" };
const TODO_GROUPS = [["heute", "Heute & täglich"], ["woche", "Diese Woche"], ["irgendwann", "Später"]];
const TODO_SUGGEST = [["Vitamin D geben", true], ["Fläschchen auskochen", true], ["Windeln nachkaufen", false], ["Pre-Milch kaufen", false], ["Kinderarzt-Termin vereinbaren", false], ["Wäsche waschen", false], ["Einkaufen", false], ["Zeit für dich einplanen", false]];

const THEMES = {
  schlaf: { c: "#4655A8", d: "#283171", s: "#EEF0FA" },
  essen: { c: "#DE6249", d: "#A6402B", s: "#FDEFEB" },
  tipps: { c: "#1F8576", d: "#135C53", s: "#E6F4F1" },
  sos: { c: "#D97F26", d: "#9C5812", s: "#FCF1E3" },
  todo: { c: "#C2416B", d: "#8C2A4C", s: "#FCEEF3" },
  baby: { c: "#9153AD", d: "#603479", s: "#F4ECF8" },
};
const NAV = [
  ["schlaf", "Schlaf", <path key="m" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />],
  ["essen", "Essen", <path key="b" d="M10 2h4M10.5 2v3L8.5 8v12a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V8l-2-3V2M8.5 12h7M8.5 16h7" />],
  ["todo", "To-dos", <path key="d" d="M10 6h10M10 12h10M10 18h10M3.5 6l1.3 1.3L7.5 4.6M3.5 12l1.3 1.3 2.7-2.7M3.5 18l1.3 1.3 2.7-2.7" />],
  ["tipps", "Tipps", <path key="t" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />],
  ["sos", "SOS", <g key="s"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></g>],
  ["baby", "Baby", <path key="h" d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />],
];

// ---------------------------------------------------------------- Hilfsfunktionen
const MIN = 60000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
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
const num = (n, d = 1) => n.toLocaleString("de-DE", { maximumFractionDigits: d });
const at = (base, dayOffset, h, m) => { const d = new Date(base); d.setDate(d.getDate() + dayOffset); d.setHours(h, m, 0, 0); return d.getTime(); };
const isoDate = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const dateDE = (ts) => { const d = new Date(ts); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`; };
const isNight = (ts) => { const h = new Date(ts).getHours(); return h >= 18 || h < 6; };
const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
const overlap = (s, e, a, b) => Math.max(0, Math.min(e, b) - Math.max(s, a));
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
let _id = 0;
const uid = () => `e${Date.now().toString(36)}${++_id}`;

// Speichern auf dem Gerät – ohne Konto, ohne Server. Schlägt das fehl (privates Fenster,
// gesperrter Speicher), läuft die App einfach ohne Speichern weiter.
const STORE = "babytakt-v1";
const load = () => { try { const v = window.localStorage.getItem(STORE); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
const store = (v) => { try { window.localStorage.setItem(STORE, JSON.stringify(v)); return true; } catch (e) { return false; } };
const wipe = () => { try { window.localStorage.removeItem(STORE); } catch (e) { /* egal */ } };

// Eine realistische Woche Beispieldaten, passend zur aktuellen Uhrzeit
function sampleData(now) {
  const sleeps = [], feeds = [], diapers = [];
  const J = (d, k, span) => Math.round(rnd(d * 37 + k) * span) * MIN;
  for (let d = -7; d <= 0; d++) {
    if (d >= -6) {
      // Schläfchen
      [[9, 10, 25, 60, 35, "mama"], [12, 50, 25, 50, 45, "papa"], [16, 15, 20, 25, 20, "mama"]].forEach(([h, m, js, base, jd, by], i) => {
        const s = at(now, d, h, m) + J(d, i, js);
        sleeps.push({ id: uid(), s, e: s + base * MIN + J(d, i + 3, jd), by });
      });
      // Mahlzeiten und Windeln am Tag
      feeds.push({ id: uid(), k: d % 2 ? "L" : "R", t: at(now, d, 6, 55) + J(d, 6, 15), d: (11 + Math.round(rnd(d + 50) * 5)) * MIN, by: "mama" });
      feeds.push({ id: uid(), k: d % 2 ? "R" : "L", t: at(now, d, 10, 10) + J(d, 7, 25), d: (10 + Math.round(rnd(d + 51) * 5)) * MIN, by: "mama" });
      if (d >= -4) feeds.push({ id: uid(), k: "B", t: at(now, d, 11, 50) + J(d, 8, 15), d: 0, g: 40 + Math.round(rnd(d + 52) * 4) * 10, food: d <= -2 ? "Karotte" : "Pastinake", by: d % 2 ? "papa" : "mama" });
      feeds.push({ id: uid(), k: d % 2 ? "L" : "R", t: at(now, d, 13, 55) + J(d, 9, 20), d: (9 + Math.round(rnd(d + 53) * 5)) * MIN, by: "mama" });
      feeds.push({ id: uid(), k: "F", t: at(now, d, 15, 35) + J(d, 10, 20), d: 0, ml: 110 + Math.round(rnd(d + 54) * 4) * 10, by: "papa" });
      [[7, 0, "nass", "papa"], [10, 15, "voll", "mama"], [13, 50, "nass", "mama"], [15, 30, "beides", "papa"], [18, 25, "nass", "papa"]].forEach(([h, m, k, by], i) => {
        diapers.push({ id: uid(), t: at(now, d, h, m) + J(d, 11 + i, 10), k, by });
      });
    }
    if (d <= -1) {
      // Nacht mit zwei Wachphasen zum Stillen
      const s1 = at(now, d, 19, 5) + J(d, 20, 45);
      feeds.push({ id: uid(), k: d % 2 ? "R" : "L", t: s1 - 22 * MIN, d: (13 + Math.round(rnd(d + 55) * 4)) * MIN, by: "mama" });
      const e1 = s1 + 220 * MIN + J(d, 21, 90);
      const s2 = e1 + 15 * MIN + J(d, 22, 10);
      const e2 = s2 + 150 * MIN + J(d, 23, 60);
      const s3 = e2 + 12 * MIN + J(d, 24, 10);
      const wake = Math.max(s3 + 40 * MIN, at(now, d + 1, 6, 5) + J(d, 25, 50));
      sleeps.push({ id: uid(), s: s1, e: e1, by: "papa" }, { id: uid(), s: s2, e: e2, by: "mama" }, { id: uid(), s: s3, e: wake, by: "mama" });
      feeds.push({ id: uid(), k: "L", t: e1 + 2 * MIN, d: 11 * MIN, by: "mama" }, { id: uid(), k: "R", t: e2 + 2 * MIN, d: 9 * MIN, by: "mama" });
      diapers.push({ id: uid(), t: e1 + 1 * MIN, k: "nass", by: "papa" });
    }
  }
  let running = null;
  const keep = sleeps.filter((x) => { if (x.s > now) return false; if (x.e > now) { running = x.s; return false; } return true; });
  return { sleeps: keep, running, feeds: feeds.filter((f) => f.t + f.d <= now), diapers: diapers.filter((x) => x.t <= now) };
}

// Beispiel-To-dos für ein Elternpaar
function sampleTodos(now) {
  const T = (text, who, when, extra = {}) => ({ id: uid(), text, who, when, daily: false, done: null, ...extra });
  const doneAt = (d, h, m, by) => { const t = at(now, d, h, m); return t <= now ? { by, t } : null; };
  return [
    T("Vitamin D geben", "beide", "heute", { daily: true, done: doneAt(0, 8, 10, "mama") }),
    T("Fläschchen auskochen", "papa", "heute", { daily: true }),
    T("Windeln nachkaufen (Größe 3)", "papa", "heute"),
    T("Bodys und Schlafsäcke waschen", "papa", "heute", { done: doneAt(0, 9, 30, "papa") }),
    T("U-Untersuchung beim Kinderarzt vereinbaren", "mama", "woche"),
    T("Babysitter für Samstag fragen", "papa", "woche"),
    T("Hebamme wegen Beikost fragen", "mama", "woche", { done: doneAt(-1, 15, 0, "mama") }),
    T("Pre-Milch auf Vorrat kaufen", "beide", "irgendwann"),
    T("Elterngeld-Unterlagen abschicken", "mama", "woche", { done: doneAt(-2, 11, 20, "mama") }),
    T("Kinderwagenreifen aufpumpen", "papa", "woche", { done: doneAt(-3, 18, 5, "papa") }),
    T("Babyschwimmen anmelden", "papa", "irgendwann", { done: doneAt(-4, 20, 40, "papa") }),
  ];
}

// ---------------------------------------------------------------- App
export default function Babytakt() {
  const [name, setName] = useState("[Dein Name]");
  const [tab, setTab] = useState("schlaf");
  const [now, setNow] = useState(null);
  // Profil
  const [baby, setBaby] = useState("Mila");
  const [birth, setBirth] = useState("");
  const [by, setBy] = useState("papa");
  // Daten
  const [sleeps, setSleeps] = useState([]);
  const [sleepStart, setSleepStart] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [diapers, setDiapers] = useState([]);
  const [feedRun, setFeedRun] = useState(null); // { k: "L" | "R", start }
  // Bedienung
  const [addOpen, setAddOpen] = useState(false);
  const [addS, setAddS] = useState("13:00");
  const [addE, setAddE] = useState("14:00");
  const [routineOpen, setRoutineOpen] = useState(false);
  const [done, setDone] = useState({});
  const [nowTipOpen, setNowTipOpen] = useState(false);
  const [mode, setMode] = useState("still");
  const [ml, setMl] = useState(120);
  const [food, setFood] = useState(2);
  const [gram, setGram] = useState(50);
  const [saved, setSaved] = useState("");
  const [tipAge, setTipAge] = useState(null);
  const [cat, setCat] = useState("alle");
  const [open, setOpen] = useState(null);
  const [fav, setFav] = useState({});
  const [safe, setSafe] = useState(false);
  const [scen, setScen] = useState(0);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [todoWho, setTodoWho] = useState("beide");
  const [todoWhen, setTodoWhen] = useState("heute");
  const [todoDaily, setTodoDaily] = useState(false);
  const [todoFilter, setTodoFilter] = useState("alle");
  const [ready, setReady] = useState(false);
  const [persist, setPersist] = useState(true);
  const [isSample, setIsSample] = useState(true);
  const [confirm, setConfirm] = useState(null); // "leer" | "beispiel"

  const fillSample = (t) => {
    const d = sampleData(t);
    setBaby("Mila"); setBirth(isoDate(t - 162 * DAY));
    setSleeps(d.sleeps); setSleepStart(d.running); setFeeds(d.feeds); setDiapers(d.diapers); setFeedRun(null);
    setTodos(sampleTodos(t));
    setIsSample(true);
  };
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("fuer");
    if (f) setName(f.slice(0, 30));
    const t = Date.now();
    const v = load();
    if (v && Array.isArray(v.sleeps)) {
      setBaby(v.baby ?? "Mila"); setBirth(v.birth || isoDate(t - 162 * DAY)); setBy(v.by || "papa");
      setSleeps(v.sleeps); setSleepStart(v.sleepStart ?? null); setFeeds(v.feeds || []); setDiapers(v.diapers || []);
      setFeedRun(v.feedRun ?? null); setFav(v.fav || {}); setDone(v.done || {}); setIsSample(!!v.isSample);
      setTodos(Array.isArray(v.todos) ? v.todos : sampleTodos(t));
    } else fillSample(t);
    setNow(t); setReady(true);
  }, []);
  // Jede Änderung sofort auf dem Gerät sichern
  useEffect(() => {
    if (!ready) return;
    setPersist(store({ baby, birth, by, sleeps, sleepStart, feeds, diapers, feedRun, fav, done, isSample, todos }));
  }, [ready, baby, birth, by, sleeps, sleepStart, feeds, diapers, feedRun, fav, done, isSample, todos]);
  const resetTo = (kind) => {
    wipe();
    if (kind === "leer") {
      setSleeps([]); setSleepStart(null); setFeeds([]); setDiapers([]); setFeedRun(null); setDone({}); setTodos([]); setIsSample(false);
    } else fillSample(Date.now());
    setConfirm(null); setSaved(kind === "leer" ? "Alles gelöscht. Ihr startet mit einem leeren Babytakt." : "Beispielwoche geladen.");
  };
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), sleepStart || feedRun ? 1000 : 20000);
    return () => clearInterval(iv);
  }, [sleepStart, feedRun]);
  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(""), 4000); return () => clearTimeout(t); }, [saved]);

  const T = THEMES[tab];
  const go = (t) => { setTab(t); const el = document.getElementById("bt-body"); if (el) el.scrollTop = 0; };

  // ---------- Profil & Alter
  const birthTs = birth ? new Date(`${birth}T00:00:00`).getTime() : null;
  const ageDays = now && birthTs ? Math.max(0, Math.floor((now - birthTs) / DAY)) : 162;
  const months = Math.floor(ageDays / 30.44);
  const ag = ageGroup(months);
  const A = AGES[ag];
  const ageText = months < 1 ? `${Math.floor(ageDays / 7)} Wochen` : `${months} ${months === 1 ? "Monat" : "Monate"}`;
  const ageDat = months < 1 ? `${Math.floor(ageDays / 7)} Wochen` : `${months} ${months === 1 ? "Monat" : "Monaten"}`;
  const babyName = baby.trim() || "Euer Baby";

  // ---------- Schlaf
  const completed = [-6, -5, -4, -3, -2, -1];
  let sleep24 = 0, naps24 = 0, longest24 = 0, lastEnd = null;
  const week = [];
  let avgTotal = 0, avgDay = 0, avgBed = null, avgLong = 0, avgNap = 0;
  if (now) {
    const from = now - DAY;
    sleeps.forEach((x) => {
      sleep24 += overlap(x.s, x.e, from, now);
      if (x.e >= from) { longest24 = Math.max(longest24, x.e - x.s); if (!isNight(x.s)) naps24++; }
      lastEnd = lastEnd === null ? x.e : Math.max(lastEnd, x.e);
    });
    if (sleepStart) { sleep24 += now - Math.max(sleepStart, from); longest24 = Math.max(longest24, now - sleepStart); }
    const all = sleepStart ? [...sleeps, { s: sleepStart, e: now }] : sleeps;
    for (let d = -6; d <= 0; d++) {
      const a = at(now, d, 0, 0), b = d === 0 ? now : a + DAY;
      let night = 0, day = 0;
      all.forEach((x) => { const o = overlap(x.s, x.e, a, b); if (isNight(x.s)) night += o; else day += o; });
      week.push({ l: d === 0 ? "Heute" : ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][new Date(a).getDay()], night: night / HOUR, day: day / HOUR, today: d === 0 });
    }
    const done6 = week.slice(0, 6);
    avgTotal = avg(done6.map((w) => w.night + w.day));
    avgDay = avg(done6.map((w) => w.day));
    const beds = [], longs = [];
    completed.forEach((d) => {
      const a = at(now, d, 18, 0), b = at(now, d + 1, 9, 0);
      const n = sleeps.filter((x) => x.s >= a && x.s < b && isNight(x.s)).sort((p, q) => p.s - q.s);
      if (n.length) { beds.push((n[0].s - at(now, d, 0, 0)) / MIN); longs.push(Math.max(...n.map((x) => x.e - x.s))); }
    });
    if (beds.length) avgBed = at(now, 0, 0, 0) + Math.round(avg(beds)) * MIN;
    avgLong = avg(longs);
    avgNap = avg(sleeps.filter((x) => !isNight(x.s) && x.s < at(now, 0, 0, 0) && x.s >= at(now, -6, 0, 0)).map((x) => (x.e - x.s) / MIN));
  }
  const awake = now && !sleepStart && lastEnd ? (now - lastEnd) / MIN : null;
  const [w1, w2] = A.ww;
  let hint;
  if (sleepStart) hint = { c: "calm", t: `${babyName} schläft.`, x: "Psst. Nutz die Zeit auch für dich: kurz hinlegen, etwas essen, durchatmen." };
  else if (awake === null) hint = { c: "calm", t: "Noch kein Schlaf eingetragen.", x: `Typisch mit ${ageDat}: ${A.wach} wach am Stück.` };
  else if (awake < w1) hint = { c: "ok", t: "Alles im grünen Bereich.", x: `Typisch mit ${ageDat}: ${A.wach} wach am Stück. Zeit zum Spielen und Kuscheln.` };
  else if (awake <= w2) hint = { c: "warn", t: "Bald Zeit für eine Pause.", x: "Achte jetzt auf Müdigkeitszeichen: Gähnen, Augenreiben, Wegschauen, Quengeln." };
  else hint = { c: "alert", t: "Schon länger wach als üblich.", x: "Reize runter, Licht dimmen, Nähe anbieten. Übermüdete Babys brauchen oft mehr Begleitung beim Einschlafen." };
  let forecast = null;
  if (now && !sleepStart && lastEnd) {
    const ws = lastEnd + w1 * MIN, we = lastEnd + w2 * MIN;
    const evening = new Date(now).getHours() >= 17 || new Date(ws).getHours() >= 18;
    if (evening && avgBed && avgBed <= now) forecast = { l: "Sonst eingeschlafen um", v: clock(avgBed), s: "Zeit für die Abendroutine – unten zum Abhaken" };
    else if (evening && avgBed) forecast = { l: "Schlafenszeit heute ca.", v: clock(avgBed), s: "euer Schnitt der letzten Woche" };
    else forecast = { l: "Nächstes Müdigkeitsfenster", v: `${clock(ws)} – ${clock(we)}`, s: "Orientierung, dein Baby gibt den Takt vor" };
  }
  // Tipp, der gerade passt
  let nowTip;
  {
    const h = now ? new Date(now).getHours() : 12;
    if (sleepStart) nowTip = isNight(sleepStart) ? "Nachts langweilig bleiben" : "Auf euch achten";
    else if (awake !== null && awake > w2) nowTip = "Dunkel und reizarm";
    else if (awake !== null && awake >= w1) nowTip = "Müdigkeitszeichen lesen";
    else if (ag >= 1 && avgNap && avgNap < 45) nowTip = "Kurze Schläfchen verlängern";
    else if (h < 12) nowTip = "Tageslicht am Morgen";
    else if (h >= 17) nowTip = "Immer derselbe Ablauf";
    else nowTip = "Schläfchen dürfen unterwegs sein";
  }
  const NT = tipByTitle(nowTip);
  const sleepList = now ? sleeps.filter((x) => x.e >= now - DAY).sort((a, b) => b.s - a.s) : [];
  const stopSleep = () => { setSleeps((x) => [...x, { id: uid(), s: sleepStart, e: Date.now(), by }]); setSleepStart(null); };
  const parseTime = (v) => { const [h, m] = v.split(":").map(Number); return at(now, 0, h, m); };
  let addStart = null, addEnd = null, addOk = false;
  if (now && addS && addE) {
    addEnd = parseTime(addE); addStart = parseTime(addS);
    if (addStart >= addEnd) addStart -= DAY;
    addOk = addEnd <= now;
  }
  const saveAdd = () => { setSleeps((x) => [...x, { id: uid(), s: addStart, e: addEnd, by }]); setAddOpen(false); };
  const rDone = ROUTINE.filter(([s]) => done[s]).length;
  const maxH = Math.max(16, ...week.map((w) => w.night + w.day));

  // ---------- Essen
  const milk = (f) => f.k !== "B";
  const lastFeed = feeds.filter(milk).reduce((a, f) => (!a || f.t + f.d > a.t + a.d ? f : a), null);
  const lastAny = feeds.reduce((a, f) => (!a || f.t + f.d > a.t + a.d ? f : a), null);
  const lastStill = feeds.filter((f) => f.k === "L" || f.k === "R").sort((a, b) => b.t - a.t)[0];
  const nextSide = !feedRun && lastStill ? (lastStill.k === "L" ? "rechts" : "links") : null;
  let feedsPerDay = 0, avgInt = 0, sideL = 50, bottleAvg = 0, wetToday = 0, fullToday = 0, wetAvg = 0;
  const tried = {};
  feeds.filter((f) => f.k === "B").sort((a, b) => a.t - b.t).forEach((f) => { if (!tried[f.food]) tried[f.food] = f.t; });
  if (now) {
    const ints = [], counts = [], wets = [];
    completed.forEach((d) => {
      const a = at(now, d, 0, 0), b = a + DAY;
      const day = feeds.filter((f) => milk(f) && f.t >= a && f.t < b).sort((p, q) => p.t - q.t);
      counts.push(day.length);
      const dayOnly = day.filter((f) => !isNight(f.t));
      for (let i = 1; i < dayOnly.length; i++) ints.push(dayOnly[i].t - dayOnly[i - 1].t);
      wets.push(diapers.filter((x) => x.t >= a && x.t < b && x.k !== "voll").length);
    });
    feedsPerDay = avg(counts); avgInt = avg(ints); wetAvg = avg(wets);
    const week7 = feeds.filter((f) => f.t >= now - 7 * DAY);
    const l = week7.filter((f) => f.k === "L").length, r = week7.filter((f) => f.k === "R").length;
    sideL = l + r ? Math.round((l / (l + r)) * 100) : 50;
    bottleAvg = avg(week7.filter((f) => f.k === "F").map((f) => f.ml));
    const t0 = at(now, 0, 0, 0);
    wetToday = diapers.filter((x) => x.t >= t0 && x.k !== "voll").length;
    fullToday = diapers.filter((x) => x.t >= t0 && x.k !== "nass").length;
  }
  const timeline = now
    ? [...feeds.filter((f) => f.t >= now - DAY).map((f) => ({ ...f, type: "f" })), ...diapers.filter((x) => x.t >= now - DAY).map((x) => ({ ...x, type: "w" }))].sort((a, b) => b.t - a.t)
    : [];
  const startStill = (k) => {
    const t = Date.now();
    if (feedRun) setFeeds((x) => [...x, { id: uid(), k: feedRun.k, t: feedRun.start, d: t - feedRun.start, by }]);
    setFeedRun({ k, start: t });
  };
  const stopStill = () => { setFeeds((x) => [...x, { id: uid(), k: feedRun.k, t: feedRun.start, d: Date.now() - feedRun.start, by }]); setFeedRun(null); setSaved(`${FEED[feedRun.k]} gespeichert.`); };
  const saveBottle = () => { setFeeds((x) => [...x, { id: uid(), k: "F", t: Date.now(), d: 0, ml, by }]); setSaved(`Fläschchen mit ${ml} ml gespeichert.`); };
  const saveFood = () => {
    const f = FOODS[food], isNew = !tried[f];
    setFeeds((x) => [...x, { id: uid(), k: "B", t: Date.now(), d: 0, g: gram, food: f, by }]);
    setSaved(isNew ? `${f} zum ersten Mal probiert. Tipp: ein paar Tage dabei bleiben und beobachten.` : `${f} gespeichert.`);
  };
  const saveDiaper = (k) => { setDiapers((x) => [...x, { id: uid(), t: Date.now(), k, by }]); setSaved(`${DIAPER[k]} gespeichert.`); };
  const feedText = (f) => (f.k === "F" ? `${f.ml} ml` : f.k === "B" ? `${f.food} · ${f.g} g` : dur(f.d));

  // ---------- Tipps
  const tAge = tipAge === null ? ag : tipAge;
  const favCount = TIPS.filter((x) => fav[x.t]).length;
  const tips = TIPS.filter((x) => x.a.includes(tAge) && (cat === "alle" || (cat === "fav" ? fav[x.t] : x.c === cat)));
  const toggleFav = (t) => setFav((f) => ({ ...f, [t]: !f[t] }));

  // ---------- To-dos
  const t0 = now ? at(now, 0, 0, 0) : 0;
  const isDone = (x) => !!x.done && (!x.daily || x.done.t >= t0);
  const mine = (x) => x.who === by || x.who === "beide";
  const openTodos = todos.filter((x) => !isDone(x) && (todoFilter !== "meine" || mine(x)));
  const openToday = todos.filter((x) => !isDone(x) && (x.daily || x.when === "heute"));
  const doneTodos = now ? todos.filter((x) => x.done && x.done.t >= now - 7 * DAY).sort((a, b) => b.done.t - a.done.t) : [];
  const weekDone = { papa: doneTodos.filter((x) => x.done.by === "papa").length, mama: doneTodos.filter((x) => x.done.by === "mama").length };
  const suggestions = TODO_SUGGEST.filter(([t]) => !todos.some((x) => (x.daily || !isDone(x)) && x.text.toLowerCase().startsWith(t.toLowerCase()))).slice(0, 4);
  const addTodo = (text, daily = todoDaily) => {
    const tx = text.trim();
    if (!tx) return;
    setTodos((s) => [{ id: uid(), text: tx, who: todoWho, when: daily ? "heute" : todoWhen, daily, done: null }, ...s]);
    setTodoText(""); setTodoDaily(false); setSaved(`„${tx}“ hinzugefügt – für ${WHO[todoWho]}.`);
  };
  const toggleTodo = (id) => setTodos((s) => s.map((x) => (x.id !== id ? x : isDone(x) ? { ...x, done: null } : { ...x, done: { by, t: Date.now() } })));
  const cycleWho = (id) => setTodos((s) => s.map((x) => (x.id !== id ? x : { ...x, who: x.who === "papa" ? "mama" : x.who === "mama" ? "beide" : "papa" })));

  // ---------- Bericht
  const report = now ? [
    `Babytakt-Bericht für ${babyName} (${ageText}) · ${dateDE(at(now, -6, 0, 0))}–${dateDE(at(now, -1, 0, 0))}`,
    "",
    `Schlaf: Ø ${num(avgTotal)} Std pro Tag, davon Ø ${num(avgDay)} Std tagsüber. Abends eingeschlafen Ø ${avgBed ? clock(avgBed) : "–"} Uhr, längste Phase nachts Ø ${hm(avgLong)}.`,
    `Mahlzeiten: Ø ${num(feedsPerDay)} Milchmahlzeiten pro Tag, tagsüber etwa alle ${hm(avgInt)}. Stillen links ${sideL} % / rechts ${100 - sideL} %${bottleAvg ? `, Fläschchen Ø ${Math.round(bottleAvg)} ml` : ""}.`,
    `Beikost: ${Object.keys(tried).length ? Object.entries(tried).map(([f, t]) => `${f} (seit ${dateDE(t)})`).join(", ") : "noch nicht begonnen"}.`,
    `Windeln: Ø ${num(wetAvg)} nasse Windeln pro Tag.`,
  ].join("\n") : "";
  const copyReport = async () => {
    try { await navigator.clipboard.writeText(report); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { /* Kopieren nicht erlaubt */ }
  };

  const Badge = ({ who }) => (who ? <span className={`bt-who ${who}`} title={who === "papa" ? "Papa" : "Mama"}>{who === "papa" ? "P" : "M"}</span> : null);

  return (
    <div className="bt" style={{ "--c": T.c, "--d": T.d, "--s": T.s }}>
      <div className="bt-top">
        <div className="bt-brand">
          <span className="bt-mark"><BabytaktLogo size={34} /></span>
          <span className="bt-logo">Babytakt</span>
          <span className="bt-by">mit {name}</span>
        </div>
        {now && <button className="bt-chip" onClick={() => go("baby")}>{babyName} · {ageText}</button>}
      </div>

      <div className="bt-body" id="bt-body">
        {!now && tab !== "tipps" && tab !== "sos" && <p className="bt-hint">Wird geladen …</p>}

        {/* ======================= SCHLAF ======================= */}
        {now && tab === "schlaf" && (
          <>
            <div className={"bt-card" + (sleepStart ? " dark" : "")}>
              <span className="bt-lbl">{sleepStart ? `Schläft seit ${clock(sleepStart)}` : lastEnd ? `Wach seit ${clock(lastEnd)}` : "Bereit"}</span>
              <strong className="bt-big">{sleepStart ? stopwatch(now - sleepStart) : lastEnd ? hm(now - lastEnd) : "–"}</strong>
              {sleepStart
                ? <button className="bt-act light" onClick={stopSleep}>☀ Aufgewacht</button>
                : <button className="bt-act" onClick={() => setSleepStart(Date.now())}>☾ Schlaf starten</button>}
            </div>

            <div className={"bt-hintbox " + hint.c}>
              <strong>{hint.t}</strong>
              <p>{hint.x}</p>
              {forecast && (
                <div className="bt-fc"><span>{forecast.l}</span><b>{forecast.v}</b><em>{forecast.s}</em></div>
              )}
            </div>

            {NT && (
              <div className="bt-nowtip">
                <div className="bt-nowtop">
                  <span className="bt-cap">Tipp für jetzt</span>
                  <button className={"bt-heart" + (fav[NT.t] ? " on" : "")} onClick={() => toggleFav(NT.t)} aria-label="Tipp merken" aria-pressed={!!fav[NT.t]}>♥</button>
                </div>
                <button className="bt-nowmain" onClick={() => setNowTipOpen((o) => !o)} aria-expanded={nowTipOpen}>
                  <strong>{NT.t}</strong><em>{NT.s}</em>
                </button>
                {nowTipOpen && <p className="bt-tiptxt">{NT.x}</p>}
                <button className="bt-link" onClick={() => { setCat("ein"); go("tipps"); }}>Alle Schlaf-Tipps →</button>
              </div>
            )}

            <div className="bt-kpis">
              <div><strong>{num(sleep24 / HOUR)} Std</strong><span>Schlaf (24 Std)</span></div>
              <div><strong>{naps24}</strong><span>Schläfchen</span></div>
              <div><strong>{hm(longest24)}</strong><span>längste Phase</span></div>
            </div>

            <span className="bt-cap sp">Eure Woche</span>
            <div className="bt-week" aria-label="Schlaf pro Tag der letzten Woche">
              {week.map((w) => (
                <div className={"bt-wk" + (w.today ? " today" : "")} key={w.l}>
                  <span className="bt-wv">{num(w.night + w.day)}</span>
                  <div className="bt-wb">
                    <div className="day" style={{ height: Math.round((w.day / maxH) * 84) }} />
                    <div className="night" style={{ height: Math.round((w.night / maxH) * 84) }} />
                  </div>
                  <span className="bt-wl">{w.l}</span>
                </div>
              ))}
            </div>
            <div className="bt-legend"><span><i className="night" /> Nacht</span><span><i className="day" /> Tag</span><span>Heute: bis jetzt</span></div>
            <div className="bt-insights">
              <div><span>Ø Schlaf pro Tag</span><b>{num(avgTotal)} Std</b></div>
              <div><span>Ø abends eingeschlafen</span><b>{avgBed ? `${clock(avgBed)} Uhr` : "–"}</b></div>
              <div><span>Ø längste Phase nachts</span><b>{hm(avgLong)}</b></div>
              <div><span>Ø Länge der Schläfchen</span><b>{Math.round(avgNap)} Min</b></div>
            </div>
            <p className="bt-hint small">Typisch mit {ageDat}: {A.ges} Schlaf pro Tag. Jedes Baby ist anders.</p>

            <div className="bt-listhead">
              <span className="bt-cap">Letzte 24 Stunden</span>
              <button className="bt-link" onClick={() => setAddOpen((o) => !o)}>{addOpen ? "Abbrechen" : "+ Nachtragen"}</button>
            </div>
            {addOpen && (
              <div className="bt-add">
                <label>Eingeschlafen<input type="time" value={addS} onChange={(e) => setAddS(e.target.value)} /></label>
                <label>Aufgewacht<input type="time" value={addE} onChange={(e) => setAddE(e.target.value)} /></label>
                <button className="bt-act small" disabled={!addOk} onClick={saveAdd}>{addOk ? `Speichern · ${dur(addEnd - addStart)}` : "Aufwachzeit liegt in der Zukunft"}</button>
              </div>
            )}
            {sleepStart && (
              <div className="bt-row live"><span className="bt-rt">{clock(sleepStart)} – jetzt</span><span className="bt-rw">läuft · {dur(now - sleepStart)}</span></div>
            )}
            {sleepList.map((x) => (
              <div className="bt-row" key={x.id}>
                <span className="bt-rt">{clock(x.s)} – {clock(x.e)}</span>
                <span className="bt-rw">{isNight(x.s) ? "Nacht" : "Schläfchen"} · {dur(x.e - x.s)}</span>
                <Badge who={x.by} />
                <button className="bt-del" onClick={() => setSleeps((s) => s.filter((i) => i.id !== x.id))} aria-label="Eintrag löschen">×</button>
              </div>
            ))}

            <button className="bt-fold" onClick={() => setRoutineOpen((o) => !o)} aria-expanded={routineOpen}>
              Abendroutine · {rDone} von {ROUTINE.length} <span>{routineOpen ? "–" : "+"}</span>
            </button>
            {routineOpen && ROUTINE.map(([s, d]) => (
              <label className={"bt-item" + (done[s] ? " done" : "")} key={s}>
                <input type="checkbox" checked={!!done[s]} onChange={() => setDone((x) => ({ ...x, [s]: !x[s] }))} />
                <span><strong>{s}</strong><em>{d}</em></span>
              </label>
            ))}
            {routineOpen && rDone === ROUTINE.length && <p className="bt-yay">Geschafft. Gute Nacht euch allen!</p>}
          </>
        )}

        {/* ======================= ESSEN ======================= */}
        {now && tab === "essen" && (
          <>
            <div className={"bt-card" + (feedRun ? " dark" : "")}>
              {feedRun ? (
                <>
                  <span className="bt-lbl">{FEED[feedRun.k]} seit {clock(feedRun.start)}</span>
                  <strong className="bt-big">{stopwatch(now - feedRun.start)}</strong>
                  <div className="bt-two">
                    <button className="bt-act light" onClick={() => startStill(feedRun.k === "L" ? "R" : "L")}>Seite wechseln</button>
                    <button className="bt-act light" onClick={stopStill}>Fertig</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="bt-lbl">Letzte Milchmahlzeit</span>
                  <strong className="bt-big">{lastFeed ? (now - lastFeed.t - lastFeed.d < MIN ? "gerade eben" : `vor ${hm(now - lastFeed.t - lastFeed.d)}`) : "–"}</strong>
                  <span className="bt-sub">{lastFeed ? `${FEED[lastFeed.k]} · ${feedText(lastFeed)} · ${clock(lastFeed.t)} Uhr` : "Noch nichts eingetragen"}</span>
                </>
              )}
            </div>

            <div className="bt-hintbox calm">
              <strong>{avgInt ? `${babyName} trinkt tagsüber etwa alle ${hm(avgInt)}.` : "Nach Bedarf füttern"}</strong>
              <p>{A.feed}</p>
              <button className="bt-link" onClick={() => { setCat("essen"); go("tipps"); }}>Tipps rund ums Essen →</button>
            </div>

            <div className="bt-seg" role="tablist">
              {[["still", "Stillen"], ["flasche", "Fläschchen"], ["brei", "Beikost"], ["windel", "Windel"]].map(([k, l]) => (
                <button key={k} role="tab" aria-selected={mode === k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>{l}</button>
              ))}
            </div>

            {mode === "still" && (
              <div className="bt-panel">
                {nextSide && <p className="bt-side">Nächstes Mal mit <strong>{nextSide}</strong> beginnen</p>}
                <div className="bt-two">
                  <button className="bt-act" disabled={feedRun?.k === "L"} onClick={() => startStill("L")}>Links starten</button>
                  <button className="bt-act" disabled={feedRun?.k === "R"} onClick={() => startStill("R")}>Rechts starten</button>
                </div>
                <p className="bt-hint small">Diese Woche: links {sideL} % · rechts {100 - sideL} %</p>
              </div>
            )}
            {mode === "flasche" && (
              <div className="bt-panel">
                <div className="bt-presets">
                  {[90, 120, 150, 180].map((v) => <button key={v} className={ml === v ? "on" : ""} onClick={() => setMl(v)}>{v} ml</button>)}
                </div>
                <div className="bt-steprow">
                  <span>Menge</span>
                  <div className="bt-stepper">
                    <button onClick={() => setMl((m) => Math.max(10, m - 10))} aria-label="10 ml weniger">–</button>
                    <output>{ml} ml</output>
                    <button onClick={() => setMl((m) => Math.min(300, m + 10))} aria-label="10 ml mehr">+</button>
                  </div>
                </div>
                <button className="bt-act" onClick={saveBottle}>Fläschchen speichern</button>
                {bottleAvg > 0 && <p className="bt-hint small">Diese Woche im Schnitt {Math.round(bottleAvg)} ml pro Fläschchen.</p>}
              </div>
            )}
            {mode === "brei" && (
              <div className="bt-panel">
                {ag === 0 ? (
                  <p className="bt-side">Beikost ist meist erst ab dem 5. bis 7. Monat ein Thema. Unter „Baby“ kannst du das Geburtsdatum ändern, um es auszuprobieren.</p>
                ) : (
                  <>
                    <div className="bt-foods">
                      {FOODS.map((f, i) => (
                        <button key={f} className={i === food ? "on" : ""} onClick={() => setFood(i)}>
                          {f}{tried[f] ? "" : <small> neu</small>}
                        </button>
                      ))}
                    </div>
                    <div className="bt-steprow">
                      <span>Menge</span>
                      <div className="bt-stepper">
                        <button onClick={() => setGram((g) => Math.max(10, g - 10))} aria-label="10 g weniger">–</button>
                        <output>{gram} g</output>
                        <button onClick={() => setGram((g) => Math.min(300, g + 10))} aria-label="10 g mehr">+</button>
                      </div>
                    </div>
                    <button className="bt-act" onClick={saveFood}>Beikost speichern</button>
                    <span className="bt-cap sp">Schon probiert</span>
                    <div className="bt-tried">
                      {Object.keys(tried).length === 0 && <span className="bt-hint small">Noch nichts – los geht’s!</span>}
                      {Object.entries(tried).map(([f, t]) => <span key={f}>{f}<em>seit {dateDE(t)}</em></span>)}
                    </div>
                  </>
                )}
              </div>
            )}
            {mode === "windel" && (
              <div className="bt-panel">
                <div className="bt-three">
                  <button className="bt-act" onClick={() => saveDiaper("nass")}>Nass</button>
                  <button className="bt-act" onClick={() => saveDiaper("voll")}>Voll</button>
                  <button className="bt-act" onClick={() => saveDiaper("beides")}>Beides</button>
                </div>
                <p className="bt-side top">Heute: <strong>{wetToday} nass</strong> · <strong>{fullToday} voll</strong></p>
                <p className="bt-hint small">Ab etwa dem 5. Lebenstag sind mindestens 5–6 nasse Windeln am Tag ein gutes Zeichen, dass dein Baby genug trinkt. Im Zweifel die Hebamme fragen.</p>
              </div>
            )}
            {saved && <p className="bt-saved" role="status">✓ {saved}</p>}

            <div className="bt-kpis">
              <div><strong>{num(feedsPerDay)}</strong><span>Ø Milchmahlzeiten pro Tag</span></div>
              <div><strong>{avgInt ? hm(avgInt) : "–"}</strong><span>Ø Abstand tagsüber</span></div>
              <div><strong>{num(wetAvg)}</strong><span>Ø nasse Windeln pro Tag</span></div>
            </div>

            <div className="bt-listhead"><span className="bt-cap">Letzte 24 Stunden</span></div>
            {feedRun && (
              <div className="bt-row live"><span className="bt-rt">{clock(feedRun.start)}</span><span className="bt-rw">{FEED[feedRun.k]} · läuft</span></div>
            )}
            {timeline.map((x) => (
              <div className="bt-row" key={x.id}>
                <span className="bt-rt">{clock(x.t)}</span>
                <span className="bt-rw">
                  <b className={"bt-dot " + (x.type === "w" ? "W" : x.k)} />
                  {x.type === "w" ? DIAPER[x.k] : `${FEED[x.k]} · ${feedText(x)}`}
                </span>
                <Badge who={x.by} />
                <button className="bt-del" onClick={() => (x.type === "w" ? setDiapers : setFeeds)((s) => s.filter((i) => i.id !== x.id))} aria-label="Eintrag löschen">×</button>
              </div>
            ))}
            <p className="bt-hint small">Jedes Baby isst anders. Bei Sorgen wegen Trinkmenge oder Gewicht: Hebamme oder Kinderarztpraxis fragen.</p>
          </>
        )}

        {/* ======================= TO-DOS ======================= */}
        {now && tab === "todo" && (
          <>
            <div className="bt-card">
              <span className="bt-lbl">Heute noch offen</span>
              <strong className="bt-big">{openToday.length}</strong>
              <span className="bt-sub">
                {openToday.length === 0 ? "Alles erledigt – stark, ihr zwei!" : `Papa ${openToday.filter((x) => x.who === "papa").length} · Mama ${openToday.filter((x) => x.who === "mama").length} · Beide ${openToday.filter((x) => x.who === "beide").length}`}
              </span>
            </div>

            <div className="bt-iam">
              <span>Du bist</span>
              <div className="bt-chips">
                {[["papa", "Papa"], ["mama", "Mama"]].map(([k, l]) => <button key={k} className={by === k ? "on" : ""} onClick={() => setBy(k)}>{l}</button>)}
              </div>
            </div>

            <div className="bt-newtodo">
              <div className="bt-inrow">
                <input value={todoText} maxLength={60} placeholder="Neues To-do, z. B. Windeln kaufen" onChange={(e) => setTodoText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addTodo(todoText); }} aria-label="Neues To-do" />
                <button className="bt-act" disabled={!todoText.trim()} onClick={() => addTodo(todoText)} aria-label="To-do hinzufügen">+</button>
              </div>
              <div className="bt-opts">
                <div className="bt-optgroup" aria-label="Für wen">
                  {[["papa", "Papa"], ["mama", "Mama"], ["beide", "Beide"]].map(([k, l]) => <button key={k} className={todoWho === k ? "on" : ""} onClick={() => setTodoWho(k)}>{l}</button>)}
                </div>
                <div className="bt-optgroup" aria-label="Wann">
                  {[["heute", "Heute"], ["woche", "Woche"], ["irgendwann", "Später"]].map(([k, l]) => <button key={k} className={todoWhen === k ? "on" : ""} onClick={() => setTodoWhen(k)}>{l}</button>)}
                </div>
              </div>
              <label className="bt-daily"><input type="checkbox" checked={todoDaily} onChange={() => setTodoDaily((d) => !d)} /> Jeden Tag wiederholen</label>
              {suggestions.length > 0 && (
                <div className="bt-sugg">
                  {suggestions.map(([t, daily]) => <button key={t} onClick={() => addTodo(t, daily)}>+ {t}</button>)}
                </div>
              )}
            </div>

            {saved && <p className="bt-saved" role="status">✓ {saved}</p>}
            <div className="bt-seg">
              {[["alle", "Alle offenen"], ["meine", "Für mich"], ["erledigt", "Erledigt"]].map(([k, l]) => (
                <button key={k} className={todoFilter === k ? "on" : ""} onClick={() => setTodoFilter(k)}>{l}</button>
              ))}
            </div>

            {todoFilter !== "erledigt" && TODO_GROUPS.map(([g, label]) => {
              const items = openTodos.filter((x) => (g === "heute" ? x.daily || x.when === "heute" : !x.daily && x.when === g));
              if (!items.length) return null;
              return (
                <div key={g}>
                  <span className="bt-cap sp">{label}</span>
                  {items.map((x) => (
                    <div className="bt-todo" key={x.id}>
                      <input type="checkbox" checked={false} onChange={() => toggleTodo(x.id)} aria-label={`${x.text} erledigen`} />
                      <span className="bt-tdtxt">{x.text}{x.daily && <em>täglich</em>}</span>
                      <button className={`bt-whobtn ${x.who}`} onClick={() => cycleWho(x.id)} title="Zuständig ändern">{WHO[x.who]}</button>
                      <button className="bt-del" onClick={() => setTodos((s) => s.filter((i) => i.id !== x.id))} aria-label="To-do löschen">×</button>
                    </div>
                  ))}
                </div>
              );
            })}
            {todoFilter !== "erledigt" && openTodos.length === 0 && <p className="bt-hint">{todoFilter === "meine" ? "Für dich ist gerade nichts offen." : "Nichts offen. Genießt die Pause!"}</p>}

            {(todoFilter === "erledigt" ? doneTodos : doneTodos.filter((x) => x.done.t >= at(now, 0, 0, 0))).length > 0 && (
              <span className="bt-cap sp">{todoFilter === "erledigt" ? "Erledigt in den letzten 7 Tagen" : "Heute erledigt"}</span>
            )}
            {(todoFilter === "erledigt" ? doneTodos : doneTodos.filter((x) => x.done.t >= at(now, 0, 0, 0))).map((x) => (
              <div className="bt-todo done" key={x.id}>
                <input type="checkbox" checked onChange={() => toggleTodo(x.id)} aria-label={`${x.text} wieder öffnen`} />
                <span className="bt-tdtxt"><span className="bt-tdt">{x.text}</span><em>von {x.done.by === "papa" ? "Papa" : "Mama"} · {x.done.t >= at(now, 0, 0, 0) ? `${clock(x.done.t)} Uhr` : dateDE(x.done.t)}</em></span>
                <Badge who={x.done.by} />
              </div>
            ))}
            {todoFilter === "erledigt" && doneTodos.length === 0 && <p className="bt-hint">Noch nichts erledigt.</p>}

            <span className="bt-cap sp">Wer hat diese Woche was übernommen?</span>
            <div className="bt-split">
              <div className="papa" style={{ flex: Math.max(weekDone.papa, 0.3) }}>Papa {weekDone.papa}</div>
              <div className="mama" style={{ flex: Math.max(weekDone.mama, 0.3) }}>Mama {weekDone.mama}</div>
            </div>
            <p className="bt-hint small">Kein Wettbewerb – nur ein ehrlicher Blick, damit sich niemand allein fühlt.</p>

            <div className="bt-roadmap">
              <strong>Im fertigen Produkt</strong>
              <ul>
                <li>Neue To-dos und Häkchen erscheinen sofort auch auf dem Handy deines Partners</li>
                <li>Auf Wunsch eine Erinnerung, wenn ein To-do für heute noch offen ist</li>
              </ul>
            </div>
          </>
        )}

        {/* ======================= TIPPS ======================= */}
        {tab === "tipps" && (
          <>
            <span className="bt-cap">Tipps für</span>
            <div className="bt-chips">
              {AGES.map((a, i) => <button key={a.label} className={i === tAge ? "on" : ""} onClick={() => { setTipAge(i); setOpen(null); }}>{a.label}</button>)}
            </div>
            <div className="bt-agebox">
              <p>{AGES[tAge].info}</p>
              <div className="bt-stats">
                <div><strong>{AGES[tAge].wach}</strong><span>meist wach am Stück</span></div>
                <div><strong>{AGES[tAge].n}</strong><span>Schläfchen</span></div>
                <div><strong>{AGES[tAge].ges}</strong><span>Schlaf pro Tag</span></div>
              </div>
            </div>
            <div className="bt-cats">
              {CATS.map(([k, l]) => <button key={k} className={cat === k ? "on" : ""} onClick={() => setCat(k)}>{l}</button>)}
              <button className={cat === "fav" ? "on" : ""} onClick={() => setCat("fav")}>♥ {favCount}</button>
            </div>
            {tips.length === 0 && <p className="bt-hint">{cat === "fav" ? "Noch nichts gemerkt. Tippe bei einem Tipp auf das Herz." : "Für dieses Alter gibt es hier noch keine Tipps."}</p>}
            {tips.map((x) => (
              <div className={"bt-tip" + (open === x.t ? " open" : "")} key={x.t}>
                <div className="bt-tiphead">
                  <button className="bt-tipmain" onClick={() => setOpen(open === x.t ? null : x.t)} aria-expanded={open === x.t}>
                    <strong>{x.t}</strong><em>{x.s}</em>
                  </button>
                  <button className={"bt-heart" + (fav[x.t] ? " on" : "")} onClick={() => toggleFav(x.t)} aria-label={fav[x.t] ? "Nicht mehr merken" : "Tipp merken"} aria-pressed={!!fav[x.t]}>♥</button>
                </div>
                {open === x.t && <p className="bt-tiptxt">{x.x}</p>}
              </div>
            ))}
            <div className="bt-stance">
              <strong>Unsere Haltung</strong>
              <p>Kein Schlaftraining, kein Schreienlassen. Wir begleiten, statt zu trainieren.</p>
            </div>
            <button className="bt-fold" onClick={() => setSafe((s) => !s)} aria-expanded={safe}>Sicher schlafen: die 5 Grundregeln <span>{safe ? "–" : "+"}</span></button>
            {safe && <ul className="bt-safe">{SAFE.map((s) => <li key={s}>{s}</li>)}</ul>}
          </>
        )}

        {/* ======================= SOS ======================= */}
        {tab === "sos" && (
          <>
            <span className="bt-cap">Was ist gerade los?</span>
            <div className="bt-scen">
              {SCENARIOS.map((s, i) => <button key={s.t} className={i === scen ? "on" : ""} onClick={() => { setScen(i); setStep(0); }}>{s.t}</button>)}
            </div>
            <span className="bt-cap sp">Schritt {step + 1} von {SCENARIOS[scen].steps.length}</span>
            <div className="bt-bar"><div style={{ width: `${((step + 1) / SCENARIOS[scen].steps.length) * 100}%` }} /></div>
            <div className={"bt-sos" + (SCENARIOS[scen].steps[step][0] === "Niemals schütteln" ? " stop" : "")}>
              <h4>{SCENARIOS[scen].steps[step][0]}</h4>
              <p>{SCENARIOS[scen].steps[step][1]}</p>
            </div>
            <div className="bt-two">
              <button className="bt-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← zurück</button>
              {step < SCENARIOS[scen].steps.length - 1
                ? <button className="bt-act" onClick={() => setStep((s) => s + 1)}>Geprüft, weiter →</button>
                : <button className="bt-act" onClick={() => setStep(0)}>Von vorn</button>}
            </div>
            <div className="bt-help">
              <strong>Hilfe holen</strong>
              <p>Fieber, Trinkschwäche, Teilnahmslosigkeit oder ungewöhnliches Schreien: Kinderarztpraxis oder Hebamme anrufen. Nachts und am Wochenende: ärztlicher Bereitschaftsdienst <b>116 117</b>. Im Notfall: <b>112</b>.</p>
            </div>
          </>
        )}

        {/* ======================= BABY ======================= */}
        {now && tab === "baby" && (
          <>
            <span className="bt-cap">Euer Baby</span>
            <div className="bt-form">
              <label>Name<input value={baby} maxLength={20} onChange={(e) => setBaby(e.target.value)} /></label>
              <label>Geburtsdatum<input type="date" value={birth} max={isoDate(now)} onChange={(e) => { setBirth(e.target.value); setTipAge(null); }} /></label>
            </div>
            <p className="bt-hint small">{babyName} ist {ageText} alt. Hinweise, Müdigkeitsfenster und Tipps passen sich automatisch an.</p>

            <span className="bt-cap sp">Wer trägt gerade ein?</span>
            <div className="bt-chips">
              {[["papa", "Papa"], ["mama", "Mama"]].map(([k, l]) => <button key={k} className={by === k ? "on" : ""} onClick={() => setBy(k)}>{l}</button>)}
            </div>
            <p className="bt-hint small">So seht ihr in den Listen, wer was übernommen hat (P / M).</p>

            <span className="bt-cap sp">Eure Daten</span>
            <div className="bt-data">
              <p>
                {persist
                  ? "Alle Einträge werden automatisch auf diesem Handy gespeichert – ohne Konto und ohne dass etwas übertragen wird."
                  : "Speichern ist in diesem Browser gerade nicht möglich (z. B. im privaten Modus). Eure Einträge gehen beim Schließen verloren."}
              </p>
              {isSample && <p><b>Gerade seht ihr eine Beispielwoche.</b> Startet leer, um Babytakt mit eurem Baby zu nutzen.</p>}
              {confirm ? (
                <div className="bt-confirm">
                  <span>{confirm === "leer" ? "Wirklich alle Einträge löschen?" : "Eure Einträge durch die Beispielwoche ersetzen?"}</span>
                  <div className="bt-two">
                    <button className="bt-ghost" onClick={() => setConfirm(null)}>Abbrechen</button>
                    <button className="bt-act" onClick={() => resetTo(confirm)}>{confirm === "leer" ? "Ja, löschen" : "Ja, ersetzen"}</button>
                  </div>
                </div>
              ) : (
                <div className="bt-two">
                  <button className="bt-act" onClick={() => setConfirm("leer")}>Leer starten</button>
                  <button className="bt-ghost wide" onClick={() => setConfirm("beispiel")}>Beispielwoche</button>
                </div>
              )}
              <p className="bt-hint small">Die Daten liegen nur auf diesem Gerät. Wer den Browserverlauf löscht, löscht auch sie. Im fertigen Produkt kommen Konto, Sicherung und gemeinsame Nutzung dazu.</p>
            </div>
            {saved && <p className="bt-saved" role="status">✓ {saved}</p>}

            <span className="bt-cap sp">Bericht für Hebamme & Kinderarzt</span>
            <pre className="bt-report">{report}</pre>
            <button className="bt-act" onClick={copyReport}>{copied ? "✓ Kopiert" : "Bericht kopieren"}</button>
            <p className="bt-hint small">Praktisch für die U-Untersuchung oder den Hebammenbesuch: die vergangenen Tage auf einen Blick.</p>

            <div className="bt-roadmap">
              <strong>Im fertigen Produkt dazu möglich</strong>
              <ul>
                <li>Gemeinsam nutzen: beide Eltern sehen dieselben Daten und To-dos</li>
                <li>Erinnerungen, z. B. an Vitamin D oder die nächste U-Untersuchung</li>
                <li>Kurze Videos von {name === "[Dein Name]" ? "dir" : name} zu einzelnen Tipps</li>
                <li>Weitere Themen wie Zahnen oder Kita-Eingewöhnung</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <nav className="bt-nav" aria-label="Bereiche">
        {NAV.map(([k, l, icon]) => (
          <button key={k} className={tab === k ? "on" : ""} style={{ "--ic": THEMES[k].c }} onClick={() => go(k)} aria-current={tab === k ? "page" : undefined}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
            <span>{l}</span>
          </button>
        ))}
      </nav>

      <style jsx global>{`
        .bt{width:100%;max-width:380px;margin:0 auto;background:#fff;border:8px solid var(--ink);border-radius:36px;overflow:hidden;box-shadow:0 30px 60px rgba(42,29,23,.22);font-family:var(--sans);color:var(--ink);display:flex;flex-direction:column}
        .bt button{font-family:var(--sans);color:var(--ink)}
        .bt-top{background:linear-gradient(140deg,var(--c),var(--d));color:#fff;padding:18px 16px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;transition:background .3s}
        .bt-brand{min-width:0;display:grid;grid-template-columns:auto 1fr;column-gap:10px;align-items:center}
        .bt-mark{grid-row:1/3;border-radius:10px;box-shadow:0 0 0 2px rgba(255,255,255,.35)}
        .bt-logo{display:block;font-family:var(--disp);font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.1}
        .bt-by{display:block;font-size:12.5px;opacity:.85;overflow-wrap:anywhere}
        .bt .bt-chip{flex-shrink:0;border:0;background:rgba(255,255,255,.2);color:#fff;border-radius:999px;font-weight:600;font-size:12px;padding:7px 11px;cursor:pointer;max-width:55%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .bt-body{padding:14px 14px 18px;height:560px;overflow-y:auto}
        .bt-cap{display:block;font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--c);margin:0 0 8px}
        .bt-cap.sp{margin-top:16px}
        .bt-hint{font-size:12px;color:var(--muted);margin-top:12px}
        .bt-hint.small{margin-top:6px;font-size:11.5px;line-height:1.45}

        .bt-card{background:var(--s);border-radius:20px;padding:16px;text-align:center}
        .bt-card.dark{background:linear-gradient(140deg,var(--c),var(--d));color:#fff}
        .bt-lbl{display:block;font-size:13px;font-weight:600;opacity:.85}
        .bt-big{display:block;font-family:var(--disp);font-size:38px;font-weight:600;letter-spacing:-0.02em;line-height:1.15;margin:2px 0 12px;font-variant-numeric:tabular-nums}
        .bt-sub{display:block;font-size:13px;color:var(--muted);margin-top:-6px}
        .bt .bt-act{width:100%;border:0;border-radius:14px;background:var(--c);color:#fff;font-weight:700;font-size:15px;padding:13px;cursor:pointer}
        .bt .bt-act:disabled{opacity:.4;cursor:default}
        .bt .bt-act.light{background:#fff;color:var(--d)}
        .bt .bt-act.small{font-size:13.5px;padding:11px}
        .bt-two,.bt-three{display:flex;gap:8px}
        .bt-two>*,.bt-three>*{flex:1}
        .bt .bt-ghost{flex:0 0 96px;background:#fff;border:1px solid var(--line);border-radius:14px;font-weight:600;font-size:14px;padding:12px;cursor:pointer}
        .bt .bt-ghost:disabled{opacity:.4;cursor:default}

        .bt-hintbox{border-radius:16px;padding:12px 14px;margin-top:12px;border:1px solid}
        .bt-hintbox.ok{background:#EEF7F1;border-color:#CFE8D8}
        .bt-hintbox.warn{background:#FFF6E5;border-color:#F4DDAE}
        .bt-hintbox.alert{background:#FDEEEE;border-color:#F3CACA}
        .bt-hintbox.calm{background:#F7F7FA;border-color:#E6E7EF}
        .bt-hintbox strong{font-size:14.5px}
        .bt-hintbox p{font-size:13.5px;line-height:1.5;margin-top:4px}
        .bt-fc{margin-top:10px;background:#fff;border-radius:12px;padding:9px 12px;display:grid;grid-template-columns:1fr auto;gap:0 10px;align-items:baseline}
        .bt-fc span{font-size:12.5px;color:var(--muted)}
        .bt-fc b{font-family:var(--disp);font-size:16px;color:var(--d);font-variant-numeric:tabular-nums}
        .bt-fc em{grid-column:1/-1;font-style:normal;font-size:11px;color:var(--muted)}
        .bt .bt-link{background:none;border:0;padding:6px 0 0;font-weight:700;font-size:13px;color:var(--c);cursor:pointer}

        .bt-nowtip{margin-top:12px;border:1px solid var(--line);border-radius:16px;padding:12px 14px}
        .bt-nowtop{display:flex;justify-content:space-between;align-items:center}
        .bt-nowtop .bt-cap{margin:0}
        .bt .bt-nowmain{display:block;width:100%;text-align:left;background:none;border:0;padding:2px 0 0;cursor:pointer}
        .bt-nowmain strong{display:block;font-size:15px}
        .bt-nowmain em{display:block;font-style:normal;font-size:12.5px;color:var(--muted)}

        .bt-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}
        .bt-kpis div{background:var(--s);border-radius:12px;padding:10px 4px;text-align:center}
        .bt-kpis strong{display:block;font-family:var(--disp);font-size:16px}
        .bt-kpis span{display:block;font-size:10.5px;color:var(--muted);line-height:1.25}

        .bt-week{display:flex;gap:6px;align-items:flex-end}
        .bt-wk{flex:1;display:flex;flex-direction:column;align-items:center}
        .bt-wv{font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums}
        .bt-wb{height:84px;width:100%;display:flex;flex-direction:column;justify-content:flex-end;margin:3px 0}
        .bt-wb div:first-child{border-radius:6px 6px 0 0}
        .bt-wb div:last-child{border-radius:0 0 4px 4px}
        .bt-wb .night{background:var(--c)}
        .bt-wb .day{background:#C3CAEB}
        .bt-wk:not(.today) .bt-wb{opacity:.8}
        .bt-wl{font-size:11px;font-weight:600;color:var(--muted)}
        .bt-wk.today .bt-wl,.bt-wk.today .bt-wv{color:var(--d);font-weight:700}
        .bt-legend{display:flex;gap:14px;font-size:11px;color:var(--muted);margin-top:6px}
        .bt-legend i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:4px;vertical-align:-1px}
        .bt-legend i.night{background:var(--c)}
        .bt-legend i.day{background:#C3CAEB}
        .bt-legend span:last-child{margin-left:auto}
        .bt-insights{margin-top:10px;border:1px solid var(--line);border-radius:14px;padding:4px 12px}
        .bt-insights div{display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;border-top:1px solid var(--lineSoft)}
        .bt-insights div:first-child{border-top:0}
        .bt-insights span{color:var(--muted)}
        .bt-insights b{font-variant-numeric:tabular-nums}

        .bt-listhead{display:flex;justify-content:space-between;align-items:center;margin-top:18px}
        .bt-listhead .bt-cap{margin:0}
        .bt-listhead .bt-link{padding:0}
        .bt-row{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--lineSoft);font-size:14px}
        .bt-rt{flex:0 0 auto;font-weight:700;font-variant-numeric:tabular-nums;min-width:46px}
        .bt-rw{flex:1;min-width:0;color:var(--muted);font-size:13px}
        .bt-row.live .bt-rw{color:var(--c);font-weight:600}
        .bt-who{flex-shrink:0;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:10.5px;font-weight:700;color:#fff}
        .bt-who.papa{background:#3B6FB6}
        .bt-who.mama{background:#C2547A}
        .bt .bt-del{flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1px solid var(--line);background:#fff;color:var(--muted);font-size:15px;line-height:1;cursor:pointer}
        .bt-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:1px}
        .bt-dot.L,.bt-dot.R{background:#DE6249}
        .bt-dot.F{background:#4655A8}
        .bt-dot.B{background:#E4A23B}
        .bt-dot.W{background:#9AA3B5}
        .bt-add{background:var(--s);border-radius:14px;padding:12px;margin:8px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .bt-add label,.bt-form label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--muted)}
        .bt-add input,.bt-form input{font:600 14px var(--sans);color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px;background:#fff;width:100%}
        .bt-add .bt-act{grid-column:1/-1}

        .bt-seg{display:flex;gap:3px;background:var(--s);border-radius:12px;padding:4px;margin-top:14px}
        .bt .bt-seg button{flex:1;border:0;background:none;border-radius:9px;font-weight:600;font-size:12.5px;padding:8px 0;cursor:pointer;color:var(--muted)}
        .bt .bt-seg button.on{background:#fff;color:var(--d);box-shadow:0 1px 3px rgba(0,0,0,.08)}
        .bt-panel{padding:12px 0 2px}
        .bt-side{font-size:13.5px;margin-bottom:10px;color:var(--muted)}
        .bt-side.top{margin:10px 0 0}
        .bt-side strong{color:var(--d)}
        .bt-steprow{display:flex;align-items:center;justify-content:space-between;font-size:14px;margin-bottom:10px}
        .bt-stepper{display:flex;align-items:center;gap:8px}
        .bt .bt-stepper button{width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:17px;line-height:1;cursor:pointer}
        .bt-stepper output{font-weight:700;min-width:58px;text-align:center}
        .bt-presets,.bt-foods{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
        .bt .bt-presets button{flex:1;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:600;font-size:13px;padding:8px 0;cursor:pointer}
        .bt .bt-foods button{flex:1 1 30%;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:600;font-size:12.5px;padding:8px 4px;cursor:pointer}
        .bt .bt-presets button.on,.bt .bt-foods button.on{background:var(--c);border-color:var(--c);color:#fff}
        .bt-foods small{font-size:10px;font-weight:700;color:var(--c)}
        .bt-foods button.on small{color:#fff}
        .bt-tried{display:flex;flex-wrap:wrap;gap:6px}
        .bt-tried span{background:var(--s);border-radius:10px;padding:6px 10px;font-size:13px;font-weight:600}
        .bt-tried em{display:block;font-style:normal;font-weight:400;font-size:11px;color:var(--muted)}
        .bt-saved{margin-top:10px;background:#EEF7F1;border:1px solid #CFE8D8;border-radius:12px;padding:9px 12px;font-size:13px;color:#1B6B3F}

        .bt-chips{display:flex;gap:5px;margin-bottom:10px}
        .bt .bt-chips button{flex:1;border:1px solid var(--line);background:#fff;border-radius:10px;font-weight:700;font-size:12px;padding:9px 0;cursor:pointer;white-space:nowrap}
        .bt .bt-chips button.on{background:var(--c);border-color:var(--c);color:#fff}
        .bt-agebox{background:var(--s);border-radius:16px;padding:12px}
        .bt-agebox p{font-size:13.5px;line-height:1.5}
        .bt-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}
        .bt-stats div{background:#fff;border-radius:10px;padding:8px 4px;text-align:center}
        .bt-stats strong{display:block;font-family:var(--disp);font-size:14.5px}
        .bt-stats span{display:block;font-size:10.5px;color:var(--muted);line-height:1.25}
        .bt-cats{display:flex;gap:6px;overflow-x:auto;margin:14px -14px 6px;padding:0 14px 4px;scrollbar-width:none}
        .bt-cats::-webkit-scrollbar{display:none}
        .bt .bt-cats button{flex-shrink:0;border:1px solid var(--line);background:#fff;border-radius:999px;font-weight:600;font-size:12.5px;padding:7px 12px;cursor:pointer}
        .bt .bt-cats button.on{background:var(--c);border-color:var(--c);color:#fff}
        .bt-tip{border-bottom:1px solid var(--lineSoft)}
        .bt-tiphead{display:flex;align-items:center;gap:6px}
        .bt .bt-tipmain{flex:1;min-width:0;text-align:left;background:none;border:0;padding:11px 0;cursor:pointer}
        .bt-tipmain strong{display:block;font-size:14.5px;line-height:1.3}
        .bt-tipmain em,.bt-item em{display:block;font-style:normal;font-size:12.5px;color:var(--muted)}
        .bt-tip.open .bt-tipmain strong{color:var(--c)}
        .bt .bt-heart{flex-shrink:0;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:15px;color:#C9CCDA;cursor:pointer}
        .bt .bt-heart.on{color:#E0527A;border-color:#F3C1CF;background:#FDF0F4}
        .bt-tiptxt{font-size:14px;line-height:1.55;padding:6px 0 10px}
        .bt-stance{background:var(--d);color:#fff;border-radius:14px;padding:12px 14px;margin-top:16px}
        .bt-stance strong{font-size:13.5px}
        .bt-stance p{font-size:13.5px;opacity:.85;margin-top:3px;line-height:1.5}
        .bt .bt-fold{width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:14px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 14px;font-weight:600;font-size:14px;cursor:pointer;text-align:left}
        .bt-fold span{color:var(--c);font-size:18px}
        .bt-safe{list-style:none;margin:6px 0 0;padding:0}
        .bt-safe li{position:relative;padding:7px 0 7px 24px;font-size:14px;border-bottom:1px solid var(--lineSoft)}
        .bt-safe li::before{content:"✓";position:absolute;left:2px;color:var(--c);font-weight:700}
        .bt-item{display:flex;gap:11px;align-items:flex-start;padding:10px 2px;border-bottom:1px solid var(--lineSoft);cursor:pointer}
        .bt-item input{width:19px;height:19px;accent-color:var(--c);margin:2px 0 0;flex-shrink:0}
        .bt-item strong{display:block;font-size:14.5px;line-height:1.3}
        .bt-item.done strong{text-decoration:line-through;color:var(--muted)}
        .bt-yay{margin-top:14px;text-align:center;font-weight:600;color:var(--c)}

        .bt-scen{display:flex;flex-direction:column;gap:6px}
        .bt .bt-scen button{border:1px solid var(--line);background:#fff;border-radius:12px;font-weight:600;font-size:14px;padding:11px 12px;cursor:pointer;text-align:left}
        .bt .bt-scen button.on{background:var(--c);border-color:var(--c);color:#fff}
        .bt-bar{height:6px;background:var(--s);border-radius:3px;overflow:hidden;margin-bottom:8px}
        .bt-bar div{height:100%;background:var(--c);transition:width .2s}
        .bt-sos{background:var(--s);border-radius:18px;padding:20px 18px;margin:6px 0 10px;min-height:170px}
        .bt-sos.stop{background:#FDEEEE;border:1px solid #F3CACA}
        .bt-sos h4{font-family:var(--disp);font-size:21px;font-weight:600;margin:0;letter-spacing:-0.01em}
        .bt-sos p{margin-top:10px;font-size:15px;line-height:1.55}
        .bt-help{margin-top:14px;border:1px solid var(--line);border-radius:14px;padding:12px 14px}
        .bt-help strong{font-size:13.5px}
        .bt-help p{font-size:13px;line-height:1.5;color:var(--muted);margin-top:3px}
        .bt-help b{color:var(--ink)}

        .bt-form{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .bt-data{background:var(--s);border-radius:14px;padding:12px}
        .bt-data p{font-size:13px;line-height:1.5;margin-bottom:10px}
        .bt-data .bt-hint{margin:8px 0 0}
        .bt .bt-ghost.wide{flex:1}
        .bt-confirm span{display:block;font-weight:600;font-size:13.5px;margin-bottom:8px}
        .bt-report{white-space:pre-wrap;font:12.5px/1.5 var(--sans);background:var(--s);border-radius:14px;padding:12px;margin:0 0 10px;color:var(--ink)}
        .bt-roadmap{margin-top:18px;border:1px dashed var(--c);border-radius:14px;padding:12px 14px}
        .bt-roadmap strong{font-size:13.5px;color:var(--d)}
        .bt-roadmap ul{margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.55}

        .bt-iam{display:flex;align-items:center;gap:10px;margin-top:12px}
        .bt-iam>span{font-size:12.5px;color:var(--muted);flex-shrink:0}
        .bt-iam .bt-chips{flex:1;margin:0}
        .bt-newtodo{margin-top:12px;background:var(--s);border-radius:16px;padding:12px}
        .bt-inrow{display:flex;gap:8px}
        .bt-inrow input{flex:1;min-width:0;font:500 14.5px var(--sans);color:var(--ink);border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:#fff}
        .bt .bt-inrow .bt-act{width:46px;flex:0 0 46px;font-size:22px;padding:0;line-height:1}
        .bt-opts{display:flex;gap:8px;margin-top:8px}
        .bt-optgroup{flex:1;display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:2px}
        .bt .bt-optgroup button{flex:1;border:0;background:none;border-radius:8px;font-weight:600;font-size:11.5px;padding:6px 0;cursor:pointer;color:var(--muted)}
        .bt .bt-optgroup button.on{background:var(--c);color:#fff}
        .bt-daily{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--muted);margin-top:8px;cursor:pointer}
        .bt-daily input{accent-color:var(--c);margin:0}
        .bt-sugg{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid #fff}
        .bt .bt-sugg button{border:1px dashed var(--c);background:#fff;border-radius:999px;font-weight:600;font-size:12px;color:var(--d);padding:6px 10px;cursor:pointer}
        .bt-todo{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--lineSoft)}
        .bt-todo input{width:20px;height:20px;accent-color:var(--c);margin:0;flex-shrink:0;cursor:pointer}
        .bt-tdtxt{flex:1;min-width:0;font-size:14.5px;line-height:1.3}
        .bt-tdtxt em{display:block;font-style:normal;font-size:11.5px;color:var(--muted)}
        .bt-todo.done .bt-tdt{color:var(--muted);text-decoration:line-through}
        .bt .bt-whobtn{flex-shrink:0;border:0;border-radius:999px;font-weight:700;font-size:11px;padding:4px 9px;cursor:pointer;color:#fff}
        .bt .bt-whobtn.papa{background:#3B6FB6}
        .bt .bt-whobtn.mama{background:#C2547A}
        .bt .bt-whobtn.beide{background:linear-gradient(90deg,#3B6FB6,#C2547A)}
        .bt-split{display:flex;gap:4px;border-radius:12px;overflow:hidden}
        .bt-split div{padding:9px 10px;font-size:12.5px;font-weight:700;color:#fff;white-space:nowrap;min-width:max-content}
        .bt-split .papa{background:#3B6FB6}
        .bt-split .mama{background:#C2547A;text-align:right}
        .bt-nav{display:flex;border-top:1px solid var(--line);background:#fff;padding:6px 4px 8px}
        .bt .bt-nav button{flex:1;min-width:0;background:none;border:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 0;cursor:pointer;color:#9AA0AE;font-size:10.5px;font-weight:600;white-space:nowrap}
        .bt .bt-nav button.on{color:var(--ic)}
        .bt-nav button svg{transition:transform .15s}
        .bt-nav button.on svg{transform:translateY(-1px)}
      `}</style>
    </div>
  );
}

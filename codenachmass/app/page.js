"use client";
import { useState } from "react";
import MealPrepDemo from "./components/MealPrepDemo";

const MAIL = "lukas@codenachmass.de";
const MAILTO = `mailto:${MAIL}?subject=${encodeURIComponent("Eigenes Produkt für meine Community")}`;
const WA = `https://wa.me/4917663250203?text=${encodeURIComponent("Hi Lukas, ich habe deine Seite gesehen und interessiere mich für ein eigenes Produkt für meine Community. Mein Kanal: ")}`;
const eur = (n) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const num = (n) => new Intl.NumberFormat("de-DE").format(n);

const NICHES = [
  ["Fitness & Training", ["12-Wochen-Trainingsplan als App mit Fortschritts-Tracking", "Home-Workout-Programm mit Übungsvideos", "30-Tage-Challenge mit täglichem Check-in"]],
  ["Food & Ernährung", ["Rezept-E-Book mit deinen Community-Favoriten", "Meal-Prep-Wochenplaner mit automatischer Einkaufsliste", "Kalorien- und Makro-Rechner in deinem Look"]],
  ["Finanzen & Sparen", ["Budget-Planer und Haushaltsbuch als Vorlage", "ETF-Sparplan-Rechner mit Schritt-für-Schritt-Guide", "Mini-Kurs „Erste 10.000 € anlegen“"]],
  ["Reisen", ["City-Guides mit deinen Geheimtipps und Karten", "Reiseplaner mit Packlisten und Budget-Übersicht", "Roadtrip-Routen zum Nachfahren"]],
  ["Beauty & Skincare", ["Hautpflege-Routine-Planer nach Hauttyp", "Produkt-Guide „Was wirklich wirkt“", "Schritt-für-Schritt-Looks als Videokurs"]],
  ["Familie & Eltern", ["Beikost-Fahrplan mit Rezepten", "Wochenplaner für den Familienalltag", "Beschäftigungsideen-Sammlung nach Alter"]],
  ["Lernen & Produktivität", ["Notion-Vorlagen für Studium oder Job", "Lernplan-Generator für Prüfungsphasen", "Gewohnheits-Tracker mit deiner Methode"]],
  ["Foto, Video & Kreatives", ["Preset-Paket in deinem Bildstil", "Mini-Kurs „Bessere Reels mit dem Handy“", "Vorlagen-Paket für Stories und Posts"]],
  ["Garten, DIY & Zuhause", ["Aussaat- und Pflegekalender", "Bauanleitungen mit Material- und Zuschnittlisten", "Putz- und Ordnungsplan zum Abhaken"]],
];

const TAKEOVER = [
  ["Konzept & Produktidee", "Ich analysiere deinen Kanal und entwickle Vorschläge, die zu dir und deinen Followern passen. Du entscheidest, was gebaut wird."],
  ["Komplette Erstellung", "Inhalte, Texte, Design, Technik — ich baue das Produkt von der ersten Skizze bis zur fertigen Version."],
  ["Verkaufsseite & Bezahlung", "Shop-Seite, Zahlungsabwicklung und automatische Auslieferung an die Käufer stehen, bevor du etwas ankündigst."],
  ["Launch-Material", "Du bekommst Textvorschläge und Material für Stories, Posts und Link-in-Bio — du stellst es auf deine Art vor."],
  ["Support für Käufer", "Fragen zu Download, Zugang oder Zahlung landen bei mir, nicht in deinen DMs."],
  ["Pflege & Weiterentwicklung", "Feedback aus der Community fließt in Updates ein. Läuft das erste Produkt gut, planen wir das nächste."],
];

const FAQ = [
  ["Kostet mich das wirklich nichts?", "Ja. Du zahlst weder für Konzept noch für Erstellung, Verkaufsseite oder Technik. Die gesamte Vorleistung liegt bei mir. Geld fließt erst, wenn das Produkt verkauft wird — und dann wird der Gewinn geteilt."],
  ["Wie viel Arbeit habe ich damit?", "Sehr wenig. Die Erstellung ist für dich komplett hands-off. Ich brauche dich nur dort, wo niemand dich ersetzen kann: Du kennst deine Community. Ein Gespräch am Anfang, kurzes Feedback zu den Entwürfen, die finale Freigabe — und zum Launch stellst du das Produkt deinen Followern vor."],
  ["Was heißt 50/50 genau?", "Vom Gewinn aus jedem Verkauf — also dem Erlös nach Zahlungsgebühren und Steuern — geht die Hälfte an dich und die Hälfte an code nach maß. Alle Details halten wir schriftlich fest, bevor es losgeht."],
  ["Wie sehe ich meine Verkaufszahlen?", "Du bekommst einen eigenen Login zu deinem persönlichen Dashboard. Dort siehst du jederzeit Verkäufe, Umsatz und deinen Anteil — direkt aus dem Verkaufssystem, nicht aus einer Tabelle von mir. Du siehst ausschließlich deine eigenen Zahlen, und niemand sonst sieht deine."],
  ["Wem gehört das Produkt?", "Dein Name, dein Gesicht und deine Marke gehören immer dir. Das Produkt selbst ist ein Gemeinschaftsprodukt: Es wird nur gemeinsam und nur unter deinem Namen verkauft, ohne deine Zustimmung passiert nichts. Wie es weitergeht, falls wir uns einmal trennen, steht klar in unserer Vereinbarung, bevor wir starten."],
  ["Kann ich jederzeit aussteigen?", "Ja. Wenn du nicht mehr möchtest, sagst du Bescheid und die Produktion wird eingestellt — egal an welchem Punkt und ohne Kosten für dich. Auch nach dem Launch kannst du den Verkauf stoppen lassen. Wer bis dahin gekauft hat, behält seinen Zugang."],
  ["Was, wenn sich das Produkt nicht verkauft?", "Dann hast du nichts verloren. Du hast kein Geld investiert und kaum Zeit. Das Risiko der Erstellung trage ich — genau deshalb baue ich nur Produkte, von denen ich überzeugt bin, dass deine Community sie haben will."],
  ["Ich habe „nur“ 10.000 Follower. Lohnt sich das?", "Gerade dann. Kleine und mittlere Kanäle haben oft die engste Bindung zu ihrer Community. Entscheidend ist nicht die Zahl, sondern das Vertrauen — und ein Produkt, das wirklich passt."],
  ["Was für Produkte sind möglich?", "Alles Digitale: E-Books und Guides, Vorlagen und Planer, Mini-Kurse, Challenges, Rechner und kleine Web-Apps. Was am besten passt, hängt von deiner Nische ab — das finden wir im ersten Gespräch heraus."],
];

const WaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z" />
  </svg>
);

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [follower, setFollower] = useState(30000);
  const [quote, setQuote] = useState(1);
  const [preis, setPreis] = useState(29);
  const sales = Math.round((follower * quote) / 100);
  const umsatz = sales * preis;
  const anteil = umsatz / 2;

  const copyMail = async () => {
    try {
      await navigator.clipboard.writeText(MAIL);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = MAIL; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (_) {}
      ta.remove();
    }
  };
  return (
    <main>
      {/* NAV */}
      <header className="nav">
        <div className="wrap navIn">
          <a href="#top" className="brand">code nach maß<span className="dot">.</span></a>
          <nav className="navlinks">
            <a href="#ueber">Über mich</a>
            <a href="#muster">Beispiel</a>
            <a href="#ideen">Ideen</a>
            <a href="#deal">Der Deal</a>
            <a href="#ablauf">Ablauf</a>
            <a href="#faq">FAQ</a>
            <a href="#kontakt" className="navcta">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="blob b1" aria-hidden="true" />
        <div className="blob b2" aria-hidden="true" />
        <div className="wrap heroIn">
          <div>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="pilot">
              <span className="pilotDot" aria-hidden="true" /> Ich suche gerade meinen ersten Creator — mit Sonderkonditionen <span aria-hidden="true">→</span>
            </a>
            <span className="eyebrow">Für Creator mit 10.000 – 100.000 Followern</span>
            <h1 className="h1">Deine Community feiert dich.<br />Zeit für dein eigenes Produkt.<br /><span className="hl">Ich baue es für dich.</span></h1>
            <p className="lede">
              Mit deinem Content gibst du deiner Community jeden Tag etwas mit. Ein eigenes digitales
              Produkt ist der nächste Schritt — und ich entwickle es passgenau für deine Follower,
              komplett auf meine Kosten. Verkauft es sich, teilen wir den Gewinn 50/50.
            </p>
            <div className="cta">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btnWa"><WaIcon /> Schreib mir auf WhatsApp</a>
              <a href="#muster" className="btn btnGhost">Beispiel ansehen</a>
            </div>
            <div className="facts">
              <div className="fact"><strong>0 €</strong><span>Kosten für dich</span></div>
              <div className="fact"><strong>50 / 50</strong><span>Gewinn pro Verkauf</span></div>
              <div className="fact"><strong>Hands-off</strong><span>Ich erstelle, du gibst frei</span></div>
            </div>
          </div>
          <a href="#muster" className="peek" aria-label="Zum Muster-Produkt">
            <div className="peekIn" aria-hidden="true" inert=""><MealPrepDemo /></div>
            <span className="peekTag">Muster-Produkt · ausprobieren ↓</span>
          </a>
        </div>
      </section>

      {/* ÜBER MICH */}
      <section className="sec" id="ueber">
        <div className="wrap about">
          <img className="aboutImg" src="/lukas.jpg" alt="Lukas Schmitz" width="720" height="900" loading="lazy" />
          <div>
            <span className="eyebrow">Über mich</span>
            <h2 className="h2">Hi, ich bin Lukas.</h2>
            <div className="aboutTxt">
              <p>
                Ich bin Entwickler aus Düsseldorf und komme ursprünglich aus der Wirtschaftsprüfung.
                Heute baue ich digitale Produkte — und zwar am liebsten für Menschen, die sich etwas
                Eigenes aufgebaut haben.
              </p>
              <p>
                <strong>Warum ich das mache:</strong> Ich sehe so viele Creator, die mit Herzblut eine
                Community aufgebaut haben und ihr jeden Tag etwas mitgeben. Verdient wird daran aber
                oft vor allem woanders — bei Marken, Plattformen und Agenturen. Ich finde, das geht
                besser. Du hast das Vertrauen deiner Community, ich kann Produkte bauen. Zusammen
                entsteht etwas, das deiner Community noch mehr Mehrwert bietet und dich unabhängiger
                von Kooperationen macht. Und ja, ich verdiene dabei natürlich auch. Am Ende gewinnen
                also alle drei: deine Community, du und ich.
              </p>
              <p>
                <strong>Warum 50/50:</strong> Ich will keine Rechnung schreiben und dann verschwinden.
                Ich verdiene nur, wenn du verdienst — wir sitzen also im selben Boot. Und weil ich aus
                der Welt der Zahlen komme, ist eine saubere, für dich jederzeit einsehbare Abrechnung
                für mich selbstverständlich.
              </p>
              <p>
                Du arbeitest nicht mit einer Agentur, sondern direkt mit mir. Wenn du eine Frage hast,
                schreibst du mir einfach.
              </p>
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btnWa"><WaIcon /> Schreib mir auf WhatsApp</a>
          </div>
        </div>
      </section>

      {/* MUSTER-PRODUKT */}
      <section className="sec secAlt" id="muster">
        <div className="wrap muster">
          <div>
            <span className="eyebrow">Muster-Produkt zum Ausprobieren</span>
            <h2 className="h2">So könnte dein Produkt aussehen.</h2>
            <p className="kosLede">
              Ein Beispiel für einen Food-Kanal: ein Meal-Prep-Planer mit deinen Rezepten. Kein
              PDF, sondern ein richtiges Werkzeug, das deine Follower jede Woche öffnen. Probier
              es aus:
            </p>
            <ul className="checks">
              <li><strong>Ziel einstellen:</strong> Kalorien und Protein pro Mahlzeit festlegen, der Plan füllt sich passend</li>
              <li><strong>Woche planen:</strong> Frühstück, Mittag und Abend für jeden Tag, jedes Gericht austauschbar</li>
              <li><strong>Rezept antippen:</strong> Beschreibung, Zutaten, Zubereitung und Nährwerte</li>
              <li><strong>Einkaufen:</strong> die Liste für die ganze Woche entsteht automatisch</li>
            </ul>
            <p className="mine">
              Bei dir stehen dann dein Name, deine Farben und deine Inhalte drin — und für eine
              andere Nische bauen wir ein ganz anderes Produkt.
            </p>
            <p className="demoNote">Muster zur Veranschaulichung mit Beispielwerten. Deine Eingaben bleiben in deinem Browser.</p>
          </div>
          <MealPrepDemo />
          <div className="musterCta">
            <p>So etwas für deine Community?</p>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btnWa"><WaIcon /> Schreib mir auf WhatsApp</a>
          </div>
        </div>
      </section>

      {/* IDEEN */}
      <section className="sec" id="ideen">
        <div className="wrap">
          <span className="eyebrow">Was wir bauen könnten</span>
          <h2 className="h2">Produktideen für deine Nische.</h2>
          <p className="kosLede">
            Am Ende entsteht kein Standardprodukt, sondern eines, das es so nur bei dir gibt.
          </p>
          <p className="swipe" aria-hidden="true">wischen für mehr →</p>
          <div className="niches">
            {NICHES.map(([t, items]) => (
              <div className="card" key={t}>
                <h3 className="cardT">{t}</h3>
                <ul className="ideas">
                  {items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="nicheNote">
            Deine Nische ist nicht dabei? Umso besser — <a href={WA} target="_blank" rel="noopener noreferrer">schreib mir</a>, und ich
            schicke dir konkrete Ideen für deinen Kanal.
          </p>
        </div>
      </section>

      {/* DEAL */}
      <section className="sec secAlt" id="deal">
        <div className="wrap">
          <span className="eyebrow">Der Deal</span>
          <h2 className="h2">Ich übernehme alles.<br />Wir teilen den Gewinn.</h2>
          <p className="kosLede">
            Ich verdiene nur, wenn du verdienst. Deshalb will ich genauso wie du, dass es richtig gut wird.
          </p>
          <div className="advGrid">
            {TAKEOVER.map(([t, d]) => (
              <div className="advCard" key={t}>
                <h4><span className="mk mkYes">✓</span> {t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECHNER */}
      <section className="sec" id="rechner">
        <div className="wrap">
          <span className="eyebrow">Beispielrechnung</span>
          <h2 className="h2">Was könnte für dich drin sein?</h2>
          <p className="kosLede">Stell die Regler auf deinen Kanal ein und spiel es durch.</p>
          <div className="calc">
            <div className="calcIn">
              <label className="fld">
                <span className="fldTop"><span>Deine Follower</span><output>{num(follower)}</output></span>
                <input type="range" min="10000" max="100000" step="1000" value={follower} onChange={(e) => setFollower(+e.target.value)} />
              </label>
              <label className="fld">
                <span className="fldTop"><span>Anteil, der kauft</span><output>{quote.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %</output></span>
                <input type="range" min="0.5" max="5" step="0.5" value={quote} onChange={(e) => setQuote(+e.target.value)} />
              </label>
              <label className="fld">
                <span className="fldTop"><span>Preis des Produkts</span><output>{eur(preis)}</output></span>
                <input type="range" min="9" max="99" step="1" value={preis} onChange={(e) => setPreis(+e.target.value)} />
              </label>
            </div>
            <div className="calcOut" aria-live="polite">
              <div className="row"><span>Verkäufe</span><strong>{num(sales)}</strong></div>
              <div className="row"><span>Umsatz</span><strong>{eur(umsatz)}</strong></div>
              <div className="total">
                <span>Dein Anteil (50 %)</span>
                <strong>{eur(anteil)}</strong>
              </div>
              <p className="calcSub">Bei 0 € Einsatz und ohne das Produkt selbst zu bauen.</p>
            </div>
          </div>
          <p className="calcNote">
            Vereinfachte Beispielrechnung vor Zahlungsgebühren und Steuern — keine Zusage. Wie viele
            Follower tatsächlich kaufen, hängt von Nische, Produkt und Community ab.
          </p>
        </div>
      </section>

      {/* ABLAUF */}
      <section className="sec secAlt" id="ablauf">
        <div className="wrap">
          <span className="eyebrow">So läuft es ab</span>
          <h2 className="h2">In vier Schritten zu deinem Produkt.</h2>
          <div className="steps">
            {[
              ["1", "Kennenlernen", "15 Minuten, unverbindlich. Du erzählst von deinem Kanal, ich bringe erste Produktideen mit."],
              ["2", "Idee festlegen", "Wir entscheiden gemeinsam, was deinen Followern am meisten bringt. Du weißt, was sie dich immer wieder fragen."],
              ["3", "Ich baue", "Du lehnst dich zurück. Zwischendurch schaust du drauf und sagst, was noch besser zu deiner Community passt."],
              ["4", "Launch & teilen", "Du stellst das Produkt vor, ich kümmere mich um Verkauf, Auslieferung und Support. Den Gewinn teilen wir 50/50."],
            ].map(([n, t, d]) => (
              <div className="step" key={n}>
                <span className="stepN">{n}</span>
                <div>
                  <h3 className="stepT">{t}</h3>
                  <p className="stepD">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec" id="faq">
        <div className="wrap">
          <span className="eyebrow">Häufige Fragen</span>
          <h2 className="h2">Klingt zu gut? Hier sind die Antworten.</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details className="qa" key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="kontakt" id="kontakt">
        <div className="wrap kontaktIn">
          <span className="eyebrow" style={{ color: "var(--glow)" }}>Kontakt</span>
          <h2 className="h2 kH">Lass uns herausfinden, was zu deiner Community passt.</h2>
          <p className="kLede">
            Schick mir einfach den Link zu deinem Kanal. Ich melde mich mit konkreten Produktideen
            für deine Community — kostenlos und unverbindlich.
          </p>
          <div className="kBtns">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btnWa btnBig"><WaIcon /> Schreib mir auf WhatsApp</a>
            <span className="or">oder per E-Mail</span>
            <div className="mailRow">
              <a href={MAILTO} className="mailLink">{MAIL}</a>
              <button type="button" className="copyChip" onClick={copyMail} aria-label="E-Mail-Adresse kopieren">{copied ? "✓ Kopiert" : "kopieren"}</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap footIn">
          <span className="brand brandD">code nach maß<span className="dot">.</span></span>
          <div className="footLinks">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
            <span className="footC">© {new Date().getFullYear()} Lukas Schmitz</span>
          </div>
        </div>
      </footer>

      <a href={WA} target="_blank" rel="noopener noreferrer" className="waFloat" aria-label="Auf WhatsApp schreiben"><WaIcon /><span>WhatsApp</span></a>

      <style jsx>{`
        .nav{position:sticky;top:0;z-index:40;background:rgba(251,245,236,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
        .navIn{display:flex;align-items:center;justify-content:space-between;height:62px}
        .brand{font-family:var(--disp);font-weight:700;font-size:18px;color:var(--ink);letter-spacing:-0.02em}
        .brandD{color:#fff}
        .dot{color:var(--accent)}
        .navlinks{display:flex;align-items:center;gap:24px}
        .navlinks a{font-size:14.5px;color:var(--muted);transition:color .15s}
        .navlinks a:hover{color:var(--ink)}
        .navcta{color:#fff!important;background:var(--ink);padding:8px 16px;border-radius:999px;font-weight:600}
        .navcta:hover{background:var(--accent)}

        .hero{position:relative;overflow:hidden;padding:72px 0 76px;background:linear-gradient(180deg,#FFF3E4 0%,var(--paper) 100%)}
        .blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55;pointer-events:none}
        .b1{width:420px;height:420px;background:#FFC9A3;top:-140px;right:-80px}
        .b2{width:320px;height:320px;background:#FFE3A8;bottom:-160px;left:-100px}
        .heroIn{position:relative;display:grid;grid-template-columns:1.8fr .75fr;gap:40px;align-items:center}
        .pilot{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-size:13.5px;font-weight:600;color:var(--ink);margin-bottom:18px;box-shadow:0 4px 12px rgba(42,29,23,.06);transition:border-color .15s}
        .pilot:hover{border-color:var(--accent)}
        .pilotDot{width:8px;height:8px;border-radius:50%;background:var(--wa);flex-shrink:0}
        .hero .eyebrow{display:block}
        .peek{display:block;justify-self:end;width:274px;transform:rotate(2deg);transition:transform .2s}
        .peek:hover{transform:rotate(0deg)}
        .peekIn{width:380px;height:694px;transform:scale(.72);transform-origin:top left;margin:0 -106px -194px 0;pointer-events:none}
        .peekTag{display:block;text-align:center;margin-top:12px;font-size:13.5px;font-weight:600;color:var(--accent)}
        .h1{font-size:clamp(30px,3.7vw,44px);font-weight:600;margin-top:16px;text-wrap:balance}
        .hl{color:var(--accent)}
        .lede{max-width:600px;font-size:clamp(16.5px,1.9vw,19px);color:var(--muted);margin-top:22px}
        .cta{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0 30px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-weight:600;font-size:15.5px;padding:14px 22px;border-radius:999px;transition:transform .12s,background .15s,border-color .15s,box-shadow .15s}
        .btn:active{transform:translateY(1px)}
        .btnWa{background:var(--wa);color:#06321A;box-shadow:0 10px 24px rgba(37,211,102,.28)}
        .btnWa:hover{background:#3BE07A}
        .btnBig{font-size:17px;padding:16px 28px}
        .btnGhost{color:var(--ink);border:1.5px solid var(--ink)}
        .btnGhost:hover{background:var(--ink);color:#fff}
        .facts{display:flex;flex-wrap:wrap;gap:12px}
        .fact{border:1px solid var(--line);border-radius:16px;padding:13px 18px;background:rgba(255,255,255,.8);min-width:160px}
        .fact strong{display:block;font-family:var(--disp);font-size:23px;font-weight:600;color:var(--accent);letter-spacing:-0.01em}
        .fact span{font-size:13.5px;color:var(--muted)}

        .sec{padding:80px 0}
        .secAlt{background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .h2{font-size:clamp(25px,3.4vw,38px);margin:12px 0 0;max-width:760px}
        .kosLede{max-width:640px;margin:14px 0 0;color:var(--muted);font-size:16.5px}


        .muster{display:grid;grid-template-columns:1fr 400px;gap:56px;align-items:center}
        .checks strong{font-weight:600}
        .checks{list-style:none;padding:0;margin:22px 0 0}
        .checks li{position:relative;padding:7px 0 7px 30px;font-size:15.5px}
        .checks li::before{content:"✓";position:absolute;left:0;top:7px;width:21px;height:21px;border-radius:50%;background:var(--accentSoft);color:var(--accent);font-size:12.5px;font-weight:700;display:grid;place-items:center}
        .mine{margin-top:16px;color:var(--muted);font-size:15.5px;max-width:560px}
        .demoNote{margin-top:14px;font-size:13px;color:var(--muted)}
        .musterCta{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:20px 24px}
        .musterCta p{font-family:var(--disp);font-size:20px;font-weight:600;letter-spacing:-0.01em}

        .swipe{display:none}
        .niches{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:34px}
        .card{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:22px;transition:transform .15s,box-shadow .15s}
        .card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(42,29,23,.09)}
        .cardT{font-size:18.5px}
        .ideas{list-style:none;padding:0;margin:12px 0 0}
        .ideas li{position:relative;padding:8px 0 8px 20px;font-size:14.5px;color:var(--muted);border-top:1px solid var(--lineSoft)}
        .ideas li:first-child{border-top:none}
        .ideas li::before{content:"→";position:absolute;left:0;color:var(--accent);font-size:13px}
        .nicheNote{margin-top:24px;color:var(--muted);font-size:15.5px}
        .nicheNote a{color:var(--accent);font-weight:600;text-decoration:underline;text-underline-offset:3px}

        .mk{font-weight:700;flex-shrink:0;font-size:14px;line-height:1.6}
        .mkYes{color:var(--accent)}
        .advGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}
        .advCard{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px 20px}
        .advCard h4{font-family:var(--disp);font-size:16.5px;font-weight:600;margin:0;letter-spacing:-0.01em}
        .advCard p{margin-top:8px;color:var(--muted);font-size:14.5px}

        .calc{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;margin-top:26px}
        .calcIn{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:26px 24px;display:flex;flex-direction:column;gap:26px;justify-content:center}
        .fld{display:block}
        .fldTop{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:15px;color:var(--muted);margin-bottom:10px}
        .fldTop output{font-weight:700;font-size:16px;color:var(--ink)}
        .fld input{width:100%;accent-color:var(--accent);cursor:pointer;margin:0}
        .calcOut{background:var(--ink);color:#fff;border-radius:20px;padding:26px 24px}
        .row{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--lineD);color:var(--mutedD);font-size:15px}
        .row strong{font-weight:600;color:#fff;font-size:16px}
        .total{padding-top:20px}
        .total span{display:block;font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--glow)}
        .total strong{display:block;font-family:var(--disp);font-size:clamp(38px,5vw,54px);font-weight:600;letter-spacing:-0.02em;line-height:1.15;color:#fff}
        .calcSub{margin-top:6px;font-size:14px;color:var(--mutedD)}
        .calcNote{margin-top:14px;font-size:13px;color:var(--muted);max-width:760px}

        .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:36px}
        .step{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:22px}
        .stepN{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;font-family:var(--disp);font-size:17px;font-weight:700;color:#fff;background:var(--accent);margin-bottom:14px}
        .stepT{font-size:18px}
        .stepD{margin-top:8px;color:var(--muted);font-size:15px}

        .about{display:grid;grid-template-columns:340px 1fr;gap:56px;align-items:center}
        .aboutImg{border-radius:26px;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;box-shadow:0 24px 50px rgba(42,29,23,.16)}
        .aboutTxt{margin:18px 0 26px;display:flex;flex-direction:column;gap:14px;max-width:620px}
        .aboutTxt p{color:var(--muted);font-size:16px}
        .aboutTxt strong{color:var(--ink)}

        .faq{margin-top:30px;max-width:820px;border-top:1px solid var(--line)}
        .qa{border-bottom:1px solid var(--line)}
        .qa summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;font-family:var(--disp);font-weight:600;font-size:17.5px;letter-spacing:-0.01em}
        .qa summary::-webkit-details-marker{display:none}
        .qa summary::after{content:"+";font-size:22px;color:var(--accent);flex-shrink:0}
        .qa[open] summary::after{content:"–"}
        .qa p{padding:0 0 20px;color:var(--muted);font-size:15.5px;max-width:720px}

        .kontakt{background:var(--ink);color:#fff;padding:88px 0}
        .kontaktIn{text-align:center}
        .kH{margin-left:auto;margin-right:auto}
        .kLede{max-width:560px;margin:16px auto 30px;color:#EADBCF;font-size:17px}
        .kBtns{display:flex;flex-direction:column;align-items:center;gap:14px}
        .or{font-size:13.5px;color:var(--mutedD)}
        .mailRow{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center}
        .mailLink{color:#fff;font-weight:600;text-decoration:underline;text-underline-offset:4px}
        .copyChip{background:transparent;border:1px solid var(--lineD);border-radius:999px;padding:6px 13px;cursor:pointer;font:600 12px var(--sans);color:var(--glow);letter-spacing:.04em;text-transform:uppercase;transition:border-color .15s}
        .copyChip:hover{border-color:var(--glow)}

        .foot{background:var(--ink2);color:var(--mutedD);padding:26px 0 26px;border-top:1px solid var(--lineD)}
        .footIn{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
        .footLinks{display:flex;align-items:center;gap:20px;font-size:14px}
        .footLinks a:hover{color:#fff}
        .footC{color:#9C8A7E}

        .waFloat{position:fixed;right:18px;bottom:18px;z-index:50;display:inline-flex;align-items:center;gap:8px;background:var(--wa);color:#06321A;font-weight:700;font-size:14.5px;padding:13px 18px;border-radius:999px;box-shadow:0 12px 28px rgba(0,0,0,.25);transition:transform .15s}
        .waFloat:hover{transform:translateY(-2px)}

        @media (max-width:1000px){
          .steps{grid-template-columns:1fr 1fr}
          .advGrid{grid-template-columns:1fr 1fr}
          .muster{grid-template-columns:1fr;gap:36px}
        }
        @media (max-width:820px){
          .navlinks a:not(.navcta){display:none}
          .hero{padding:36px 0 44px}
          .heroIn{grid-template-columns:1fr;gap:26px}
          .peek{display:none}
          .pilot{font-size:12.5px;padding:7px 12px;margin-bottom:14px}
          .musterCta{flex-direction:column;gap:12px;text-align:center}
          .musterCta .btn{width:100%}
          .h1{margin-top:12px}
          .cta{margin:22px 0 22px}
          .cta .btn{flex:1 1 100%}
          .facts{gap:8px;flex-wrap:nowrap}
          .fact{min-width:0;flex:1;padding:10px 10px}
          .fact strong{font-size:17px}
          .fact span{font-size:11.5px;line-height:1.3;display:block}
          .sec{padding:52px 0}
          .swipe{display:block;margin-top:16px;font-size:13px;color:var(--muted)}
          .niches{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin:10px -24px 0;padding:0 24px 10px;scrollbar-width:none}
          .niches::-webkit-scrollbar{display:none}
          .card{flex:0 0 80%;scroll-snap-align:center}
          .card:hover{transform:none;box-shadow:none}
          .advGrid{grid-template-columns:1fr;gap:0;margin-top:22px;background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:6px 18px}
          .advCard{background:transparent;border:0;border-radius:0;padding:11px 0;border-top:1px solid var(--line)}
          .advCard:first-child{border-top:0}
          .advCard h4{font-size:15.5px}
          .advCard p{display:none}
          .calc{grid-template-columns:1fr}
          .steps{grid-template-columns:1fr;gap:10px;margin-top:24px}
          .step{display:flex;gap:14px;padding:16px 18px}
          .stepN{margin:0;flex-shrink:0}
          .stepD{margin-top:4px}
          .about{grid-template-columns:1fr;gap:24px}
          .aboutImg{max-width:220px;border-radius:22px}
          .about .btn{width:100%}
          .kontakt{padding:60px 0 84px}
          .btnBig{width:100%}
          .waFloat{right:12px;bottom:12px;padding:13px}
          .waFloat span{display:none}
          .foot{padding-bottom:76px}
        }
      `}</style>
    </main>
  );
}

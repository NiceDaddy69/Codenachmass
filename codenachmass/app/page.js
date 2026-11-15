"use client";
import { useState } from "react";

const MAIL = "lukas@codenachmass.de";
const MAILTO = `mailto:${MAIL}?subject=${encodeURIComponent("Eigenes Produkt für meine Community")}`;
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
  ["Was heißt 50/50 genau?", "Vom Gewinn aus jedem Verkauf — also dem Erlös nach Zahlungsgebühren und Steuern — geht die Hälfte an dich und die Hälfte an code nach maß. Die Abrechnung ist für dich nachvollziehbar, und alle Details halten wir schriftlich fest, bevor es losgeht."],
  ["Was, wenn sich das Produkt nicht verkauft?", "Dann hast du nichts verloren. Du hast kein Geld investiert und kaum Zeit. Das Risiko der Erstellung trage ich — genau deshalb baue ich nur Produkte, von denen ich überzeugt bin, dass deine Community sie haben will."],
  ["Ich habe „nur“ 10.000 Follower. Lohnt sich das?", "Gerade dann. Kleine und mittlere Kanäle haben oft die engste Bindung zu ihrer Community. Entscheidend ist nicht die Zahl, sondern das Vertrauen — und ein Produkt, das wirklich passt."],
  ["Passt ein Produkt überhaupt zu meinem Kanal?", "Du hast immer das letzte Wort. Nichts geht online, was du nicht freigegeben hast. Das Produkt trägt deinen Namen — also muss es sich für dich und deine Follower richtig anfühlen."],
  ["Was für Produkte sind möglich?", "Alles Digitale: E-Books und Guides, Vorlagen und Planer, Mini-Kurse, Challenges, Rechner und kleine Web-Apps. Was am besten passt, hängt von deiner Nische ab — das finden wir im ersten Gespräch heraus."],
];

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
            <a href="#idee">Die Idee</a>
            <a href="#beispiele">Beispiele</a>
            <a href="#deal">Der Deal</a>
            <a href="#rechner">Rechner</a>
            <a href="#ablauf">Ablauf</a>
            <a href="#faq">FAQ</a>
            <a href="#kontakt" className="navcta">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="grid" aria-hidden="true" />
        <div className="wrap heroIn">
          <span className="eyebrow" style={{ color: "var(--mint)" }}>Für Creator mit 10.000 – 80.000 Followern</span>
          <h1 className="h1">Deine Community.<br />Dein eigenes Produkt.<br /><span className="hl">Ich baue es.</span></h1>
          <div className="rule tall heroRule" style={{ color: "var(--mint)" }} />
          <p className="lede">
            Du hast dir eine Community aufgebaut, aber noch nichts Eigenes, das du ihr anbieten kannst?
            Ich entwickle ein digitales Produkt, das genau zu deinen Followern passt — komplett
            auf meine Kosten. Verkauft es sich, teilen wir den Gewinn 50/50.
          </p>
          <div className="cta">
            <a href="#kontakt" className="btn btnPrimary">Unverbindlich anfragen</a>
            <a href="#beispiele" className="btn btnGhost">Produktideen ansehen</a>
          </div>
          <div className="facts">
            <div className="fact"><strong>0 €</strong><span>Kosten für dich</span></div>
            <div className="fact"><strong>50 / 50</strong><span>Gewinn pro Verkauf</span></div>
            <div className="fact"><strong>Hands-off</strong><span>Ich erstelle, du gibst frei</span></div>
          </div>
        </div>
      </section>

      {/* IDEE */}
      <section className="sec" id="idee">
        <div className="wrap">
          <span className="eyebrow">Die Idee</span>
          <h2 className="h2">Die Community hast du schon.<br />Es fehlt nur noch das Produkt.</h2>
          <p className="kosLede">
            Deine Follower vertrauen dir und fragen dich längst nach Tipps, Plänen und Empfehlungen.
            Ein eigenes Produkt gibt ihnen echten Mehrwert — und dir ein Einkommen, das nicht von
            Kooperationen oder dem Algorithmus abhängt. Meist scheitert es nicht an der Idee, sondern
            an Zeit, Technik und Aufwand. Genau den Teil übernehme ich.
          </p>
          <div className="three">
            <div className="pt">
              <span className="ptLabel">01 — Maßgeschneidert</span>
              <p>Kein Produkt von der Stange mit deinem Logo drauf. Wir schneiden es gemeinsam exakt auf deine Community zu — auf ihre Fragen, ihre Sprache, ihren Alltag.</p>
            </div>
            <div className="pt">
              <span className="ptLabel">02 — Ohne Risiko</span>
              <p>Du investierst kein Geld. Ich gehe mit der kompletten Erstellung in Vorleistung und verdiene nur, wenn du auch verdienst.</p>
            </div>
            <div className="pt">
              <span className="ptLabel">03 — Ohne Aufwand</span>
              <p>Du machst weiter das, was du am besten kannst: Content. Ich brauche dich nur für das, was niemand sonst weiß — was deine Follower wirklich wollen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BEISPIELE */}
      <section className="sec secAlt" id="beispiele">
        <div className="wrap">
          <span className="eyebrow">Was wir bauen könnten</span>
          <h2 className="h2">Produktideen für deine Nische.</h2>
          <p className="kosLede">
            Ein paar Beispiele, wie ein digitales Produkt für deine Community aussehen kann. Am Ende
            entsteht kein Standardprodukt, sondern eines, das es so nur bei dir gibt.
          </p>
          <div className="niches">
            {NICHES.map(([t, items]) => (
              <div className="card" key={t}>
                <div className="cardTick" aria-hidden="true" />
                <h3 className="cardT">{t}</h3>
                <ul className="ideas">
                  {items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="nicheNote">
            Deine Nische ist nicht dabei? Umso besser — <a href="#kontakt">schreib mir</a>, und ich
            schicke dir konkrete Ideen für deinen Kanal.
          </p>
        </div>
      </section>

      {/* DEAL */}
      <section className="sec" id="deal">
        <div className="wrap">
          <span className="eyebrow">Der Deal</span>
          <h2 className="h2">Ich übernehme alles.<br />Wir teilen den Gewinn.</h2>
          <p className="kosLede">
            Wer ein digitales Produkt alleine auf die Beine stellt, braucht Wochen an Zeit, mehrere
            Tools und oft bezahlte Hilfe. Mit code nach maß bekommst du das fertige Produkt — ohne
            einen Cent zu zahlen. Ich verdiene nur, wenn du verdienst. Deshalb will ich genauso wie du,
            dass es richtig gut wird.
          </p>
          <div className="compare">
            <div className="col colOld">
              <span className="colTag">Alleine umsetzen</span>
              <ul>
                <li><span className="mk mkNo">✕</span> Wochen an Arbeit neben dem Content</li>
                <li><span className="mk mkNo">✕</span> Kosten für Design, Tools und Technik</li>
                <li><span className="mk mkNo">✕</span> Shop, Zahlung und Auslieferung selbst einrichten</li>
                <li><span className="mk mkNo">✕</span> Support-Anfragen landen bei dir</li>
                <li><span className="mk mkNo">✕</span> Das volle Risiko liegt bei dir</li>
              </ul>
            </div>
            <div className="col colNew">
              <span className="colTag colTagNew">Mit code nach maß</span>
              <ul>
                <li><span className="mk mkYes">✓</span> Erstellung komplett hands-off für dich</li>
                <li><span className="mk mkYes">✓</span> 0 € Kosten — ich gehe in Vorleistung</li>
                <li><span className="mk mkYes">✓</span> Verkaufsseite und Technik laufen fertig</li>
                <li><span className="mk mkYes">✓</span> Ich kümmere mich um die Käufer</li>
                <li><span className="mk mkYes">✓</span> 50 % vom Gewinn bei jedem Verkauf</li>
              </ul>
            </div>
          </div>

          <h3 className="advSubhead">Das übernehme ich für dich.</h3>
          <div className="advGrid">
            {TAKEOVER.map(([t, d], i) => (
              <div className="advCard" key={t}>
                <span className="advN">{String(i + 1).padStart(2, "0")}</span>
                <h4>{t}</h4>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div className="yours">
            <span className="yoursTag">Dein Part</span>
            <p>
              Ein Kennenlerngespräch, kurzes Feedback zu den Entwürfen, die finale Freigabe — und
              zum Start erzählst du deiner Community davon. Mehr nicht.
            </p>
          </div>
        </div>
      </section>

      {/* RECHNER */}
      <section className="sec secAlt" id="rechner">
        <div className="wrap">
          <span className="eyebrow">Beispielrechnung</span>
          <h2 className="h2">Was könnte für dich drin sein?</h2>
          <p className="kosLede">
            Schon wenn nur ein kleiner Teil deiner Follower kauft, kommt etwas zusammen. Stell die
            Regler auf deinen Kanal ein und spiel es durch.
          </p>
          <div className="calc">
            <div className="calcIn">
              <label className="fld">
                <span className="fldTop"><span>Deine Follower</span><output>{num(follower)}</output></span>
                <input type="range" min="10000" max="80000" step="1000" value={follower} onChange={(e) => setFollower(+e.target.value)} />
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
      <section className="sec" id="ablauf">
        <div className="wrap">
          <span className="eyebrow">So läuft es ab</span>
          <h2 className="h2">In vier Schritten zu deinem Produkt.</h2>
          <div className="steps steps4">
            {[
              ["01", "Kennenlernen", "15 Minuten, unverbindlich. Du erzählst von deinem Kanal und deiner Community, ich bringe erste Produktideen mit."],
              ["02", "Idee festlegen", "Wir entscheiden gemeinsam, was deinen Followern am meisten bringt. Du weißt, was sie dich immer wieder fragen — das ist die beste Vorlage."],
              ["03", "Ich baue", "Du lehnst dich zurück. Ich erstelle Produkt, Verkaufsseite und Technik. Zwischendurch schaust du drauf und sagst, was noch besser zu deiner Community passt."],
              ["04", "Launch & teilen", "Du stellst das Produkt vor, ich kümmere mich um Verkauf, Auslieferung und Support. Den Gewinn teilen wir 50/50."],
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
      <section className="sec secAlt" id="faq">
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
          <span className="eyebrow" style={{ color: "var(--mint)" }}>Kontakt</span>
          <h2 className="h2 kH">Lass uns herausfinden, was zu deiner Community passt.</h2>
          <p className="kLede">
            Schick mir einfach den Link zu deinem Kanal. Ich melde mich mit konkreten Produktideen
            für deine Community — kostenlos und unverbindlich.
          </p>
          <div className="kBtns">
            <a href={MAILTO} className="btn btnMint">E-Mail schreiben</a>
            <button type="button" className="copyChip" onClick={copyMail} aria-label="E-Mail-Adresse kopieren">
              <span className="copyMail">{MAIL}</span>
              <span className="copyIco">{copied ? "✓ Kopiert" : "kopieren"}</span>
            </button>
          </div>
          <p className="kBy">
            Hinter code nach maß steht <strong>Lukas Schmitz</strong>, Entwickler aus Düsseldorf —
            zuvor in der Wirtschaftsprüfung. Saubere Zahlen und eine transparente Abrechnung sind für
            mich selbstverständlich.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap footIn">
          <span className="brand">code nach maß<span className="dot">.</span></span>
          <div className="footLinks">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
            <span className="footC">© {new Date().getFullYear()} Lukas Schmitz</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .nav{position:sticky;top:0;z-index:40;background:rgba(15,26,36,.82);backdrop-filter:blur(10px);border-bottom:1px solid var(--lineD)}
        .navIn{display:flex;align-items:center;justify-content:space-between;height:62px}
        .brand{font-family:var(--mono);font-weight:600;font-size:15px;color:#fff;letter-spacing:-0.01em}
        .dot{color:var(--mint)}
        .navlinks{display:flex;align-items:center;gap:26px}
        .navlinks a{font-size:14px;color:var(--mutedD);transition:color .15s}
        .navlinks a:hover{color:#fff}
        .navcta{color:#fff!important;border:1px solid var(--lineD);padding:7px 14px;border-radius:8px}
        .navcta:hover{background:var(--accent);border-color:var(--accent)}

        .hero{position:relative;background:var(--ink);color:#fff;overflow:hidden;padding:96px 0 84px}
        .grid{position:absolute;inset:0;background-image:linear-gradient(var(--lineD) 1px,transparent 1px),linear-gradient(90deg,var(--lineD) 1px,transparent 1px);background-size:48px 48px;opacity:.28;mask-image:radial-gradient(120% 90% at 20% 0%,#000 30%,transparent 78%)}
        .heroIn{position:relative}
        .h1{font-size:clamp(38px,6.4vw,72px);font-weight:600}
        .heroRule{max-width:320px;margin:26px 0}
        .lede{max-width:620px;font-size:clamp(17px,2.1vw,20px);color:#D6E0E4}
        .cta{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0 34px}
        .btn{display:inline-block;font-weight:600;font-size:15px;padding:13px 22px;border-radius:11px;transition:transform .12s,background .15s,border-color .15s}
        .btn:active{transform:translateY(1px)}
        .btnPrimary{background:var(--mint);color:var(--ink)}
        .btnPrimary:hover{background:#5AD9C8}
        .btnGhost{color:#fff;border:1px solid var(--lineD)}
        .btnGhost:hover{border-color:var(--mint);color:var(--mint)}
        .trust{max-width:640px;font-size:14.5px;color:var(--mutedD);border-left:2px solid var(--accent);padding-left:16px}
        .trust strong{color:#fff;font-weight:600}

        .sec{padding:84px 0}
        .secAlt{background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .h2{font-size:clamp(26px,3.6vw,40px);margin:14px 0 0;max-width:760px}

        .three{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:44px}
        .ptLabel{font-family:var(--mono);font-size:12.5px;font-weight:600;color:var(--accent);letter-spacing:.04em}
        .pt p{margin-top:12px;color:var(--muted);font-size:15.5px}

        .cards{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:44px}
        .card{position:relative;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:26px 24px;overflow:hidden;transition:transform .15s,box-shadow .15s}
        .card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(15,26,36,.09)}
        .cardTick{position:absolute;top:0;left:0;right:0;height:16px;color:var(--accent);background-image:repeating-linear-gradient(90deg,currentColor 0 1.4px,transparent 1.4px 10px);opacity:.32}
        .cardT{font-size:19px;margin:14px 0 0}
        .cardD{margin-top:10px;color:var(--muted);font-size:15px}

        .kosLede{max-width:660px;margin:14px 0 0;color:var(--muted);font-size:16px}
        .compare{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:34px}
        .col{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:26px 24px}
        .colNew{border-color:var(--accent);box-shadow:0 14px 34px rgba(15,110,107,.12)}
        .colTag{font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
        .colTagNew{color:var(--accent)}
        .col ul{list-style:none;padding:0;margin:16px 0 0}
        .col li{display:flex;align-items:flex-start;gap:11px;padding:9px 0;font-size:15px;color:var(--ink);border-top:1px solid var(--lineSoft)}
        .col li:first-child{border-top:none}
        .colOld li{color:var(--muted)}
        .mk{font-family:var(--mono);font-weight:700;flex-shrink:0;font-size:14px;line-height:1.5}
        .mkNo{color:#B5271F}
        .mkYes{color:var(--accent)}
        .advSubhead{font-family:var(--disp);font-size:clamp(19px,2.4vw,25px);font-weight:600;letter-spacing:-0.01em;margin:48px 0 0}
        .advGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
        .advCard{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px}
        .advN{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--accent);letter-spacing:.04em}
        .advCard h4{font-family:var(--disp);font-size:16.5px;font-weight:600;margin:10px 0 0;letter-spacing:-0.01em}
        .advCard p{margin-top:8px;color:var(--muted);font-size:14.5px}
        @media (max-width:900px){ .advGrid{grid-template-columns:1fr 1fr} }
        @media (max-width:620px){ .advGrid{grid-template-columns:1fr} }

        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:44px}
        .step{display:flex;gap:16px}
        .stepN{font-family:var(--mono);font-size:14px;font-weight:600;color:#fff;background:var(--accent);border-radius:9px;padding:6px 10px;height:fit-content}
        .stepT{font-size:18px}
        .stepD{margin-top:8px;color:var(--muted);font-size:15px}

        .kontakt{background:var(--ink);color:#fff;padding:92px 0}
        .kontaktIn{text-align:center}
        .kH{margin-left:auto;margin-right:auto}
        .kLede{max-width:560px;margin:16px auto 30px;color:#D6E0E4;font-size:17px}
        .btnMint{background:var(--mint);color:var(--ink);font-family:var(--mono);font-size:16px}
        .btnMint:hover{background:#5AD9C8}
        .kBtns{display:flex;flex-direction:column;align-items:center;gap:14px}
        .copyChip{display:inline-flex;align-items:center;gap:12px;background:transparent;border:1px solid var(--lineD);border-radius:11px;padding:10px 15px;cursor:pointer;font-family:var(--mono);transition:border-color .15s}
        .copyChip:hover{border-color:var(--mint)}
        .copyMail{color:#fff;font-size:14.5px}
        .copyIco{font-size:11.5px;color:var(--mint);letter-spacing:.05em;text-transform:uppercase;min-width:64px;text-align:left}

        .foot{background:var(--ink2);color:var(--mutedD);padding:26px 0;border-top:1px solid var(--lineD)}
        .footIn{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
        .footLinks{display:flex;align-items:center;gap:20px;font-size:14px}
        .footLinks a:hover{color:#fff}
        .footC{color:#5B6D77}


        .hl{color:var(--mint)}
        .facts{display:flex;flex-wrap:wrap;gap:14px}
        .fact{border:1px solid var(--lineD);border-radius:12px;padding:14px 18px;background:rgba(22,36,47,.7);min-width:170px}
        .fact strong{display:block;font-family:var(--disp);font-size:24px;font-weight:600;color:var(--mint);letter-spacing:-0.01em}
        .fact span{font-size:13.5px;color:var(--mutedD)}

        .niches{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
        .ideas{list-style:none;padding:0;margin:14px 0 0}
        .ideas li{position:relative;padding:8px 0 8px 20px;font-size:14.5px;color:var(--muted);border-top:1px solid var(--line)}
        .ideas li:first-child{border-top:none}
        .ideas li::before{content:"→";position:absolute;left:0;color:var(--accent);font-family:var(--mono);font-size:13px}
        .nicheNote{margin-top:26px;color:var(--muted);font-size:15.5px}
        .nicheNote a{color:var(--accent);font-weight:600;text-decoration:underline;text-underline-offset:3px}

        .yours{margin-top:22px;display:flex;gap:18px;align-items:flex-start;background:var(--ink);color:#D6E0E4;border-radius:14px;padding:22px 24px}
        .yoursTag{flex-shrink:0;font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);background:var(--mint);border-radius:7px;padding:5px 10px}
        .yours p{font-size:15.5px}

        .calc{display:grid;grid-template-columns:1.1fr 1fr;gap:20px;margin-top:34px}
        .calcIn{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:26px 24px;display:flex;flex-direction:column;gap:26px;justify-content:center}
        .fld{display:block}
        .fldTop{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:15px;color:var(--muted);margin-bottom:10px}
        .fldTop output{font-family:var(--mono);font-weight:600;font-size:16px;color:var(--ink)}
        .fld input{width:100%;accent-color:var(--accent);cursor:pointer;margin:0}
        .calcOut{background:var(--ink);color:#fff;border-radius:16px;padding:26px 24px}
        .row{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--lineD);color:var(--mutedD);font-size:15px}
        .row strong{font-family:var(--mono);font-weight:600;color:#fff;font-size:16px}
        .total{padding-top:20px}
        .total span{display:block;font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mint)}
        .total strong{display:block;font-family:var(--disp);font-size:clamp(38px,5vw,54px);font-weight:600;letter-spacing:-0.02em;line-height:1.15;color:#fff}
        .calcSub{margin-top:6px;font-size:14px;color:var(--mutedD)}
        .calcNote{margin-top:14px;font-family:var(--mono);font-size:12.5px;color:var(--muted);max-width:760px}

        .steps4{grid-template-columns:repeat(2,1fr);gap:30px 36px}

        .faq{margin-top:34px;max-width:820px;border-top:1px solid var(--line)}
        .qa{border-bottom:1px solid var(--line)}
        .qa summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;font-family:var(--disp);font-weight:600;font-size:17.5px;letter-spacing:-0.01em}
        .qa summary::-webkit-details-marker{display:none}
        .qa summary::after{content:"+";font-family:var(--mono);font-size:20px;color:var(--accent);flex-shrink:0}
        .qa[open] summary::after{content:"–"}
        .qa p{padding:0 0 20px;color:var(--muted);font-size:15.5px;max-width:720px}

        .kBy{max-width:560px;margin:34px auto 0;font-size:14px;color:var(--mutedD)}
        .kBy strong{color:#fff;font-weight:600}
        @media (max-width:1000px){ .niches{grid-template-columns:1fr 1fr} }
        @media (max-width:620px){ .compare{grid-template-columns:1fr} .yours{flex-direction:column;gap:12px} .fact{flex:1 1 100%} }

        @media (max-width:820px){
          .three,.cards,.steps,.niches,.calc{grid-template-columns:1fr}
          .hero{padding:72px 0 64px}
          .sec{padding:64px 0}
          .navlinks{gap:16px}
          .navlinks a:not(.navcta){display:none}
        }
      `}</style>
    </main>
  );
}

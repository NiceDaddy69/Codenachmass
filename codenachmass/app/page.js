"use client";
import { useState } from "react";
import FristenTracker from "./components/Fristentracker";
import OnboardingPortal from "./components/OnboardingPortal";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const copyMail = async () => {
    const mail = "lukas@codenachmass.de";
    try {
      await navigator.clipboard.writeText(mail);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = mail; ta.style.position = "fixed"; ta.style.opacity = "0";
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
            <a href="#ansatz">Ansatz</a>
            <a href="#leistungen">Leistungen</a>
            <a href="#demo">Demos</a>
            <a href="#ablauf">Ablauf</a>
            <a href="#kontakt" className="navcta">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="grid" aria-hidden="true" />
        <div className="wrap heroIn">
          <span className="eyebrow" style={{ color: "var(--mint)" }}>Individuelle Software · Düsseldorf</span>
          <h1 className="h1">Werkzeuge nach Maß<br />für Steuerkanzleien.</h1>
          <div className="rule tall heroRule" style={{ color: "var(--mint)" }} />
          <p className="lede">
            Ich baue interne Tools, die genau zu Ihrem Arbeitsablauf passen — dort, wo Excel
            an seine Grenzen kommt und große Kanzleisoftware zu schwerfällig ist.
          </p>
          <div className="cta">
            <a href="#demo" className="btn btnPrimary">Live-Demo ansehen</a>
            <a href="#kontakt" className="btn btnGhost">Gespräch anfragen</a>
          </div>
          <p className="trust">
            Gebaut von <strong>Lukas Schmitz</strong> — zuvor in der Wirtschaftsprüfung, heute Entwickler.
            Zahlen, Fristen und Bescheide muss man mir nicht erklären.
          </p>
        </div>
      </section>

      {/* ANSATZ */}
      <section className="sec" id="ansatz">
        <div className="wrap">
          <span className="eyebrow">Der Ansatz</span>
          <h2 className="h2">Keine Software von der Stange.<br />Sondern genau das Werkzeug, das fehlt.</h2>
          <div className="three">
            <div className="pt">
              <span className="ptLabel">01 — Passgenau</span>
              <p>Das Tool bildet Ihren Prozess ab, nicht umgekehrt. Kein Anpassen an fremde Workflows, kein Funktions-Ballast, den niemand nutzt.</p>
            </div>
            <div className="pt">
              <span className="ptLabel">02 — Verständlich</span>
              <p>Ich komme aus dem Prüfungswesen, nicht nur aus der IT. Fristen, Bescheide, Mandantenlogik muss man mir nicht erklären.</p>
            </div>
            <div className="pt">
              <span className="ptLabel">03 — Schlank</span>
              <p>Eine fokussierte Lösung für ein konkretes Problem — schnell gebaut, sofort einsetzbar, ohne monatelanges IT-Projekt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="sec secAlt" id="leistungen">
        <div className="wrap">
          <span className="eyebrow">Was ich baue</span>
          <h2 className="h2">Vom Fristen-Tool bis zum Mandantenportal.</h2>
          <div className="cards">
            {[
              ["Interne Tools & Fristenkontrolle", "Übersichten, die Ihr Team wirklich nutzt — Fristen, Aufgaben, Zuständigkeiten an einem Ort statt in verstreuten Excel-Listen."],
              ["Automatisierung", "Wiederkehrende Handgriffe abschaffen: Erinnerungen, Berechnungen, Statuswechsel laufen automatisch, nicht per Zuruf."],
              ["Reporting & Dashboards", "Auswertungen und Mandanten-Reportings, die sich auf Knopfdruck erzeugen — statt sie jeden Monat neu in Excel zusammenzubauen."],
              ["Mandanten-Portale & Onboarding", "Digitale Wege für Unterlagen, Freigaben und Kommunikation — sauber, DSGVO-konform, ohne E-Mail-Pingpong."],
            ].map(([t, d]) => (
              <div className="card" key={t}>
                <div className="cardTick" aria-hidden="true" />
                <h3 className="cardT">{t}</h3>
                <p className="cardD">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="sec" id="demo">
        <div className="wrap">
          <span className="eyebrow">Beispiel 1</span>
          <h2 className="h2">Fristentracker für Steuerkanzleien</h2>
          <p className="demoLede">
            Ein Beispiel meiner Arbeit: gesetzlich berechnete Fristen je Mandant (inkl. beratener Fälle
            und bundeslandspezifischer Feiertage), Zuständigkeit pro Sachbearbeiter, und sobald ein Bescheid
            eingeht, wird automatisch die Einspruchsfrist erzeugt. Klicken Sie sich durch:
          </p>
          <div className="demoFrame">
            <div className="demoBar" aria-hidden="true">
              <span className="dotb" /><span className="dotb" /><span className="dotb" />
              <span className="demoUrl">fristentracker · Demo</span>
            </div>
            <div className="demoBody">
              <FristenTracker />
            </div>
          </div>
          <p className="demoNote">Voll funktionsfähige Demo. Eingaben bleiben nur lokal in Ihrem Browser.</p>
        </div>
      </section>

      {/* DEMO 2 */}
      <section className="sec secAlt" id="demo2">
        <div className="wrap">
          <span className="eyebrow">Beispiel 2</span>
          <h2 className="h2">Digitales Mandanten-Onboarding</h2>
          <p className="demoLede">
            Neue Mandanten aufzunehmen heißt in vielen Kanzleien: E-Mail-Pingpong, PDF-Formulare,
            eingescannte Vollmachten. Hier erledigt der Mandant alles online — Stammdaten, Unterlagen,
            SEPA und Vollmacht — und die Kanzlei sieht den Fortschritt live. Wechseln Sie oben rechts
            zwischen Kanzlei- und Mandanten-Ansicht:
          </p>
          <div className="demoFrame">
            <div className="demoBar" aria-hidden="true">
              <span className="dotb" /><span className="dotb" /><span className="dotb" />
              <span className="demoUrl">onboarding · Demo</span>
            </div>
            <div className="demoBody">
              <OnboardingPortal />
            </div>
          </div>
          <p className="demoNote">Voll funktionsfähige Demo. Eingaben bleiben nur lokal in Ihrem Browser — es werden keine Daten übertragen.</p>
        </div>
      </section>

      {/* ABLAUF */}
      <section className="sec" id="ablauf">
        <div className="wrap">
          <span className="eyebrow">So läuft es ab</span>
          <h2 className="h2">In drei Schritten zum fertigen Tool.</h2>
          <div className="steps">
            {[
              ["01", "Erstgespräch", "15 Minuten. Wir schauen gemeinsam, wo es im Alltag hakt und was sich lohnt zu bauen."],
              ["02", "Prototyp", "Innerhalb weniger Tage ein klickbarer Entwurf — Sie sehen früh, wohin es geht, kein monatelanges Projekt."],
              ["03", "Ihr Tool", "Fertig gebaut, eingeführt und auf Wunsch weiter betreut. Bezahlt wird pro Projekt, transparent kalkuliert."],
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

      {/* KONTAKT */}
      <section className="kontakt" id="kontakt">
        <div className="wrap kontaktIn">
          <span className="eyebrow" style={{ color: "var(--mint)" }}>Kontakt</span>
          <h2 className="h2 kH">Wo hakt es in Ihrer Kanzlei?</h2>
          <p className="kLede">
            Schreiben Sie mir kurz, welcher Prozess Sie Zeit kostet — ich melde mich mit einer
            ehrlichen Einschätzung, ob und wie sich das automatisieren lässt.
          </p>
          <div className="kBtns">
            <a href="mailto:lukas@codenachmass.de" className="btn btnMint">E-Mail schreiben</a>
            <button type="button" className="copyChip" onClick={copyMail} aria-label="E-Mail-Adresse kopieren">
              <span className="copyMail">lukas@codenachmass.de</span>
              <span className="copyIco">{copied ? "✓ Kopiert" : "kopieren"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap footIn">
          <span className="brand">code nach maß<span className="dot">.</span></span>
          <div className="footLinks">
            <a href="/impressum">Impressum</a>
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

        .demoLede{max-width:720px;margin:16px 0 0;color:var(--muted);font-size:16px}
        .demoFrame{margin-top:30px;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 24px 60px rgba(15,26,36,.12)}
        .demoBar{display:flex;align-items:center;gap:8px;padding:11px 16px;background:var(--ink);border-bottom:1px solid var(--lineD)}
        .dotb{width:10px;height:10px;border-radius:50%;background:#33454F}
        .demoUrl{font-family:var(--mono);font-size:12px;color:var(--mutedD);margin-left:10px}
        .demoBody{padding:14px;background:#EEF1F6}
        .demoNote{margin-top:14px;font-family:var(--mono);font-size:12.5px;color:var(--muted)}

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

        @media (max-width:820px){
          .three,.cards,.steps{grid-template-columns:1fr}
          .hero{padding:72px 0 64px}
          .sec{padding:64px 0}
          .navlinks{gap:16px}
          .navlinks a:not(.navcta){display:none}
        }
      `}</style>
    </main>
  );
}

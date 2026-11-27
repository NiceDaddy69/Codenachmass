"use client";
import Babytakt from "../../components/Babytakt";
import BabytaktLogo from "../../components/BabytaktLogo";

const WA = `https://wa.me/4917663250203?text=${encodeURIComponent("Hi Lukas, ich habe mir das Muster von Babytakt angesehen. ")}`;

export default function MusterBabytakt() {
  return (
    <main>
      <header className="nav">
        <div className="wrap navIn">
          <a href="/" className="brand">code nach maß<span className="dot">.</span></a>
          <a href="/" className="navlink">Wer dahinter steckt →</a>
        </div>
      </header>

      <section className="sec">
        <div className="wrap grid">
          <div>
            <div className="lockup">
              <BabytaktLogo size={52} />
              <div>
                <strong>Babytakt</strong>
                <span className="eyebrow">Muster-Produkt zum Ausprobieren</span>
              </div>
            </div>
            <h1 className="h1">Der Begleiter für Schlaf, Essen und den Familienalltag im ersten Jahr.</h1>
            <p className="lede">
              Ein erster Entwurf, wie ein eigenes Produkt für deine Community aussehen könnte: eine
              kleine App fürs Handy, die Eltern Tag und Nacht wirklich nutzen — nicht noch ein PDF, das
              im Download-Ordner verschwindet. Bindungsorientiert gedacht: begleiten statt trainieren.
              Probier es aus, die Beispielwoche ist schon eingetragen:
            </p>
            <ul className="checks">
              <li><strong>Schlaf:</strong> Schlaf per Knopfdruck festhalten, sehen, wann das nächste Müdigkeitsfenster kommt, und einen Tipp bekommen, der genau jetzt passt — dazu Wochenübersicht und Auswertung</li>
              <li><strong>Essen:</strong> Stillen mit Timer und Seitenwechsel, Fläschchen, Beikost mit „schon probiert“ und Windeln — mit Rhythmus und Durchschnittswerten</li>
              <li><strong>To-dos:</strong> eine gemeinsame Liste für beide Eltern — wer macht was, was ist heute noch offen, was wiederholt sich täglich, und wer hat diese Woche was übernommen</li>
              <li><strong>Tipps:</strong> über 20 Tipps zu Schlaf, Essen und dem Papa-Alltag, passend zum Alter des Babys, zum Merken</li>
              <li><strong>SOS:</strong> Schritt für Schritt durch drei typische Situationen, von „schläft nicht ein“ bis „weint und ist kaum zu beruhigen“</li>
              <li><strong>Baby:</strong> Geburtsdatum einmal eintragen, alles passt sich an — plus Bericht für Hebamme und Kinderarzt per Knopfdruck</li>
            </ul>
            <div className="next">
              <h2>Was daraus mit dir wird</h2>
              <p>
                Das hier ist ein Gerüst mit Beispielinhalten. Im echten Produkt stecken deine
                Erfahrungen, deine Tipps und deine Sprache — und wir lassen die Inhalte fachlich
                gegenlesen, zum Beispiel von einer Hebamme. Dazu kommen Dinge wie die gemeinsame
                Nutzung für beide Eltern, Erinnerungen und kurze Videos von dir.
              </p>
            </div>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn">Schreib mir, was du davon hältst</a>
            <p className="note">Muster zur Veranschaulichung mit Orientierungs- und Beispielwerten. Kein medizinischer Rat. Deine Eingaben werden nur auf deinem Gerät gespeichert und nicht übertragen. Unter „Baby“ kannst du leer starten oder die Beispielwoche wieder laden.</p>
          </div>
          <Babytakt />
        </div>
      </section>

      <footer className="foot">
        <div className="wrap footIn">
          <span>© {new Date().getFullYear()} Lukas Schmitz</span>
          <span><a href="/impressum">Impressum</a> · <a href="/datenschutz">Datenschutz</a></span>
        </div>
      </footer>

      <style jsx>{`
        .nav{background:rgba(251,245,236,.9);border-bottom:1px solid var(--line)}
        .navIn{display:flex;align-items:center;justify-content:space-between;height:62px}
        .brand{font-family:var(--disp);font-weight:700;font-size:18px;letter-spacing:-0.02em}
        .dot{color:var(--accent)}
        .navlink{font-size:14px;font-weight:600;color:var(--accent)}
        .sec{padding:56px 0 72px;background:linear-gradient(180deg,#FFF3E4 0%,var(--paper) 60%)}
        .grid{display:grid;grid-template-columns:1fr 400px;gap:56px;align-items:start}
        .lockup{display:flex;align-items:center;gap:14px}
        .lockup strong{display:block;font-family:var(--disp);font-size:24px;font-weight:700;letter-spacing:-0.02em;line-height:1.1}
        .h1{font-size:clamp(28px,3.6vw,42px);margin-top:18px;text-wrap:balance}
        .lede{margin-top:16px;color:var(--muted);font-size:16.5px;max-width:600px}
        .checks{list-style:none;padding:0;margin:20px 0 0;max-width:600px}
        .checks li{position:relative;padding:7px 0 7px 30px;font-size:15.5px}
        .checks li::before{content:"✓";position:absolute;left:0;top:8px;width:21px;height:21px;border-radius:50%;background:var(--accentSoft);color:var(--accent);font-size:12.5px;font-weight:700;display:grid;place-items:center}
        .checks strong{font-weight:600}
        .next{margin-top:26px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:20px 22px;max-width:600px}
        .next h2{font-size:19px}
        .next p{margin-top:8px;color:var(--muted);font-size:15px}
        .btn{display:inline-flex;margin-top:24px;background:var(--wa);color:#06321A;font-weight:600;font-size:15.5px;padding:14px 22px;border-radius:999px;box-shadow:0 10px 24px rgba(37,211,102,.28)}
        .btn:hover{background:#3BE07A}
        .note{margin-top:16px;font-size:12.5px;color:var(--muted);max-width:600px}
        .foot{border-top:1px solid var(--line);padding:22px 0;font-size:13.5px;color:var(--muted)}
        .footIn{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
        @media (max-width:900px){
          .sec{padding:32px 0 48px}
          .grid{grid-template-columns:1fr;gap:30px}
          .btn{width:100%;justify-content:center}
        }
      `}</style>
    </main>
  );
}

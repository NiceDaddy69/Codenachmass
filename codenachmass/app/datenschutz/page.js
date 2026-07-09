import Link from "next/link";

export const metadata = { title: "Datenschutzerklärung — Code nach Maß", robots: { index: false, follow: true } };

const H2 = { fontSize: 20, marginTop: 34 };
const H3 = { fontSize: 16, marginTop: 20 };
const P = { marginTop: 10, color: "var(--muted)", fontSize: 15, lineHeight: 1.7 };

export default function Datenschutz() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div className="wrap" style={{ maxWidth: 780, paddingTop: 64, paddingBottom: 90 }}>
        <Link href="/" style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--accent)" }}>← zurück</Link>
        <h1 style={{ fontSize: 34, marginTop: 22 }}>Datenschutzerklärung</h1>
        <p style={{ ...P, marginTop: 14 }}>
          Der Schutz Ihrer personenbezogenen Daten ist mir wichtig. Nachfolgend informiere ich Sie
          über die Verarbeitung personenbezogener Daten beim Besuch dieser Website.
        </p>

        <h2 style={H2}>1. Verantwortlicher</h2>
        <p style={P}>
          Lukas Schmitz<br />
          Flinger Straße 41, 40213 Düsseldorf, Deutschland<br />
          E-Mail: <a href="mailto:lukas@codenachmass.de" style={{ color: "var(--accent)" }}>lukas@codenachmass.de</a>
        </p>

        <h2 style={H2}>2. Hosting</h2>
        <p style={P}>
          Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA,
          gehostet. Beim Aufruf der Website verarbeitet Vercel als Auftragsverarbeiter technisch
          erforderliche Daten (siehe Server-Logfiles). Mit Vercel besteht ein Auftragsverarbeitungs­vertrag.
          Da Vercel Daten auch in den USA verarbeiten kann, erfolgt eine Übermittlung in ein Drittland;
          Grundlage hierfür sind die Standardvertragsklauseln der EU-Kommission bzw. ein vergleichbarer
          Angemessenheitsmechanismus. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an einem sicheren und effizienten Betrieb der Website).
        </p>

        <h2 style={H2}>3. Server-Logfiles</h2>
        <p style={P}>
          Beim Aufruf der Website werden automatisch Informationen erfasst, die Ihr Browser übermittelt:
          IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, verwendeter Browser und
          Betriebssystem sowie die zuvor besuchte Seite (Referrer). Diese Daten sind technisch
          erforderlich, um die Website auszuliefern und ihre Stabilität und Sicherheit zu gewährleisten.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Eine Zusammenführung dieser Daten mit anderen
          Datenquellen findet nicht statt.
        </p>

        <h2 style={H2}>4. Schriftarten (lokal gehostet)</h2>
        <p style={P}>
          Diese Website verwendet Schriftarten, die <strong>lokal auf dem Server eingebunden</strong> sind.
          Es besteht dabei <strong>keine Verbindung zu Servern Dritter</strong> (insbesondere nicht zu
          Google Fonts). Beim Laden der Schriften werden keine Daten an Dritte übermittelt.
        </p>

        <h2 style={H2}>5. Cookies & Tracking</h2>
        <p style={P}>
          Diese Website setzt <strong>keine Cookies</strong> zu Analyse- oder Marketingzwecken und
          verwendet <strong>keine Tracking- oder Analyse-Dienste</strong> (z. B. kein Google Analytics).
        </p>

        <h2 style={H2}>6. Interaktive Demo-Tools</h2>
        <p style={P}>
          Die auf dieser Seite eingebetteten Demo-Anwendungen (z. B. Fristentracker, Onboarding-Portal)
          laufen vollständig in Ihrem Browser. Eingaben, die Sie dort vornehmen, werden ausschließlich
          <strong> lokal in Ihrem Browser</strong> gespeichert (localStorage) und <strong>nicht an mich
          oder Dritte übertragen</strong>. Sie können diese Daten jederzeit über die Einstellungen Ihres
          Browsers löschen.
        </p>

        <h2 style={H2}>7. Kontaktaufnahme per E-Mail</h2>
        <p style={P}>
          Wenn Sie mir per E-Mail schreiben, verarbeite ich Ihre Angaben (Name, E-Mail-Adresse, Inhalt
          der Nachricht) zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
          (Anbahnung/Durchführung eines Vertrags) bzw. lit. f DSGVO (berechtigtes Interesse an der
          Beantwortung Ihrer Anfrage). Die Daten werden gelöscht, sobald sie für die Zweckerreichung
          nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
        <p style={P}>
          Der E-Mail-Dienst wird über Zoho (Zoho Corporation) bereitgestellt.
        </p>

        <h2 style={H2}>8. Ihre Rechte</h2>
        <p style={P}>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch
          gegen die Verarbeitung (Art. 21). Zur Ausübung genügt eine formlose Nachricht an die oben
          genannte Adresse.
        </p>
        <p style={P}>
          Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu. Zuständig ist
          u. a. die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.
        </p>

        <h2 style={H2}>9. SSL/TLS-Verschlüsselung</h2>
        <p style={P}>
          Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Eine verschlüsselte
          Verbindung erkennen Sie am „https://" in der Adresszeile Ihres Browsers.
        </p>

        <p style={{ marginTop: 40, fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })} · <Link href="/impressum" style={{ color: "var(--accent)" }}>Impressum</Link>
        </p>
      </div>
    </main>
  );
}

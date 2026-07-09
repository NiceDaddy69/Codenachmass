import Link from "next/link";

export const metadata = { title: "Impressum — Code nach Maß", robots: { index: false, follow: true } };

const H2 = { fontSize: 19, marginTop: 28 };
const P = { marginTop: 10, color: "var(--muted)" };

export default function Impressum() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div className="wrap" style={{ maxWidth: 760, paddingTop: 64, paddingBottom: 80 }}>
        <Link href="/" style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--accent)" }}>← zurück</Link>
        <h1 style={{ fontSize: 34, marginTop: 22 }}>Impressum</h1>

        <h2 style={H2}>Angaben gemäß § 5 DDG</h2>
        <p style={P}>
          Lukas Schmitz<br />
          Flinger Straße 41<br />
          40213 Düsseldorf<br />
          Deutschland
        </p>

        <h2 style={H2}>Kontakt</h2>
        <p style={P}>
          E-Mail: <a href="mailto:lukas@codenachmass.de" style={{ color: "var(--accent)" }}>lukas@codenachmass.de</a>
        </p>

        <h2 style={H2}>Umsatzsteuer</h2>
        <p style={P}>
          Gemäß § 19 UStG (Kleinunternehmerregelung) wird keine Umsatzsteuer berechnet und
          folglich nicht in Rechnungen ausgewiesen.
        </p>

        <h2 style={H2}>Verantwortlich für den Inhalt</h2>
        <p style={P}>Lukas Schmitz, Anschrift wie oben.</p>

        <h2 style={H2}>Haftung für Inhalte</h2>
        <p style={{ ...P, fontSize: 15 }}>
          Die Inhalte dieser Seiten wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als
          Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich.
        </p>

        <h2 style={H2}>Haftung für Links</h2>
        <p style={{ ...P, fontSize: 15 }}>
          Diese Seite enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte ich keinen
          Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
          verantwortlich.
        </p>

        <p style={{ marginTop: 40, fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <Link href="/datenschutz" style={{ color: "var(--accent)" }}>→ Datenschutzerklärung</Link>
        </p>
      </div>
    </main>
  );
}

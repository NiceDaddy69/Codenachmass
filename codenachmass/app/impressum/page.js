import Link from "next/link";

export const metadata = {
  title: "Impressum — Code nach Maß",
  robots: { index: false, follow: true },
};

export default function Impressum() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <div className="wrap" style={{ maxWidth: 760, paddingTop: 64, paddingBottom: 80 }}>
        <Link href="/" style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--accent)" }}>← zurück</Link>
        <h1 style={{ fontSize: 34, marginTop: 22 }}>Impressum</h1>

        <h2 style={{ fontSize: 19, marginTop: 34 }}>Angaben gemäß § 5 DDG (ehem. § 5 TMG)</h2>
        <p style={{ marginTop: 10, color: "var(--muted)" }}>
          Lukas Schmitz<br />
          [Straße und Hausnummer]<br />
          [PLZ] Düsseldorf<br />
          Deutschland
        </p>

        <h2 style={{ fontSize: 19, marginTop: 28 }}>Kontakt</h2>
        <p style={{ marginTop: 10, color: "var(--muted)" }}>
          E-Mail: <a href="mailto:lukas@codenachmass.de" style={{ color: "var(--accent)" }}>lukas@codenachmass.de</a><br />
          Telefon: [optional]
        </p>

        <h2 style={{ fontSize: 19, marginTop: 28 }}>Umsatzsteuer</h2>
        <p style={{ marginTop: 10, color: "var(--muted)" }}>
          Als Kleinunternehmer im Sinne von § 19 UStG wird keine Umsatzsteuer ausgewiesen.
          [Falls nicht zutreffend: USt-IdNr. hier eintragen.]
        </p>

        <h2 style={{ fontSize: 19, marginTop: 28 }}>Verantwortlich für den Inhalt</h2>
        <p style={{ marginTop: 10, color: "var(--muted)" }}>Lukas Schmitz (Anschrift wie oben)</p>

        <h2 style={{ fontSize: 19, marginTop: 28 }}>Haftung für Inhalte</h2>
        <p style={{ marginTop: 10, color: "var(--muted)", fontSize: 15 }}>
          Die Inhalte dieser Seiten wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
          Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach
          den allgemeinen Gesetzen verantwortlich.
        </p>

        <p style={{ marginTop: 40, fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          Hinweis: Die Platzhalter in eckigen Klammern vor Veröffentlichung ausfüllen. Ein Impressum
          mit ladungsfähiger Anschrift ist für geschäftsmäßige Websites in Deutschland Pflicht.
        </p>
      </div>
    </main>
  );
}

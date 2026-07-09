import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://codenachmass.de"),
  title: "Code nach Maß — Individuelle Software für Steuerkanzleien",
  description:
    "Individuelle Softwareentwicklung für Steuerkanzleien. Interne Tools, Automatisierung und Fristenkontrolle — passgenau auf Ihren Arbeitsablauf. Gebaut mit Hintergrund in der Wirtschaftsprüfung.",
  keywords: ["Softwareentwicklung", "Steuerkanzlei", "Fristenmanagement", "individuelle Software", "Kanzlei-Tools"],
  openGraph: {
    title: "Code nach Maß — Individuelle Software für Steuerkanzleien",
    description: "Interne Tools, Automatisierung und Fristenkontrolle — passgenau auf Ihren Arbeitsablauf.",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

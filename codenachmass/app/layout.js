import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import StyledJsxRegistry from "./StyledJsxRegistry";

export const metadata = {
  metadataBase: new URL("https://codenachmass.de"),
  title: "Code nach Maß — Dein eigenes digitales Produkt für deine Community",
  description:
    "Für Creator mit 10.000 bis 100.000 Followern: Ich entwickle ein digitales Produkt, das genau zu deiner Community passt — ohne Kosten für dich, komplett hands-off. Den Gewinn teilen wir 50/50.",
  keywords: ["digitale Produkte", "Mikro-Influencer", "Creator", "Community monetarisieren", "E-Book", "Online-Kurs", "Vorlagen"],
  openGraph: {
    title: "Code nach Maß — Dein eigenes digitales Produkt für deine Community",
    description: "Ich baue das Produkt, du kennst deine Community. 0 € Kosten für dich, 50/50 beim Gewinn.",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}

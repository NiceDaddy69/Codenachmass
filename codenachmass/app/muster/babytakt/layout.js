export const metadata = {
  title: "Muster: Babytakt — Code nach Maß",
  description: "Ein Muster-Produkt zum Ausprobieren: Schlaf- und Ess-Tracker mit passenden Tipps, Soforthilfe und Bericht für Eltern im ersten Jahr.",
  robots: { index: false, follow: false },
  icons: { icon: "/babytakt-icon.svg", apple: "/babytakt-180.png" },
  manifest: "/babytakt.webmanifest",
  appleWebApp: { capable: true, title: "Babytakt", statusBarStyle: "default" },
};

export default function Layout({ children }) {
  return children;
}

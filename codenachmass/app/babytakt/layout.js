export const metadata = {
  title: "Babytakt",
  description: "Schlaf, Essen und To-dos für Eltern im ersten Jahr – Muster von Code nach Maß.",
  robots: { index: false, follow: false },
  icons: { icon: "/babytakt-icon.svg", apple: "/babytakt-180.png" },
  manifest: "/babytakt.webmanifest",
  appleWebApp: { capable: true, title: "Babytakt", statusBarStyle: "default" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4655A8",
};

export default function Layout({ children }) {
  return children;
}

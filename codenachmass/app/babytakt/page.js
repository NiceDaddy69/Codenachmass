import AppClient from "./AppClient";

// Babytakt als eigenständige App – ohne Einleitung, bildschirmfüllend.
// Personalisierung über ?fuer=kanalname; die App-Beschreibung für den
// Startbildschirm übernimmt den Namen in ihre Startadresse.
const clean = (v) => (typeof v === "string" ? v.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 30) : "");

export function generateMetadata({ searchParams }) {
  const fuer = clean(searchParams?.fuer);
  return { manifest: fuer ? `/babytakt-manifest?fuer=${encodeURIComponent(fuer)}` : "/babytakt-manifest" };
}

export default function BabytaktApp({ searchParams }) {
  const fuer = clean(searchParams?.fuer) || null;
  return <AppClient fuer={fuer} />;
}

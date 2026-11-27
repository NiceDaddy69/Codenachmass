// App-Beschreibung (Web-Manifest) für Babytakt, passend zum Kanalnamen.
// Die Startadresse enthält ?fuer=…, damit „mit [Kanalname]“ auch beim Start
// vom Startbildschirm erscheint – dort fehlt sonst der Zusatz aus dem Link.
export const dynamic = "force-dynamic";

const clean = (v) => (v || "").replace(/[^A-Za-z0-9ÄÖÜäöüß ._-]/g, "").replace(/\s+/g, " ").trim().slice(0, 30);

export function GET(request) {
  const fuer = clean(new URL(request.url).searchParams.get("fuer"));
  const start = fuer ? `/babytakt?fuer=${encodeURIComponent(fuer)}` : "/babytakt";
  const manifest = {
    id: start,
    name: "Babytakt",
    short_name: "Babytakt",
    description: "Schlaf, Essen und To-dos für Eltern im ersten Jahr.",
    start_url: start,
    scope: "/babytakt",
    display: "standalone",
    background_color: "#D2477A",
    theme_color: "#4655A8",
    icons: [
      { src: "/babytakt-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/babytakt-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "content-type": "application/manifest+json; charset=utf-8", "cache-control": "no-store" },
  });
}

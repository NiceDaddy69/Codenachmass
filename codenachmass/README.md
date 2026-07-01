# codenachmass.de — Landingpage

Next.js 14 (App Router). Eine Seite + eingebetteter Fristentracker als Live-Demo + Impressum.

## Vor dem Livegang
1. **Impressum ausfüllen:** In `app/impressum/page.js` die `[Platzhalter]` (Anschrift, ggf. Telefon/USt) ersetzen. Ladungsfähige Anschrift ist Pflicht.
2. **EY-Vertrag:** Öffentliche Nebentätigkeit berührt Ziffer 2.3 (Zustimmung in Textform). Vor Livegang kurz mit RA Selhorst abstimmen — besonders während der laufenden Exit-Verhandlung.

## Deploy (wie bei Hybridstate)
1. Ordner komplett auf GitHub hochladen (ganzes Verzeichnis in einem Rutsch).
2. In Vercel: neues Projekt → Repo wählen → Framework "Next.js" (automatisch) → Deploy.
3. Domain `codenachmass.de` in Vercel unter Settings → Domains verbinden.

## Lokal testen
    npm install
    npm run dev      # http://localhost:3000

## Anpassen
- Texte/Design: `app/page.js` (+ `app/globals.css`)
- Demo-Tool: `app/components/Fristentracker.jsx`

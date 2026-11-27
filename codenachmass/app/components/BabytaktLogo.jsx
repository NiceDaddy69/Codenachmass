import { useId } from "react";

// Logo von Babytakt: Mond (Schlaf) mit Herz (Nähe) auf einem Verlauf von Tag zu Nacht.
export default function BabytaktLogo({ size = 32, title = "Babytakt" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={title} style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF9A62" />
          <stop offset="0.5" stopColor="#D2477A" />
          <stop offset="1" stopColor="#3F4BA6" />
        </linearGradient>
        <mask id={`m${id}`}>
          <rect width="64" height="64" fill="#fff" />
          <circle cx="40" cy="24" r="14.5" fill="#000" />
        </mask>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#g${id})`} />
      <circle cx="29" cy="34" r="19" fill="#fff" mask={`url(#m${id})`} />
      <path transform="translate(37 17.4) scale(0.72)" fill="#fff" d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" />
    </svg>
  );
}

import Babytakt from "../components/Babytakt";

// Babytakt als eigenständige App – ohne Einleitung, bildschirmfüllend.
// Personalisierung wie im Muster über ?fuer=kanalname.
export default function BabytaktApp() {
  return (
    <main style={{ minHeight: "100dvh", background: "#F3F1F6", display: "flow-root" }}>
      <Babytakt fullscreen />
    </main>
  );
}

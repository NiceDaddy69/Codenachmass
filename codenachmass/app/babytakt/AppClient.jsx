"use client";
import Babytakt from "../components/Babytakt";

export default function AppClient({ fuer }) {
  return (
    <main style={{ minHeight: "100dvh", background: "#F3F1F6", display: "flow-root" }}>
      <Babytakt fullscreen initialName={fuer} />
    </main>
  );
}

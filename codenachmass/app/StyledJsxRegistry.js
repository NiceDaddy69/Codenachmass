"use client";
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

// Sorgt dafür, dass die <style jsx>-Stile schon im ausgelieferten HTML stehen.
// Ohne das erscheinen Seiten beim Laden kurz ungestaltet, bis der Browser sie nachlädt.
export default function StyledJsxRegistry({ children }) {
  const [registry] = useState(() => createStyleRegistry());
  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });
  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}

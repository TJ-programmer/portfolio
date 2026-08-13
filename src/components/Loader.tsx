"use client";

import { useEffect, useState } from "react";
import { BatIcon } from "./icons";

export function Loader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("leaving"), 1500);
    const t2 = setTimeout(() => setPhase("done"), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`loader ${phase === "leaving" ? "loader-leave" : ""}`} aria-hidden="true">
      <div className="loader-mark">
        <BatIcon size={44} />
      </div>
      <div className="loader-label">INITIALIZING GOTHAM</div>
    </div>
  );
}

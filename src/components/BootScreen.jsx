import React, { useEffect, useRef, useState } from "react";
import { site } from "../libs/data";

const BootScreen = () => {
  const [phase, setPhase] = useState("in");
  const [gone, setGone] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    timers.current = [
      setTimeout(() => setPhase("out"), 1900),
      setTimeout(() => setGone(true), 2350),
    ];
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const skip = () => {
    if (phase !== "in") return;
    timers.current.forEach(clearTimeout);
    setPhase("out");
    timers.current = [setTimeout(() => setGone(true), 420)];
  };

  if (gone) return null;

  return (
    <div
      role="presentation"
      onClick={skip}
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-[#03050b] px-6 ${
        phase === "out" ? "boot-exit" : ""
      }`}
    >
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 crt-vignette opacity-80" aria-hidden="true" />

      <div className="relative w-full max-w-[520px]">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="font-arcade text-[13px] text-[var(--accent)]">
            PXL-BIOS
          </span>
          <span className="font-mono text-[10px] text-white/30">v2.6 · 64k ok</span>
        </div>

        <div className="space-y-1.5 font-mono text-[11.5px] leading-relaxed text-lime-200/80">
          {site.boot.lines.map((line, index) => (
            <p
              key={line}
              className="animate-[fade-in_240ms_ease_both]"
              style={{ animationDelay: `${180 + index * 240}ms` }}
            >
              <span className="mr-2 text-white/25">$</span>
              {line}
            </p>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="font-arcade text-[9px] text-white/40">loading</span>
          <span className="relative h-[6px] flex-1 overflow-hidden border border-white/15 bg-white/5">
            <span
              className="boot-bar block h-full origin-left bg-[var(--accent)]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--accent) 0 6px, transparent 6px 9px)",
                boxShadow: "0 0 12px var(--accent)",
              }}
            />
          </span>
        </div>

        <p className="mt-4 flex items-center gap-2 font-mono text-[10px] text-white/35">
          <span className="blink inline-block h-2.5 w-1.5 bg-[var(--accent)]" aria-hidden="true" />
          {site.boot.hint}
        </p>
      </div>
    </div>
  );
};

export default BootScreen;

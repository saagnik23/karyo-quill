import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Zap, Clock } from "lucide-react";

export function TopBar() {
  const [sessionSecs, setSessionSecs] = useState(135); // Start at 02:15

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, "0");
    const secs = (totalSecs % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <header data-testid="top-bar" className="quill-app-header no-print">
      {/* Left side: Brand Logo + Status Badge */}
      <div className="flex items-center gap-5">
        <span
          data-testid="quill-wordmark"
          className="font-bold tracking-tight text-white flex items-center gap-2 select-none"
          style={{ fontSize: 24, letterSpacing: "-0.03em" }}
        >
          Karyo-Quill <span className="text-[var(--quill-accent)]">🪶</span>
        </span>

        {/* AI Connected Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] select-none">
          <span className="relative flex h-2 w-2">
            <span className="pulse-green-dot absolute inline-flex h-full w-full rounded-full bg-[var(--quill-green)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--quill-green)]"></span>
          </span>
          <span className="text-[11px] font-semibold text-[var(--quill-green)] tracking-wider uppercase">
            AI Connected
          </span>
        </div>
      </div>

      {/* Middle side: Session Stats (Model, Latency, Timer) */}
      <div className="hidden md:flex items-center gap-6 text-[13px] text-[var(--quill-body)] font-medium bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 shadow-inner select-none">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--quill-accent)]" />
          <span>Model: <strong className="text-white">GPT Medical</strong></span>
        </div>
        <span className="w-1 h-1 rounded-full bg-white/15" />
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>Latency: <strong className="text-white">120ms</strong></span>
        </div>
        <span className="w-1 h-1 rounded-full bg-white/15" />
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--quill-accent)] animate-pulse" />
          <span>Session Time: <strong className="text-white font-mono">{formatSessionTime(sessionSecs)}</strong></span>
        </div>
      </div>

      {/* Right side: Doctor Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[14px] font-semibold text-white leading-tight">Dr. A. Mehta</p>
          <p className="text-[11px] text-[var(--quill-muted)] font-medium">Chief Medical Scribe</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--quill-accent)] to-[#7DD3FC] p-[1.5px] shadow-lg shadow-[var(--quill-accent)]/15">
          <div className="w-full h-full rounded-full bg-[#0B1220] flex items-center justify-center">
            <span className="text-[13.5px] font-bold text-white tracking-wide">AM</span>
          </div>
        </div>
      </div>
    </header>
  );
}

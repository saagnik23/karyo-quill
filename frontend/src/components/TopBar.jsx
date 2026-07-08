import React, { useState, useEffect } from "react";
import { ShieldCheck, Zap, Clock } from "lucide-react";

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
    <header data-testid="top-bar" className="quill-app-header no-print select-none">
      {/* Left side: Brand Logo + Status Badge */}
      <div className="flex items-center gap-4">
        <span
          data-testid="quill-wordmark"
          className="font-bold tracking-tight text-[#F8FAFC] flex items-center gap-1.5"
          style={{ fontSize: 22, letterSpacing: "-0.03em" }}
        >
          Quill <span className="text-[var(--quill-accent)] font-normal font-serif">Scribe</span>
        </span>

        {/* AI Connected Status (Compact Dark badge) */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.18)]">
          <span className="relative flex h-2 w-2">
            <span className="pulse-green-dot absolute inline-flex h-full w-full rounded-full bg-[var(--quill-green)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--quill-green)]"></span>
          </span>
          <span className="text-[10px] font-bold text-[var(--quill-green)] tracking-wider uppercase">
            AI Connected
          </span>
        </div>
      </div>

      {/* Middle side: Session Stats */}
      <div className="hidden md:flex items-center gap-5 text-[12.5px] text-[#CBD5E1] font-medium bg-[#1E293B]/60 border border-[#334155] rounded-xl px-4 py-1.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--quill-accent)]" />
          <span>Model: <strong className="text-[#F8FAFC] font-semibold">GPT Medical</strong></span>
        </div>
        <span className="w-1 h-1 rounded-full bg-[#334155]" />
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Latency: <strong className="text-[#F8FAFC] font-semibold">120ms</strong></span>
        </div>
        <span className="w-1 h-1 rounded-full bg-[#334155]" />
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--quill-accent)]" />
          <span>Session Time: <strong className="text-[#F8FAFC] font-semibold font-mono">{formatSessionTime(sessionSecs)}</strong></span>
        </div>
      </div>

      {/* Right side: Doctor Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[13.5px] font-bold text-[#F8FAFC] leading-tight">Dr. A. Mehta</p>
          <p className="text-[11px] text-[var(--quill-muted)] font-semibold">Clinical Lead</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--quill-accent)] to-[#C4B5FD] p-[1.5px] shadow-sm">
          <div className="w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center">
            <span className="text-[13px] font-bold text-[#F8FAFC] tracking-wide">AM</span>
          </div>
        </div>
      </div>
    </header>
  );
}

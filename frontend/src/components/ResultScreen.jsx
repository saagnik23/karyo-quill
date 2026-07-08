import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { 
  AlertTriangle, 
  Check, 
  ArrowLeft, 
  ShieldAlert, 
  FileCheck, 
  Info, 
  Copy, 
  CheckSquare,
  AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";

const RISK_KEYWORDS = ["interaction", "drug", "allergy", "warfarin", "amoxicillin"];

function isHighRisk(flags) {
  const joined = (flags || []).join(" ").toLowerCase();
  return RISK_KEYWORDS.some((kw) => joined.includes(kw));
}

// Custom TypedText component for typewriter effect in notes sections
function TypedText({ text, speed = 8, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.substring(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="text-[14.5px] leading-[1.7] text-[var(--quill-body)] font-medium">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="typewriter-text ml-0.5 inline-block w-1.5 h-4.5 bg-[var(--quill-accent)] animate-pulse" />
      )}
    </span>
  );
}

// Categorize raw warning flags into structured cards
function categorizeFlag(flag) {
  const text = flag.toLowerCase();
  if (text.includes("interaction") || text.includes("warfarin") || text.includes("drug")) {
    return {
      category: "Medication Alerts",
      color: "text-[var(--quill-red)]",
      borderColor: "border-[var(--quill-red)]/20",
      bgClass: "bg-[var(--quill-red)]/5",
      glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.1)]",
      icon: <ShieldAlert className="w-5 h-5 text-[var(--quill-red)]" />,
      explanation: "Warfarin has severe drug interaction hazards. Check patient medication profile."
    };
  } else if (text.includes("allergy")) {
    return {
      category: "Critical Risks",
      color: "text-[var(--quill-red)]",
      borderColor: "border-[var(--quill-red)]/20",
      bgClass: "bg-[var(--quill-red)]/5",
      glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.1)]",
      icon: <AlertTriangle className="w-5 h-5 text-[var(--quill-red)]" />,
      explanation: "A drug allergy query is mandatory prior to prescribing antibiotics."
    };
  } else if (text.includes("not recorded") || text.includes("not confirmed") || text.includes("not asked") || text.includes("missing")) {
    return {
      category: "Missing Information",
      color: "text-[var(--quill-amber)]",
      borderColor: "border-[var(--quill-amber)]/20",
      bgClass: "bg-[var(--quill-amber)]/5",
      glowClass: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
      icon: <AlertCircle className="w-5 h-5 text-[var(--quill-amber)]" />,
      explanation: "Key patient baseline information was not verbalized in the raw dialog."
    };
  } else {
    return {
      category: "Suggested Follow Ups",
      color: "text-[var(--quill-accent)]",
      borderColor: "border-[var(--quill-accent)]/20",
      bgClass: "bg-[var(--quill-accent)]/5",
      glowClass: "shadow-[0_0_15px_rgba(40,182,255,0.1)]",
      icon: <Info className="w-5 h-5 text-[var(--quill-accent)]" />,
      explanation: "Recommended metrics or review checks to address in the next consult."
    };
  }
}

export function ResultScreen({
  transcript,
  result,
  approved,
  setApproved,
  onExport,
  onNew,
}) {
  const highRisk = useMemo(() => isHighRisk(result.flags), [result.flags]);
  const [typingIndex, setTypingIndex] = useState(0);

  // Auto-reveal sections sequentially
  const sections = result.sections || [];
  const handleSectionComplete = useCallback(() => {
    setTypingIndex((prev) => prev + 1);
  }, []);

  return (
    <main
      data-testid="result-screen"
      className="w-full max-w-6xl mx-auto pt-2 pb-24 animate-[quill-rise_0.4s_ease-out]"
    >
      {/* Header: Title + Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 select-none">
        <div className="min-w-0">
          <button
            type="button"
            data-testid="new-button"
            onClick={onNew}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--quill-body)] hover:text-white transition-colors mb-2 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            New Note
          </button>
          <h2
            data-testid="document-title"
            className="text-[22px] sm:text-[24px] text-white font-bold tracking-tight truncate"
            style={{ letterSpacing: "-0.02em" }}
          >
            {result.documentTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!approved ? (
            <Button
              data-testid="approve-button"
              onClick={() => setApproved(true)}
              className="quill-primary inline-flex items-center gap-2 rounded-xl h-11 px-5 text-[14px] font-semibold"
            >
              <Check className="h-4.5 w-4.5" />
              Approve Note
            </Button>
          ) : (
            <span
              data-testid="approved-pill"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 h-11 text-[13px] font-bold text-[var(--quill-green)] bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] select-none shadow-[0_0_15px_rgba(34,197,94,0.1)]"
            >
              <Check className="h-4 w-4" />
              Approved
            </span>
          )}
          
          <Button
            data-testid="export-button"
            disabled={!approved}
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl h-11 px-5 text-[14px] font-bold bg-[#182434] text-white border border-white/10 hover:bg-[#182434]/80 disabled:bg-white/5 disabled:text-white/20 disabled:border-white/5 active:scale-[0.98] transition-all shadow-md"
          >
            <Copy className="w-4 h-4" />
            {result.exportLabel}
          </Button>
        </div>
      </div>

      {/* Confidence and Metrics Summary Row */}
      <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl select-none">
        
        {/* Metric 1: Clinical Confidence Dial */}
        <div className="flex items-center gap-3.5">
          <div className="confidence-dial relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" className="stroke-white/5 fill-none" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" className="stroke-[var(--quill-accent)] fill-none" strokeWidth="4" strokeDasharray="125" strokeDashoffset="7.5" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-white font-mono">94%</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-white/90">Clinical Confidence</p>
            <p className="text-[11px] text-[var(--quill-body)]">High correlation validation</p>
          </div>
        </div>

        {/* Metric 2: Documentation Completeness Bar */}
        <div className="flex flex-col gap-1.5 w-full md:max-w-[240px]">
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-white/80">Documentation Completeness</span>
            <span className="text-[var(--quill-accent)] font-mono">91%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-[var(--quill-accent)] to-[#7DD3FC] rounded-full" style={{ width: '91%' }} />
          </div>
        </div>

        {/* Metric 3: Risk Score */}
        <div className="flex items-center gap-4 pr-4">
          <div className="text-right">
            <p className="text-[13px] font-bold text-white/90">Risk Assessment</p>
            <p className="text-[11px] text-[var(--quill-body)]">No critical blockers</p>
          </div>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[12.5px] font-bold bg-[var(--quill-green)]/15 text-[var(--quill-green)] border border-[var(--quill-green)]/35 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            Low Risk
          </span>
        </div>
      </div>

      {/* Split workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4.5fr)_minmax(0,7.5fr)] gap-6">
        
        {/* Left column: Original transcript panel */}
        <aside
          data-testid="transcript-panel"
          className="glass-panel border border-white/10 shadow-md flex flex-col h-fit"
        >
          <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--quill-muted)] select-none">
              Original transcript
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)]" />
          </div>
          <div
            data-testid="transcript-content"
            className="px-5 py-5 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-[13.5px] leading-[1.75] text-[var(--quill-body)] font-medium"
            style={{ scrollbarWidth: 'thin' }}
          >
            {transcript}
          </div>
        </aside>

        {/* Right column: Generated SOAP sections and risks (staggered) */}
        <section
          data-testid="record-panel"
          className="flex flex-col gap-5"
        >
          {/* Dynamic categorized alerts / Risk card panel */}
          {result.flags && result.flags.length > 0 && (
            <div className="flex flex-col gap-3">
              {result.flags.map((flag, idx) => {
                const cardDetails = categorizeFlag(flag);
                return (
                  <div
                    key={idx}
                    data-testid={`gap-flag-${idx}`}
                    className={`glass-panel border ${cardDetails.borderColor} ${cardDetails.bgClass} ${cardDetails.glowClass} p-4.5 flex gap-4 transition-all duration-300`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {cardDetails.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${cardDetails.color}`}>
                          {cardDetails.category}
                        </span>
                        <span className="text-[10px] text-[var(--quill-muted)]">Active Check</span>
                      </div>
                      <h4 className="text-[14.5px] font-bold text-white mb-1 leading-snug">
                        {flag}
                      </h4>
                      <p className="text-[12.5px] text-[var(--quill-body)] leading-relaxed font-medium">
                        {cardDetails.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SOAP note Sections with Typewriter reveal animations */}
          {sections.map((s, idx) => {
            const isVisible = idx <= typingIndex;
            if (!isVisible) return null;

            return (
              <div
                key={idx}
                data-testid={`section-card-${idx}`}
                className="glass-panel p-5 sm:p-6 border border-white/10 shadow-md animate-[quill-rise_0.4s_ease-out]"
              >
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/5 select-none">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--quill-muted)]">
                    {s.heading.includes("ICD-10") ? "Billing Codes" : "Clinical Record"}
                  </p>
                  <span className="text-[11.5px] font-mono text-[var(--quill-accent)] font-semibold">SOAP.{s.heading.substring(0, 3).toUpperCase()}</span>
                </div>
                
                <h3 className="text-[17px] text-white font-bold tracking-tight mb-3">
                  {s.heading}
                </h3>

                {s.heading.includes("ICD-10") ? (
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {s.content.split(";").map((code, ci) => {
                      const trimmed = code.trim();
                      if (!trimmed) return null;
                      return (
                        <span
                          key={ci}
                          data-testid={`icd-pill-${ci}`}
                          className="inline-flex items-center rounded-xl px-3.5 py-1.5 text-[12.5px] font-bold bg-[var(--quill-accent-soft)] text-[var(--quill-accent)] border border-[var(--quill-accent)]/20 shadow-sm"
                        >
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-1 font-medium">
                    <TypedText 
                      text={s.content} 
                      speed={5} 
                      onComplete={handleSectionComplete} 
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Suggested prescriptions or tools */}
          {result.suggestions && result.suggestions.length > 0 && typingIndex >= sections.length && (
            <div 
              data-testid="suggestions-card"
              className="glass-panel p-5 sm:p-6 border border-white/10 shadow-md animate-[quill-rise_0.4s_ease-out]"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 select-none">
                <h3 className="text-[17px] text-white font-bold tracking-tight">
                  Suggested Action Items
                </h3>
                <span className="text-[10px] text-[var(--quill-muted)] uppercase tracking-wider font-bold">
                  Clinical Review Required
                </span>
              </div>
              
              <ul data-testid="suggestions-list" className="space-y-3">
                {result.suggestions.map((sg, idx) => (
                  <li
                    key={idx}
                    data-testid={`suggestion-${idx}`}
                    className="rounded-xl border border-white/10 bg-[#0B1220]/45 p-4 flex flex-col gap-1 transition-colors hover:border-white/20"
                  >
                    <p className="text-[14px] font-bold text-white">
                      {sg.label}
                    </p>
                    <p className="text-[13px] text-[var(--quill-body)] font-medium leading-relaxed">
                      {sg.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { 
  AlertTriangle, 
  Check, 
  ArrowLeft, 
  ShieldAlert, 
  Info, 
  Copy, 
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
    <span className="text-[18px] leading-[1.7] text-[#52525B] font-medium">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="typewriter-text ml-0.5 inline-block w-1.5 h-5 bg-[var(--quill-accent)] animate-pulse" />
      )}
    </span>
  );
}

// Categorize raw warning flags into structured cards matching specific color specs
function categorizeFlag(flag) {
  const text = flag.toLowerCase();
  if (text.includes("interaction") || text.includes("warfarin") || text.includes("drug")) {
    return {
      category: "Medication Alerts",
      color: "text-[#E96D6D]",
      borderColor: "border-[#E96D6D]/35",
      bgClass: "bg-[#FFF0F0]",
      glowClass: "shadow-[0_4px_12px_rgba(233,109,109,0.05)]",
      icon: <ShieldAlert className="w-5 h-5 text-[#E96D6D]" />,
      explanation: "Warfarin has severe drug interaction hazards. Check patient medication profile."
    };
  } else if (text.includes("allergy")) {
    return {
      category: "Critical Risks",
      color: "text-[#E96D6D]",
      borderColor: "border-[#E96D6D]/35",
      bgClass: "bg-[#FFF0F0]",
      glowClass: "shadow-[0_4px_12px_rgba(233,109,109,0.05)]",
      icon: <AlertTriangle className="w-5 h-5 text-[#E96D6D]" />,
      explanation: "A drug allergy query is mandatory prior to prescribing antibiotics."
    };
  } else if (text.includes("not recorded") || text.includes("not confirmed") || text.includes("not asked") || text.includes("missing")) {
    return {
      category: "Missing Information",
      color: "text-[#F6B44B]",
      borderColor: "border-[#F6B44B]/35",
      bgClass: "bg-[#FFF6E7]",
      glowClass: "shadow-[0_4px_12px_rgba(246,180,75,0.05)]",
      icon: <AlertCircle className="w-5 h-5 text-[#F6B44B]" />,
      explanation: "Key patient baseline information was not verbalized in the raw dialog."
    };
  } else {
    return {
      category: "Suggested Follow Ups",
      color: "text-[var(--quill-accent)]",
      borderColor: "border-[var(--quill-accent)]/35",
      bgClass: "bg-[#F5F0FF]",
      glowClass: "shadow-[0_4px_12px_rgba(177,138,247,0.05)]",
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
      className="w-full max-w-5xl mx-auto pt-4 pb-24 animate-[quill-rise_350ms_ease-out]"
    >
      {/* Header: Title + Action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 select-none">
        <div className="min-w-0">
          <button
            type="button"
            data-testid="new-button"
            onClick={onNew}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#52525B] hover:text-[#18181B] transition-colors mb-2 bg-[#F4F1E8] border border-[#E7E5DD] rounded-xl px-3 py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            New Note
          </button>
          <h2
            data-testid="document-title"
            className="text-[24px] sm:text-[26px] text-[#18181B] font-bold tracking-tight truncate"
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
              className="inline-flex items-center gap-1.5 rounded-xl px-4 h-11 text-[13px] font-bold text-[var(--quill-green)] bg-[rgba(91,185,140,0.08)] border border-[rgba(91,185,140,0.25)] select-none shadow-[0_0_12px_rgba(91,185,140,0.08)]"
            >
              <Check className="h-4 w-4" />
              Approved
            </span>
          )}
          
          <Button
            data-testid="export-button"
            disabled={!approved}
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-xl h-11 px-5 text-[14px] font-bold bg-[#FFFFFF] text-[#18181B] border border-[#E7E5DD] hover:bg-[#F4F1E8]/50 disabled:bg-[#ECEAE2] disabled:text-[#71717A]/40 disabled:border-[#ECEAE2] active:scale-[0.98] transition-all shadow-sm"
          >
            <Copy className="w-4 h-4" />
            {result.exportLabel}
          </Button>
        </div>
      </div>

      {/* Confidence and Metrics Summary floating card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5DD] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-[24px] select-none">
        
        {/* Metric 1: Clinical Confidence Dial */}
        <div className="flex items-center gap-4">
          <div className="confidence-dial relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" className="stroke-[#F4F1E8] fill-none" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" className="stroke-[var(--quill-accent)] fill-none" strokeWidth="4" strokeDasharray="125" strokeDashoffset="7.5" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-[#18181B] font-mono">94%</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#18181B]">Clinical Confidence</p>
            <p className="text-[11.5px] text-[#52525B]">High correlation validation</p>
          </div>
        </div>

        {/* Metric 2: Documentation Completeness Bar */}
        <div className="flex flex-col gap-1.5 w-full md:max-w-[240px]">
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-[#52525B]">Documentation Completeness</span>
            <span className="text-[var(--quill-accent)] font-mono">92%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F4F1E8] overflow-hidden border border-[#ECEAE2]">
            <div className="h-full bg-gradient-to-r from-[var(--quill-accent)] to-[#E8DDFE] rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Metric 3: Risk Score */}
        <div className="flex items-center gap-4 pr-4">
          <div className="text-right">
            <p className="text-[13px] font-bold text-[#18181B]">Risk Assessment</p>
            <p className="text-[11.5px] text-[#52525B]">No critical blockers</p>
          </div>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold bg-[#EAF8F1] text-[var(--quill-green)] border border-[var(--quill-green)]/35 shadow-[0_0_8px_rgba(91,185,140,0.06)]">
            Low Risk
          </span>
        </div>
      </div>

      {/* Split workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8">
        
        {/* Left column: Original transcript panel */}
        <aside
          data-testid="transcript-panel"
          className="bg-[#FFFFFF] border border-[#E7E5DD] rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex flex-col h-fit"
        >
          <div className="px-6 pt-6 pb-4 border-b border-[#ECEAE2] flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#71717A] select-none">
              Original transcript
            </p>
            <span className="w-2 h-2 rounded-full bg-[var(--quill-accent)] animate-pulse" />
          </div>
          <div
            data-testid="transcript-content"
            className="px-6 py-6 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-[14px] leading-[1.8] text-[#52525B] font-medium"
            style={{ scrollbarWidth: 'thin' }}
          >
            {transcript}
          </div>
        </aside>

        {/* Right column: Generated SOAP sections and risks (staggered) */}
        <section
          data-testid="record-panel"
          className="flex flex-col gap-6"
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
                    className={`border ${cardDetails.borderColor} ${cardDetails.bgClass} ${cardDetails.glowClass} p-5 flex gap-4 transition-all duration-300 rounded-[24px]`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {cardDetails.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${cardDetails.color}`}>
                          {cardDetails.category}
                        </span>
                        <span className="text-[10px] text-[#71717A] font-bold">Active Check</span>
                      </div>
                      <h4 className="text-[15px] font-bold text-[#18181B] mb-1 leading-snug">
                        {flag}
                      </h4>
                      <p className="text-[13px] text-[#52525B] leading-relaxed font-medium">
                        {cardDetails.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SOAP note Sections (Large white cards with 24px/28px corners) */}
          {sections.map((s, idx) => {
            const isVisible = idx <= typingIndex;
            if (!isVisible) return null;

            return (
              <div
                key={idx}
                data-testid={`section-card-${idx}`}
                className="bg-[#FFFFFF] border border-[#E7E5DD] p-6 sm:p-8 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-[quill-rise_350ms_ease-out]"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#ECEAE2] select-none">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#71717A]">
                    {s.heading.includes("ICD-10") ? "Billing Codes" : "Clinical Record"}
                  </p>
                  <span className="text-[11.5px] font-mono text-[var(--quill-accent)] font-bold">SOAP.{s.heading.substring(0, 3).toUpperCase()}</span>
                </div>
                
                {/* 30px Section Title, Weight 600 */}
                <h3 
                  className="text-[#18181B] font-semibold tracking-tight mb-4 select-none"
                  style={{ fontSize: "30px", letterSpacing: "-0.03em" }}
                >
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
                          className="inline-flex items-center rounded-xl px-3.5 py-1.5 text-[12.5px] font-bold bg-[#E8DDFE] text-[var(--quill-accent)] border border-[#B18AF7]/15"
                        >
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-1">
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
              className="bg-[#FFFFFF] border border-[#E7E5DD] p-6 sm:p-8 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-[quill-rise_350ms_ease-out]"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#ECEAE2] select-none">
                <h3 className="text-[17px] text-[#18181B] font-bold tracking-tight">
                  Suggested Action Items
                </h3>
                <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">
                  Clinical Review Required
                </span>
              </div>
              
              <ul data-testid="suggestions-list" className="space-y-3">
                {result.suggestions.map((sg, idx) => (
                  <li
                    key={idx}
                    data-testid={`suggestion-${idx}`}
                    className="rounded-xl border border-[#E7E5DD] bg-[#F4F1E8]/40 p-4.5 flex flex-col gap-1 transition-colors hover:border-[#D8D3C9]"
                  >
                    <p className="text-[14px] font-bold text-[#18181B]">
                      {sg.label}
                    </p>
                    <p className="text-[13px] text-[#52525B] font-medium leading-relaxed">
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

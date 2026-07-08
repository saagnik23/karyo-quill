import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

const STAGES = [
  "Listening...",
  "Transcribing...",
  "Extracting Symptoms...",
  "Finding Diagnoses...",
  "Checking Drug Interactions...",
  "Generating SOAP...",
  "Risk Analysis...",
  "Complete"
];

export function LoadingScreen() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const intervals = [1200, 1500, 1400, 1600, 1500, 1800, 1500];
    let timer;

    const runNextStage = (index) => {
      if (index >= intervals.length) return;
      timer = setTimeout(() => {
        setCurrentStage(index + 1);
        runNextStage(index + 1);
      }, intervals[index]);
    };

    runNextStage(0);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-16 px-4">
      {/* Visual Header */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-[20px] font-bold text-white tracking-tight">
          AI is analyzing
        </h2>
        {/* Typing dots indicator */}
        <div className="flex gap-1 items-center pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)] animate-bounce" style={{ animationDelay: "0s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)] animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)] animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      {/* Timeline Panel */}
      <div className="w-full glass-panel p-6 sm:p-8 flex flex-col gap-1 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--quill-accent)]/10 rounded-full blur-3xl pointer-events-none" />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 transition-all duration-300 ${
                isCompleted 
                  ? "text-[var(--quill-green)] opacity-90" 
                  : isActive 
                  ? "text-[var(--quill-accent)] font-semibold opacity-100" 
                  : "text-[var(--quill-body)] opacity-35"
              }`}
            >
              <span className="text-[14.5px] tracking-wide">{stage}</span>

              {/* Status Indicator */}
              <div className="flex items-center justify-center w-5 h-5">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-[var(--quill-green)]/15 border border-[var(--quill-green)]/35 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[var(--quill-green)]" strokeWidth={3} />
                  </div>
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[var(--quill-accent)] animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/15" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <p className="mt-8 text-center text-[12px] text-[var(--quill-muted)]">
        Processing transcript securely. All analyses are transient and HIPAA-compliant.
      </p>
    </div>
  );
}

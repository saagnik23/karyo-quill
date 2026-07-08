import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

const STAGES = [
  "Listening...",
  "Understanding context...",
  "Extracting symptoms...",
  "Detecting risks...",
  "Generating SOAP...",
  "Creating summary...",
  "Complete"
];

export function LoadingScreen() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const intervals = [1000, 1200, 1300, 1400, 1500, 1200];
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
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-16 px-4 animate-[quill-rise_350ms_ease-out]">
      {/* Visual Header */}
      <div className="flex items-center gap-3 mb-8 select-none">
        <h2 className="text-[22px] font-bold text-[#18181B] tracking-tight">
          AI is analyzing
        </h2>
        {/* Typing dots indicator */}
        <div className="flex gap-1 items-center pt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)] animate-bounce" style={{ animationDelay: "0s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)] animate-bounce" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--quill-accent)] animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      {/* Timeline Panel (White floating paper card style) */}
      <div className="w-full bg-[#FFFFFF] border border-[#E7E5DD] p-8 flex flex-col gap-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-[24px] relative overflow-hidden">
        {/* Soft radial backdrop gradient */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[var(--quill-accent)]/5 rounded-full blur-3xl pointer-events-none" />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between py-2.5 border-b border-[#ECEAE2] last:border-0 transition-all duration-300 ${
                isCompleted 
                  ? "text-[var(--quill-green)] opacity-90" 
                  : isActive 
                  ? "text-[var(--quill-accent)] font-semibold opacity-100" 
                  : "text-[var(--quill-body)] opacity-35"
              }`}
            >
              <span className="text-[14.5px] font-medium tracking-wide">{stage}</span>

              {/* Status Indicator */}
              <div className="flex items-center justify-center w-5 h-5">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-[var(--quill-green)]/10 border border-[var(--quill-green)]/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[var(--quill-green)]" strokeWidth={3.5} />
                  </div>
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[var(--quill-accent)] animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#E7E5DD]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* HIPAA note */}
      <p className="mt-8 text-center text-[12.5px] text-[var(--quill-muted)] select-none font-semibold">
        HIPAA Secure · End-to-end encrypted
      </p>
    </div>
  );
}

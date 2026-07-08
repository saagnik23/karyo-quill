import React, { useEffect, useState } from "react";
import { Sparkles, FileText, ChevronRight, Mic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { MicRecorder } from "./MicRecorder";
import { MODES, SAMPLES } from "../lib/samples";

export function InputScreen({
  mode,
  setMode,
  transcript,
  setTranscript,
  onGenerate,
  loading,
  apiBase,
  micEnabled,
}) {
  const canGenerate = transcript.trim().length > 0 && !loading;
  const [micError, setMicError] = useState("");

  const currentModeLabel = MODES.find((m) => m.value === mode)?.label || "Clinical Mode";

  // Auto-dismiss inline mic errors after ~4s
  useEffect(() => {
    if (!micError) return undefined;
    const id = setTimeout(() => setMicError(""), 4000);
    return () => clearTimeout(id);
  }, [micError]);

  const loadSample = () => {
    setTranscript(SAMPLES[mode] || "");
  };

  const appendTranscribed = (text) => {
    if (!text) return;
    setTranscript((prev) => {
      if (!prev) return text;
      const sep = prev.endsWith("\n") ? "" : "\n";
      return `${prev.trimEnd()}${sep ? "\n" : ""}${text}`;
    });
  };

  return (
    <main data-testid="input-screen" className="w-full max-w-5xl mx-auto pt-4">
      
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 mb-8 text-[12.5px] font-semibold text-[var(--quill-muted)] select-none">
        <span>Workspace</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span>New Note</span>
        <span className="mx-1.5 opacity-20">·</span>
        <span className="text-[var(--quill-accent)] font-semibold">{currentModeLabel}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Oversized Hero Editorial Header */}
        <div className="lg:w-[350px] flex-shrink-0 pt-1 flex flex-col justify-start">
          <h1
            data-testid="input-title"
            className="tracking-tight mb-6 flex flex-col gap-1 text-[#18181B] font-bold select-none"
            style={{ 
              fontSize: "clamp(36px, 4.8vw, 56px)", 
              lineHeight: "clamp(42px, 5.5vw, 64px)", 
              letterSpacing: "-0.04em" 
            }}
          >
            <span className="opacity-0 translate-y-3 animate-[quill-rise_0.6s_ease-out_0.1s_forwards]">Capture Context.</span>
            <span className="opacity-0 translate-y-3 animate-[quill-rise_0.6s_ease-out_0.25s_forwards] text-[var(--quill-accent)]">Detect Risks.</span>
            <span className="opacity-0 translate-y-3 animate-[quill-rise_0.6s_ease-out_0.4s_forwards] text-stone-500 font-serif italic font-normal">Generate Notes.</span>
          </h1>
          
          <p className="text-[15px] leading-[1.65] text-[var(--quill-body)] mb-10 opacity-90 select-none font-medium">
            Rethinking medical documentation. Paste your patient conversation transcript or record live to instantly extract structured SOAP clinical notes.
          </p>

          {/* Sequential Live AI Status Badges */}
          <div className="space-y-4 select-none">
            {[
              "Speech Recognition Active",
              "Clinical Context Extraction",
              "SOAP Generation Ready",
              "Gap Analysis Enabled",
              "HIPAA Secure"
            ].map((text, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2.5 text-[12.5px] opacity-0 translate-y-2 animate-[quill-rise_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${0.65 + idx * 0.15}s` }}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--quill-green)]/10 border border-[var(--quill-green)]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--quill-green)] text-[9px] font-bold">✓</span>
                </div>
                <span className="font-semibold text-[#52525B]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Premium White Paper Card (Large 28px corners) */}
        <div className="flex-1 bg-[#FFFFFF] border border-[#E7E5DD] p-8 relative rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <div className="mb-6">
            <label
              htmlFor="mode-select"
              className="block text-[11px] font-bold text-[#71717A] mb-2.5 uppercase tracking-wider select-none"
            >
              Mode
            </label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger
                id="mode-select"
                data-testid="mode-select-trigger"
                className="h-12 w-full bg-[#F4F1E8]/40 border-[#E7E5DD] text-[#18181B] text-[14.5px] rounded-[20px] focus:border-[var(--quill-accent)] focus:ring-1 focus:ring-[var(--quill-accent)]/20 transition-all font-semibold"
              >
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent
                data-testid="mode-select-content"
                className="bg-white border-[#E7E5DD] text-[#18181B]"
              >
                {MODES.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    data-testid={`mode-option-${m.value}`}
                    className="text-[14.5px] focus:bg-[#F4F1E8]"
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="transcript-textarea"
              className="block text-[11px] font-bold text-[#71717A] mb-2.5 uppercase tracking-wider select-none"
            >
              Transcript
            </label>
            <div className="relative" data-testid="transcript-wrap">
              <textarea
                id="transcript-textarea"
                data-testid="transcript-textarea"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder=""
                rows={10}
                className="w-full resize-y rounded-[28px] bg-white border border-[#E7E5DD] focus:border-[var(--quill-accent)] focus:ring-4 focus:ring-[rgba(177,138,247,0.12)] outline-none px-6 py-5 pr-16 text-[15px] leading-[1.7] text-[#18181B] shadow-sm transition-all duration-300 relative z-1"
                style={{ minHeight: 220 }}
              />

              {/* Minimalist Empty State Overlay */}
              {(!transcript || transcript.trim().length === 0) && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center select-none z-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--quill-accent-soft)] flex items-center justify-center mb-3.5 border border-[var(--quill-accent)]/15">
                    <Mic className="w-5 h-5 text-[var(--quill-accent)] animate-pulse" />
                  </div>
                  
                  {/* Subtle Lavender Waveform */}
                  <div className="flex items-center gap-1.5 justify-center mb-3">
                    <span className="w-1 h-3 rounded-full bg-[var(--quill-accent)]/30 animate-[waveform-jump_0.75s_ease-in-out_infinite_alternate]" />
                    <span className="w-1 h-6 rounded-full bg-[var(--quill-accent)]/60 animate-[waveform-jump_0.75s_ease-in-out_infinite_alternate_0.15s]" />
                    <span className="w-1 h-4 rounded-full bg-[var(--quill-accent)]/45 animate-[waveform-jump_0.75s_ease-in-out_infinite_alternate_0.3s]" />
                    <span className="w-1 h-2 rounded-full bg-[var(--quill-accent)]/20 animate-[waveform-jump_0.75s_ease-in-out_infinite_alternate_0.1s]" />
                  </div>

                  <h4 className="text-[14px] font-bold text-[#18181B] mb-1 font-serif">Capture Consultation</h4>
                  <p className="text-[12.5px] text-[var(--quill-body)] max-w-sm">
                    Start speaking or paste your consultation transcript...
                  </p>
                </div>
              )}

              {micEnabled && (
                <MicRecorder
                  apiBase={apiBase}
                  onTranscribed={appendTranscribed}
                  onError={(msg) => setMicError(msg || "")}
                  disabled={loading}
                />
              )}
            </div>
            {micError && (
              <p
                data-testid="mic-error"
                role="alert"
                className="mt-2.5 text-[12.5px] text-[var(--quill-red)] bg-[rgba(233,109,109,0.04)] border border-[rgba(233,109,109,0.15)] rounded-lg px-3.5 py-2"
              >
                {micError}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-[#E7E5DD]">
            {/* Load Sample Button */}
            <button
              type="button"
              data-testid="load-sample-button"
              onClick={loadSample}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] h-11 px-4 text-[13px] font-bold text-[#52525B] bg-[#F4F1E8] hover:text-[#18181B] hover:bg-[#F4F1E8]/70 active:scale-[0.98] transition-all border border-[#E7E5DD]"
            >
              <FileText className="h-4 w-4 opacity-80" />
              Load sample
            </button>

            {/* Sparkles Generate Button (Lavender) */}
            <Button
              data-testid="generate-button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className="quill-primary inline-flex items-center justify-center gap-2 rounded-[18px] h-12 px-8 text-[14.5px] font-bold tracking-wide"
            >
              {loading ? (
                <>
                  <span className="quill-spinner" aria-hidden />
                  Generating…
                </>
              ) : (
                <>
                  Generate <Sparkles className="h-4.5 w-4.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-[12px] text-[var(--quill-muted)] select-none">
        Quill drafts; you review and approve. Suggestions are never auto-applied.
      </p>
    </main>
  );
}

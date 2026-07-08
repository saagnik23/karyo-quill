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
    <main data-testid="input-screen" className="w-full max-w-4xl mx-auto">
      
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 mb-8 text-[13px] font-medium text-[var(--quill-muted)] select-none">
        <span>Workspace</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span>New Session</span>
        <span className="mx-1.5 opacity-30">·</span>
        <span className="text-[var(--quill-accent)] font-semibold">{currentModeLabel}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Premium Live AI Workspace Header */}
        <div className="lg:w-[310px] flex-shrink-0 pt-2 flex flex-col justify-start">
          <h1
            data-testid="input-title"
            className="font-bold tracking-tight mb-4 flex flex-col gap-1.5 text-white"
            style={{ fontSize: "clamp(26px, 3.5vw, 32px)", lineHeight: 1.1 }}
          >
            <span className="opacity-0 translate-y-3 animate-[quill-rise_0.6s_ease-out_0.1s_forwards]">Capture Context.</span>
            <span className="opacity-0 translate-y-3 animate-[quill-rise_0.6s_ease-out_0.25s_forwards] text-[var(--quill-accent)]">Detect Risks.</span>
            <span className="opacity-0 translate-y-3 animate-[quill-rise_0.6s_ease-out_0.4s_forwards] text-white/80">Generate Clinical Intelligence.</span>
          </h1>
          
          <p className="text-[14.5px] leading-[1.6] text-[var(--quill-body)] mb-8 opacity-90 select-none">
            Paste your raw transcript or record live. Karyo-Quill automatically structures your clinical notes and actively scans for critical omissions or risks.
          </p>

          {/* Sequential Live AI Status Cards */}
          <div className="space-y-3 select-none">
            {[
              "Speech Recognition Active",
              "Clinical Context Extraction",
              "SOAP Generation Ready",
              "Gap Analysis Enabled",
              "HIPAA Secure"
            ].map((text, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2.5 text-[13px] opacity-0 translate-y-2 animate-[quill-rise_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${0.65 + idx * 0.15}s` }}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--quill-green)]/15 border border-[var(--quill-green)]/35 flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--quill-green)] text-[9px] font-extrabold">✓</span>
                </div>
                <span className="font-semibold text-white/85">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Glassmorphism Form Card */}
        <div className="flex-1 glass-panel p-6 sm:p-8 relative">
          {/* Subtle Ambient Glow inside Card */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-[var(--quill-accent)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6">
            <label
              htmlFor="mode-select"
              className="block text-[11px] font-bold text-white mb-2.5 uppercase tracking-wider opacity-80"
            >
              Mode
            </label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger
                id="mode-select"
                data-testid="mode-select-trigger"
                className="h-12 w-full bg-[#0B1220]/65 border-white/10 text-white text-[15px] rounded-xl shadow-inner focus:border-[var(--quill-accent)] focus:ring-1 focus:ring-[var(--quill-accent)]/20 transition-all"
              >
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent
                data-testid="mode-select-content"
                className="bg-[#182434] border-white/10 text-white"
              >
                {MODES.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    data-testid={`mode-option-${m.value}`}
                    className="text-[15px] focus:bg-[#0B1220]"
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
              className="block text-[11px] font-bold text-white mb-2.5 uppercase tracking-wider opacity-80"
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
                className="w-full resize-y rounded-xl bg-[#0B1220]/65 border border-white/10 focus:border-[var(--quill-accent)] focus:ring-2 focus:ring-[var(--quill-accent-soft)] outline-none px-5 py-4 pr-16 text-[15px] leading-[1.65] text-white shadow-inner transition-all duration-300 relative z-1"
                style={{ minHeight: 220, background: "rgba(11, 18, 32, 0.45)" }}
              />

              {/* Animated Empty State Illustration Overlay */}
              {(!transcript || transcript.trim().length === 0) && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center select-none z-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--quill-accent-soft)] flex items-center justify-center mb-3.5 border border-[var(--quill-accent)]/15">
                    <Mic className="w-5 h-5 text-[var(--quill-accent)] animate-pulse" />
                  </div>
                  
                  {/* Glowing Waveform Simulation */}
                  <div className="flex items-center gap-1 justify-center mb-3">
                    <span className="w-1 h-3 rounded-full bg-[var(--quill-accent)]/30 animate-[waveform-jump_0.7s_ease-in-out_infinite_alternate]" />
                    <span className="w-1 h-5 rounded-full bg-[var(--quill-accent)]/60 animate-[waveform-jump_0.7s_ease-in-out_infinite_alternate_0.15s]" />
                    <span className="w-1 h-8 rounded-full bg-[var(--quill-accent)] animate-[waveform-jump_0.7s_ease-in-out_infinite_alternate_0.3s]" />
                    <span className="w-1 h-4 rounded-full bg-[var(--quill-accent)]/50 animate-[waveform-jump_0.7s_ease-in-out_infinite_alternate_0.2s]" />
                    <span className="w-1 h-2 rounded-full bg-[var(--quill-accent)]/20 animate-[waveform-jump_0.7s_ease-in-out_infinite_alternate_0.1s]" />
                  </div>

                  <h4 className="text-[14px] font-semibold text-white/90 mb-1">Start Live Scribe</h4>
                  <p className="text-[12.5px] text-[var(--quill-body)] max-w-sm">
                    Start speaking or paste a consultation transcript to begin...
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
                className="mt-2.5 text-[13px] text-[var(--quill-red)] bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.18)] rounded-lg px-3.5 py-2"
              >
                {micError}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
            {/* Load Sample Button */}
            <button
              type="button"
              data-testid="load-sample-button"
              onClick={loadSample}
              className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-4 text-[13.5px] font-semibold text-[var(--quill-body)] bg-white/5 hover:text-white hover:bg-white/10 active:scale-[0.98] transition-all border border-white/5"
            >
              <FileText className="h-4 w-4 opacity-80" />
              Load sample
            </button>

            {/* Sparkles Generate Button */}
            <Button
              data-testid="generate-button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className="quill-primary inline-flex items-center justify-center gap-2 rounded-xl h-12 px-8 text-[15px] font-bold tracking-wide"
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
        Karyo-Quill drafts; you review and approve. Suggestions are never auto-applied.
      </p>
    </main>
  );
}

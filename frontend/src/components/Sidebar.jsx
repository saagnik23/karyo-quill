import React from "react";
import { Plus, User, Clock } from "lucide-react";
import { BorderGlow } from "./BorderGlow";

export const MOCK_SESSIONS = [
  { id: 1, initials: "JS", patientName: "John Smith", date: "Jul 08", time: "14:15", status: "amber", docInitials: "AM" },
  { id: 2, initials: "AM", patientName: "Alice Miller", date: "Jul 08", time: "11:30", status: "red", docInitials: "AM" },
  { id: 3, initials: "RC", patientName: "Robert Chen", date: "Jul 07", time: "09:45", status: "green", docInitials: "AM" },
  { id: 4, initials: "KL", patientName: "Karen Lee", date: "Jul 06", time: "16:20", status: "green", docInitials: "AM" },
  { id: 5, initials: "TB", patientName: "Thomas Brown", date: "Jul 05", time: "10:15", status: "amber", docInitials: "AM" },
];

const StatusDot = ({ status }) => {
  const colors = {
    red: "bg-[#EF4444] shadow-[0_0_6px_#EF4444]",
    amber: "bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]",
    green: "bg-[#22C55E] shadow-[0_0_6px_#22C55E]",
  };
  return (
    <span 
      className={`block w-2 h-2 rounded-full ${colors[status] || colors.green}`} 
      aria-hidden="true"
    />
  );
};

export function Sidebar({ onNew, onSelectSession, activeSessionId }) {
  return (
    <aside className="quill-sidebar no-print select-none">
      {/* New Note button */}
      <button 
        onClick={onNew}
        className="quill-new-note-btn w-full flex items-center gap-2 justify-center text-white font-semibold rounded-xl px-4 py-3.5 shadow-md active:scale-[0.98] mb-6"
      >
        <Plus className="w-4 h-4" />
        New Note
      </button>

      {/* Recent Sessions list */}
      <div className="flex-1">
        <h3 className="text-[11px] font-bold text-[var(--quill-muted)] uppercase tracking-wider mb-3 px-1.5 flex items-center gap-1.5">
          Recent Sessions
        </h3>
        <div className="space-y-2.5">
          {MOCK_SESSIONS.map((session) => {
            const isSelected = activeSessionId === session.id;
            return (
              <BorderGlow
                key={session.id}
                edgeSensitivity={16}
                borderRadius={14}
                glowRadius={22}
                glowIntensity={0.35} // subtle glow intensity
                animated={false}
                backgroundColor={isSelected ? "rgba(139, 92, 246, 0.15)" : "#1F2937"}
                borderColor={isSelected ? "#8B5CF6" : "#334155"}
                colors={["#8B5CF6", "#38BDF8"]}
                className="transition-transform duration-200 hover:scale-[1.01]"
              >
                <div 
                  onClick={() => onSelectSession && onSelectSession(session.id)}
                  className="p-3.5 cursor-pointer relative"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {/* Patient Initials Circle */}
                      <div className="w-6.5 h-6.5 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[10px] font-bold text-[var(--quill-accent)]">
                        {session.initials}
                      </div>
                      {/* Patient Name */}
                      <span className="text-[13px] font-semibold text-[#F8FAFC] truncate max-w-[130px]">
                        {session.patientName}
                      </span>
                    </div>
                    {/* Status Indicator */}
                    <StatusDot status={session.status} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#CBD5E1] mt-2 pt-2 border-t border-[#334155]/40">
                    {/* Doc Avatar */}
                    <div className="flex items-center gap-1 font-semibold text-stone-400">
                      <User className="w-3 h-3 text-[var(--quill-accent)]" />
                      <span>Dr. {session.docInitials}</span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 opacity-70">
                      <Clock className="w-3 h-3 text-stone-500" />
                      <span>{session.date}</span>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

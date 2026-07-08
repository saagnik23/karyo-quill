import React from "react";
import { Plus, User, Clock } from "lucide-react";

export const MOCK_SESSIONS = [
  { id: 1, initials: "JS", patientName: "John Smith", date: "Jul 08", time: "14:15", status: "amber", docInitials: "AM" },
  { id: 2, initials: "AM", patientName: "Alice Miller", date: "Jul 08", time: "11:30", status: "red", docInitials: "AM" },
  { id: 3, initials: "RC", patientName: "Robert Chen", date: "Jul 07", time: "09:45", status: "green", docInitials: "AM" },
  { id: 4, initials: "KL", patientName: "Karen Lee", date: "Jul 06", time: "16:20", status: "green", docInitials: "AM" },
  { id: 5, initials: "TB", patientName: "Thomas Brown", date: "Jul 05", time: "10:15", status: "amber", docInitials: "AM" },
];

const StatusDot = ({ status }) => {
  const colors = {
    red: "bg-[#ef4444] shadow-[0_0_8px_#ef4444]",
    amber: "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]",
    green: "bg-[#22c55e] shadow-[0_0_8px_#22c55e]",
  };
  return (
    <span
      className={`block w-2.5 h-2.5 rounded-full ${colors[status] || colors.green}`}
      aria-hidden="true"
    />
  );
};

export function Sidebar({ onNew, onSelectSession, activeSessionId }) {
  return (
    <aside className="quill-sidebar no-print select-none">
      {/* New Note Button */}
      <button
        onClick={onNew}
        className="quill-new-note-btn w-full flex items-center gap-2.5 justify-center text-white font-semibold rounded-xl px-4 py-3 shadow-md active:scale-[0.98] mb-8"
      >
        <Plus className="w-5 h-5" />
        New Note
      </button>

      {/* Recent Sessions list */}
      <div className="flex-1">
        <h3 className="text-[11px] font-bold text-[var(--quill-muted)] uppercase tracking-wider mb-4 px-1.5 flex items-center gap-1.5">
          Recent Sessions
        </h3>
        <div className="space-y-2">
          {MOCK_SESSIONS.map((session) => {
            const isSelected = activeSessionId === session.id;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession && onSelectSession(session.id)}
                className={`quill-sidebar-card ${isSelected ? "selected" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Patient Initials Circle */}
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-white">
                      {session.initials}
                    </div>
                    {/* Patient Name details */}
                    <span className="text-[13.5px] font-semibold text-white truncate max-w-[120px]">
                      {session.patientName}
                    </span>
                  </div>
                  {/* Status Indicator */}
                  <StatusDot status={session.status} />
                </div>

                <div className="flex items-center justify-between text-[11.5px] text-[var(--quill-body)] mt-1.5 pt-1.5 border-t border-white/5">
                  {/* Doc Avatar representation */}
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[var(--quill-accent)]" />
                    <span className="font-mono">Dr. {session.docInitials}</span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 opacity-80">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.date} {session.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

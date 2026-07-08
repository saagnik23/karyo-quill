import React, { useEffect, useState, useRef } from "react";

export function InteractiveCursor() {
  const [cursorType, setCursorType] = useState("normal"); // 'normal' | 'button' | 'text' | 'card'
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      positionRef.current.x = e.clientX;
      positionRef.current.y = e.clientY;
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Check hierarchy for interactive components
      if (
        target.closest("button") || 
        target.closest("a") || 
        target.closest("[role='button']") ||
        target.closest(".quill-new-note-btn") ||
        (target.closest(".select-none") && target.tagName === "DIV" && target.innerText.includes("Connected"))
      ) {
        setCursorType("button");
      } else if (
        target.closest("input") || 
        target.closest("textarea") ||
        target.closest("[role='textbox']")
      ) {
        setCursorType("text");
      } else if (
        target.closest(".quill-card") || 
        target.closest(".quill-sidebar-card") || 
        target.closest(".glass-panel")
      ) {
        setCursorType("card");
      } else {
        setCursorType("normal");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`custom-cursor cursor-${cursorType} pointer-events-none fixed`}
      style={{
        left: "-100px",
        top: "-100px",
      }}
    >
      <div className="custom-cursor-dot" />
    </div>
  );
}

import React, { useRef, useState } from "react";

export function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 24,
  borderRadius = 24,
  glowRadius = 32,
  glowIntensity = 0.65,
  animated = false,
  backgroundColor = "#1F2937",
  colors = ["#8B5CF6", "#38BDF8", "#A78BFA"],
  borderColor = "rgba(51, 65, 85, 0.45)",
  style = {}
}) {
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Calculate distance to closest edge
    const distLeft = x;
    const distRight = rect.width - x;
    const distTop = y;
    const distBottom = rect.height - y;
    const minDistance = Math.min(distLeft, distRight, distTop, distBottom);

    // If mouse is inside container, check sensitivity boundary
    if (
      x >= 0 && x <= rect.width &&
      y >= 0 && y <= rect.height &&
      minDistance <= edgeSensitivity
    ) {
      // Scale intensity based on distance from the closest boundary edge
      const intensityFactor = 1 - (minDistance / edgeSensitivity);
      setOpacity(glowIntensity * intensityFactor);
    } else {
      setOpacity(0);
    }
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Build the gradient colors representation
  const colorString = colors.join(", ");
  const backgroundGradient = colors.length > 1
    ? `radial-gradient(${glowRadius}px circle at ${coords.x}px ${coords.y}px, ${colorString}, transparent 100%)`
    : `radial-gradient(${glowRadius}px circle at ${coords.x}px ${coords.y}px, ${colors[0] || "#8B5CF6"}, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-[1.5px] overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        background: borderColor, // custom border color override
        transition: "transform 200ms ease, box-shadow 200ms ease",
        ...style
      }}
    >
      {/* Spotlight Glow layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity z-0"
        style={{
          opacity,
          backgroundImage: backgroundGradient,
          transitionDuration: opacity > 0 ? "250ms" : "300ms",
          borderRadius: `${borderRadius}px`,
        }}
      />

      {/* Content panel nested inside the border glow padding */}
      <div
        className="relative w-full h-full z-10"
        style={{
          backgroundColor,
          borderRadius: `${borderRadius - 1.5}px`
        }}
      >
        {children}
      </div>
    </div>
  );
}

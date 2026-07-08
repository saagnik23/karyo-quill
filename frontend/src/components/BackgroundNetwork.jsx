import React, { useEffect, useRef } from "react";
import { MagicRings } from "./MagicRings";

export function BackgroundNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Very subtle floating particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.12 + 0.03
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid (opacity ~3%)
      ctx.strokeStyle = "rgba(51, 65, 85, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 48;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw particles (opacity ~4%)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`; // Lavender particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {/* Base deep slate color */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #0F172A 0%, #0F172A 100%)",
        }}
      />
      
      {/* Canvas for grid and particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block pointer-events-none" 
      />

      {/* Full-screen MagicRings WebGL shader background (10% subtle opacity) */}
      <div className="absolute inset-0 pointer-events-auto opacity-10">
        <MagicRings
          color="#5BB98C"
          colorTwo="#CBE1FD"
          ringCount={6}
          speed={0.5}
          attenuation={10}
          lineThickness={1.5}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.08}
          opacity={1.0}
          blur={0}
          noiseAmount={0.03}
          rotation={15}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={true}
          mouseInfluence={0.08}
          hoverScale={1.1}
          parallax={0.02}
          clickBurst={true}
        />
      </div>
    </div>
  );
}

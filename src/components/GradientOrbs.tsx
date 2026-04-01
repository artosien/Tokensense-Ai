"use client";

export function GradientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {/* Teal orb — top left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: "-20%", left: "-10%",
          background: "radial-gradient(circle, rgba(0,220,180,0.13) 0%, transparent 70%)",
          animation: "orb-drift-1 10s ease-in-out infinite alternate",
        }}
      />
      {/* Indigo orb — top right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          top: "-10%", right: "-5%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          animation: "orb-drift-2 12s ease-in-out infinite alternate",
        }}
      />
      {/* Purple orb — bottom center */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          bottom: "-15%", left: "40%",
          background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)",
          animation: "orb-drift-3 14s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

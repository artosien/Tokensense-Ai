'use client';

export default function HeroBadges() {
  const badges = [
    { icon: '🔒', label: '100% Client-Side' },
    { icon: '✨', label: 'No Sign-up' },
    { icon: '∞', label: 'Free Forever' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-plasma-500/40 bg-plasma-500/10 hover:bg-plasma-500/20 hover:border-plasma-500/60 transition-all duration-200"
        >
          <span className="text-sm">{badge.icon}</span>
          <span className="text-sm font-semibold text-plasma-400">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}


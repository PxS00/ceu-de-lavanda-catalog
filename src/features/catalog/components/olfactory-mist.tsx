// Fixed coordinates keep the decorative droplets identical during hydration.
const droplets = Array.from({ length: 64 }, (_, index) => {
  const distance = 30 + (index / 63) * 340;
  const spread = Math.sin(index * 2.39996) * distance * 0.22;
  return { x: distance, y: 90 + spread, radius: 0.65 + (index % 4) * 0.4 };
});

export function OlfactoryMist() {
  return <svg className="olfactory-mist" viewBox="0 0 420 180" aria-hidden="true">
    <defs>
      <linearGradient id="olfactory-plume" x1="0" x2="1">
        <stop offset="0" stopColor="var(--color-paper)" stopOpacity=".9" />
        <stop offset=".35" stopColor="var(--color-paper)" stopOpacity=".65" />
        <stop offset="1" stopColor="var(--color-paper)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="olfactory-droplets" x1="0" x2="1">
        <stop offset="0" stopColor="var(--color-gold-light)" stopOpacity=".9" />
        <stop offset="1" stopColor="var(--color-paper)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g className="olfactory-mist-cloud" fill="url(#olfactory-plume)">
      <path d="M0 90 Q90 55 230 25 Q350 0 420 30 L420 150 Q340 175 230 155 Q90 125 0 90Z" opacity=".6" />
      <path d="M0 90 Q110 65 240 60 Q355 50 410 95 Q330 135 220 120 Q100 110 0 90Z" opacity=".5" />
    </g>
    <g fill="url(#olfactory-droplets)">
      {droplets.map((drop, index) => <circle key={index} cx={drop.x} cy={drop.y} r={drop.radius} />)}
    </g>
  </svg>;
}

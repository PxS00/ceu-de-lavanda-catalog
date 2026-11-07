export function OlfactoryPump() {
  return <svg className="olfactory-pump" viewBox="0 0 2172 724" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <clipPath id="olfactory-pump-button">
        <path d="M1047 148 Q1075 135 1115 131 L1116 187 L1047 187Z" />
      </clipPath>
    </defs>
    <image href="/campaigns/olfactory-pump-plate.webp" width="2172" height="724" />
    <g className="olfactory-pump-button">
      <image href="/campaigns/olfactory-panorama.webp" width="2172" height="724" clipPath="url(#olfactory-pump-button)" />
    </g>
  </svg>;
}

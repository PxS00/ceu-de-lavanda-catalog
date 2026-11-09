export function OlfactoryPump() {
  return <svg className="olfactory-pump" viewBox="0 0 2172 724" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <clipPath id="olfactory-pump-collar">
        <path d="M1038 190 Q1040 185 1047 185 H1116 Q1125 185 1127 190 V202 H1038Z" />
      </clipPath>
      <clipPath id="olfactory-pump-button">
        <path d="M1047 148 Q1075 135 1115 131 L1116 187 L1047 187Z" />
      </clipPath>
    </defs>
    <image href="/campaigns/olfactory-panorama.webp" width="2172" height="724" clipPath="url(#olfactory-pump-collar)" />
    <g className="olfactory-pump-button">
      <image href="/campaigns/olfactory-panorama.webp" width="2172" height="724" clipPath="url(#olfactory-pump-button)" />
    </g>
    <ellipse className="olfactory-spray-indicator" cx="1138" cy="164" rx="20" ry="9" />
  </svg>;
}

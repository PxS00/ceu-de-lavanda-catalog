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
    <g className="olfactory-pump-trails olfactory-spray" fill="none" stroke="var(--primary)" strokeWidth="1.5">
      <path pathLength="1" d="M1108 157 Q1230 95 1450 150" />
      <path pathLength="1" d="M1108 157 Q1270 150 1450 235" />
      <path pathLength="1" d="M1108 157 Q1270 175 1450 320" />
    </g>
  </svg>;
}

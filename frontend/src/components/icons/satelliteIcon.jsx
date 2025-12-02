export default function SatelliteIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="7" rx="1"/>
        <rect x="15" y="15" width="7" height="7" rx="1"/>
        <path d="M9 5l6 6"/>
        <path d="M19 9l2 2"/>
        <path d="M9 19l2 2"/>
      </svg>
    </div>
  );
}

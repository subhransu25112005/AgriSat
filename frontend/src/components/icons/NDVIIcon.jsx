export default function NDVIIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18c3-5 6-7 8-7s5 2 8 7"/>
        <circle cx="12" cy="8" r="3"/>
      </svg>
    </div>
  );
}

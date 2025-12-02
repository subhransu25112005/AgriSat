export default function FarmIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3"/>
        <path d="M4 20c2-3 4-5 8-5s6 2 8 5"/>
        <path d="M2 20h20"/>
      </svg>
    </div>
  );
}

export default function FertilizerIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2h10l3 6v12H4V8z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    </div>
  );
}

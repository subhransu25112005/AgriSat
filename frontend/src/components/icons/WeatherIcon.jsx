export default function WeatherIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 2v4"/>
        <path d="M4.22 4.22l2.83 2.83"/>
        <path d="M1 12h4"/>
        <path d="M19 12h4"/>
        <path d="M17 7.05l2.83-2.83"/>
      </svg>
    </div>
  );
}

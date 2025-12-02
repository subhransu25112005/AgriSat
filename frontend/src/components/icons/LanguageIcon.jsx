export default function LanguageIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h14"/>
        <path d="M12 4v4"/>
        <path d="M7 12h10l-1 3h-8z"/>
        <path d="M10 15l1.5 3"/>
        <path d="M14 15l-1.5 3"/>
      </svg>
    </div>
  );
}

export default function AddIcon({ size = 26, color = "#0F7A3A" }) {
  return (
    <div className="icon-anim inline-flex">
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14"/>
        <path d="M5 12h14"/>
      </svg>
    </div>
  );
}

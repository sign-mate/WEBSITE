export function CursorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`illus-cursor${className ? ` ${className}` : ""}`}
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.2 1L1.2 15.3L4.6 12.1L6.9 16.8L9.3 15.7L7 11L11.9 11L1.2 1Z"
        fill="#1a1a1a"
        stroke="#fff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IllusLines({ widths, className }: { widths: number[]; className?: string }) {
  return (
    <div className={`illus-lines${className ? ` ${className}` : ""}`}>
      <span className="illus-line illus-line--title" />
      {widths.map((w, i) => (
        <span key={i} className="illus-line" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

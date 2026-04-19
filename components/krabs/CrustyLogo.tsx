type CrustyLogoProps = {
  compact?: boolean;
};

export default function CrustyLogo({ compact = false }: CrustyLogoProps) {
  return (
    <div className="flex items-center gap-2.5" data-testid="crusty-logo">
      <div
        className="relative grid place-items-center"
        style={{
          width: 40,
          height: 40,
          background: "var(--tomato)",
          border: "2.5px solid var(--ink)",
          borderRadius: 10,
          boxShadow: "3px 3px 0 0 var(--ink)",
          transform: "rotate(-4deg)",
        }}
      >
        <svg viewBox="0 0 32 32" width="22" height="22">
          <path
            d="M6 18 Q8 10 16 10 Q24 10 26 18 L25 22 Q16 25 7 22 Z"
            fill="#ffffff"
            stroke="#1c2233"
            strokeWidth="2.2"
          />
          <circle cx="13" cy="16" r="1.6" fill="#1c2233" />
          <circle cx="19" cy="16" r="1.6" fill="#1c2233" />
          <path d="M6 18 L3 16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 18 L29 16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="font-display" style={{ fontSize: "1rem", color: "var(--ink)" }}>
            CRUSTY&nbsp;CRAB
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--aqua-deep)",
            }}
          >
            Ventures / Fund I
          </div>
        </div>
      )}
    </div>
  );
}

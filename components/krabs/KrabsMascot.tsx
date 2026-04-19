type KrabsMascotProps = {
  size?: number;
  className?: string;
  wobble?: boolean;
};

/**
 * Stylised Eugene K. — the AI GP mascot.
 * Original SVG in the Crusty Crab palette. Not a likeness of any copyrighted character.
 */
export default function KrabsMascot({ size = 220, className = "", wobble = true }: KrabsMascotProps) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      data-testid="krabs-mascot"
    >
      <svg
        viewBox="0 0 240 240"
        width={size}
        height={size}
        className={wobble ? "krabs-wobble" : ""}
        aria-label="Eugene K. – AI GP mascot"
      >
        <ellipse cx="120" cy="218" rx="70" ry="8" fill="#1c2233" opacity="0.3" />

        <g stroke="#1c2233" strokeWidth="4" strokeLinecap="round">
          <path d="M85 200 Q78 210 72 216" fill="none" stroke="#a0230f" strokeWidth="6" />
          <path d="M100 206 Q95 214 92 220" fill="none" stroke="#a0230f" strokeWidth="6" />
          <path d="M140 206 Q145 214 148 220" fill="none" stroke="#a0230f" strokeWidth="6" />
          <path d="M155 200 Q162 210 168 216" fill="none" stroke="#a0230f" strokeWidth="6" />
        </g>

        <ellipse cx="120" cy="155" rx="62" ry="52" fill="#cf3721" stroke="#1c2233" strokeWidth="4" />
        <ellipse cx="120" cy="168" rx="40" ry="26" fill="#ffb4a0" opacity="0.4" />

        <path
          d="M78 158 Q120 190 162 158 L170 210 Q120 220 70 210 Z"
          fill="#31a9b8"
          stroke="#1c2233"
          strokeWidth="4"
        />
        <path
          d="M115 165 L125 165 L130 195 L120 205 L110 195 Z"
          fill="#f5be41"
          stroke="#1c2233"
          strokeWidth="3"
        />
        <text
          x="120"
          y="188"
          textAnchor="middle"
          fontFamily="Bungee, sans-serif"
          fontSize="14"
          fill="#1c2233"
          fontWeight="700"
        >
          $
        </text>

        <g className="claw-pinch-left">
          <path
            d="M68 150 Q42 140 30 120"
            fill="none"
            stroke="#cf3721"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M30 120 L18 108 L10 118 L20 128 L16 138 L28 142 L38 132 Z"
            fill="#cf3721"
            stroke="#1c2233"
            strokeWidth="3.5"
          />
          <path d="M18 118 L30 125" stroke="#1c2233" strokeWidth="2" />
        </g>

        <g className="claw-pinch-right">
          <path
            d="M172 150 Q198 140 210 120"
            fill="none"
            stroke="#cf3721"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M210 120 L222 108 L230 118 L220 128 L224 138 L212 142 L202 132 Z"
            fill="#cf3721"
            stroke="#1c2233"
            strokeWidth="3.5"
          />
          <path d="M222 118 L210 125" stroke="#1c2233" strokeWidth="2" />
        </g>

        <g stroke="#1c2233" strokeWidth="3" fill="#cf3721">
          <rect x="96" y="80" width="8" height="30" rx="3" />
          <rect x="136" y="80" width="8" height="30" rx="3" />
        </g>
        <circle cx="100" cy="78" r="16" fill="#ffffff" stroke="#1c2233" strokeWidth="3" />
        <circle cx="140" cy="78" r="16" fill="#ffffff" stroke="#1c2233" strokeWidth="3" />
        <circle cx="104" cy="80" r="5.5" fill="#1c2233" />
        <circle cx="144" cy="80" r="5.5" fill="#1c2233" />
        <circle cx="106" cy="78" r="2" fill="#ffffff" />
        <circle cx="146" cy="78" r="2" fill="#ffffff" />

        <path
          d="M84 62 Q120 52 156 62"
          fill="none"
          stroke="#1c2233"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          d="M100 132 Q120 148 140 132"
          fill="none"
          stroke="#1c2233"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect x="117" y="134" width="6" height="7" fill="#ffffff" stroke="#1c2233" strokeWidth="2" />
      </svg>
    </div>
  );
}

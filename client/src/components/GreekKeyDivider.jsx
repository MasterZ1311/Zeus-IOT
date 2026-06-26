/**
 * GreekKeyDivider
 * A subtle Greek "meander" (key) border with a thunderbolt medallion in the
 * centre — a recognisably Hellenic, premium flourish. Edges fade out via a mask
 * so it blends into the dark background. Purely decorative.
 */
import { useId } from 'react';

export default function GreekKeyDivider({ withBolt = true, className = '' }) {
  const id = useId().replace(/[:]/g, '');

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`} aria-hidden="true">
      <div
        className="w-full"
        style={{
          height: 22,
          maskImage: 'linear-gradient(90deg, transparent, #000 28%, #000 72%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 28%, #000 72%, transparent)',
        }}
      >
        <svg width="100%" height="22" preserveAspectRatio="xMidYMid">
          <defs>
            <pattern id={`gk-${id}`} width="28" height="22" patternUnits="userSpaceOnUse">
              {/* Continuous baseline + interlocking key spiral */}
              <path
                d="M0 17 H28 M4 17 V5 H20 V13 H10 V9 H16"
                fill="none"
                stroke="#e5a93c"
                strokeOpacity="0.4"
                strokeWidth="1.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#gk-${id})`} />
        </svg>
      </div>

      {withBolt && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#070c1e',
            border: '1px solid rgba(229,169,60,0.45)',
            boxShadow: '0 0 16px rgba(229,169,60,0.25), inset 0 0 8px rgba(229,169,60,0.1)',
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#e5a93c"
            style={{ filter: 'drop-shadow(0 0 4px rgba(229,169,60,0.6))' }}>
            <path d="M13 2 L4 14 H10.5 L9 22 L20 9 H13 Z" />
          </svg>
        </div>
      )}
    </div>
  );
}

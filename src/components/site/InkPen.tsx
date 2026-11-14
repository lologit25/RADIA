/** Hero visual: black ink pouring from the top of the page into a fountain-pen nib that drips. */
export function InkPen() {
  return (
    <div className="ink" aria-hidden="true">
      <div className="ink-glow" />
      <svg viewBox="0 0 400 560" fill="none">
        <defs>
          <linearGradient id="ink-body" x1="110" y1="0" x2="290" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.22" stopColor="#2b2b2b" />
            <stop offset="0.48" stopColor="#050505" />
            <stop offset="0.8" stopColor="#161616" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <linearGradient id="ink-rim" x1="0" y1="0" x2="0" y2="490" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.38" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
          </linearGradient>
          <filter id="ink-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <filter id="ink-softer" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <clipPath id="ink-clip">
            <path d="M187 -40V120c0 45-37 70-59 115-16 33-10 65 7 100 25 55 50 105 65 145 15-40 40-90 65-145 17-35 23-67 7-100-22-45-59-70-59-115V-40z" />
          </clipPath>
        </defs>

        <g className="ink-sway">
          {/* stream + nib silhouette */}
          <path
            d="M187 -40V120c0 45-37 70-59 115-16 33-10 65 7 100 25 55 50 105 65 145 15-40 40-90 65-145 17-35 23-67 7-100-22-45-59-70-59-115V-40z"
            fill="url(#ink-body)"
            stroke="url(#ink-rim)"
            strokeWidth="1.2"
          />

          <g clipPath="url(#ink-clip)">
            {/* ink running down the stream */}
            <ellipse className="ink-run" cx="200" cy="0" rx="15" ry="34" fill="#3a3a3a" filter="url(#ink-soft)" />
            {/* broad reflections */}
            <path
              d="M150 232c-13 31-8 62 7 97 16 36 30 66 40 92"
              stroke="#fff"
              strokeOpacity="0.5"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#ink-softer)"
            />
            <path
              d="M256 240c11 26 6 54-7 84"
              stroke="#fff"
              strokeOpacity="0.22"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#ink-softer)"
            />
            <path d="M192 -40V118" stroke="#fff" strokeOpacity="0.75" strokeWidth="2.4" filter="url(#ink-soft)" />
            <path d="M209 -40V112" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.6" />
          </g>

          {/* sharp speculars */}
          <ellipse cx="163" cy="222" rx="11" ry="4.5" transform="rotate(-52 163 222)" fill="#fff" fillOpacity="0.92" />
          <ellipse cx="236" cy="214" rx="7" ry="3" transform="rotate(48 236 214)" fill="#fff" fillOpacity="0.7" />
          <ellipse cx="149" cy="292" rx="3" ry="9" transform="rotate(-12 149 292)" fill="#fff" fillOpacity="0.55" />

          {/* nib details: breather hole and slit */}
          <circle cx="200" cy="268" r="9.5" fill="#000" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
          <path d="M193.5 262.5a9 9 0 0 1 9-3" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M200 278V476" stroke="#fff" strokeOpacity="0.32" strokeWidth="1" />
          <path d="M170 196c18 12 42 12 60 0" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />

          {/* drop forming at the tip, then falling */}
          <g transform="translate(200 484)">
            <g className="ink-drop">
              <path
                d="M0-16C6-5 11 2 11 9A11 11 0 1 1-11 9C-11 2-6-5 0-16Z"
                fill="#0a0a0a"
                stroke="#fff"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <ellipse cx="-4" cy="8" rx="2.2" ry="5" transform="rotate(-18 -4 8)" fill="#fff" fillOpacity="0.85" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

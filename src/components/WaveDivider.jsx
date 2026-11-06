import './WaveDivider.css'

// Every HOME boundary shares this gentle, repeating curve and the same SVG scale.
const curve = 'M0 52C136 12 136 12 272 52S408 92 544 52 680 12 816 52 952 92 1088 52 1224 12 1360 52 1496 92 1632 52'

export default function WaveDivider({ fromColor, toColor, fillUpperBackground = true }) {
  return <svg className="wave-divider" viewBox="0 0 1632 150" preserveAspectRatio="none" aria-hidden="true" focusable="false" data-from-color={fromColor} data-to-color={toColor}>
    {fillUpperBackground && <rect width="1632" height="150" fill={fromColor} />}
    <path d={`${curve}V150H0Z`} fill={toColor} />
    <path className="wave-divider__accent" d={curve} />
    <path className="wave-divider__cream" d={curve} />
    <g className="wave-divider__glints"><path d="M65 33q15-6 30-8M620 35q20-7 40-8M1160 34q18-6 36-8" /><circle cx="107" cy="23" r="3" /><circle cx="121" cy="22" r="2" /><circle cx="673" cy="26" r="3" /><circle cx="1209" cy="24" r="3" /></g>
  </svg>
}


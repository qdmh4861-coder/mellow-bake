import cakeBackground from '../images/back.png'

// Original artwork is cropped into four SVGs, using SANDWICH's display areas.
export default function CakeCornerArt({ side, position }) {
  const bottom = position === 'bottom'
  const viewportHeight = bottom ? 563 : 729
  const sourceY = bottom ? 800 : 0
  const sourceHeight = bottom ? 616 : 800
  const sourceX = side === 'right' ? 1143 : 0
  const alignment = `${side === 'right' ? 'xMax' : 'xMin'}${bottom ? 'YMax' : 'YMin'} meet`

  return <svg className={`our-menu-cake-corner our-menu-cake-corner--${position}`}
    data-cake-art-source="back.png"
    viewBox={`${sourceX} ${sourceY} 492 ${sourceHeight}`}
    style={{ aspectRatio: `492 / ${viewportHeight}` }}
    preserveAspectRatio={alignment} focusable="false">
    <image href={cakeBackground} width="1635" height="1416" />
  </svg>
}

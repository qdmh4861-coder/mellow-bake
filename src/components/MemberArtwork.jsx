import { assetHref } from '../appRouting'
import { useId } from 'react'
import MemberCutout from './MemberCutout'

// Only decorative illustrations from the supplied design, never a page screenshot.
const regions = {
  rabbit: [282, 130, 302, 316],
  treats: [899, 195, 296, 227],
  badge: [4, 112, 289, 212],
  box: [616, 981, 218, 110],
}
// The rabbit uses a roomy feathered mask, keeping the full ears, hat and heart.
// The sidebar badge includes its original ribbon, frame and lettering as one emblem.
const silhouettes = {
  treats: 'M963 313 L963 281 Q956 261 978 247 L1002 233 Q1005 212 1033 209 Q1049 192 1073 207 Q1097 207 1105 233 Q1133 242 1129 270 L1129 301 Q1157 305 1171 337 Q1199 348 1185 391 Q1170 403 1134 400 L1089 399 Q1056 425 1022 419 L980 408 Q944 419 916 398 Q897 385 899 355 Q900 327 929 319 Z',
}
export default function MemberArtwork({ part, className = '', cutout = false }) {
  const id = useId()
  if (cutout) return <MemberCutout name={({ rabbit: 'rabbit', treats: 'desserts', box: 'empty-box' })[part]} className={`member-art member-art--${part} ${className}`} />
  const [x, y, width, height] = regions[part] || regions.rabbit
  const softRabbit = part === 'rabbit'
  return <svg className={`member-art member-art--${part} ${className}`} viewBox={`${x} ${y} ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs><clipPath id={id}>{silhouettes[part] ? <path d={silhouettes[part]} /> : <rect x={x} y={y} width={width} height={height} />}</clipPath>{softRabbit && <><filter id={`${id}-feather`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4" /></filter><mask id={`${id}-soft`} maskUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}><path d="M294 140H509V242L541 279 573 311V390L530 436H359L303 398 290 332Z" fill="white" filter={`url(#${id}-feather)`} /></mask></>}</defs><image href={assetHref("/images/마이.png")} width="1200" height="1312" clipPath={`url(#${id})`} mask={softRabbit ? `url(#${id}-soft)` : undefined} /></svg>
}

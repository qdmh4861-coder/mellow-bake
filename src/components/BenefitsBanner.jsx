import { assetHref } from '../appRouting'
import { useId } from 'react'
import icons from '../assets/benefits/illustrations.png'
import './BenefitsBanner.css'

const items = [
  ['신선한 재료', '매일 엄선한 재료로 만들어요', 0, 0],
  ['매일 만드는 디저트', '매일 신선하게 준비해요', 1, 0],
  ['스페셜티 커피', '향 좋은 커피와 함께해요', 0, 1],
  ['매장 안내', '가까운 매장을 확인해 보세요', 1, 1],
]

function Icon({ col, row }) {
  const clipId = useId()
  return <div className="benefits-guide-icon" aria-hidden="true"><svg viewBox="0 0 1 1"><defs><clipPath id={clipId}><rect width="1" height="1" /></clipPath></defs><image href={assetHref(icons)} x={-col} y={-row} width="2" height="2" preserveAspectRatio="none" clipPath={`url(#${clipId})`} /></svg><svg className="benefits-guide-spark" viewBox="0 0 32 36"><path d="M16 2Q17 16 30 18 17 19 16 34 14 20 2 18 14 16 16 2Z" fill="#ffd34b" /><path d="m24 4 2 4m-3 20 3 3" stroke="#ffe58b" strokeWidth="3" strokeLinecap="round" /></svg></div>
}

function Ribbon() {
  const patternId = useId()
  return <svg className="benefits-guide-ribbon" viewBox="0 0 150 85" aria-hidden="true"><defs><pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#fff2f7" /><path d="M0 0h7v14H0ZM0 0h14v7H0Z" fill="#fa8fbe" fillOpacity=".55" /></pattern></defs><g fill={`url(#${patternId})`} stroke="#fff8fc" strokeWidth="4" strokeLinejoin="round"><path d="M68 34 32 16 10 65l22-5 8 17 34-37ZM82 34l36-18 22 49-22-5-8 17-34-37Z" /><path d="M69 32C8-18-6 11 15 37c14 14 33 8 54-5ZM81 32c61-50 75-21 54 5-14 14-33 8-54-5Z" /><rect x="63" y="21" width="24" height="29" rx="9" /></g><path d="m27 18 37 13m60-13L87 31" stroke="#f16aab" strokeWidth="2" fill="none" /></svg>
}

export default function BenefitsBanner() {
  return <div className="benefits-guide" aria-label="MELLOW BAKE 안내"><div className="benefits-guide-grid">{items.map(([title, description, col, row]) => <div className="benefits-guide-item" key={title}><Icon col={col} row={row} /><div className="benefits-guide-copy"><h2>{title}</h2><p>{description}</p></div></div>)}</div><Ribbon /></div>
}

export function BenefitsWave() {
  const curve = 'M0 45C136 5 136 5 272 45S408 85 544 45 680 5 816 45 952 85 1088 45 1224 5 1360 45 1496 85 1632 45'
  return <svg className="benefits-guide-wave" viewBox="0 0 1632 120" preserveAspectRatio="none" aria-hidden="true"><path d={`${curve}V120H0Z`} fill="#fff7ed" /><path d={curve} fill="none" stroke="#fff9ed" strokeWidth="23" /><path d={curve} fill="none" stroke="#ff86b2" strokeWidth="17" /><path d={curve} fill="none" stroke="#ffd1e2" strokeWidth="12" /><path d={curve} fill="none" stroke="#ffb5d1" strokeWidth="3" /></svg>
}

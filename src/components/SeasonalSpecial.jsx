import './SeasonalSpecial.css'

// The supplied composite contains the lettering and dessert artwork already.
// Show only its central panel, preserving the existing outer background and waves.
const referenceImage = `${import.meta.env.BASE_URL}images/seasonal-special-reference.png`

function Flower({ className }) {
  return <svg className={className} viewBox="0 0 80 80" aria-hidden="true"><g fill="#fffdf5"><ellipse cx="40" cy="22" rx="12" ry="20" /><ellipse cx="40" cy="58" rx="12" ry="20" /><ellipse cx="22" cy="40" rx="20" ry="12" /><ellipse cx="58" cy="40" rx="20" ry="12" /><ellipse cx="40" cy="22" rx="12" ry="20" transform="rotate(45 40 40)" /><ellipse cx="40" cy="58" rx="12" ry="20" transform="rotate(45 40 40)" /></g><circle cx="40" cy="40" r="12" fill="#ffe454" /></svg>
}

export default function SeasonalSpecial() {
  return <div className={`seasonal-special-banner${referenceImage ? ' seasonal-special-banner--reference' : ''}`}>
    {referenceImage && <div className="seasonal-special-reference">
      <svg viewBox="158 155 1579 524" preserveAspectRatio="xMidYMid meet" role="img" aria-label="MELLOW BAKE SEASONAL SPECIAL — 가을의 달콤함을 담다. 마카롱, 컵케이크, 레몬과 딸기로 구성한 시즌 배너">
        <defs><clipPath id="seasonal-reference-panel"><rect x="158" y="155" width="1579" height="524" rx="50" /></clipPath></defs>
        <image href={referenceImage} width="1894" height="830" clipPath="url(#seasonal-reference-panel)" />
        <a href="#new-arrivals" aria-label="새로운 메뉴 보기"><rect className="seasonal-reference-link" x="350" y="555" width="295" height="65" rx="33" fill="transparent" /></a>
      </svg>
    </div>}
    <svg className="seasonal-special-cloud" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true"><path d="M73 72C105 15 182 11 224 48 264 0 351 12 377 49 452 10 525 51 518 105 588 120 610 197 552 235 572 300 509 341 450 325 412 394 324 383 293 343 223 392 154 356 142 314 59 350 2 292 40 240c-62 4-86-47-78-92C-7 118 16 77 73 72Z" fill="#fff6ef" /></svg>
    <div className="seasonal-special-copy">
      <span className="seasonal-special-brand">MELLOW BAKE</span>
      <h2 id="home-promo-title">SEASONAL<br />SPECIAL</h2>
      <svg className="seasonal-special-underline" viewBox="0 0 400 18" preserveAspectRatio="none" aria-hidden="true"><path d="M7 12C120 19 267-5 393 5" fill="none" stroke="#ff77ae" strokeWidth="5" strokeLinecap="round" /></svg>
      <p className="seasonal-special-subtitle">가을의 달콤함을 담다</p>
      <a className="seasonal-special-button" href="#new-arrivals">새로운 메뉴 보기 ↗</a>
    </div>
    <div className="seasonal-special-art" data-image-status="ready">
      <svg className="seasonal-reference-desserts" viewBox="820 155 917 524" role="img" aria-label="첨부 원본의 마카롱, 컵케이크, 레몬과 딸기"><image href={referenceImage} width="1894" height="830" /></svg>
    </div>
    <div className="seasonal-special-ornaments" aria-hidden="true"><span className="seasonal-special-heart">♡</span><svg className="seasonal-special-rays" viewBox="0 0 70 50"><path d="m8 21 2-16m20 21 9-16m5 30 18-8" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" /><path d="m8 21 2-16m20 21 9-16m5 30 18-8" fill="none" stroke="#ff6aa4" strokeWidth="5" strokeLinecap="round" /></svg><span className="seasonal-special-sparkle">✧</span><Flower className="seasonal-special-flower seasonal-special-flower--top" /><Flower className="seasonal-special-flower seasonal-special-flower--bottom" /></div>
  </div>
}






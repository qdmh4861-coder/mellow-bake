import './SeasonalSpecial.css'
import neonImage from '../assets/3ccc0e89-b2a3-47fd-95e7-53ab94c43e08.png'

export default function SeasonalSpecial() {
  return (
    <div className="seasonal-special-neon-banner">
      <div className="seasonal-special-neon-artwork">
        <svg
          id="home-promo-title"
          viewBox="0 30 1905 710"
          role="img"
          aria-label="MELLOW BAKE SEASONAL SPECIAL — 가을의 달콤함을 담다. 토끼 셰프와 컵케이크, 마카롱 네온 배너"
        >
          <image href={neonImage} width="1905" height="825" />
        </svg>
        <a
          className="seasonal-special-neon-link"
          href="#new-arrivals"
          aria-label="새로운 메뉴 보기"
        />
      </div>
    </div>
  )
}

import BenefitsBanner, { BenefitsWave } from './BenefitsBanner'
import { useId } from 'react'
import bannerReference from '../assets/home-banner-reference.png'
import './HomeHero.css'

function Bunny() {
  return <svg className="hero-bunny" viewBox="0 0 150 150" fill="none" aria-hidden="true" stroke="#74503b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M35 74C-3 42 17 8 35 30l21 36C30-2 67-8 76 31l8 35c54 2 68 70 26 73H40C9 139 2 96 35 74Z" fill="#fffdf9" />
    <path d="m28 42 15 23M61 27l10 35" stroke="#ffe0eb" strokeWidth="10" />
    <ellipse cx="48" cy="100" rx="4" ry="5" fill="#74503b" /><ellipse cx="82" cy="97" rx="4" ry="5" fill="#74503b" />
    <path d="m61 108 5 3 5-5m-5 5c-3 10-10 5-10 2m10-2c6 9 12 2 10 0" />
    <ellipse cx="34" cy="112" rx="10" ry="7" fill="#ffbdd0" stroke="none" /><ellipse cx="96" cy="108" rx="10" ry="7" fill="#ffbdd0" stroke="none" />
    <path d="m5 145 140-14" /><ellipse cx="43" cy="135" rx="16" ry="12" fill="#fffdf9" /><ellipse cx="108" cy="130" rx="16" ry="12" fill="#fffdf9" />
  </svg>
}

function ChefHat() {
  return <svg className="hero-chef-hat" viewBox="0 0 110 100" fill="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 57C-8 55 1 13 30 22c2-25 41-25 45 0 30-9 41 34 11 37l-4 32-61-6 2-28Z" fill="#fff" stroke="#fff" strokeWidth="13" />
    <path d="M23 57C-8 55 1 13 30 22c2-25 41-25 45 0 30-9 41 34 11 37" stroke="#ff7866" strokeWidth="5" />
    <path d="m24 58-3 27 61 6 4-31M23 75l60 6" stroke="#87573a" strokeWidth="4" />
  </svg>
}

function Heart({ className }) {
  return <svg className={`hero-heart ${className}`} viewBox="0 0 80 90" fill="none" aria-hidden="true"><path d="M40 78S-3 40 13 17c14-19 27 5 27 5s15-26 29-7C87 39 40 78 40 78Z" stroke="#fff" strokeWidth="12" strokeLinejoin="round" /><path d="M40 78S-3 40 13 17c14-19 27 5 27 5s15-26 29-7C87 39 40 78 40 78Z" stroke="#ff4999" strokeWidth="6" strokeLinejoin="round" /></svg>
}

function CakeVisual() {
  const clipId = useId()
  // Present only the cake and cream shape from the user's original composite.
  // Keep source coordinates and aspect ratio; no generated or substitute photo.
  return <svg className="hero-cake" viewBox="630 75 1080 545" role="img" aria-label="딸기와 흰 꽃으로 장식한 노란 드립 케이크, 마카롱과 컵케이크">
    <defs><clipPath id={clipId}><path d="M658 544C645 506 733 468 792 446c55-24 61-81 101-105 35-30 77-51 120-43-6-47 1-72 38-85l70-33c-5-33 4-73 31-69 27 4 44 33 64 43 0-24-2-43 13-60 20-11 24 26 22 54 29-8 54 2 70 31 48-16 95 18 112 42 56-37 118-36 145 3 19 27 16 71 34 105 20 38 85 62 101 113 11 38 10 65-22 91-17 13-27 18-37 24 4 17 5 39-10 48-30 20-73 11-111 4-45 15-94-2-145 1-63 6-112 8-164 1-39 9-77 2-105 3-27 8-47 4-64-4-47 8-68-1-93-5-31-3-60-14-86-20-47 11-81 1-85-19Z" /></clipPath></defs>
    <image href={bannerReference} width="1774" height="887" clipPath={`url(#${clipId})`} />
  </svg>
}

export default function HomeHero() {
  const cloudPath = 'M66 114C27 57 106 12 162 47c34-52 109-49 143-16 41-47 123-35 143 6 65-27 130 28 112 78 61 21 58 95 3 112 1 67-73 101-125 68-39 42-109 41-150 10-48 39-118 27-143-9-65 24-123-5-121-60-42-36-19-104 42-122Z'
  return <section className="home-section home-top-banner" aria-labelledby="home-hero-title">
    <div className="hero-banner">
      <p className="hero-banner__note">달콤한 시간이,<br />오늘을 더 특별하게.<svg viewBox="0 0 300 25" preserveAspectRatio="none" aria-hidden="true"><path d="M6 20Q140 1 293 7" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" /><path d="M6 20Q140 1 293 7" stroke="#ff5b9c" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></p>
      <div className="hero-banner__logo-group">
        <svg className="hero-banner__cloud" viewBox="0 0 610 340" preserveAspectRatio="none" aria-hidden="true"><path d={cloudPath} fill="#fff" /><path d={cloudPath} transform="translate(13 8) scale(.955)" fill="none" stroke="#ff94bb" strokeWidth="3" strokeDasharray="12 9" strokeLinecap="round" /></svg>
        <h1 id="home-hero-title" className="hero-banner__title"><span>MELLOW</span><span>BAKE</span></h1>
        <ChefHat /><Bunny /><Heart className="hero-heart--cloud" />
      </div>
      <CakeVisual />
      <Heart className="hero-heart--top" />
      <span className="hero-sparkle hero-sparkle--one" aria-hidden="true">✧</span><span className="hero-sparkle hero-sparkle--two" aria-hidden="true">✧</span>
      <p className="hero-banner__bubble">SWEET MOMENTS,<br />A BETTER DAY</p>
      <a className="hero-banner__order" href="#best-menu">바로 주문하기 <span aria-hidden="true">&gt;</span></a>
    </div>
    <BenefitsBanner />
    <BenefitsWave />
  </section>
}




import { useId } from 'react'
import desserts from '../assets/our-story/desserts.png'
import bunny from '../assets/our-story/bunny.png'
import './OurStory.css'

function NeonLogo() {
  const gradientId = useId()
  return <div className="story-neon" aria-label="MELLOW BAKE♡">
    <svg viewBox="0 0 620 320" aria-hidden="true"><defs><radialGradient id={gradientId}><stop stopColor="#ff8ebf" /><stop offset="1" stopColor="#f34299" /></radialGradient></defs><path className="story-neon-cloud" d="M99 279C7 286-13 176 62 146 50 67 144 32 195 76 213-9 333-7 364 66 433 6 536 44 530 119 637 110 663 241 574 270 459 304 209 305 99 279Z" fill={`url(#${gradientId})`} /><path className="story-neon-crown" d="m251 73-13-37 29 15 23-32 15 34 31-14-13 36Z" /></svg>
    <div className="story-neon-wordmark">MELLOW<br />BAKE<span>♡</span></div>
  </div>
}

function FeatureIcon({ type }) {
  return <svg className="story-feature-icon" viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'sprout' && <><path d="M31 54C31 33 17 36 13 14c24 0 29 18 18 27 6-24 17-30 29-32-1 22-13 34-29 32" fill="#b0d75c" stroke="#648b29" strokeWidth="3" /><path d="m20 23 12 18 17-20" stroke="#6e982b" strokeWidth="3" /></>}
    {type === 'chef' && <><path d="M16 34C1 33 4 11 19 13 24 0 42 4 44 14c17-4 21 21 4 23v19H16Z" fill="#fffaf3" stroke="#e84193" strokeWidth="3.5" /><path d="M17 46h30M26 24v9m12-9v9" stroke="#e84193" strokeWidth="3.5" /></>}
    {type === 'heart' && <path d="M32 55S4 39 5 21C6 3 26 3 32 19 39 3 59 4 59 21c0 18-27 34-27 34Z" fill="#ffadd2" stroke="#ec4295" strokeWidth="3.5" />}
  </svg>
}

function Feature({ icon, children }) {
  return <li className="story-feature"><svg className="story-feature-flower" viewBox="0 0 110 110" aria-hidden="true"><path d="M55 7C63 0 74 4 77 13c12-4 23 5 22 17 12 4 15 18 7 26 8 10 3 23-8 27 0 13-12 21-24 16-6 11-21 12-29 3-11 7-24 2-27-9C4 94-3 79 3 68c-9-10-5-24 7-28-3-13 7-24 20-22C35 5 46 1 55 7Z" /></svg><FeatureIcon type={icon} /><span>{children}</span></li>
}

function StoryRibbon() {
  return <div className="story-title-ribbon"><svg viewBox="0 0 420 135" aria-hidden="true"><path className="story-ribbon-banner" d="M13 54Q210-13 407 54l-19 23 5 43Q210 69 27 120l5-43Z" /><path className="story-ribbon-bow" d="M199 34C139-26 103 5 150 35c18 10 30 3 49-1ZM220 34C280-26 316 5 269 35c-18 10-30 3-49-1Z" /><path d="m165 17 37 16m52-17-36 17" fill="none" stroke="#ffb8db" strokeWidth="5" /><ellipse className="story-ribbon-knot" cx="210" cy="33" rx="15" ry="14" /></svg><span>OUR STORY</span></div>
}

export default function OurStory() {
  return <div className="story-content story-neon-content">
    <div className="story-artwork"><NeonLogo /><img className="story-desserts" src={desserts} alt="딸기 생크림 케이크와 크루아상, 컵케이크, 까눌레, 핑크 마카롱을 올린 핑크 체크무늬 천" loading="lazy" /></div>
    <div className="story-copy">
      <StoryRibbon />
      <h2 id="home-story-title"><span>일상 속 달콤한 쉼표,</span><strong>멜로우 베이크 ♡</strong></h2>
      <p className="story-introduction">멜로우 베이크는 좋은 재료와 정성으로<br className="story-desktop-break" /> 일상에 작은 행복과 달콤한 휴식을 전하는 디저트 브랜드입니다.</p>
      <div className="story-copy-lower"><div className="story-values-and-action">
        <ul className="story-features" aria-label="멜로우 베이크의 브랜드 특징"><Feature icon="sprout">좋은 재료</Feature><Feature icon="chef">정성 가득</Feature><Feature icon="heart">달콤한 휴식</Feature></ul>
        <a className="story-button" href="#visit">VIEW MORE <span aria-hidden="true">&gt;</span></a>
      </div><img className="story-chef-bunny" src={bunny} alt="핑크 짤주머니를 든 흰색 토끼 요리사" loading="lazy" /></div>
    </div>
  </div>
}

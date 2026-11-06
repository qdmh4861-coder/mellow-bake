import { useState } from 'react'
import './OurStory.css'

const bakeryPhoto = `${import.meta.env.BASE_URL}images/our-story-bakery.png`


function StoryLeftDecorations() {
  return <div className="story-left-decorations" aria-hidden="true">
    <svg className="story-left-ribbon" viewBox="0 0 160 75" fill="none"><path d="M4 66C37 10 81 30 59 61 34 89 38 22 92 8c42-9 51 18 31 28-26 11 0-43 32-22" stroke="#fa5a9f" strokeWidth="5" strokeLinecap="round" /></svg>
    <svg className="story-left-flower" viewBox="0 0 60 60" fill="none"><path d="M26 19C7 0 4 25 19 28-4 40 18 54 27 40c-2 24 25 20 17 1 22 7 24-20 4-20C60 2 32-5 26 19Z" fill="#ffe66b" stroke="#563628" strokeWidth="3.5" strokeLinejoin="round" /></svg>
    <svg className="story-left-star" viewBox="0 0 45 55" fill="none"><path d="M22 5c0 13-4 19-16 23 12 2 16 8 16 21 3-13 6-19 17-21C28 24 25 18 22 5Z" fill="#ff8aba" stroke="#563628" strokeWidth="3.5" strokeLinejoin="round" /></svg>
    <svg className="story-left-pink-flower" viewBox="0 0 65 75" fill="none"><path d="M32 7C46-2 57 11 52 21c18 9 12 26 0 29 4 18-17 24-26 12-16 10-29-6-20-19C-5 30 6 12 20 17 21 10 25 7 32 7Z" fill="#f678b3" stroke="#fff8ef" strokeWidth="3" strokeLinejoin="round" /></svg>
    <svg className="story-left-tulip" viewBox="0 0 55 80" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 7 25 21 34 7l2 16L48 14c5 22-18 33-32 19C7 25 11 16 14 7Z" fill="#f275b0" stroke="#563628" strokeWidth="3" /><path d="M28 39c1 16-6 25-15 32" stroke="#563628" strokeWidth="3" /><path d="m39 45 10 4M39 57l6 10" stroke="#fa5a9f" strokeWidth="4" /></svg>
  </div>
}
export default function OurStory() {
  const [photoUnavailable, setPhotoUnavailable] = useState(false)
  return <><div className="home-container story-content">
    <StoryLeftDecorations />
    <div className="story-layout">
      <div className="story-photo">{!photoUnavailable ? <img src={bakeryPhoto} alt="햇살이 들어오는 베이커리에 놓인 케이크와 크루아상, 디저트" loading="lazy" onError={() => setPhotoUnavailable(true)} /> : <p className="story-photo-pending">매장 사진 원본 연결 대기<span>our-story-bakery.png</span></p>}</div>
      <div className="story-copy"><span className="story-eyebrow">OUR STORY</span><h2 id="home-story-title">일상 속 달콤한 쉼표,<br className="story-mobile-break" /> 멜로우 베이크</h2><p>멜로우 베이크는 좋은 재료와 정성을 담아<br className="story-desktop-break" /> 일상 속 작은 행복을 전하는 디저트 브랜드입니다.</p><p>향긋한 커피와 달콤한 디저트가 어우러지는 공간에서<br className="story-desktop-break" /> 잠시나마 여유롭고 따뜻한 시간을 선물합니다.</p><a className="story-button" href="#visit">VIEW MORE <span aria-hidden="true">&gt;</span></a></div>
    </div>
  </div>
  <div className="story-bunny-layer" aria-hidden="true"><img className="story-bunny" src={`${import.meta.env.BASE_URL}images/our-story-bunny.png`} alt="" width="1272" height="1237" /></div>
  </>
}




import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import interior from '../assets/33d8952e-332b-433a-b667-64e49cd48144.png'
import bunny from '../assets/our-story/bunny.png'
import './Store.css'
import StoreMap from '../components/StoreMap'

// Portfolio example, not a verified operating store or registered map listing.
const address = '서울특별시 관악구 남부순환로 1820, 101동 203호'
const photos = [
  { id: 'interior', label: '매장 내부', src: interior },
  { id: 'bread', label: '갓 구운 빵', src: null, requestedPath: '/images/store/fresh-bread.jpg' },
  { id: 'seating', label: '매장 좌석과 인테리어', src: null, requestedPath: '/images/store/seating.jpg' },
  { id: 'desserts', label: '케이크와 디저트', src: null, requestedPath: '/images/store/desserts.jpg' },
  { id: 'exterior', label: '매장 외관', src: null, requestedPath: '/images/store/exterior.jpg' },
]
function StoreIcon({ type }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'pin' ? <><path d="M24 43S9 28 9 18a15 15 0 0 1 30 0c0 10-15 25-15 25Z" /><circle cx="24" cy="18" r="5" /></> : type === 'clock' ? <><circle cx="24" cy="24" r="19" /><path d="M24 12v13l10 5" /></> : type === 'calendar' ? <><rect x="6" y="10" width="36" height="32" rx="4" /><path d="M6 20h36M16 5v10M32 5v10M14 27h4m12 0h4m-20 8h4m12 0h4" /></> : type === 'phone' ? <path d="M10 5 5 12c0 14 17 31 31 31l7-6-10-9-6 5c-6-2-10-6-12-12l5-6L10 5Z" /> : type === 'bread' ? <><path d="M5 29c-2-13 5-20 19-20s21 7 19 20l-6 10H11L5 29Z" fill="#ffe6c2" /><path d="m14 13 4 11m5-14 3 12m5-9 4 11" /></> : type === 'cake' ? <><path d="M7 20h34v21H7ZM7 29h34M7 20 30 7l11 13" fill="#ffd6e1" /><path d="M29 7V3m-5 9h10" /><path d="M7 23c5-6 7 7 12 1s7 6 12 0 7 5 10 0" /></> : type === 'coffee' ? <><path d="M8 20h26v11a13 13 0 0 1-26 0V20Zm26 2h5a6 6 0 0 1 0 12h-5M5 43h36M14 14c-5-5 5-7 0-12m10 12c-5-5 5-7 0-12" /></> : <><path d="M12 24V13a12 12 0 0 1 24 0v11M7 22c-6 0-6 12 0 12h34c6 0 6-12 0-12s-6 7-6 7H13s0-7-6-7ZM7 34v9m34-9v9M13 43h22" /><circle cx="24" cy="16" r="1" /></>}
  </svg>
}
export default function Store() {
  const [selected, setSelected] = useState(0)
  const [failed, setFailed] = useState(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const [copying, setCopying] = useState(false)
  const mapDialog = useRef(null)
  const mapUrl = `https://map.naver.com/p/search/${encodeURIComponent(address)}`
  useEffect(() => {
    if (!mapOpen) return
    const dialog = mapDialog.current
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
    }
  }, [mapOpen])
  async function copyAddress() {
    if (copying) return
    setCopying(true)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(address)
      setCopyMessage('주소가 복사되었습니다.')
    } catch { setCopyMessage('주소를 복사하지 못했습니다. 아래 주소를 직접 선택해 복사해 주세요.') }
    finally { setCopying(false) }
  }
  const photo = photos[selected]
  return <div className="store-page"><HomeHeader /><main className="store-main">
    <header className="store-heading"><img className="store-heading-bunny" src={bunny} alt="" /><div><p className="store-english">Store Information ♡</p><h1>매장소개</h1><div className="store-ribbon">MELLOW BAKE STORE</div></div><div className="store-heading-cake"><StoreIcon type="cake" /><span aria-hidden="true">✧ ♡</span></div></header>
    <p className="store-intro"><span aria-hidden="true">❧</span><span>갓 구운 빵과 달콤한 디저트, 향긋한 커피가 있는<br />멜로우베이크의 오프라인 매장을 소개합니다.</span><span aria-hidden="true">❧</span></p>
    <div className="store-layout"><section className="store-gallery" aria-label="매장 사진"><div className="store-photo-caption">달콤한 공간<br />MELLOW BAKE <span aria-hidden="true">♡</span></div><div className="store-main-photo" aria-live="polite">{photo.src && failed !== photo.src ? <img src={photo.src} alt={`MELLOW BAKE ${photo.label} 예시 사진`} onError={() => setFailed(photo.src)} /> : <div className="store-photo-placeholder"><StoreIcon type={photo.id === 'bread' ? 'bread' : photo.id === 'desserts' ? 'cake' : 'chair'} /><strong>{photo.label}</strong><span>원본 사진 준비 중</span></div>}</div><div className="store-thumbnails" role="group" aria-label="매장 사진 선택">{photos.slice(1).map((item, index) => <button type="button" key={item.id} aria-label={`${item.label} 사진 선택 (원본 준비 중)`} aria-pressed={selected === index + 1} onClick={() => setSelected(index + 1)}>{item.src ? <img src={item.src} alt={item.label} /> : <><StoreIcon type={index === 0 ? 'bread' : index === 2 ? 'cake' : 'chair'} /><span>{item.label}</span><small>사진 준비 중</small></>}</button>)}</div><button className="store-interior-reset" type="button" aria-pressed={selected === 0} onClick={() => setSelected(0)}>매장 내부 사진 보기</button></section>
    <section className="store-information" aria-label="매장 이용 정보"><div className="store-info-card"><dl>{[['pin', '매장 주소', address], ['clock', '영업시간', '매일 10:00 ~ 21:00'], ['calendar', '휴무일', '연중무휴'], ['phone', '연락처', '010-1234-5678']].map(([icon, label, value]) => <div className="store-info-row" key={label}><dt><span className="store-info-icon"><StoreIcon type={icon} /></span>{label}</dt><dd>{value}{icon === 'clock' && <span className="store-last-order">라스트 오더 20:30</span>}</dd></div>)}</dl></div><button className="store-map-button" type="button" aria-haspopup="dialog" onClick={() => { setCopyMessage(''); setMapOpen(true) }}><StoreIcon type="pin" />지도 보기 (VIEW MAP) ›</button><p className="store-example-note">포트폴리오용 예시 매장 정보입니다.<br />지도는 주소 검색으로 열리며, 실제 매장 등록을 의미하지 않습니다.</p></section></div>
    <section className="store-features" aria-label="매장 특징">{[['bread', '매일 갓 구운 빵'], ['cake', '다양한 디저트'], ['coffee', '향긋한 커피'], ['chair', '편안한 휴식 공간']].map(([icon, text]) => <div key={icon}><StoreIcon type={icon} /><h2>{text}</h2></div>)}</section><span className="store-floating-heart" aria-hidden="true">♡</span>
  </main><div className="store-bottom-checks" aria-hidden="true" /><HomeFooter />
    <dialog className="store-map-dialog" ref={mapDialog} aria-labelledby="store-map-title" aria-describedby="store-map-example" onClose={() => setMapOpen(false)} onClick={event => { if (event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setMapOpen(false) }}>
      <button className="store-map-close" type="button" aria-label="지도 팝업 닫기" onClick={() => setMapOpen(false)}>×</button>
      <header className="store-map-heading"><img src={bunny} alt="" /><div><h2 id="store-map-title"><StoreIcon type="pin" />매장 위치 안내 ♡</h2><strong>MELLOW BAKE STORE</strong></div><StoreIcon type="bread" /></header>
      <div className="store-map-content"><StoreMap open={mapOpen} address={address} /><section className="store-map-details" aria-label="매장 안내"><dl>{[['pin', '주소', address], ['clock', '영업시간', '매일 10:00 ~ 21:00'], ['calendar', '휴무일', '연중무휴'], ['phone', '연락처', '010-1234-5678']].map(([icon, label, value]) => <div key={label}><dt><StoreIcon type={icon} />{label}</dt><dd>{value}{icon === 'clock' && <span className="store-last-order">라스트 오더 20:30</span>}</dd></div>)}</dl></section></div>
      <div className="store-map-actions"><button type="button" disabled={copying} onClick={copyAddress}><span aria-hidden="true">▢</span>{copying ? '복사 중…' : '주소 복사하기'}</button><a href={mapUrl} target="_blank" rel="noopener noreferrer"><span className="store-naver-mark" aria-hidden="true">N</span>네이버 지도에서 길찾기 ›</a></div>
      <p className="store-map-copy-status" role="status">{copyMessage}</p><p id="store-map-example" className="store-map-example">포트폴리오용 예시 매장입니다. 실제 등록된 매장 위치를 표시하지 않습니다.<br />네이버 지도에서 주소 검색 후 출발지와 목적지를 확인해 주세요.</p>
    </dialog>
  </div>
}

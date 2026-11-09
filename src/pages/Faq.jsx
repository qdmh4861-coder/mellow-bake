import { useId, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import './MyPage.css'
import './Claims.css'
import './Faq.css'

const categories = ['전체', '주문 / 결제', '배송', '취소 / 반품 / 교환', '환불', '상품', '회원 / 기타']
// Site-function examples, not live payment, shipping, refund, or food-storage policies.
const questions = [
  { id: 'delivery-time', category: '배송', question: '주문 후 배송은 얼마나 걸리나요?', answer: '배송 소요 기간은 상품 준비 상태와 배송 지역에 따라 달라질 수 있습니다. 주문한 상품의 진행 상태는 마이페이지 → 배송 조회에서 확인할 수 있습니다.', note: '현재 주문·배송 화면은 포트폴리오 데모이며 실제 배송 추적 서비스는 연결되지 않았습니다.', links: [['배송 조회', '/mypage/orders']] },
  { id: 'cancel-order', category: '주문 / 결제', question: '주문을 취소하고 싶어요. 어떻게 하나요?', answer: '마이페이지 → 주문 내역에서 주문 상태를 확인한 후 취소 가능 여부를 확인할 수 있습니다. 이미 배송 준비가 시작된 주문은 취소가 제한될 수 있습니다.', note: '현재 실제 주문 취소 기능은 준비 중이며, 확인 팝업만으로 주문이 취소되지는 않습니다.', links: [['주문 내역', '/mypage/orders/list']] },
  { id: 'return-item', category: '취소 / 반품 / 교환', question: '상품을 교환하거나 반품하고 싶어요.', answer: '주문 내역에서 해당 상품의 주문 상태를 확인하고 교환 또는 반품 가능 여부를 확인해 주세요. 자세한 사항은 1:1 문의하기를 이용해 주세요.', note: '현재 문의는 브라우저 데모로 저장되며 실제 운영자에게 전송되지는 않습니다.', links: [['주문 내역', '/mypage/orders/list'], ['1:1 문의하기', '/mypage/inquiry']] },
  { id: 'payment-methods', category: '주문 / 결제', question: '어떤 결제수단을 사용할 수 있나요?', answer: '현재 실제 주문·결제 서비스는 연결되지 않았습니다. 결제 내역에 표시되는 카드결제와 네이버페이는 포트폴리오 시연용 예시이며, 실제로 결제할 수 있는 수단을 의미하지 않습니다.', links: [['환불 / 결제 내역', '/mypage/payments']] },
  { id: 'order-history', category: '주문 / 결제', question: '주문 내역은 어디에서 확인하나요?', answer: '마이페이지 → 쇼핑정보 → 주문 내역에서 확인할 수 있습니다.', note: '현재 화면에는 실제 회원 주문과 구분된 시연용 예시가 표시됩니다.', links: [['주문 내역', '/mypage/orders/list']] },
  { id: 'change-address', category: '배송', question: '배송지를 변경하고 싶어요.', answer: '마이페이지 → 배송지 관리에서 등록된 배송지를 수정하거나 새 배송지를 추가할 수 있습니다. 이미 접수된 주문의 배송지 변경은 주문 진행 상태에 따라 제한될 수 있습니다.', note: '현재 배송지 관리는 이 브라우저에 저장하는 데모 기능이며, 기존 주문의 배송지를 변경하지 않습니다.', links: [['배송지 관리', '/mypage/addresses']] },
  { id: 'track-delivery', category: '배송', question: '배송 조회는 어디에서 하나요?', answer: '마이페이지 → 쇼핑정보 → 배송 조회에서 확인할 수 있습니다.', note: '실제 택배사 추적 서비스는 연결 준비 중입니다.', links: [['배송 조회', '/mypage/orders']] },
  { id: 'claims-history', category: '취소 / 반품 / 교환', question: '취소 / 반품 / 교환 내역은 어디에서 확인하나요?', answer: '마이페이지 → 쇼핑정보 → 취소 / 반품 / 교환 내역에서 확인할 수 있습니다.', note: '표시된 예시 신청 내역은 실제 취소·반품·교환 처리 기록이 아닙니다.', links: [['취소 / 반품 / 교환 내역', '/mypage/claims']] },
  { id: 'refund-history', category: '환불', question: '환불 내역은 어디에서 확인할 수 있나요?', answer: '마이페이지 → 쇼핑정보 → 환불 / 결제 내역에서 확인할 수 있습니다.', note: '현재 실제 환불 데이터가 없어 환불 내역은 빈 상태로 표시됩니다.', links: [['환불 / 결제 내역', '/mypage/payments']] },
  { id: 'refund-time', category: '환불', question: '환불은 언제 완료되나요?', answer: '환불 처리 기간은 결제수단과 처리 상태에 따라 달라질 수 있습니다. 정확한 진행 상태는 환불 내역 또는 1:1 문의하기를 통해 확인해 주세요.', note: '현재 실제 환불·상담 서버는 미연동 상태로, 환불 완료 일정을 확정해 안내하지 않습니다.', links: [['환불 / 결제 내역', '/mypage/payments'], ['1:1 문의하기', '/mypage/inquiry']] },
  { id: 'salt-storage', category: '상품', question: '소금빵은 어떻게 보관하면 좋나요?', answer: '상품의 신선도를 위해 구매 후 가능한 한 빨리 섭취하는 것을 권장합니다. 자세한 보관 방법은 소금빵 상품 상세페이지에 안내된 내용을 기준으로 확인해 주세요.', note: '상세페이지는 포트폴리오 시안입니다. 실제 보관 온도와 소비기한은 판매자의 제품별 확인 자료가 필요합니다.', links: [['소금빵 상세페이지', '/menu/salt-bread']] },
  { id: 'allergens', category: '상품', question: '상품에 알레르기 유발 성분이 포함되어 있나요?', answer: '각 상품의 상세페이지에서 알레르기 안내를 확인해 주세요. 알레르기가 있는 경우 구매 전에 원재료 정보를 반드시 확인해 주세요.', note: '확인 중인 정보가 있는 상품은 원재료·알레르기 성분을 확정된 정보로 보지 마세요.', links: [['전체 상품', '/menu']] },
  { id: 'profile', category: '회원 / 기타', question: '회원정보를 변경하고 싶어요.', answer: '마이페이지 → 회원정보 변경에서 이름, 연락처, 주소 등 변경 가능한 정보를 수정할 수 있습니다.', note: '현재 입력 검사와 화면만 구현되어 있으며 실제 회원정보 저장 서비스는 연결되지 않았습니다.', links: [['회원정보 변경', '/mypage/profile']] },
  { id: 'password', category: '회원 / 기타', question: '비밀번호를 변경하려면 어떻게 하나요?', answer: '마이페이지 → 회원정보 → 비밀번호 변경에서 변경할 수 있습니다.', note: '현재 실제 인증·비밀번호 변경 API가 없어 입력 검사 후 미연동 안내가 표시됩니다.', links: [['비밀번호 변경', '/mypage/password']] },
  { id: 'benefits', category: '회원 / 기타', question: '쿠폰과 포인트는 어디에서 확인하나요?', answer: '마이페이지 → 혜택관리에서 쿠폰함, 적립금 내역, 쿠폰·포인트 현황을 확인할 수 있습니다.', note: '현재 화면의 예시 쿠폰·포인트는 실제 잔액이 아니며, 실제 발급·사용 기능은 연결 준비 중입니다.', links: [['쿠폰함', '/mypage/coupons'], ['적립금 내역', '/mypage/points'], ['쿠폰·포인트 현황', '/mypage/benefits']] },
]
function Art({ box, className = '' }) {
  const clip = useId(), [x, y, width, height] = box.split(' ').map(Number)
  return <svg viewBox={box} className={className} aria-hidden="true"><defs><clipPath id={clip}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><image href="/images/자주 묻는질문.png" width="1536" height="1024" clipPath={`url(#${clip})`} /></svg>
}
function CategoryIcon({ index }) {
  if (!index) return null
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{index === 1 ? <><path d="M4 9h20v17H4ZM9 9V6a5 5 0 0 1 10 0v3" /></> : index === 2 ? <><path d="M2 20V5h15v15M17 10h5l4 5v5h-5M7 20h9" /><circle cx="6" cy="21" r="3" /><circle cx="20" cy="21" r="3" /></> : index === 3 ? <><path d="M5 10a10 10 0 0 1 17-4l3 4M3 8l2 4 5-1M23 18A10 10 0 0 1 6 22l-3-4m22 2-2-4-5 1" /></> : index === 4 ? <><path d="M3 10h22v6H3Zm3 6v11h16V16M14 10v17M14 10C0-5 3-3 11 3l3 7c12-17 17-7 0 0Z" /></> : index === 5 ? <><path d="M4 13h20v13H4ZM4 13l16-9 4 9M4 19h20M18 5V1" /></> : <><circle cx="14" cy="8" r="5" /><path d="M4 26v-3a10 10 0 0 1 20 0v3ZM3 20h22" /></>}</svg>
}
export default function Faq() {
  const [category, setCategory] = useState('전체')
  const [draft, setDraft] = useState(''), [query, setQuery] = useState('')
  const [opened, setOpened] = useState(questions[0].id)
  const prefix = useId()
  const normalized = query.trim().toLocaleLowerCase()
  const filtered = questions.filter(item => (category === '전체' || item.category === category) && `${item.question} ${item.answer} ${item.note || ''}`.toLocaleLowerCase().includes(normalized))
  function search(event) { event.preventDefault(); setQuery(draft); setOpened(null) }
  return <div className="mypage-page claims-page faq-page"><HomeHeader /><header className="claims-banner faq-banner"><Art box="336 84 180 151" /><span aria-hidden="true">♡ ✧</span><div><h1>마이페이지</h1><p>My Page</p></div><span aria-hidden="true">♡</span><Art box="1120 120 145 115" /></header><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card faq-content"><header className="faq-heading"><span aria-hidden="true">?</span><div><h2>자주 묻는 질문 (FAQ)</h2><p>고객님들께서 자주 궁금해하시는 내용을 모아 답변해드립니다.</p></div></header>
    <div className="faq-categories" role="group" aria-label="FAQ 카테고리">{categories.map((label, index) => <button key={label} type="button" aria-pressed={category === label} onClick={() => { setCategory(label); setOpened(null) }}><CategoryIcon index={index} />{label}</button>)}</div>
    <form className="faq-search" role="search" onSubmit={search}><label className="mypage-sr-only" htmlFor="faq-search-input">질문 또는 답변 검색</label><div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></svg><input type="search" id="faq-search-input" value={draft} placeholder="궁금한 내용을 검색해보세요." onChange={event => setDraft(event.target.value)} /></div><button type="submit">검색</button></form>
    <div className="faq-list" aria-live="polite">{filtered.length ? filtered.map(item => <article className={`faq-item${opened === item.id ? ' is-open' : ''}`} key={item.id} data-faq-id={item.id}><h3><button type="button" id={`${prefix}-${item.id}-question`} aria-expanded={opened === item.id} aria-controls={`${prefix}-${item.id}-answer`} onClick={() => setOpened(old => old === item.id ? null : item.id)}><span className="faq-q" aria-hidden="true">Q</span><span>{item.question}</span><svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m4 8 8 8 8-8" /></svg></button></h3><div className="faq-answer" id={`${prefix}-${item.id}-answer`} role="region" aria-labelledby={`${prefix}-${item.id}-question`} hidden={opened !== item.id}><span className="faq-a" aria-hidden="true">A</span><div><p>{item.answer}</p>{item.note && <p className="faq-note">{item.note}</p>}<div className="faq-related-links">{item.links.map(([label, href]) => <a href={href} key={href}>{label} ›</a>)}</div></div></div></article>) : <div className="faq-empty"><h3>검색 결과가 없습니다.</h3><p>원하는 답변을 찾지 못하셨다면 1:1 문의하기를 이용해 주세요.</p><a href="/mypage/inquiry">1:1 문의하기</a></div>}</div>
    <section className="faq-contact"><div><h3>궁금한 점이 해결되지 않으셨나요?</h3><p>1:1 문의하기를 통해 궁금한 내용을 남겨주세요.</p></div><a href="/mypage/inquiry">1:1 문의하기 ›</a></section><div className="faq-bottom" aria-hidden="true"><span>♡</span><Art box="411 914 145 77" /><span>✧</span><Art box="1310 866 194 130" /></div></section></div></main><HomeFooter /></div>
}

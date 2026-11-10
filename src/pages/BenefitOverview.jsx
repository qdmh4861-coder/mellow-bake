import { useState } from 'react'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { benefitSummary, couponStatus, getCoupons, getPointLedger, useCouponUpdates } from '../benefitData'
import './BenefitOverview.css'

// Read-only display samples. Never issued, saved or included in member balances.
const sampleCoupons = [
  { id: 'overview-example-welcome', title: '신규 가입 쿠폰', benefit: '10% 할인', conditions: '전 메뉴 10% 할인' },
  { id: 'overview-example-birthday', title: '생일 축하 쿠폰', benefit: '20% 할인', conditions: '전 메뉴 20% 할인' },
  { id: 'overview-example-thanks', title: '재방문 감사 쿠폰', benefit: '3,000원 할인', conditions: '10,000원 이상 구매 시 3,000원 할인' },
]
const statusText = { available: '사용 가능', used: '사용 완료', expired: '기간 만료' }
const points = value => `${value.toLocaleString('ko-KR')}P`
const day = value => value ? String(value).slice(0, 10).replaceAll('-', '.') : ''
function expiration(coupon) {
  const value = typeof coupon.expiresAt === 'string' ? coupon.expiresAt : ''
  return value && Number.isFinite(Date.parse(value.replaceAll('.', '-'))) ? `${day(value)}까지` : '유효기간 확인 필요'
}
function BenefitAmount({ value }) {
  const match = String(value || '').match(/^(.*?)\s*(할인[!！]?)$/)
  return <strong>{match ? <><span>{match[1].trim()}</span><small>{match[2]}</small></> : value}</strong>
}
export default function BenefitOverview({ examplePoints }) {
  useCouponUpdates()
  const summary = benefitSummary(), savedCoupons = getCoupons(), actualLedger = getPointLedger()
  const [examples, setExamples] = useState(true)
  const couponExamples = !savedCoupons.length && examples
  const pointExamples = !actualLedger.length && examples
  const coupons = [...(couponExamples ? sampleCoupons : savedCoupons)].sort((a, b) => (Date.parse(b.issuedAt) || 0) - (Date.parse(a.issuedAt) || 0)).slice(0, 3)
  const ledger = [...(pointExamples ? examplePoints : actualLedger)].sort((a, b) => (Date.parse(b.occurredAt) || 0) - (Date.parse(a.occurredAt) || 0)).slice(0, 3)
  let running = 0
  const balances = new Map([...actualLedger].sort((a, b) => (Date.parse(a.occurredAt) || 0) - (Date.parse(b.occurredAt) || 0)).map(row => {
    if (row.kind !== 'pending' && Number.isFinite(row.amount)) running += row.amount
    return [row.id, running]
  }))
  return <div className="benefit-status-content">
    <header className="benefit-status-banner"><div className="benefit-status-awning" aria-hidden="true" /><MemberCutout name="benefit-gift-rabbit" className="benefit-status-banner-rabbit" /><div className="benefit-status-title"><span aria-hidden="true">⋈</span><h1>쿠폰 및 포인트 현황</h1><p>보유 중인 쿠폰과 포인트를 한눈에 확인하세요!</p></div><MemberCutout name="wallet-desserts" className="benefit-status-banner-desserts" /></header>
    <div className="benefit-status-mode"><p>브라우저 데모 · 보유 수량과 잔액은 기존 데이터의 조회값입니다.{(couponExamples || pointExamples) && ' 예시 목록은 저장되거나 잔액에 합산되지 않습니다.'}</p>{(!savedCoupons.length || !actualLedger.length) && <button type="button" aria-pressed={examples} onClick={() => setExamples(!examples)}>{examples ? '예시 목록 숨기기' : '예시 목록 보기'}</button>}</div>
    <section className="benefit-status-summary" aria-label="보유 쿠폰과 포인트"><a href="/mypage/coupons"><MemberCutout name="coupon-bunny" /><span className="benefit-status-symbol" aria-hidden="true">♧</span><div><h2>보유 쿠폰</h2><strong>{summary.availableCoupons}장</strong></div><span className="benefit-status-arrow" aria-hidden="true">›</span></a><a href="/mypage/points"><MemberCutout name="benefit-bear-left" /><span className="benefit-status-symbol" aria-hidden="true">Ⓟ</span><div><h2>보유 포인트</h2><strong>{points(summary.points)}</strong></div><span className="benefit-status-arrow" aria-hidden="true">›</span></a></section>
    <div className="benefit-status-panels"><section className="benefit-status-coupons"><header><h2><span aria-hidden="true">♧</span> 내 쿠폰 ({summary.couponCount})</h2><a href="/mypage/coupons">전체 쿠폰 보기 ›</a></header>{couponExamples && <p className="benefit-status-example">아래 3종은 디자인 예시이며 실제 보유 쿠폰이 아닙니다.</p>}<div className="benefit-status-tickets">{coupons.map((coupon, index) => <a className="benefit-status-ticket" href="/mypage/coupons" key={coupon.id} data-coupon-id={coupon.id}><BenefitAmount value={coupon.benefit} /><div><h3>{coupon.title}</h3><p>{coupon.conditions || '사용 조건 확인 필요'}</p><small>{expiration(coupon)} · {couponExamples ? '예시' : statusText[couponStatus(coupon)]}</small></div><span aria-hidden="true">{index === 2 ? '♡' : '♧'}</span></a>)}</div>{!coupons.length && <div className="benefit-status-empty"><span aria-hidden="true">♧</span><p>보유한 쿠폰이 없습니다.</p><a href="/mypage/coupon-events">쿠폰 이벤트 보기 ›</a></div>}</section>
      <section className="benefit-status-points"><header><h2><span aria-hidden="true">Ⓟ</span> 포인트 내역</h2><a href="/mypage/points">전체 내역 보기 ›</a></header>{pointExamples && <p className="benefit-status-example">디자인 예시 거래입니다. 잔여 포인트는 계산하지 않습니다.</p>}<div className="benefit-status-table"><table><caption className="mypage-sr-only">{pointExamples ? '디자인 예시 포인트 내역' : '최근 포인트 내역'}</caption><thead><tr><th scope="col">일자</th><th scope="col">내용</th><th scope="col">포인트</th><th scope="col">잔여 포인트</th></tr></thead><tbody>{ledger.map(row => <tr key={row.id} data-point-id={row.id}><td>{day(row.occurredAt) || '확인 필요'}</td><td>{row.description}</td><td className={`benefit-status-amount benefit-status-amount--${row.kind}`}>{row.amount > 0 ? '+' : ''}{points(row.amount)}</td><td>{pointExamples ? '—' : points(balances.get(row.id) ?? 0)}</td></tr>)}{!ledger.length && <tr><td colSpan={4}><div className="benefit-status-empty"><span aria-hidden="true">Ⓟ</span><p>포인트 내역이 없습니다.</p></div></td></tr>}</tbody></table></div></section></div>
    <section className="benefit-status-guide"><MemberCutout name="cake-bunny" /><div><h2><span aria-hidden="true">▤</span> 쿠폰 이용 안내</h2><ul><li>쿠폰별 적용 상품과 최소 주문 금액을 확인해 주세요.</li><li>중복 사용과 발급 횟수는 쿠폰별 정책 확인이 필요합니다.</li><li>데모 발급은 브라우저에 저장되며 실제 쿠폰 사용은 회원·결제 서비스 연동 후 가능합니다.</li></ul></div><span className="benefit-status-guide-heart" aria-hidden="true">♡</span></section>
    <MemberDecoration variant="benefits" />
  </div>
}

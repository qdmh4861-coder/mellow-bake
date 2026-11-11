import { appLocation, appHref } from '../appRouting'
import { useState } from 'react'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import './MyPage.css'
import './Notices.css'

// Portfolio demonstration records supplied by the designer, not operating notices.
const exampleNotices = [
  { id: 'welcome', category: '서비스 공지', title: 'MELLOW BAKE에 오신 것을 환영합니다!', date: '2026.11.09', body: ['안녕하세요. MELLOW BAKE입니다.', 'MELLOW BAKE를 찾아주셔서 감사합니다.', '저희 사이트에서는 다양한 베이커리 메뉴를 둘러보고, 마음에 드는 상품을 찜하거나 장바구니에 담을 수 있습니다.', '상품별 상세페이지에서는 상품 소개, 재료 안내, 보관 방법, 고객 리뷰 등을 확인하실 수 있습니다.', '앞으로도 편리하고 즐거운 쇼핑 경험을 제공할 수 있도록 노력하겠습니다.', '감사합니다.'] },
  { id: 'coupon', category: '이벤트 안내', title: 'MELLOW BAKE 쿠폰 이벤트 이용 안내', date: '2026.11.07', body: ['안녕하세요. MELLOW BAKE입니다.', '쿠폰 이벤트 페이지에서 준비된 다양한 할인 혜택을 확인하실 수 있습니다.', "쿠폰을 발급받은 경우 마이페이지의 '쿠폰함'에서 보유 쿠폰을 확인할 수 있습니다.", '쿠폰별 사용 조건과 유효기간은 각 쿠폰의 안내를 참고해 주세요.', '일부 쿠폰은 중복 사용이 제한될 수 있으며, 실제 적용 가능한 혜택은 주문 과정에서 확인할 수 있습니다.', '감사합니다.'] },
  { id: 'delivery', category: '배송 안내', title: '주문 내역 및 배송 상태 확인 방법', date: '2026.11.05', body: ['안녕하세요. MELLOW BAKE입니다.', '주문 내역과 배송 상태는 마이페이지에서 확인할 수 있습니다.', "마이페이지의 '주문내역' 메뉴에서는 주문한 상품과 주문 상세정보를 확인할 수 있습니다.", "'배송조회' 메뉴에서는 주문별 배송 진행 상태를 확인할 수 있습니다.", '배송 정보는 주문 처리 상태에 따라 표시되며, 택배사 및 운송장 정보가 등록되지 않은 경우 조회가 제한될 수 있습니다.', '감사합니다.'] },
  { id: 'reviews', category: '서비스 공지', title: '상품 리뷰 작성 및 이용 안내', date: '2026.11.03', body: ['안녕하세요. MELLOW BAKE입니다.', '상품을 이용하신 후 리뷰를 작성하여 소중한 경험을 공유해 주세요.', '리뷰 작성 시 별점, 리뷰 제목, 리뷰 내용을 입력할 수 있으며 사진과 리뷰 태그도 선택할 수 있습니다.', "작성한 리뷰는 마이페이지의 '작성한 리뷰' 메뉴에서 확인할 수 있습니다.", '리뷰는 다른 고객이 상품을 선택하는 데 도움이 됩니다.', '감사합니다.'] },
  { id: 'support', category: '기타 안내', title: 'MELLOW BAKE 고객센터 이용 방법', date: '2026.11.01', body: ['안녕하세요. MELLOW BAKE입니다.', '사이트 이용 중 궁금한 점이 있다면 고객센터를 이용해 주세요.', "'자주 묻는 질문'에서는 주문, 배송, 결제, 회원정보와 관련된 안내를 확인할 수 있습니다.", "추가 문의가 필요한 경우 '1:1 문의하기' 메뉴를 이용해 주세요.", "작성한 문의는 '문의 내역'에서 확인할 수 있습니다.", '감사합니다.'] },
].map(notice => ({ ...notice, isExample: true, views: 0 }))
const categories = ['전체', '이벤트 안내', '배송 안내', '서비스 공지', '기타 안내']
const categoryClass = category => `notice-category notice-category--${categories.indexOf(category)}`
const relatedPages = {
  welcome: [['/menu', '메뉴 둘러보기']],
  coupon: [['/mypage/coupon-events', '쿠폰 이벤트'], ['/mypage/coupons', '쿠폰함']],
  delivery: [['/mypage/orders/list', '주문내역'], ['/mypage/orders', '배송조회']],
  reviews: [['/reviews', '전체 리뷰'], ['/mypage/reviews', '작성한 리뷰']],
  support: [['/mypage/faq', '자주 묻는 질문'], ['/mypage/inquiry', '1:1 문의하기']],
}

export default function Notices() {
  const params = new URLSearchParams(appLocation.search)
  const category = categories.includes(params.get('category')) ? params.get('category') : '전체'
  const query = params.get('q') || ''
  const [draft, setDraft] = useState(query)
  const detailId = appLocation.pathname.replace(/\/+$/, '').match(/^\/mypage\/notices\/([^/]+)$/)?.[1]
  const notice = exampleNotices.find(item => item.id === detailId)
  function listHref(nextCategory = category, nextQuery = query) {
    const search = new URLSearchParams()
    if (nextCategory !== '전체') search.set('category', nextCategory)
    if (nextQuery) search.set('q', nextQuery)
    return `/mypage/notices${search.size ? `?${search}` : ''}`
  }
  const filtered = [...exampleNotices].sort((a, b) => b.date.localeCompare(a.date)).filter(item => (category === '전체' || item.category === category) && `${item.title} ${item.body.join(' ')}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const currentIndex = exampleNotices.findIndex(item => item.id === detailId)
  const detailHref = id => `/mypage/notices/${id}${appLocation.search}`
  const adjacentPosts = [{ label: '이전 글', item: exampleNotices[currentIndex + 1] }, { label: '다음 글', item: exampleNotices[currentIndex - 1] }]
  return <div className="mypage-page notices-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className="mypage-content notices-content">
    <header className="notices-heading"><span className="notices-awning" aria-hidden="true" /><MemberCutout name="coupon-bunny" className="notices-banner-character" /><div><h1><span aria-hidden="true">♡</span> 공지사항 <span aria-hidden="true">♡</span></h1><p>멜로우 베이크의 새로운 소식과 안내를 확인해 보세요!</p></div><MemberCutout name="wallet-desserts" className="notices-banner-desserts" /></header>
    <p className="notices-example-label">포트폴리오 시연용 예시 공지사항입니다.</p>
    {detailId ? <><article className="notice-detail">{notice ? <><header><span className={categoryClass(notice.category)}>{notice.category}</span><h2>{notice.title}</h2><dl><div><dt>등록일</dt><dd>{notice.date}</dd></div><div><dt>조회수</dt><dd>{notice.views}</dd></div></dl></header><div className="notice-body">{notice.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="notice-demo-information">현재 화면은 프론트엔드 시연용입니다. 실제 결제·배송·환불 서비스와는 연결되어 있지 않습니다.</p><nav className="notice-related" aria-label="관련 페이지">{relatedPages[notice.id].map(([href,label]) => <a key={href} href={appHref(href)}>{label} →</a>)}</nav></div></> : <div className="notices-empty">해당 공지사항을 찾을 수 없습니다.</div>}</article><nav className="notice-post-navigation" aria-label="공지사항 이전 다음">{adjacentPosts.map(({label,item}) => <div key={label}><strong>{label}</strong>{notice && item ? <a href={appHref(detailHref(item.id))}>{item.title}</a> : <span>더 이상 공지사항이 없습니다.</span>}</div>)}</nav><a className="notice-back" href={appHref(listHref())}>목록으로</a></> : <>
      <div className="notices-tools"><nav aria-label="공지사항 분류">{categories.map(item => <a href={appHref(listHref(item))} key={item} aria-current={category === item ? 'true' : undefined}>{item}</a>)}</nav><form role="search" onSubmit={event => { event.preventDefault(); appLocation.assign(listHref(category, draft.trim())) }}><label className="mypage-sr-only" htmlFor="notice-search">공지사항 제목 또는 내용 검색</label><input id="notice-search" type="search" placeholder="제목 또는 내용을 검색해 주세요." value={draft} onChange={event => setDraft(event.target.value)} /><button type="submit" aria-label="검색"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></svg></button></form></div>
      <div className="notices-table-wrap"><table className="notices-table"><caption className="mypage-sr-only">공지사항 목록</caption><thead><tr>{['번호', '구분', '제목', '등록일', '조회수'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{filtered.length ? filtered.map(item => <tr key={item.id} onClick={event => { if (!event.target.closest("a")) appLocation.assign(detailHref(item.id)) }}><td data-label="number">{exampleNotices.length - exampleNotices.indexOf(item)}</td><td data-label="category"><span className={categoryClass(item.category)}>{item.category}</span></td><td data-label="title"><a href={appHref(detailHref(item.id))}>{item.title}</a></td><td data-label="date"><time>{item.date}</time></td><td data-label="views">{item.views}</td></tr>) : <tr><td colSpan={5} className="notices-empty">검색 조건에 맞는 공지사항이 없습니다.</td></tr>}</tbody></table></div>
    <MemberDecoration variant="wallet" /></>}
  </div></main><HomeFooter /></div>
}

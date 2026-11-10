import { questions } from './faqQuestions'
import { bestProducts } from './consultationProducts'
import { productHref } from './pages/productLinks'

export const consultationLinks = [
  ['메뉴 추천', '/menu'], ['주문·배송', '/mypage/orders/list'],
  ['쿠폰·포인트', '/mypage/benefits'], ['매장 안내', '/store'],
  ['1:1 문의', '/mypage/inquiry'], ['자주 묻는 질문', '/mypage/faq'],
]
// Local site guidance only. A future AI integration must call a server endpoint.
export function consultationReply(message) {
  if (/인기|추천|메뉴/.test(message)) return {
    text: 'HOME의 BEST MENU에 소개된 상품이에요. 실시간 판매 순위는 아닙니다. 상품을 선택하면 상세페이지를 확인할 수 있어요.',
    links: bestProducts.map(p => [p.koreanName + ' · ' + p.price, productHref(p.id)]),
  }
  if (/쿠폰|포인트|적립/.test(message)) return {
    text: '마이페이지 혜택관리에서 확인하실 수 있어요. 브라우저 데모 기능이며 실제 결제 할인 서비스는 연결되지 않았습니다.',
    links: [['쿠폰 이벤트', '/mypage/coupon-events'], ['쿠폰함', '/mypage/coupons'], ['적립금 내역', '/mypage/points']],
  }
  if (/매장|영업|주소/.test(message)) return {
    text: 'STORE의 포트폴리오 예시 정보입니다. 서울특별시 관악구 남부순환로 1820, 101동 203호 / 매일 10:00~21:00 / 라스트 오더 20:30 / 연중무휴. 실제 등록 매장 정보가 아닙니다.',
    links: [['매장 안내', '/store']],
  }
  const match = /배송/.test(message) ? questions[0] : questions.find(q => q.question === message || q.question.includes(message))
  if (match) return { text: [match.answer, match.note].filter(Boolean).join('\n'), links: match.links || [] }
  return { text: '등록된 안내에서 정확한 답변을 찾지 못했어요. FAQ 또는 1:1 문의하기를 이용해 주세요. 이 상담은 실제 AI나 운영자 연결이 아닌 사이트 안내 자동응답 데모입니다.', links: [['FAQ', '/mypage/faq'], ['1:1 문의하기', '/mypage/inquiry']] }
}

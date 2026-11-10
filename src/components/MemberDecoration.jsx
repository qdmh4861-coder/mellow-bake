import MemberCutout from './MemberCutout'

// Transparent objects on one continuous CSS cloud, never cropped page backgrounds.
const themes = {
  benefits: ['coupon-cake', 'review-cupcake', 'coupon-croissant', 'wallet-desserts'],
  reviews: ['review-bunny', 'coupon-croissant', 'review-cupcake', 'rabbit'],
  addresses: ['address', 'coupon-gift', 'review-cupcake', 'rabbit'],
  claims: ['rabbit', 'coupon-croissant', 'review-cupcake', 'desserts'],
  payments: ['rabbit', 'coupon-croissant', 'review-cupcake', 'coin-bunny'],
  event: ['coupon-gift', 'review-cupcake', 'coupon-croissant', 'coupon-bunny'],
  wallet: ['wallet-desserts', 'review-cupcake', 'coupon-croissant', 'rabbit'],
  points: ['coins', 'review-cupcake', 'coupon-croissant', 'coin-bunny'],
  faq: ['rabbit', 'review-cupcake', 'coupon-croissant', 'desserts'],
  inquiry: ['review-bunny', 'coupon-gift', 'review-cupcake', 'desserts'],
  inquiries: ['coupon-bunny', 'review-cupcake', 'coupon-croissant', 'rabbit'],
}
export default function MemberDecoration({ variant }) {
  const [left, smallLeft, smallRight, right] = themes[variant]
  return <div className={'member-decoration member-decoration--' + variant} aria-hidden="true"><MemberCutout name={left} className="member-decoration-character" /><MemberCutout name={smallLeft} className="member-decoration-small" /><span className="member-decoration-heart">&#9825;</span><MemberCutout name={smallRight} className="member-decoration-small" /><MemberCutout name={right} className="member-decoration-character" /></div>
}

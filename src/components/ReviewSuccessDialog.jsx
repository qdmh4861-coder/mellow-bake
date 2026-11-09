import { useLayoutEffect, useRef } from 'react'
import './ReviewSuccessDialog.css'

const goToMyReviews = () => window.location.assign('/mypage/reviews')

// Pass the successful save response from the review service, never form validity alone.
// Expected result: { success: true, review: { id, authorId, productId } }.
export default function ReviewSuccessDialog({ result, onComplete = goToMyReviews }) {
  const dialogRef = useRef(null)
  const completed = useRef(null)
  const review = result?.review
  const confirmed = result?.success === true && typeof review?.id === 'string' && review.id.length > 0 && typeof review?.authorId === 'string' && review.authorId.length > 0 && typeof review?.productId === 'string' && review.productId.length > 0
  const receiptKey = confirmed ? JSON.stringify([review.id, review.authorId, review.productId]) : null
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (confirmed && completed.current !== receiptKey) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) dialog.close()
  }, [confirmed, receiptKey])
  function finish() {
    if (!confirmed || completed.current === receiptKey) return
    completed.current = receiptKey
    dialogRef.current?.close()
    onComplete(review)
  }
  return <dialog className="review-success-dialog" ref={dialogRef} aria-labelledby="review-success-title" aria-describedby="review-success-description" onCancel={event => { event.preventDefault(); finish() }} onClose={finish}>
    <button className="review-success-close" type="button" aria-label="리뷰 등록 완료 팝업 닫기" onClick={finish}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg></button>
    <svg className="review-success-check" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="18" /><path d="m16 24 6 6 11-12" /></svg>
    <h2 id="review-success-title">리뷰가 등록되었습니다</h2>
    <p id="review-success-description">소중한 리뷰를 남겨주셔서 감사합니다.<br />작성하신 리뷰는 다른 고객에게 큰 도움이 됩니다.</p>
    <button className="review-success-confirm" type="button" autoFocus onClick={finish}>확인</button>
  </dialog>
}

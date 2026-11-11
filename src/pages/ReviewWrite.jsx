import { appLocation, appHref, assetHref } from '../appRouting'
import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import ReviewSuccessDialog from '../components/ReviewSuccessDialog'
import OrderProductImage from '../components/OrderProductImage'
import NewMenuProductImage from '../components/NewMenuProductImage'
import { reviewProducts, findReviewProduct } from '../reviewProducts'
import { getEditableReview, saveDemoReview } from '../reviewData'
import './ReviewWrite.css'

const tags = ['부드러워요', '촉촉해요', '바삭해요', '버터향이 좋아요', '재구매 할게요', '선물하기 좋아요', '커피와 잘 어울려요', '아이도 좋아해요']
function readImage(file) {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('사진을 읽지 못했습니다.')); reader.readAsDataURL(file) })
}
export default function ReviewWrite() {
  const params = new URLSearchParams(appLocation.search), editId = params.get('reviewId')
  const [existing] = useState(() => editId ? getEditableReview(editId) : null)
  const [productId, setProductId] = useState(existing?.productId || findReviewProduct(params.get('productId'))?.id || reviewProducts[0]?.id || '')
  const [rating, setRating] = useState(existing?.rating || 0)
  const [title, setTitle] = useState(existing?.title || '')
  const [body, setBody] = useState(existing?.body || '')
  const [photos, setPhotos] = useState(existing?.photos || [])
  const [selectedTags, setSelectedTags] = useState(existing?.tags || [])
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [reading, setReading] = useState(false)
  const [result, setResult] = useState(null)
  const saving = useRef(false)
  const product = findReviewProduct(productId)
  async function addPhotos(event) {
    const files = Array.from(event.target.files || []); event.target.value = ''
    if (files.length + photos.length > 5) { setNotice('사진은 최대 5장까지 첨부할 수 있습니다.'); return }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 1024 * 1024)) { setNotice('JPG·PNG·WEBP 사진을 장당 1MB 이하로 첨부해 주세요.'); return }
    setReading(true); setNotice('')
    try { const added = await Promise.all(files.map(readImage)); setPhotos(old => [...old, ...added]) }
    catch (error) { setNotice(error.message) }
    finally { setReading(false) }
  }
  function submit(event) {
    event.preventDefault()
    if (saving.current || result || reading) return
    const next = { rating: rating ? '' : '별점을 선택해 주세요.', title: title.trim() ? '' : '리뷰 제목을 입력해 주세요.', body: body.trim() ? '' : '리뷰 내용을 입력해 주세요.' }
    setErrors(next); setNotice('')
    if (Object.values(next).some(Boolean)) return
    if (!product || (editId && !existing)) { setNotice('상품 또는 수정할 리뷰를 확인할 수 없습니다.'); return }
    saving.current = true
    try { setResult(saveDemoReview({ productId, rating, title, body, photos, tags: selectedTags }, editId)) }
    catch (error) { setNotice(`리뷰를 저장하지 못했습니다. ${error.message || '브라우저 저장 공간을 확인해 주세요.'}`); saving.current = false }
  }
  return <div className="review-write-page"><HomeHeader /><main className="review-write-main"><header><span>MELLOW BAKE</span><h1>{editId ? '리뷰 수정' : '리뷰 작성'}</h1><p>맛있는 순간을 함께 나눠주세요!</p></header><p className="review-write-demo">프론트엔드 데모 · 이 브라우저에만 저장되며 로그인 회원 리뷰와 연동되지 않습니다.</p>
    {editId && !existing ? <div className="review-write-missing"><p>이 브라우저에서 수정할 수 있는 리뷰가 아닙니다.</p><a href={appHref("/mypage/reviews")}>작성한 리뷰로 돌아가기</a></div> : <form className="review-write-form" onSubmit={submit} noValidate>
    <div className="review-write-row"><label htmlFor="review-product">{editId ? '리뷰 상품' : '상품 선택'}</label><div><select id="review-product" value={productId} disabled={Boolean(editId) || Boolean(result)} onChange={event => setProductId(event.target.value)}>{reviewProducts.map(item => <option key={item.id} value={item.id}>{item.koreanName || item.korean}</option>)}</select>{product && <div className="review-write-product"><div>{product.id.startsWith('new-') ? <NewMenuProductImage product={product} /> : <OrderProductImage item={{ ...product, koreanName: product.koreanName || product.korean }} />}</div><section><h2>{product.koreanName || product.korean}</h2><strong>{typeof product.price === 'number' ? `${product.price.toLocaleString('ko-KR')}원` : product.price}</strong><p>{product.description}</p></section></div>}</div></div>
    <div className="review-write-row"><span>별점 평가 <em>*필수</em></span><div><div className="review-write-stars" role="group" aria-label="별점 선택">{[1, 2, 3, 4, 5].map(value => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={rating === value} disabled={Boolean(result)} onClick={() => setRating(value)} className={value <= rating ? 'is-filled' : ''}>{value <= rating ? '★' : '☆'}</button>)}</div>{errors.rating && <p className="review-write-error" role="alert">{errors.rating}</p>}</div></div>
    <div className="review-write-row"><label htmlFor="review-title">리뷰 제목 <em>*필수</em></label><div><input id="review-title" value={title} disabled={Boolean(result)} maxLength={150} required placeholder="리뷰 제목을 입력해 주세요" aria-invalid={Boolean(errors.title)} onChange={event => setTitle(event.target.value)} />{errors.title && <p className="review-write-error" role="alert">{errors.title}</p>}</div></div>
    <div className="review-write-row"><label htmlFor="review-body">리뷰 내용 <em>*필수</em></label><div><textarea id="review-body" value={body} disabled={Boolean(result)} maxLength={5000} required placeholder="맛과 식감, 좋았던 점을 남겨 주세요" aria-invalid={Boolean(errors.body)} onChange={event => setBody(event.target.value)} />{errors.body && <p className="review-write-error" role="alert">{errors.body}</p>}</div></div>
    <div className="review-write-row"><label htmlFor="review-photos">사진 첨부 <small>선택</small></label><div><input id="review-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={reading || Boolean(result)} onChange={addPhotos} /><small>최대 5장 · JPG, PNG, WEBP · 장당 1MB 이하</small><div className="review-write-photos">{photos.map((src, index) => <div key={index}><img src={assetHref(src)} alt={`첨부 사진 ${index + 1}`} /><button type="button" disabled={Boolean(result)} aria-label={`첨부 사진 ${index + 1} 삭제`} onClick={() => setPhotos(old => old.filter((_, i) => i !== index))}>×</button></div>)}</div></div></div>
    <div className="review-write-row"><span>리뷰 태그 <small>선택</small></span><div><p className="review-write-tag-help">다른 고객을 위해 해당되는 태그를 선택해 주세요. (최대 3개)</p><div className="review-write-tags">{[...new Set([...tags, ...selectedTags])].map(tag => <button type="button" key={tag} aria-pressed={selectedTags.includes(tag)} disabled={Boolean(result)} onClick={() => { if (selectedTags.includes(tag)) setSelectedTags(old => old.filter(value => value !== tag)); else if (selectedTags.length < 3) setSelectedTags(old => [...old, tag]); else setNotice('태그는 최대 3개까지 선택해 주세요.') }}>{tag}</button>)}</div></div></div>
    <p role="status" className="review-write-notice">{notice}</p><div className="review-write-actions"><a href={appHref("/mypage/reviews")}>취소</a><button type="submit" disabled={reading || Boolean(result)}>{reading ? '사진 처리 중…' : editId ? '수정 완료' : '리뷰 등록'}</button></div></form>}
  </main><ReviewSuccessDialog result={result} /><HomeFooter /></div>
}

import MemberCutout from '../components/MemberCutout'
import { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import { inquiryTypes, validateInquiry, validateInquiryPhotos, saveInquiry } from '../inquiryData'
import './MyPage.css'
import './Claims.css'
import './InquiryWrite.css'

function CameraIcon() { return <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h8l4-6h8l4 6h6v23H5Z" /><circle cx="20" cy="23" r="8" /><path d="M29 15h3" /></svg> }
function FieldIcon({ kind }) {
  return <svg className="inquiry-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{kind === 'type' ? <path d="M3 5h3v3H3z M9 6h12 M3 11h3v3H3z M9 12h12 M3 17h3v3H3z M9 18h12" /> : kind === 'title' ? <path d="m4 16 12-12 4 4L8 20H4v-4Z M13 7l4 4" /> : kind === 'body' ? <path d="M20 11a8 8 0 0 1-8 8H8l-5 3 1-7a8 8 0 1 1 16-4Z M7 11h2 m2 0h2 m2 0h2" /> : <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m4 18 6-6 4 4 3-3 4 5" /></>}</svg>
}
function PhotoPreview({ file, onRemove, disabled }) {
  const [url, setUrl] = useState('')
  useEffect(() => { const next = URL.createObjectURL(file); setUrl(next); return () => URL.revokeObjectURL(next) }, [file])
  return <div className="inquiry-photo-preview"><img src={url || undefined} alt={file.name || '첨부 사진'} /><button type="button" disabled={disabled} aria-label={`${file.name} 사진 삭제`} onClick={onRemove}>×</button></div>
}
export default function InquiryWrite() {
  const [type, setType] = useState(''), [title, setTitle] = useState(''), [body, setBody] = useState('')
  const [photos, setPhotos] = useState([]), [errors, setErrors] = useState({}), [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false), [receipt, setReceipt] = useState(null), [cancelling, setCancelling] = useState(false)
  const success = useRef(null), cancel = useRef(null), fileInput = useRef(null), inFlight = useRef(false), submissionId = useRef(null)
  useEffect(() => { if (receipt) success.current?.showModal() }, [receipt])
  useEffect(() => { if (cancelling) cancel.current?.showModal(); else cancel.current?.close() }, [cancelling])
  useEffect(() => {
    if (!receipt && !cancelling) return
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old }
  }, [receipt, cancelling])
  function attach(event) {
    const added = Array.from(event.target.files || []); event.target.value = ''
    const error = validateInquiryPhotos([...photos, ...added])
    if (error) { setNotice(error); return }
    setPhotos(old => [...old, ...added]); setNotice('')
  }
  async function submit(event) {
    event.preventDefault()
    if (inFlight.current || receipt) return
    const next = validateInquiry({ type, title, body }); setErrors(next); setNotice('')
    if (Object.keys(next).length) { document.getElementById(`inquiry-${Object.keys(next)[0]}`)?.focus(); return }
    inFlight.current = true; setBusy(true)
    submissionId.current ||= crypto.randomUUID()
    try { setReceipt(await saveInquiry({ type, title, body, photos }, submissionId.current)) }
    catch (error) { setNotice(error.name === 'QuotaExceededError' ? '브라우저 저장 공간이 부족합니다. 첨부 사진을 줄인 뒤 다시 등록해 주세요. 문의는 저장되지 않았습니다.' : `문의 저장에 실패했습니다. ${error.message || '브라우저 저장소 설정을 확인해 주세요.'}`) }
    finally { inFlight.current = false; setBusy(false) }
  }
  function leave() { if (type || title || body || photos.length) setCancelling(true); else window.location.assign('/mypage') }
  function complete() { window.location.assign(`/mypage/inquiries${receipt ? `?inquiryId=${encodeURIComponent(receipt.id)}` : ''}`) }
  const locked = busy || Boolean(receipt)
  return <div className="mypage-page claims-page inquiry-page"><HomeHeader /><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content inquiry-final-content"><section className="claims-card inquiry-content"><header className="inquiry-heading inquiry-final-banner"><span className="inquiry-awning" aria-hidden="true" /><MemberCutout name="coupon-bunny" /><div><h1><span aria-hidden="true">♡</span> 1:1 문의하기 <span aria-hidden="true">♡</span></h1><p>상품, 주문, 배송 등 궁금한 점을 문의하실 수 있습니다.</p></div><MemberCutout name="wallet-desserts" /></header><p className="claims-demo-note"><span aria-hidden="true">ⓘ </span>프론트엔드 데모 · 문의와 사진은 이 브라우저에만 저장되며 운영자에게 전송되지 않습니다. 저장한 문의는 문의 내역에서 확인할 수 있습니다.</p>
    <form onSubmit={submit} noValidate><div className="inquiry-form-card"><div className="inquiry-row"><label htmlFor="inquiry-type"><FieldIcon kind="type" />문의 유형 <em>*필수</em></label><div><select id="inquiry-type" required disabled={locked} value={type} aria-invalid={Boolean(errors.type)} onChange={event => { setType(event.target.value); setErrors(old => ({ ...old, type: '' })) }}><option value="">문의 유형을 선택해 주세요.</option>{inquiryTypes.filter(label => label !== "\uD658\uBD88 \uBB38\uC758").map(label => <option key={label}>{label}</option>)}</select>{errors.type && <p className="inquiry-error" role="alert">{errors.type}</p>}</div></div>
    <div className="inquiry-row"><label htmlFor="inquiry-title"><FieldIcon kind="title" />제목 <em>*필수</em></label><div><input id="inquiry-title" required maxLength={50} value={title} disabled={locked} aria-invalid={Boolean(errors.title)} placeholder="문의 제목을 입력해 주세요. (최대 50자)" onChange={event => { setTitle(event.target.value.slice(0, 50)); setErrors(old => ({ ...old, title: '' })) }} />{errors.title && <p className="inquiry-error" role="alert">{errors.title}</p>}</div></div>
    <div className="inquiry-row"><label htmlFor="inquiry-body"><FieldIcon kind="body" />문의 내용 <em>*필수</em></label><div><div className="inquiry-textarea"><textarea id="inquiry-body" required maxLength={1000} value={body} disabled={locked} aria-invalid={Boolean(errors.body)} placeholder="궁금한 내용을 자세히 입력해 주세요. (최대 1,000자)" onChange={event => { setBody(event.target.value.slice(0, 1000)); setErrors(old => ({ ...old, body: '' })) }} /><output aria-live="polite">{body.length.toLocaleString('ko-KR')} / 1,000</output></div>{errors.body && <p className="inquiry-error" role="alert">{errors.body}</p>}</div></div>
    <div className="inquiry-row"><span><FieldIcon kind="photos" />첨부 사진</span><div><input className="mypage-sr-only" id="inquiry-files" ref={fileInput} type="file" multiple accept="image/jpeg,image/png,image/gif" disabled={locked || photos.length >= 5} onChange={attach} /><div className="inquiry-photo-grid">{photos.length < 5 && <button type="button" className="inquiry-add-photo" disabled={locked} onClick={() => fileInput.current?.click()}><CameraIcon /><strong>사진 추가</strong><small>(최대 5장)</small></button>}{photos.map((file, index) => <PhotoPreview key={`${file.name}-${index}`} file={file} disabled={locked} onRemove={() => setPhotos(old => old.filter((_, i) => i !== index))} />)}{Array.from({ length: Math.max(0, (photos.length ? 5 - photos.length - (photos.length < 5 ? 1 : 0) : 4)) }, (_, index) => <div className="inquiry-photo-empty" key={index} aria-hidden="true">▧</div>)}</div><p className="inquiry-photo-help">ⓘ 파일 형식: JPG, PNG, GIF　|　최대 용량: 파일당 10MB 이하 · 최대 5장</p></div></div></div><p className="inquiry-notice" role="status">{notice}</p><div className="inquiry-form-actions"><button type="button" disabled={locked} onClick={leave}>취소</button><button type="submit" disabled={locked}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m3 10 18-7-7 18-3-8-8-3Z M11 13 21 3" /></svg>{busy ? '저장 중…' : '문의 등록'}</button></div></form>
    <div className="inquiry-final-decoration" aria-hidden="true"><MemberCutout name="wallet-desserts" /><span>♡</span><MemberCutout name="rabbit" /></div></section></div></main><HomeFooter />
    <dialog className="inquiry-dialog" ref={success} aria-labelledby="inquiry-success-title" onCancel={event => { event.preventDefault(); complete() }}><span className="inquiry-success-check" aria-hidden="true">✓</span><h2 id="inquiry-success-title">문의가 정상적으로 등록되었습니다.</h2><p>작성하신 문의는 문의 내역에서 확인하실 수 있습니다.</p><p className="inquiry-demo-note">브라우저 데모 저장이 완료되었습니다. 실제 운영자에게 접수되지 않았습니다.<br />확인을 누르면 작성한 문의 내역으로 이동합니다.</p>{receipt && <p className="inquiry-receipt">문의번호: {receipt.number} · 답변 대기</p>}<button type="button" onClick={complete}>확인</button></dialog>
    <dialog className="inquiry-dialog" ref={cancel} aria-labelledby="inquiry-cancel-title" onClose={() => setCancelling(false)}><h2 id="inquiry-cancel-title">작성 중인 문의를 취소하시겠습니까?</h2><div className="inquiry-dialog-actions"><button type="button" onClick={() => setCancelling(false)}>계속 작성</button><button type="button" onClick={() => window.location.assign('/mypage')}>작성 취소</button></div></dialog>
  </div>
}

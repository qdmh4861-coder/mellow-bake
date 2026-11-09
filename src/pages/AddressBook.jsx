import { useEffect, useId, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import { useAddresses, initializeDemoAddresses, saveAddress, deleteAddress, setDefaultAddress, validateAddress } from '../addressStore'
import './MyPage.css'
import './Claims.css'
import './AddressBook.css'

const empty = { name: '', recipient: '', phone: '', postcode: '', address: '', detail: '', isDefault: false }
function Art({ box, className = '' }) {
  const clip = useId(), [x, y, width, height] = box.split(' ').map(Number)
  return <svg className={className} viewBox={box} aria-hidden="true"><defs><clipPath id={clip}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><image href="/images/배송관리.png" width="1536" height="1024" clipPath={`url(#${clip})`} /></svg>
}
function AddressIcon({ type }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === 'truck' ? <><path d="M2 24V6h18v18M20 12h5l5 6v6h-6M7 24h12" /><circle cx="6" cy="25" r="3" /><circle cx="23" cy="25" r="3" /></> : type === 'office' ? <><path d="M7 29V3h18v26M4 29h24M14 29v-7h5v7M12 8h2m5 0h2m-9 6h2m5 0h2" /></> : type === 'gift' ? <><path d="M3 12h26v6H3Zm3 6v12h20V18M16 12v18" /><path d="M16 12C-1-3 6-3 13 4l3 8c13-20 19-8 0 0Z" /></> : <><path d="m2 14 14-12 14 12M6 12v17h8v-9h5v9h7V12" /></>}</svg>
}
export default function AddressBook() {
  const addresses = useAddresses()
  const [notice, setNotice] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [editorError, setEditorError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [replacement, setReplacement] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const editor = useRef(null), confirmation = useRef(null)
  useEffect(() => { try { initializeDemoAddresses() } catch { setNotice('배송지를 불러오거나 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.') } }, [])
  useEffect(() => { if (editorOpen) editor.current?.showModal(); else editor.current?.close() }, [editorOpen])
  useEffect(() => { if (deleting) confirmation.current?.showModal(); else confirmation.current?.close() }, [deleting])
  useEffect(() => {
    if (!editorOpen && !deleting) return
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old }
  }, [editorOpen, deleting])
  function edit(item = null) { setEditingId(item?.id || null); setValues(item ? { ...empty, ...item } : { ...empty }); setErrors({}); setEditorError(''); setEditorOpen(true) }
  function submit(event) {
    event.preventDefault(); const next = validateAddress(values); setErrors(next)
    if (Object.keys(next).length) { document.getElementById(`address-${Object.keys(next)[0]}`)?.focus(); return }
    try { saveAddress(values, editingId); setEditorOpen(false); setNotice(editingId ? '배송지 정보를 수정했습니다.' : '배송지를 추가했습니다.') }
    catch (error) { setEditorError(`저장하지 못했습니다. ${error.message}`) }
  }
  function makeDefault(id) { try { setDefaultAddress(id); setNotice('기본 배송지를 변경했습니다.') } catch (error) { setNotice(`변경하지 못했습니다. ${error.message}`) } }
  function requestDelete(item) { setDeleting(item); setReplacement(''); setDeleteError('') }
  function confirmDelete() {
    try { deleteAddress(deleting.id, replacement || null); setDeleting(null); setNotice('배송지를 삭제했습니다.') }
    catch (error) { setDeleteError(`삭제하지 못했습니다. ${error.message}`) }
  }
  return <div className="mypage-page claims-page address-book-page"><HomeHeader /><header className="claims-banner address-book-banner"><Art box="336 82 175 151" /><span aria-hidden="true">♡ ✧</span><div><h1>마이페이지</h1><p>My Page</p></div><span aria-hidden="true">♡</span><Art box="1120 118 140 115" /></header><main className="mypage-layout claims-layout"><MyPageSidebar /><div className="mypage-content"><section className="claims-card address-book-content"><header className="address-book-heading"><AddressIcon type="truck" /><div><h2>배송지 관리</h2><p>주문 시 사용할 배송지를 등록하고 관리할 수 있습니다.</p></div><button className="address-book-add" type="button" onClick={() => edit()}>＋ 배송지 추가</button></header><p className="claims-demo-note">프론트엔드 데모 · 이 브라우저에 저장됩니다. 초기 주소와 연락처는 포트폴리오 예시이며 실제 회원정보가 아닙니다. 예시 수령인 이름은 실제 주문 전에 수정해 주세요.</p><p className="address-book-notice" role="status">{notice}</p><p className="address-book-count">등록 배송지 {addresses.length}개</p>
    <div className="address-book-list">{addresses.length ? addresses.map(item => <article className={`address-book-card${item.isDefault ? ' is-default' : ''}`} key={item.id} data-address-id={item.id}><div className="address-book-icon"><AddressIcon type={item.id === 'demo-office' ? 'office' : item.id === 'demo-family' ? 'gift' : 'home'} /></div><div className="address-book-info">{item.isDefault && <span className="address-book-default">기본 배송지</span>}<h3>{item.name}</h3><p>({item.postcode}) {item.address}{item.detail ? `, ${item.detail}` : ''}</p><p>{item.phone}</p><small>받는 사람: {item.recipient || '확인 필요'}</small></div><div className="address-book-actions">{!item.isDefault && <button type="button" onClick={() => makeDefault(item.id)}>☆ 기본설정</button>}<button type="button" onClick={() => edit(item)}>✎ 수정</button><button type="button" onClick={() => requestDelete(item)}>삭제</button></div>{item.isDefault && <span className="address-book-bookmark" aria-hidden="true">★</span>}</article>) : <div className="address-book-empty">등록된 배송지가 없습니다. 배송지를 추가해 주세요.</div>}</div>
    <div className="address-book-bottom" aria-hidden="true"><span>♡</span><Art box="410 914 145 78" /><span>✧</span><Art box="1315 855 155 139" /></div>
    </section></div></main><HomeFooter />
    <dialog className="address-book-dialog" ref={editor} aria-labelledby="address-editor-title" onClose={() => setEditorOpen(false)}><button className="address-book-close" type="button" aria-label="배송지 입력 닫기" onClick={() => setEditorOpen(false)}>×</button><h2 id="address-editor-title">{editingId ? '배송지 수정' : '배송지 추가'}</h2><form onSubmit={submit} noValidate>{[['name', '배송지 이름', 'text', 40], ['recipient', '받는 사람', 'text', 40], ['phone', '연락처', 'tel', 13], ['postcode', '우편번호', 'text', 5], ['address', '기본 주소', 'text', 160], ['detail', '상세 주소', 'text', 100]].map(([key, label, type, maxLength]) => <div className="address-book-field" key={key}><label htmlFor={`address-${key}`}>{label}{key !== 'detail' && <em> *</em>}</label><input id={`address-${key}`} type={type} maxLength={maxLength} inputMode={key === 'postcode' ? 'numeric' : undefined} autoComplete="off" required={key !== 'detail'} value={values[key]} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `address-${key}-error` : undefined} onChange={event => { setValues(old => ({ ...old, [key]: event.target.value })); setErrors(old => ({ ...old, [key]: '' })); setEditorError('') }} />{errors[key] && <p id={`address-${key}-error`} className="address-book-error" role="alert">{errors[key]}</p>}</div>)}<label className="address-book-default-check"><input type="checkbox" checked={Boolean(values.isDefault)} disabled={Boolean(editingId && addresses.find(item => item.id === editingId)?.isDefault)} onChange={event => setValues(old => ({ ...old, isDefault: event.target.checked }))} />기본 배송지로 설정</label><p className="address-book-error" role="status">{editorError}</p><div className="address-book-dialog-actions"><button type="button" onClick={() => setEditorOpen(false)}>취소</button><button type="submit">저장</button></div></form></dialog>
    <dialog className="address-book-dialog address-book-delete" ref={confirmation} aria-labelledby="address-delete-title" onClose={() => setDeleting(null)}><h2 id="address-delete-title">선택한 배송지를 삭제하시겠습니까?</h2><p>{deleting?.name}</p>{deleting?.isDefault && addresses.length > 1 && <div className="address-book-field"><label htmlFor="address-replacement">다른 배송지를 기본 배송지로 지정해 주세요.</label><select id="address-replacement" value={replacement} onChange={event => setReplacement(event.target.value)}><option value="">새 기본 배송지 선택</option>{addresses.filter(item => item.id !== deleting.id).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>}{deleting?.isDefault && addresses.length === 1 && <p>마지막 배송지를 삭제하면 기본 배송지도 없어집니다.</p>}<p className="address-book-error" role="status">{deleteError}</p><div className="address-book-dialog-actions"><button type="button" onClick={() => setDeleting(null)}>취소</button><button type="button" onClick={confirmDelete}>삭제하기</button></div></dialog>
  </div>
}

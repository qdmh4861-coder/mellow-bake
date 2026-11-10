import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import MemberCutout from '../components/MemberCutout'
import MemberDecoration from '../components/MemberDecoration'
import { useDemoUser } from '../demoAuth'
import { loadMemberProfile, saveMemberProfile } from '../memberProfileStore'
import { validateSignupField } from './signupValidation'
import './MyPage.css'
import './Profile.css'

const blank = { name: '', year: '', month: '', day: '', gender: '', phone: '', postcode: '', address: '', detail: '' }
function load() {
  try { const data = loadMemberProfile(); const [year = '', month = '', day = ''] = (data?.birth || '').split('-'); return { values: { ...blank, ...data, year, month, day }, error: '' } }
  catch { return { values: blank, error: '저장된 회원정보를 불러오지 못했습니다. 브라우저 저장소를 확인해 주세요.' } }
}
function daysIn(year, month) { return month ? new Date(Number(year) || 2000, Number(month), 0).getDate() : 31 }
function validate(values) {
  const errors = {}, birth = `${values.year}-${values.month}-${values.day}`, date = new Date(`${birth}T00:00:00Z`)
  if (!values.name.trim()) errors.name = '이름을 입력해 주세요.'
  if (!values.year || !values.month || !values.day || Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== birth || birth > new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())) errors.birth = '유효한 생년월일을 모두 선택해 주세요.'
  if (!['female', 'male'].includes(values.gender)) errors.gender = '성별을 선택해 주세요.'
  const phone = values.phone.replace(/\D/g, '')
  const phoneError = validateSignupField('phone', { phone })
  if (!phone || phoneError) errors.phone = phoneError || '휴대폰 번호를 입력해 주세요.'
  if (!/^\d{5}$/.test(values.postcode) || !values.address.trim()) errors.address = '우편번호 5자리와 기본 주소를 입력해 주세요.'
  return errors
}
function Icon({ kind }) {
  const paths = { user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 22v-2a8 8 0 0 1 16 0v2', mail: 'M3 5h18v14H3V5Zm0 0 9 8 9-8', home: 'm2 11 10-9 10 9M5 9v13h14V9M10 22v-8h4v8', lock: 'M5 11h14v11H5V11Zm3 0V6a4 4 0 0 1 8 0v5' }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]} /></svg>
}
export default function Profile() {
  const user = useDemoUser(), [loaded] = useState(load), [values, setValues] = useState(loaded.values)
  const [errors, setErrors] = useState({}), [notice, setNotice] = useState(loaded.error), [saved, setSaved] = useState(false)
  const [phoneEditing, setPhoneEditing] = useState(false), previousPhone = useRef(values.phone)
  const dialog = useRef(null), form = useRef(null), saving = useRef(false)
  const [year] = useState(() => new Date().getFullYear())
  const dirty = JSON.stringify(values) !== JSON.stringify(loaded.values)
  function change(key, value, errorKey = key) {
    setValues(old => { const next = { ...old, [key]: value }; if ((key === 'year' || key === 'month') && Number(next.day) > daysIn(next.year,next.month)) next.day = ''; return next })
    setErrors(old => ({ ...old, [errorKey]: '' })); setNotice('')
  }
  function props(key) { return { 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `profile-${key}-error` : undefined } }
  function error(key) { return errors[key] && <p className="profile-error" id={`profile-${key}-error`} role="alert">{errors[key]}</p> }
  function submit(event) {
    event.preventDefault(); if (saving.current || saved) return
    if (loaded.error) { setNotice('기존 회원정보를 확인할 수 없어 덮어쓰지 않았습니다. 저장소 접근을 확인한 뒤 새로고침해 주세요.'); return }
    if (!user) { setNotice('로그인이 필요합니다. 로그인 페이지에서 데모 로그인 후 이용해 주세요.'); return }
    const next = validate(values); setErrors(next)
    if (Object.keys(next).length) { requestAnimationFrame(() => form.current?.querySelector('[aria-invalid="true"]')?.focus()); return }
    saving.current = true
    try { const updated = saveMemberProfile({ ...values, birth: `${values.year}-${values.month}-${values.day}` }); setValues(old => ({ ...old, addressId: updated.addressId })); setSaved(true); setPhoneEditing(false); setNotice('이 브라우저에 회원정보와 기본 배송지를 저장했습니다.'); dialog.current?.showModal() }
    catch (error) { setNotice(`저장하지 못했습니다. ${error.name === 'QuotaExceededError' ? '브라우저 저장 공간이 부족합니다.' : error.message}`) }
    finally { saving.current = false }
  }
  function cancel(event) { if (dirty && !window.confirm('수정 중인 내용을 저장하지 않고 마이페이지로 이동하시겠습니까?')) event.preventDefault() }
  return <div className="mypage-page profile-page"><HomeHeader /><main className="mypage-layout"><MyPageSidebar /><div className="mypage-content profile-content profile-final">
    <header className="profile-final-banner"><span className="profile-awning" aria-hidden="true" /><MemberCutout name="coupon-bunny" /><div><h1><span aria-hidden="true">♡</span> 회원정보 수정 <span aria-hidden="true">♡</span></h1><p>회원님의 정보를 수정할 수 있습니다.</p></div><MemberCutout name="wallet-desserts" /></header>
    <p className="profile-final-note">ⓘ 변경한 정보는 마이페이지와 관련 서비스에 동일하게 적용됩니다.<br /><small>프론트엔드 데모 · 이 브라우저에만 저장됩니다. 실제 회원 서버와 연동되지 않으며 과거 주문의 배송정보는 변경하지 않습니다.</small></p>
    {!user && <p className="profile-login-note">로그인 후 이용해 주세요. <a href="/login?returnTo=%2Fmypage%2Fprofile">로그인하기</a></p>}
    <form className="profile-final-form" ref={form} noValidate onSubmit={submit}>
      <section className="profile-info-card"><header><Icon kind="user" /><h2>기본 정보</h2><p>회원님의 기본 정보를 확인하고 수정할 수 있습니다.</p></header><div className="profile-info-fields profile-with-art">
        <div className="profile-row"><label htmlFor="profile-id">아이디</label><div className="profile-controls profile-id-controls"><input id="profile-id" value={user?.email || ''} readOnly placeholder="로그인 후 표시됩니다" /><span className="profile-id-note">아이디는 변경할 수 없습니다.</span></div></div>
        <div className="profile-row"><label htmlFor="profile-name">이름 <em>*필수</em></label><div><input id="profile-name" value={values.name} autoComplete="name" placeholder="이름을 입력해 주세요" maxLength={40} {...props('name')} onChange={event => change('name',event.target.value)} />{error('name')}</div></div>
        <div className="profile-row"><span id="profile-birth-label">생년월일 <em>*필수</em></span><div><div className="profile-segments" role="group" aria-labelledby="profile-birth-label">{[['year','연도',Array.from({length:year-1899},(_,i)=>String(year-i))],['month','월',Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0'))],['day','일',Array.from({length:daysIn(values.year,values.month)},(_,i)=>String(i+1).padStart(2,'0'))]].map(([key,label,options]) => <select key={key} aria-label={`출생 ${label}`} value={values[key]} {...props('birth')} onChange={event => change(key,event.target.value,'birth')}><option value="">{label}</option>{options.map(option => <option key={option} value={option}>{option}{label === '연도' ? '년' : label}</option>)}</select>)}</div>{error('birth')}</div></div>
        <div className="profile-row"><span id="profile-gender-label">성별 <em>*필수</em></span><div><div className="profile-gender" role="group" aria-labelledby="profile-gender-label">{[['female','여자'],['male','남자']].map(([value,label]) => <label key={value}><input type="radio" name="gender" checked={values.gender === value} value={value} {...props('gender')} onChange={() => change('gender',value)} />{label}</label>)}</div>{error('gender')}</div></div>
        <MemberCutout name="rabbit" className="profile-card-art" />
      </div></section>
      <section className="profile-info-card"><header><Icon kind="mail" /><h2>연락처 정보</h2><p>이메일과 휴대폰 번호를 확인할 수 있습니다.</p></header><div className="profile-info-fields">
        <div className="profile-row"><label htmlFor="profile-email">이메일</label><div className="profile-controls"><input id="profile-email" type="email" readOnly value={user?.email || ''} /><button className="profile-soft-button" type="button" onClick={() => setNotice('이메일은 로그인 아이디와 연결되어 있습니다. 데모에서는 이메일 인증과 계정 변경을 지원하지 않아 수정할 수 없습니다.')}>이메일 변경</button></div></div>
        <div className="profile-row"><label htmlFor="profile-phone">휴대폰 번호 <em>*필수</em></label><div><div className="profile-controls"><input id="profile-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={13} readOnly={!phoneEditing} placeholder="번호 변경을 눌러 입력해 주세요" value={values.phone} {...props('phone')} onChange={event => change('phone',event.target.value.replace(/[^\d-]/g,''))} /><button className="profile-soft-button" type="button" onClick={() => { if (phoneEditing) change('phone',previousPhone.current); else previousPhone.current = values.phone; setPhoneEditing(!phoneEditing) }}>{phoneEditing ? '변경 취소' : '번호 변경'}</button></div>{error('phone')}</div></div>
      </div></section>
      <section className="profile-info-card"><header><Icon kind="home" /><h2>주소 정보</h2><p>배송지 관리의 기본 배송지와 함께 저장됩니다.</p></header><div className="profile-info-fields profile-with-art">
        <div className="profile-row"><label htmlFor="profile-postcode">주소 <em>*필수</em></label><div><div className="profile-controls profile-postcode-controls"><input id="profile-postcode" value={values.postcode} maxLength={5} inputMode="numeric" placeholder="우편번호" autoComplete="postal-code" {...props('address')} onChange={event => change('postcode',event.target.value.replace(/\D/g,''),'address')} /><button className="profile-soft-button" type="button" onClick={() => setNotice('우편번호 검색 서비스는 아직 연결되지 않았습니다. 우편번호와 기본 주소를 직접 입력하거나 배송지 관리에서 기본 배송지를 선택해 주세요.')}>우편번호 찾기</button></div><input className="profile-address-input" aria-label="기본 주소" placeholder="기본 주소" autoComplete="address-line1" value={values.address} {...props('address')} onChange={event => change('address',event.target.value)} /><input className="profile-address-input" aria-label="상세 주소" placeholder="상세 주소 (선택)" autoComplete="address-line2" value={values.detail} onChange={event => change('detail',event.target.value)} />{error('address')}<a className="profile-address-link" href="/mypage/addresses">배송지 관리 →</a></div></div><MemberCutout name="address" className="profile-card-art" />
      </div></section>
      <section className="profile-info-card profile-password-card"><header><Icon kind="lock" /><h2>비밀번호 변경</h2><p>비밀번호는 표시하거나 저장하지 않습니다.</p><a className="profile-soft-button" href="/mypage/password">비밀번호 변경 →</a></header></section>
      <div className="profile-actions"><a href="/mypage" onClick={cancel}>취소</a><button type="submit" disabled={!user || saved}>수정하기</button></div><p className="profile-status" role="status">{notice}</p>
    </form><MemberDecoration variant="addresses" />
  </div></main><dialog className="profile-save-dialog" ref={dialog} onClose={() => setSaved(false)} aria-labelledby="profile-save-message"><p id="profile-save-message">회원정보가 이 브라우저에 저장되었습니다.</p><p>실제 회원 서버에는 전송되지 않았습니다.</p><form method="dialog"><button type="submit" onClick={() => setSaved(false)}>확인</button></form></dialog><HomeFooter /></div>
}


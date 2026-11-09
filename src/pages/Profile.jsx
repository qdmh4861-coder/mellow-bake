import { useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import HomeFooter from '../components/HomeFooter'
import MyPageSidebar from '../components/MyPageSidebar'
import { validateSignupField } from './signupValidation'
import './MyPage.css'
import './Profile.css'

const initialValues = { name: '', year: '', month: '', day: '', gender: '', emailLocal: '', emailDomain: '', customDomain: '', phonePrefix: '', phoneMiddle: '', phoneLast: '', postcode: '', address: '', addressDetail: '' }
function todayParts() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value)
}
function emailFor(values) { return `${values.emailLocal.trim()}@${(values.emailDomain === 'custom' ? values.customDomain : values.emailDomain).trim()}` }
function validateProfile(values) {
  const errors = {}
  const nameError = validateSignupField('name', values)
  if (nameError) errors.name = nameError
  const email = emailFor(values)
  const emailError = !values.emailLocal.trim() || !(values.emailDomain === 'custom' ? values.customDomain : values.emailDomain).trim()
    ? '이메일을 입력해 주세요.' : validateSignupField('email', { email })
  if (emailError) errors.email = emailError
  const phone = `${values.phonePrefix}${values.phoneMiddle}${values.phoneLast}`
  const phoneError = !phone ? '휴대폰 번호를 입력해 주세요.' : validateSignupField('phone', { phone })
  if (phoneError || !/^\d{3,4}$/.test(values.phoneMiddle) || !/^\d{4}$/.test(values.phoneLast)) errors.phone = phoneError || '휴대폰 번호를 정확하게 입력해 주세요.'
  const birth = `${values.year}-${values.month}-${values.day}`
  const date = new Date(`${birth}T00:00:00Z`)
  if (!values.year || !values.month || !values.day) errors.birth = '생년월일을 모두 선택해 주세요.'
  else if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== birth || birth > todayParts().join('-')) errors.birth = '유효한 생년월일을 선택해 주세요.'
  if (!values.gender) errors.gender = '성별을 선택해 주세요.'
  if (!/^\d{5}$/.test(values.postcode)) errors.address = '우편번호 5자리를 입력해 주세요.'
  else if (!values.address.trim()) errors.address = '기본 주소를 입력해 주세요.'
  return errors
}
function ProfileError({ name, errors }) { return errors[name] ? <p className="profile-error" id={`profile-${name}-error`}>{errors[name]}</p> : null }

export default function Profile() {
  // Authentication/member APIs do not exist yet. No saved email is treated as a session,
  // no example identity/password is loaded, and no profile data is persisted locally.
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const formRef = useRef(null)
  const saveDialogRef = useRef(null)
  const currentYear = Number(todayParts()[0])
  function change(field, value, errorKey = field) {
    setValues(old => ({ ...old, [field]: value }))
    setErrors(old => ({ ...old, [errorKey]: '' }))
    setNotice('')
  }
  function submit(event) {
    event.preventDefault()
    const nextErrors = validateProfile(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setNotice('입력 내용을 확인해 주세요.')
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setNotice('로그인이 필요합니다. 회원정보 저장 서비스가 연결되지 않아 입력 내용은 저장되거나 전송되지 않았습니다. 위의 로그인 링크를 이용해 주세요.')
    saveDialogRef.current?.showModal()
  }
  function emailChange() {
    const error = validateProfile(values).email
    if (error) { setErrors(old => ({ ...old, email: error })); return }
    setNotice('이메일 변경 인증 서비스는 준비 중입니다. 입력한 이메일은 저장되거나 변경되지 않았습니다.')
  }
  function errorProps(key) { return { 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `profile-${key}-error` : undefined } }
  return <div className="mypage-page profile-page">
    <HomeHeader />
    <main className="mypage-layout"><MyPageSidebar /><div className="mypage-content profile-content">
      <h1>MY PAGE</h1><p className="profile-intro">회원님의 정보를 확인하고 수정할 수 있습니다</p>
      <form className="profile-card" ref={formRef} onSubmit={submit} noValidate>
        <h2>기본 정보</h2>
        <p className="profile-login-note">회원정보 변경에는 로그인이 필요합니다. 현재 회원 서비스는 연동 준비 중입니다. <a href="/login">로그인하기</a></p>
        <div className="profile-fields">
          <div className="profile-row"><label htmlFor="profile-id">아이디<span aria-hidden="true">*</span></label><div className="profile-controls profile-id-controls"><input id="profile-id" value="" readOnly placeholder="로그인 후 표시됩니다" autoComplete="off" /><span className="profile-id-note">아이디는 변경할 수 없음</span></div></div>
          <div className="profile-row"><span className="profile-field-label">비밀번호<span aria-hidden="true">*</span></span><div className="profile-controls"><div className="profile-password-hidden">비밀번호는 표시되지 않습니다</div><button className="profile-soft-button" type="button" onClick={() => setNotice('비밀번호 변경 기능은 준비 중입니다. 현재 비밀번호를 조회하거나 입력받지 않습니다.')}>비밀번호 변경</button></div></div>
          <div className="profile-row"><label htmlFor="profile-name">이름<span aria-hidden="true">*</span></label><div className="profile-field"><input id="profile-name" name="name" value={values.name} autoComplete="name" required {...errorProps('name')} onChange={event => change('name', event.target.value)} /><ProfileError errors={errors} name="name" /></div></div>
          <div className="profile-row"><span id="profile-birth-label" className="profile-field-label">생년월일<span aria-hidden="true">*</span></span><div className="profile-field"><div className="profile-segments" role="group" aria-labelledby="profile-birth-label"><select aria-label="출생 연도" value={values.year} required {...errorProps('birth')} onChange={event => change('year', event.target.value, 'birth')}><option value="">연도</option>{Array.from({ length: currentYear - 1899 }, (_, index) => <option key={currentYear - index} value={currentYear - index}>{currentYear - index}</option>)}</select><select aria-label="출생 월" value={values.month} required {...errorProps('birth')} onChange={event => change('month', event.target.value, 'birth')}><option value="">월</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={String(index + 1).padStart(2, '0')}>{String(index + 1).padStart(2, '0')}</option>)}</select><select aria-label="출생 일" value={values.day} required {...errorProps('birth')} onChange={event => change('day', event.target.value, 'birth')}><option value="">일</option>{Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={String(index + 1).padStart(2, '0')}>{String(index + 1).padStart(2, '0')}</option>)}</select></div><ProfileError errors={errors} name="birth" /></div></div>
          <div className="profile-row"><span id="profile-gender-label" className="profile-field-label">성별<span aria-hidden="true">*</span></span><div className="profile-field"><div className="profile-gender" role="group" aria-labelledby="profile-gender-label">{[['female', '여자'], ['male', '남자']].map(([value, label]) => <label key={value}><input type="radio" name="gender" value={value} checked={values.gender === value} required {...errorProps('gender')} onChange={() => change('gender', value)} />{label}</label>)}</div><ProfileError errors={errors} name="gender" /></div></div>
          <div className="profile-row"><label htmlFor="profile-email-local">이메일<span aria-hidden="true">*</span></label><div className="profile-field profile-wide-field"><div className="profile-controls profile-email-controls"><input id="profile-email-local" aria-label="이메일 아이디" value={values.emailLocal} required autoComplete="off" {...errorProps('email')} onChange={event => change('emailLocal', event.target.value, 'email')} /><span aria-hidden="true">@</span><select aria-label="이메일 도메인" value={values.emailDomain} required {...errorProps('email')} onChange={event => change('emailDomain', event.target.value, 'email')}><option value="">선택</option>{['naver.com', 'gmail.com', 'daum.net', 'nate.com'].map(domain => <option key={domain}>{domain}</option>)}<option value="custom">직접 입력</option></select><button className="profile-soft-button" type="button" onClick={emailChange}>이메일 변경</button></div>{values.emailDomain === 'custom' && <input className="profile-custom-domain" aria-label="이메일 도메인 직접 입력" placeholder="example.com" value={values.customDomain} {...errorProps('email')} onChange={event => change('customDomain', event.target.value, 'email')} />}<ProfileError errors={errors} name="email" /></div></div>
          <div className="profile-row"><span id="profile-phone-label" className="profile-field-label">휴대폰 번호<span aria-hidden="true">*</span></span><div className="profile-field"><div className="profile-segments" role="group" aria-labelledby="profile-phone-label"><select aria-label="휴대폰 앞자리" value={values.phonePrefix} required {...errorProps('phone')} onChange={event => change('phonePrefix', event.target.value, 'phone')}><option value="">선택</option>{['010', '011', '016', '017', '018', '019'].map(prefix => <option key={prefix}>{prefix}</option>)}</select><input type="tel" aria-label="휴대폰 가운데 자리" inputMode="numeric" value={values.phoneMiddle} maxLength={4} required {...errorProps('phone')} onChange={event => change('phoneMiddle', event.target.value.replace(/\D/g, ''), 'phone')} /><input type="tel" aria-label="휴대폰 마지막 자리" inputMode="numeric" value={values.phoneLast} maxLength={4} required {...errorProps('phone')} onChange={event => change('phoneLast', event.target.value.replace(/\D/g, ''), 'phone')} /></div><ProfileError errors={errors} name="phone" /></div></div>
          <div className="profile-row profile-address-row"><label htmlFor="profile-postcode">주소<span aria-hidden="true">*</span></label><div className="profile-field"><div className="profile-controls profile-postcode-controls"><input id="profile-postcode" aria-label="우편번호" value={values.postcode} maxLength={5} inputMode="numeric" autoComplete="postal-code" required {...errorProps('address')} onChange={event => change('postcode', event.target.value.replace(/\D/g, ''), 'address')} /><button className="profile-soft-button" type="button" onClick={() => setNotice('우편번호 검색 서비스는 준비 중입니다. 우편번호와 주소를 직접 입력해 주세요.')}>우편번호 찾기</button></div><input className="profile-address-input" aria-label="기본 주소" value={values.address} autoComplete="address-line1" required {...errorProps('address')} onChange={event => change('address', event.target.value)} /><input className="profile-address-input" aria-label="상세 주소 (선택)" value={values.addressDetail} autoComplete="address-line2" onChange={event => change('addressDetail', event.target.value, 'address')} /><ProfileError errors={errors} name="address" /></div></div>
        </div>
        <div className="profile-actions"><a href="/mypage">취소</a><button type="submit">수정하기</button></div>
        <p className="profile-status" role="status">{notice}</p>
      </form>
    </div></main>
    <dialog className="profile-save-dialog" ref={saveDialogRef} aria-labelledby="profile-save-message"><p id="profile-save-message">회원정보 저장 기능 준비 중입니다.<br />입력하신 정보는 저장되지 않았습니다.</p><form method="dialog"><button type="submit">확인</button></form></dialog>
    <HomeFooter />
  </div>
}

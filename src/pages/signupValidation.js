export const initialSignupValues = { name: '', email: '', password: '', confirm: '', nickname: '', phone: '' }

export function validateSignupField(name, values) {
  switch (name) {
    case 'name': return values.name.trim() ? '' : '이름을 입력해 주세요.'
    case 'email':
      if (!values.email.trim()) return '이메일을 입력해 주세요.'
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? '' : '올바른 이메일 형식으로 입력해 주세요.'
    case 'password':
      if (!values.password) return '비밀번호를 입력해 주세요.'
      return values.password.length >= 8 && /[a-z]/i.test(values.password) && /[0-9]/.test(values.password) && /[^a-z0-9\s]/i.test(values.password) ? '' : '비밀번호 조건을 확인해 주세요.'
    case 'confirm': return values.confirm && values.password === values.confirm ? '' : '비밀번호가 일치하지 않습니다.'
    case 'nickname': return values.nickname.trim() ? '' : '닉네임을 입력해 주세요.'
    case 'phone': return !values.phone || /^01[016789][0-9]{7,8}$/.test(values.phone) ? '' : '휴대폰 번호를 숫자 10~11자리로 입력해 주세요.'
    default: return ''
  }
}

export function validateSignupAgreements(agreements) {
  return agreements.terms && agreements.privacy ? '' : '필수 약관에 동의해 주세요.'
}

export function validateSignup(values, agreements) {
  const errors = {}
  for (const name of Object.keys(initialSignupValues)) {
    const error = validateSignupField(name, values)
    if (error) errors[name] = error
  }
  const agreementError = validateSignupAgreements(agreements)
  if (agreementError) errors.agreements = agreementError
  return errors
}
